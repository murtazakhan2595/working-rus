// src/app/modules/Attendance/ShiftCalendar/Section/PendingSchedule.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import CustomTable from "components/CustomTable";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import moment from "moment";
import { EmployeeOverview, EmployeeID } from "components";
import { pendingScheduleColumns } from "./PendingScheduleColumn";
import ScheduleCalendar from "./ScheduleCalendar";
import { Button } from "components/ui/button";

const PendingSchedule = ({pendingSchedules}) => {
  const [activeSchedule, setActiveSchedule] = useState(null);

  console.log("Pending Schedules", pendingSchedules);
  const handleScheduleSelect = (scheduleId) => {
    setActiveSchedule(scheduleId);
  }
  return (
    <div className="flex gap-2">
      <Card className="min-w-[40%]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <p className="text-sm">All Members</p>
              <p className="text-sm">{pendingSchedules?.count || 0}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[450px] overflow-auto">
          {pendingSchedules?.count > 0 &&
            pendingSchedules?.results?.map((schedule, index) => (
              <ListView
                pendingShift={schedule}
                key={index}
                handleSelect={handleScheduleSelect}
                active={activeSchedule}
              />
            ))}
          {(!pendingSchedules?.results ||
            pendingSchedules.results.length === 0) && (
            <div className="text-center py-4 text-gray-500">
              No pending schedule found
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 w-full p-4 bg-gray-100 rounded-lg shadow-lg">
        <ScheduleCalendar pendingSchedule={activeSchedule} />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => {}} disabled={false}>
            Reject with Reason
          </Button>
          <Button onClick={() => {}} disabled={false}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};
const ListView = ({pendingShift, handleSelect, active}) =>{
  return (
    <div
      className={`flex flex-row items-center justify-start gap-4 py-2 border-b-2  hover:bg-plum-500 hover:text-plum-900 cursor-pointer ${
        active === pendingShift.id ? "bg-plum-300 text-plum-1100 " : ""
      }`}
      onClick={() => {
        handleSelect(pendingShift.id);
      }}
    >
      <EmployeeOverview
        id={pendingShift?.employee}
        showPosition={true}
        showDepartment={true}
      />
      <div className="flex flex-col justify-start gap-1">
        <div className="flex justify-start text-base font-medium text-neutral-1100">
          {`${"here come shift name"}`}
        </div>
        <div className="flex justify-start text-sm text-muted-foreground md:inline">
          {moment(pendingShift.start_date).format("YYYY-MM-DD")} -{" "}
          {moment(pendingShift.end_date).format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  );
}
export default PendingSchedule;
