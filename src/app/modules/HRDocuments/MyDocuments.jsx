import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { HRDocumentsStatus } from "data/Data";
import { getDocumentAssignmentList } from "app/hooks/hrDocuments";
import { MyHRDocumentsColumns } from "app/modules/HRDocuments/Sections";
import { MyDocumentDetails } from "app/modules/HRDocuments/Screens";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom, Header } from "components";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";


export default function MyDocuments() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [HRDocumentsData, setHRDocumentsData] = useState({
    results: [],
    count: 0,
  });
  const [OpenDocumentID, setOpenDocumentID] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("id");
  const [filterData, setFilterData] = useState({ emp: userID });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    onRowClick: (row) => {
      setOpenDocumentID(row.id);
    },
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getDocumentAssignmentList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setHRDocumentsData(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "document_category") setSelectedCategory(filterValue);
    else if (filterName === "status") setSelectedStatus(filterValue);

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}    >
      <Header />
      <Card>
        <CardHeader>
          <CardTitle>HR Documents</CardTitle>
          <CardDescription>Here you can view, acknowledged and sign the documents assigned to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterInput
            filters={[
              {
                type: "select",
                options: Document_Category,
                name: "document_category",
                placeholder: "Category",
              },
              {
                type: "select",
                options: HRDocumentsStatus,
                name: "status",
                placeholder: "Status",
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end mb-4"
          />
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={HRDocumentsData.results}
              columns={MyHRDocumentsColumns}
              pagination={true}
              dataTotalSize={HRDocumentsData.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>

      {OpenDocumentID && (
        <MyDocumentDetails
          documentID={OpenDocumentID}
          isOpen={!!OpenDocumentID}
          setIsOpen={() => {
            setOpenDocumentID(null);
            fetchData(true)
          }}
          DocumentList={HRDocumentsData.results}
          reloadData={fetchData}
        />
      )}
    </div>
  );
}
