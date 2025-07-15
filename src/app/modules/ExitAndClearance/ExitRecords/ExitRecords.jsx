import React, { useState } from "react";
import { Resigned, Terminated } from "app/modules/ExitAndClearance/ExitRecords";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";

const ExitRecords = ({ isTeamView, permittedViewFilterData }) => {
  const [activeTab, setActiveTab] = useState("Terminated");
  const [filterData, setFilterData] = useState({
    request_status: "REJECTED,APPROVED",
    exit_category: "TERMINATION",
    reporting_employees: isTeamView
      ? permittedViewFilterData?.reporting_employees
      : [],
  });
  const handleTabChange = (tab) => {
    setFilterData((prevFilters) => {
      return {
        ...prevFilters,
        exit_category:
          tab === "Resigned"
            ? "RESIGNATION"
            : tab === "Terminated"
            ? "TERMINATION"
            : null,
      };
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
        <TabsList className="flex items-center justify-center">
          {["Resigned", "Terminated"].map((tab) => (
            <TabsTrigger key={tab} value={tab} variant={"inner-tab"}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="Resigned">
        <Resigned filterData={filterData} />
      </TabsContent>
      <TabsContent value="Terminated">
        <Terminated filterData={filterData} />
      </TabsContent>
    </Tabs>
  );
};

export default ExitRecords;
