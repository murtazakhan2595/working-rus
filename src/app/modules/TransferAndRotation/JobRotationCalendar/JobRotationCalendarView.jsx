// src/app/modules/TransferAndRotation/JobRotationCalendar/JobRotationCalendarView.jsx
import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "src/@/components/ui/tooltip";
import JobRotationDetails from "./JobRotationDetails";
import { BranchName } from "utils/getValuesFromTables";
import { useSelector } from "react-redux";
import { getDesignationName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";

// Status transformation function
const transformJobRotationStatus = (rotation) => {
  const { status: apiStatus, effective_date, rotation_cap_time } = rotation;
  const currentDate = moment();
  const effectiveDate = moment(effective_date);
  const capEndDate = effectiveDate.clone().add(rotation_cap_time, "days");

  switch (apiStatus) {
    case "pending":
      return "Pending Approval";

    case "rejected":
      return "Cancelled";

    case "approved":
      // If effective date hasn't arrived yet
      if (currentDate.isBefore(effectiveDate)) {
        return "Scheduled";
      }

      // If effective date has passed but within cap time
      if (
        currentDate.isAfter(effectiveDate) &&
        currentDate.isBefore(capEndDate)
      ) {
        return "In Progress";
      }

      // If cap time has expired
      if (currentDate.isAfter(capEndDate)) {
        return "Overdue";
      }

      return "Scheduled";

    default:
      return "Pending Approval";
  }
};

// Status color mapping
export const STATUS_COLORS = {
  "Pending Approval": "#3B82F6", // Blue
  Scheduled: "#10B981", // Green
  "In Progress": "#F59E0B", // Yellow
  Overdue: "#EF4444", // Red
  Cancelled: "#374151", // Black
};

// Event Content Component with Tooltip
const EventWithTooltip = ({ eventInfo }) => {
  console.log("Event Info:", eventInfo.event.extendedProps);
  const {
    employee,
    currentBranch,
    newBranch,
    new_designation,
    status,
    capTime,
    originalStatus, // Keep track of original API status if needed
  } = eventInfo.event.extendedProps;

  const fullTitle = eventInfo.event.title;
  const shortTitle =
    fullTitle.length > 25 ? fullTitle.substring(0, 22) + "..." : fullTitle;

  const getTooltipContent = () => {
    return (
      <div className="space-y-1 text-sm">
        <p className="font-medium">{employee?.label}</p>
        <p className="text-xs">
          <DesignationName value={employee?.department_position} /> ➝{" "}
          <DesignationName value={new_designation} />
        </p>
        <p className="text-xs">
          <BranchName value={employee?.branch_id} /> ➝{" "}
          <BranchName value={newBranch} />
        </p>
        <p className="text-xs">Status: {status}</p>
        <p className="text-xs">Cap Time: {capTime} days</p>
        <p className="text-xs">Click for details</p>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-1 overflow-hidden w-full cursor-pointer hover:opacity-80 transition-opacity">
            <div className="font-medium text-[10px] lg:text-xs leading-tight truncate w-full text-white">
              {shortTitle}
            </div>
            <div className="text-[8px] lg:text-[10px] leading-tight truncate text-white opacity-90">
              {currentBranch.code} ➝ {newBranch.code}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const JobRotationCalendarView = ({ jobRotations, loading, reload }) => {
  const [selectedRotation, setSelectedRotation] = useState(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const branches = useSelector((state) => state.common.branches);
  const Employees = useSelector((state) => state.emp.employees);
  const Designations = useSelector((state) => state.common.designations);

  console.log("Employees in Calendar View:", Employees);

  const getBranchLabel = (branches, value, fallBackText = "N/A") => {
    const branch = branches.find((option) => option.value === parseInt(value));
    return branch ? branch.label : value ?? fallBackText;
  };

  // Generate calendar events from job rotation data
  const calendarEvents = useMemo(() => {
    if (!jobRotations?.results) return [];

    return jobRotations.results.map((rotation) => {
      // Transform the status based on business logic
      const transformedStatus = transformJobRotationStatus(rotation);
      const statusColor = STATUS_COLORS[transformedStatus] || "#6B7280";

      const employee = Employees.find((emp) => emp.id === rotation.employee);

      return {
        id: rotation.id,
        title: `${employee?.label || "Unknown Employee"} - Job Rotation`,
        start: rotation.effective_date,
        allDay: true,
        backgroundColor: statusColor,
        borderColor: statusColor,
        textColor: "#000",
        extendedProps: {
          employee: employee,
          currentBranch: getBranchLabel(branches, employee?.branch_id),
          newBranch: getBranchLabel(branches, rotation.new_branch),
          status: transformedStatus, // Use transformed status
          originalStatus: rotation.status, // Keep original API status
          capTime: rotation.rotation_cap_time,
          new_designation: rotation.new_designation,
          rotation: {
            ...rotation,
            status: transformedStatus, // Override status in rotation object too
            originalStatus: rotation.status,
          },
        },
      };
    });
  }, [jobRotations, branches, Employees]);

  const handleEventClick = (clickInfo) => {
    const rotation = clickInfo.event.extendedProps.rotation;
    setSelectedRotation(rotation.id);
    setIsDetailSheetOpen(true);
  };

  const handleDateClick = (dateInfo) => {
    // Find all rotations on this date
    const dateStr = moment(dateInfo.date).format("YYYY-MM-DD");
    const rotationsOnDate =
      jobRotations?.results?.filter(
        (rotation) => rotation.effective_date === dateStr
      ) || [];

    if (rotationsOnDate.length > 0) {
      // Open the first rotation
      setSelectedRotation(rotationsOnDate[0].id);
      setIsDetailSheetOpen(true);
    }
  };

  const StatusLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs mt-4">
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <div key={status} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <span>{status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <Card className="pt-6">
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <div className="mt-2">Loading job rotations...</div>
              </div>
            </div>
          ) : (
            <div className="h-[700px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView={calendarView}
                events={calendarEvents}
                height="100%"
                eventDisplay="block"
                dayMaxEvents={3}
                moreLinkClick="popover"
                nowIndicator={true}
                weekends={true}
                aspectRatio={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 0.8
                    : 1.35
                }
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventContent={(eventInfo) => (
                  <EventWithTooltip eventInfo={eventInfo} />
                )}
                eventClassNames={() => [
                  "transition-all",
                  "hover:opacity-80",
                  "hover:scale-105",
                  "cursor-pointer",
                ]}
                dayCellContent={(dayInfo) => {
                  return {
                    html: `<div class="text-sm sm:text-base">${dayInfo.dayNumberText}</div>`,
                  };
                }}
                viewDidMount={(info) => {
                  setCalendarView(info.view.type);
                }}
                slotLabelFormat={
                  calendarView !== "dayGridMonth"
                    ? {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    : undefined
                }
                eventTimeFormat={
                  calendarView !== "dayGridMonth"
                    ? {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    : undefined
                }
              />
            </div>
          )}
          <StatusLegend />
        </CardContent>
      </Card>

      {/* Job Rotation Detail Sheet */}
      {selectedRotation && (
        <JobRotationDetails
          isOpen={isDetailSheetOpen}
          setIsOpen={setIsDetailSheetOpen}
          currentId={selectedRotation}
          DataList={jobRotations?.results || []}
          reloadData={reload}
          transformStatus={transformJobRotationStatus} // Pass the transform function
        />
      )}
    </div>
  );
};

export default JobRotationCalendarView;
