import React, { useEffect, useState } from "react";
import { CardHeader, CardContent } from "components/ui/card";
import { DocumentDetails } from "app/modules/HRDocuments/Screens";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import {
  getDocumentList,
  getEmployeeTransferStats,
} from "app/hooks/hrDocuments";
import { HRDocumentsColumns } from "app/modules/HRDocuments/Sections";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { HRDocumentTargetAudience } from "data/Data";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import Config from "constants/config";
import { useNavigate, useParams } from "react-router-dom";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { PageLoader } from "components";

export default function Documents({ reload }) {
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [activeTab, setActiveTab] = useState("all-documents");
  
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [OpenDocumentID, setOpenDocumentID] = useState(false);
  const [filterData, setFilterData] = useState({ exclude_expired: true });

  const DocumentTabs = [
    {
      title: "All Documents",
      label: "All Documents",
      value: "all-documents",
      description: "Here you can view all the non-expired documents.",
    },
    {
      title: "Assigned Documents",
      label: "Assigned",
      value: "assigned",
      description: "Here you view all the non-expired documents that are assigned any employee",
    },
    {
      title: "Expired Documents",
      label: "Expired",
      value: "expired",
      description: "Here you view all the expired documents.",
    },
  ];

const [activeTabDetails, setActiveTabDetails] = useState(DocumentTabs[0]);

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
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getDocumentList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setEmployeeTransferData(data);
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

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering("-id");
    fetchData(true);
    return () => {
      isMounted = false;
    };
  }, [reload]);

  useEffect(() => {
    setFilterData((prevFilter) => {
      const updatedFilter = { ...prevFilter };
      if (activeTab === "all-documents") {
        delete updatedFilter.doc_status; // Remove the status key
        updatedFilter.exclude_expired = true;
      } else if (activeTab === "assigned") {
        delete updatedFilter.doc_status; // Remove the status key
        updatedFilter.exclude_expired = true;
      } else {
        delete updatedFilter.exclude_expired; // Remove the status key
      }
      return updatedFilter;
    });
  }, [activeTab]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);

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
    <>
      {/* <Stats stats={statsData} /> */}
      <Tabs
        defaultValue="All Documents"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
          setActiveTabDetails(DocumentTabs.find((obj) => obj.value === tab));
        }}
        value={activeTab}
      >
        {/* Responsive layout for tabs and filters */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
          {/* Tabs with horizontal scroll but no vertical scroll */}
          <div className="w-full sm:w-auto overflow-hidden mb-4">
            <TabsList className="flex flex-nowrap w-full overflow-x-auto overflow-y-hidden sm:overflow-visible">
              {DocumentTabs.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} variant="inner-tab">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>

      <CardHeader>
        <CardTitle>{activeTabDetails.title}</CardTitle>
        <CardDescription>{activeTabDetails.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters that take full width on mobile, original style on desktop */}
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by name",
              name: "name",
            },
            {
              type: "select",
              options: Document_Category,
              name: "category",
              placeholder: "Category",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={employeeTransferData.results}
            columns={HRDocumentsColumns(
              activeTab === "all-documents",
              fetchData
            )}
            pagination={true}
            dataTotalSize={employeeTransferData.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
      {OpenDocumentID && (
        <DocumentDetails
          documentID={OpenDocumentID}
          isOpen={!!OpenDocumentID}
          setIsOpen={() => {
            setOpenDocumentID(null);
          }}
          DocumentList={employeeTransferData.results}
          reloadData={fetchData}
        />
      )}
    </>
  );
}
