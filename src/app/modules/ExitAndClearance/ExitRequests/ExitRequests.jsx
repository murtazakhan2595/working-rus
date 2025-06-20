import React, { useState } from "react";
import { FilterInput } from "components/FormControl";
import {
  Resignations,
  Terminations,
} from "app/modules/ExitAndClearance/ExitRequests";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";

const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";
const ExitRequests = ({ reload }) => {
  const [activeTab, setActiveTab] = useState("Terminations");
  const [filterData, setFilterData] = useState({ request_status: "PENDING" });

  const handleTabChange = (tab) => {
    setFilterData((prevFilters) => {
      return {
        ...prevFilters,
        exit_category:
          tab === "Resignations"
            ? "resignation"
            : tab === "Terminations"
            ? "termination"
            : null,
      };
    });
  };

  const handleFilterChange = (filterName, filterValue) => {
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
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        handleTabChange(tab);
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList className="flex items-center justify-center mb-4">
          {["Terminations", "Resignations"].map((tab) => (
            <TabsTrigger key={tab} value={tab} variant={"inner-tab"}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <CardHeader>
        <CardTitle>{activeTab} Requests</CardTitle>
        <CardDescription>
          Here you can manage and {activeTab.toLowerCase()} requests of
          employees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID",
              name: "emp_serial_no",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        <TabsContent value="Resignations">
          <Resignations filterData={filterData} reload={reload} />
        </TabsContent>
        <TabsContent value="Terminations">
          <Terminations filterData={filterData} reload={reload} />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
};

export default ExitRequests;
