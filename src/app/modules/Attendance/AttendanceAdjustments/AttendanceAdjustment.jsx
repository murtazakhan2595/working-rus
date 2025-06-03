import React from "react";
import {
  AttendanceAdjustmentRecord,
  AttendanceAdjustmentHistory,
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
  const isViewAAPermitted = HasAccess("VIEW_ATT_UPDATE_LOGS");
  const isViewBAAPermitted = HasAccess("VIEW_BRN_ATT_UPDATES_LOGS");
  const isViewDAAermitted = HasAccess("VIEW_DPT_ATT_UPDATES_LOGS");
  const [activeTab, setActiveTab] = useState(activeView);
  const TimeAdjustmentOuterTab = useMemo(() => {
    return ["Attendance Adjustments", "History & Logs"];
  }, []);

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
            <AttendanceAdjustmentRecord
              isTeamView={false}
              isDepartmentView={isViewDAAermitted}
              isBranchView={isViewBAAPermitted}
              adminView={isViewAAPermitted}
            />
          </TabsContent>
          <TabsContent value="History & Logs">
            <AttendanceAdjustmentHistory />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AttendanceAdjustment;
