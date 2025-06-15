import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
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

const DocumentTabs = [
  "All Documents",
  "Assigned",
  // "Signed",
  // "Pending",
  "Expired",
].filter(Boolean);
const innerTabClassName =
  "shadow-none border-transparent border-b data-[state=active]:border-plum-1100 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium whitespace-nowrap px-2 sm:w-28 flex-1 sm:flex-initial text-sm sm:text-base";

export default function Documents({ reload }) {
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [activeDocumentTab, setActiveDocumentTab] = useState("All Documents");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTargetAudience, setSelectedTargetAudience] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [OpenDocumentID, setOpenDocumentID] = useState(false);
  const [filterData, setFilterData] = useState({ exclude_expired: true });

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
      if (activeDocumentTab === "All Documents") {
        delete updatedFilter.doc_status; // Remove the status key
        updatedFilter.exclude_expired = true;
      } else if (activeDocumentTab === "Assigned") {
        delete updatedFilter.doc_status; // Remove the status key
        updatedFilter.exclude_expired = true;
      } else {
        delete updatedFilter.exclude_expired; // Remove the status key
        updatedFilter.doc_status =
          activeDocumentTab === "Signed"
            ? "Signed"
            : activeDocumentTab === "Expired"
            ? "Expired"
            : activeDocumentTab === "Pending"
            ? "Pending"
            : updatedFilter.doc_status; // Keep existing value if no match
      }
      return updatedFilter;
    });
  }, [activeDocumentTab]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "category") setSelectedCategory(filterValue);
    if (filterName === "target_audience")
      setSelectedTargetAudience(filterValue);

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
        defaultValue="All Documents"
        className="w-full"
        onValueChange={(tab) => {
          setActiveDocumentTab(tab);
        }}
        value={activeDocumentTab}
      >
        {/* Responsive layout for tabs and filters */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
          {/* Tabs with horizontal scroll but no vertical scroll */}
          <div className="w-full sm:w-auto overflow-hidden mb-4">
            <TabsList className="flex flex-nowrap w-full overflow-x-auto overflow-y-hidden sm:overflow-visible">
              {DocumentTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className={innerTabClassName}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Filters that take full width on mobile, original style on desktop */}
          <div className="w-full sm:w-auto">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by name",
                  name: "name",
                  width: "w-full sm:w-56", // Full width on mobile, fixed width on larger screens
                },
                {
                  type: "select-two",
                  option: Document_Category,
                  name: "category",
                  placeholder: "Category",
                  values: selectedCategory,
                  width: "w-full sm:w-56", // Full width on mobile, fixed width on larger screens
                },
              ]}
              onChange={handleFilterChange}
              className="w-full flex flex-col sm:flex-row gap-2"
            />
          </div>
        </div>
        
        <TableCustom
          data={employeeTransferData.results}
          columns={HRDocumentsColumns(
            activeDocumentTab === "All Documents",
            fetchData
          )}
          pagination={true}
          dataTotalSize={employeeTransferData.count || 0}
          tableOptions={tableOptions}
        />
      </Tabs>
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
    </div>
  );
}
