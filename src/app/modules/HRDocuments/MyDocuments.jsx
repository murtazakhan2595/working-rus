import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { UploadDocumentForm } from "app/modules/HRDocuments";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import {
  getDocumentAssignmentList,
  getEmployeeTransferStats,
} from "app/hooks/hrDocuments";
import { MyHRDocumentsColumns } from "app/modules/HRDocuments/Sections";
import { DocumentDetails } from "app/modules/HRDocuments/Screens";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import Config from "constants/config";

const ExternalTabs = ["All", "Signed", "Pending", "Expired"].filter(Boolean);

export default function MyDocuments() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [HRDocumentsData, setHRDocumentsData] = useState({
    results: [],
    count: 0,
  });
  const [employeeTransferStat, setEmployeeTransferStat] = useState({});
  const [OpenDocumentID, setOpenDocumentID] = useState(false);
  const [activeExternalTab, setActiveExternalTab] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
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

  const fetchStatData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeTransferStats({
        filterData: { transfer_type: filterData.transfer_type },
      });
      if (isMounted) {
        setEmployeeTransferStat(data);
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
    fetchStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData.transfer_type]);

  const statsData = [
    {
      label: "Total",
      value: employeeTransferStat.total_transfers || 0,
      icon: UsersRound,
    },
    {
      label: "Approved",
      value: employeeTransferStat.approved_transfers || 0,
      icon: Contact,
    },
    {
      label: "Rejected",
      value: employeeTransferStat.rejected_transfers || 0,
      icon: UserRoundCheck,
    },
    {
      label: "Pending",
      value: employeeTransferStat.pending_transfers || 0,
      icon: UserRoundCheck,
    },
  ];
  useEffect(() => {
    setFilterData((prevFilter) => ({
      ...prevFilter,
      ...(activeExternalTab === "All"
        ? { status: "PENDING,VIEWED,ACKNOWLEDGED,EXPIRED" }
        : {}),
      ...(activeExternalTab === "Signed" ? { status: "ACKNOWLEDGED" } : {}),
      ...(activeExternalTab === "Expired" ? { status: "EXPIRED" } : {}),
      ...(activeExternalTab === "Pending" ? { status: "PENDING" } : {}),
    }));
  }, [activeExternalTab]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "category") setSelectedCategory(filterValue);

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
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />

      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <FilterInput
          filters={[
            {
              type: "select-one",
              option: Document_Category,
              name: "category",
              placeholder: "Category",
              values: selectedCategory,
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>
      <Card>
        <CardContent>
          <TableCustom
            data={HRDocumentsData.results}
            columns={MyHRDocumentsColumns}
            pagination={true}
            dataTotalSize={HRDocumentsData.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
      {OpenDocumentID && (
        <DocumentDetails
          documentID={OpenDocumentID}
          isOpen={!!OpenDocumentID}
          setIsOpen={() => {
            setOpenDocumentID(null);
          }}
          DocumentList={HRDocumentsData.results}
          reloadData={fetchData}
          // readOnlyMode={true}
        />
      )}
    </div>
  );
}
