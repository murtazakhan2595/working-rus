import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { UploadDocumentForm } from "app/modules/HRDocuments";
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
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import Config from "constants/config";

const DocumentTabs = ["All", "Signed", "Pending", "Expired"].filter(Boolean);
const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";

export default function Documents() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [employeeTransferStat, setEmployeeTransferStat] = useState({});
  const [activeDocumentTab, setActiveDocumentTab] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState(
    userRole === 2 ? { new_reporting_manager: userID } : {}
  );

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
    setFilterData((prevFilter) => {
      const updatedFilter = { ...prevFilter };
      if (activeDocumentTab === "All") {
        delete updatedFilter.status; // Remove the status key
      } else {
        updatedFilter.status =
          activeDocumentTab === "Signed"
            ? "ACKNOWLEDGED"
            : activeDocumentTab === "Expired"
            ? "EXPIRED"
            : activeDocumentTab === "Pending"
            ? "PENDING"
            : updatedFilter.status; // Keep existing value if no match
      }
      return updatedFilter;
    });
  }, [activeDocumentTab]);

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
      {/* <Stats stats={statsData} /> */}
      <Tabs
        defaultValue="All"
        className="w-full"
        onValueChange={(tab) => {
          setActiveDocumentTab(tab);
        }}
        value={activeDocumentTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {DocumentTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={innerTabClassName}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
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

        <TableCustom
          data={employeeTransferData.results}
          columns={HRDocumentsColumns}
          pagination={true}
          dataTotalSize={employeeTransferData.count || 0}
          tableOptions={tableOptions}
        />
      </Tabs>
    </div>
  );
}
