import React from "react";
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

const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";
const ExitRequests = ({
  filterData = {},
  handleTabChange = () => {},
  activeTab,
  setActiveTab = () => {},
  reload,
}) => {
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
          {["Terminations","Resignations"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className={innerTabClassName}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="Resignations">
        <Resignations filterData={filterData} reload={reload} />
      </TabsContent>
      <TabsContent value="Terminations">
        <Terminations filterData={filterData} reload={reload} />
      </TabsContent>
    </Tabs>
  );
};

export default ExitRequests;
