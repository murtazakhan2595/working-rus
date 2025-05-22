// src/app/modules/Attendance/ShiftCalendar/Section/ScheduleViewSheet.jsx
import React from "react";
import SheetComponent from "components/ui/CustomSheet";
import { Button } from "components/ui/button";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { EmployeeOverview } from "components";
import moment from "moment";

const ScheduleViewSheet = ({ isOpen, setIsOpen, schedule }) => {
  if (!schedule) return null;

  const getShiftTypeDisplay = () => {
    if (schedule.is_off_day) return "OFF Day";
    if (schedule.is_split_shift) return "Split Shift";
    return "Regular Shift";
  };

  const getTimeDisplay = () => {
    if (schedule.is_off_day) return "No working hours";
    if (schedule.is_split_shift) {
      return `Split: ${moment(schedule.split_start_time).format(
        "h:mm A"
      )} - ${moment(schedule.split_end_time).format("h:mm A")}`;
    }
    return "Regular shift timings";
  };

  const formSheetData = {
    title: "Shift Schedule Details",
    description: null,
    footer: null,
  };

  const scheduleDetails = [
    {
      label: "Employee ID",
      value: schedule.employee_id,
    },
    {
      label: "Branch",
      value: schedule.branch_name,
    },
    {
      label: "Submitted By",
      value: schedule.submitted_by,
    },
    {
      label: "Period",
      value: `${moment(schedule.start_date).format("MMM D, YYYY")} - ${moment(
        schedule.end_date
      ).format("MMM D, YYYY")}`,
    },
    {
      label: "Duration",
      value: `${
        Math.abs(
          moment(schedule.end_date).diff(moment(schedule.start_date), "days")
        ) + 1
      } days`,
    },
    {
      label: "Shift Type",
      value: getShiftTypeDisplay(),
    },
    {
      label: "Working Hours",
      value: getTimeDisplay(),
    },
    {
      label: "Submitted Date",
      value: moment(schedule.created_at).format("MMM D, YYYY h:mm A"),
    },
    {
      label: "Status",
      value: schedule.status,
    },
  ].filter(Boolean);

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="custom-sheet-width"
      width="800px"
    >
      {/* Employee Overview */}
      <div className="mb-6">
        <EmployeeOverview
          id={schedule.employee_id}
          showEmail={true}
          showDepartment={true}
          showPosition={true}
          showId={true}
          showBranchName={true}
        />
      </div>

      {/* Schedule Details Card */}
      <DetailCard
        detailCardTitle="Schedule Details"
        date={schedule.created_at}
        dateTitle="Submitted On"
      >
        <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
          {scheduleDetails.map((item, index) => (
            <DetailBox key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailCard>

      {/* Status Card */}
      <DetailCard detailCardTitle="Current Status" className="mt-4">
        <DetailBox
          label="Status"
          value={
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700">
              {schedule.status}
            </span>
          }
        />
        <DetailBox label="Assigned By" value={schedule.submitted_by} />
        {schedule.rejection_reason && (
          <DetailBox
            label="Rejection Reason"
            value={schedule.rejection_reason}
          />
        )}
      </DetailCard>

      {/* Close Button */}
      <div className="flex justify-end pt-6">
        <Button
          variant="outline"
          type="button"
          size="lg"
          onClick={() => setIsOpen(false)}
        >
          Close
        </Button>
      </div>
    </SheetComponent>
  );
};

export default ScheduleViewSheet;
