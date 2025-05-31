import React from "react";
import {
  AttendanceAdjustmentRecord,
  TimeAdjustmentsHistory,
} from "app/modules/Attendance";
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
import { HasAccess } from "utils/PermissionUtils";

const AttendanceAdjustment = ({ activeView = "Attendance Adjustments" }) => {
  const isViewTAPermitted = HasAccess("VIEW_TIME_ADJ_REQUESTS");
  const isViewBTAPermitted = HasAccess("VIEW_BRN_TIME_ADJ_REQUESTS");
  const isViewDTAermitted = HasAccess("VIEW_DPT_TIME_ADJ_REQUESTS");
  const isViewLogPermitted = HasAccess("VIEW_TIME_ADJ_LOGS");
  const [activeTab, setActiveTab] = useState(activeView);
  const TimeAdjustmentOuterTab = useMemo(() => {
    return [
      ...(isViewTAPermitted || isViewBTAPermitted || isViewDTAermitted
        ? ["Attendance Adjustments"]
        : []),
      ...(isViewLogPermitted ? ["History & Logs"] : []),
    ];
  }, [
    isViewDTAermitted,
    isViewBTAPermitted,
    isViewTAPermitted,
    isViewLogPermitted,
  ]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Tabs
        defaultValue="Attendance Adjustments"
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
          <TabsContent value="Attendance Adjustments">
            <AttendanceAdjustmentRecord />
          </TabsContent>
          <TabsContent value="History & Logs">
            <TimeAdjustmentsHistory />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AttendanceAdjustment;
