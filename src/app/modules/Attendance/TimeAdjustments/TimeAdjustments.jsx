import React from "react";
import { TimeAdjustmentRecords } from "app/modules/Attendance";
import { useEffect, useState, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeesExitCount } from "app/hooks/employeeExitAndClearance";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { Card, CardContent } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import { ResignationStatusOptions } from "data/Data";
import Stats from "components/ui/Stats";
import { TerminationStatusOptions } from "data/Data";
import { useDispatch, useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";

const TimeAdjustments = ({ userProfile, departments, isTeamView = false }) => {
  const isViewHierarchyPermitted = HasAccess("VIEW_APPROVAL_HIERARCHY");
  const [activeTab, setActiveTab] = useState("Time Adjustments");

  const TimeAdjustmentOuterTab = useMemo(() => {
    return [
      ...(isViewHierarchyPermitted ? ["Time Adjustments"] : []),
      ...(isViewHierarchyPermitted ? ["History & Logs"] : []),
    ];
  }, [isViewHierarchyPermitted]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Tabs
        defaultValue="Time Adjustments"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {TimeAdjustmentOuterTab.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-fit data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <TabsContent value="Time Adjustments">
            <TimeAdjustmentRecords />
          </TabsContent>
          <TabsContent value="Exit Records"></TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default TimeAdjustments;
