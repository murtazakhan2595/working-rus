import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "src/@/components/ui/tabs";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { RotationRequests, RotationRecords } from "./index";

const Rotations = ({ reload, permittedViewFilterData }) => {
  const [activeTab, setActiveTab] = useState("Requests");

  return (
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList>
          {["Requests", "Records"].map((tab) => (
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
      <TabsContent value='Requests'>
        <RotationRequests reload={reload} permittedViewFilterData={permittedViewFilterData} />
      </TabsContent>
      <TabsContent value='Records'>
        <RotationRecords reload={reload} permittedViewFilterData={permittedViewFilterData} />
      </TabsContent>
    </Tabs>
  );
};

export default Rotations;
