// src/app/modules/Attendance/ShiftManagement/ShiftManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import { useSelector } from "react-redux";
import ScheduleShift from "./Sections/ScheduleShift";
import PendingSchedule from "./Sections/PendingSchedule";
import ShiftCalendar from "./Sections/ShiftCalendar";
import ShiftRequest from "./Sections/ShiftRequest";

const ShiftManagement = () => {
  const [activeTab, setActiveTab] = useState("schedule-shift");
  const userProfile = useSelector((state) => state.user.userProfile);

  // Determine if user is a Branch Manager or Cluster Manager
  const isBranchManager = userProfile?.role === 2; // Adjust based on your role IDs
  const isClusterManager = userProfile?.role === 3; // Adjust based on your role IDs

  return (
    <div>
      <Header content={null} title="Shift Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule-shift">Schedule Shift</TabsTrigger>
          <TabsTrigger value="pending-schedule">Pending Schedule</TabsTrigger>
          <TabsTrigger value="shift-calendar">Shift Calendar</TabsTrigger>
          <TabsTrigger value="shift-request">Shift Request</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule-shift">
          <ScheduleShift />
        </TabsContent>

        <TabsContent value="pending-schedule">
          <PendingSchedule />
        </TabsContent>

        <TabsContent value="shift-calendar">
          <ShiftCalendar />
        </TabsContent>

        <TabsContent value="shift-request">
          <ShiftRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftManagement;
