import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "src/@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { employeeData } from "app/hooks/attendance";
import ShiftChangeRequestModal from "./ShiftChangeRequestModal";
import { HasAccess } from "utils/PermissionUtils";



// Event Content Component with Tooltip
const EventWithTooltip = ({ eventInfo }) => {
  const fullTitle = eventInfo.event.title;
  const shortTitle =
    fullTitle.length > 18 ? fullTitle.substring(0, 15) + "..." : fullTitle;

  // Extract additional details from extendedProps
  const { type, shiftName, scheduleId } = eventInfo.event.extendedProps;

  // Create detailed tooltip content
  const getTooltipContent = () => {
    const start = moment(eventInfo.event.start).format("HH:mm");
    const end = moment(eventInfo.event.end).format("HH:mm");

    // Format type for display
    const formatType = (type) => {
      switch (type) {
        case "direct_assignment":
          return "Direct Assignment";
        case "org_schedule":
          return "Organization Schedule";
        case "custom_regular":
          return "Custom Schedule";
        case "custom_split":
          return "Split Shift";
        case "custom_off":
          return "Day Off";
        default:
          return "Scheduled Shift";
      }
    };

    return (
      <div className="space-y-1">
        <p className="font-medium">{shiftName || eventInfo.event.title}</p>
        <p className="text-xs">
          Time: {start} - {end}
        </p>
        <p className="text-xs">Type: {formatType(type)}</p>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-0.5 sm:p-1 overflow-hidden w-full cursor-pointer">
            <div className="font-medium text-[8px] sm:text-[10px] lg:text-xs leading-tight truncate w-full">
              {shortTitle}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-popover text-popover-foreground border border-border shadow-md rounded-md p-3"
        >
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Calendar = ({ shift, scheduleShifts, employeeId, reload, refreshShiftChangeRequests }) => {

  const [events, setEvents] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const prevDataRef = useRef(null);
  const isEditEmployeeShiftPermitted = HasAccess("EDIT_EMPLOYEE_SHIFT");

  // Fetch employee data when employeeId changes
  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        try {
          const empData = await employeeData(employeeId);
          setSelectedEmployee(empData);
        } catch (error) {
          console.error("Error fetching employee data:", error);
          setSelectedEmployee(null);
        }
      } else {
        setSelectedEmployee(null);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  useEffect(() => {
    // Skip if no employee selected
    if (!employeeId) {
      setEvents([]);
      return;
    }

    // Create a reference key to track changes
    const currentDataKey = {
      employeeId,
      shiftId: shift?.id,
      scheduleCount: scheduleShifts?.count || 0,
      scheduleIds: scheduleShifts?.results?.map((s) => s.id).join(",") || "",
    };

    // Skip if data hasn't changed
    if (
      prevDataRef.current &&
      JSON.stringify(prevDataRef.current) === JSON.stringify(currentDataKey)
    ) {
      return;
    }

    prevDataRef.current = currentDataKey;

    // Generate calendar events
    generateCalendarEvents();
  }, [shift, scheduleShifts, employeeId]);

  const generateCalendarEvents = () => {
    
    try {
      const events = [];
      const coveredDates = new Set(); // Track dates covered by schedules

      // 1. PRIORITY: Add approved schedule shifts first and track covered dates
      if (scheduleShifts?.results && scheduleShifts.results.length > 0) {
        scheduleShifts.results.forEach((schedule, index) => {
          console.log(`📅 DEBUG: Processing schedule ${index + 1}: ${schedule.id} (${schedule.is_org_based ? 'org' : 'custom'})`);
          
          if (schedule.is_org_based && schedule.shift_details) {
            // Organization-based scheduled shift
            const scheduleEvents = generateOrgScheduleEvents(schedule, coveredDates);
            console.log(`🟢 DEBUG: Generated ${scheduleEvents.length} org events for schedule ${schedule.id}`);
            events.push(...scheduleEvents);
            
            // Track dates covered by this schedule - for org schedules, track the entire date range
            const startDate = moment(schedule.start_date);
            const endDate = moment(schedule.end_date);
            let currentDate = startDate.clone();
            while (currentDate.isSameOrBefore(endDate)) {
              const dateKey = currentDate.format('YYYY-MM-DD');
              if (!coveredDates.has(dateKey)) {
                coveredDates.add(dateKey);
              }
              currentDate.add(1, 'day');
            }
          } else if (schedule.custom_schedule) {
            // Custom scheduled shift
            const scheduleEvents = generateCustomScheduleEvents(schedule);
            events.push(...scheduleEvents);
            
            // Track dates covered by this schedule
            Object.keys(schedule.custom_schedule).forEach(date => {
              coveredDates.add(date);
            });
          }
        });
      }

      // 2. FALLBACK: Add direct shift assignment for dates NOT covered by schedules
      if (shift) {
        const directShiftEvents = generateDirectShiftEvents(shift, coveredDates);
        events.push(...directShiftEvents);
      }
      
      setEvents(events);
    } catch (error) {
      console.error("Error generating calendar events:", error);
      setEvents([]);
    }
  };

  const generateOrgScheduleEvents = (schedule, coveredDates = new Set()) => {
    const events = [];
    const shiftDetails = schedule.shift_details;

    if (!shiftDetails) return events;

    // Parse weekdays from JSON string
    let weekdays = [];
    try {
      if (shiftDetails.weekdays && shiftDetails.weekdays !== null) {
        weekdays = JSON.parse(shiftDetails.weekdays);
      }
      // Ensure weekdays is an array
      if (!Array.isArray(weekdays) || weekdays.length === 0) {
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      }
    } catch (e) {
      weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    }

    // Convert to lowercase short form for moment.js
    const shortWeekdays = weekdays.map((day) =>
      day.toLowerCase().substring(0, 3)
    );

    const startDate = moment(schedule.start_date);
    const endDate = moment(schedule.end_date);

    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const dayName = currentDate.format("ddd").toLowerCase();
      const dateKey = currentDate.format("YYYY-MM-DD");

      // Skip this date if it's already covered by a newer schedule
      if (coveredDates.has(dateKey)) {
        currentDate.add(1, "day");
        continue;
      }

      if (shortWeekdays.includes(dayName)) {
        const startTime = moment(
          shiftDetails.starttime.replace("Z", "")
        ).format("HH:mm");
        const endTime = moment(shiftDetails.endtime.replace("Z", "")).format(
          "HH:mm"
        );

        events.push({
          title: `${shiftDetails.name} (${startTime} - ${endTime})`,
          start: `${currentDate.format("YYYY-MM-DD")}T${startTime}:00`,
          end: `${currentDate.format("YYYY-MM-DD")}T${endTime}:00`,
          backgroundColor: "#10B981", // Green for org shifts
          borderColor: "#059669",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "org_schedule",
            shiftName: shiftDetails.name,
            scheduleId: schedule.id,
            fullTitle: `${shiftDetails.name} (${startTime} - ${endTime})`,
          },
        });
      }

      currentDate.add(1, "day");
    }

    return events;
  };

  const generateCustomScheduleEvents = (schedule) => {
    const events = [];
    const customSchedule = schedule.custom_schedule;

    Object.entries(customSchedule).forEach(([date, daySchedule]) => {
      if (daySchedule.is_off) {
        events.push({
          title: "OFF",
          start: date,
          allDay: true,
          backgroundColor: "#6B7280", // Gray for OFF days
          borderColor: "#4B5563",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_off",
            scheduleId: schedule.id,
            shiftName: "Day Off",
            fullTitle: "Day Off",
          },
        });
      } else if (daySchedule.is_split) {
        // Split shift - create two events
        if (daySchedule.start_time_1 && daySchedule.end_time_1) {
          events.push({
            title: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            start: `${date}T${daySchedule.start_time_1}:00`,
            end: `${date}T${daySchedule.end_time_1}:00`,
            backgroundColor: "#F59E0B", // Orange for split shifts
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split",
              part: 1,
              scheduleId: schedule.id,
              shiftName: `Split Shift Part 1`,
              fullTitle: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            },
          });
        }

        if (daySchedule.start_time_2 && daySchedule.end_time_2) {
          let endDate = date;
          if (daySchedule.end_time_2 < daySchedule.start_time_2) {
            endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
          }

          events.push({
            title: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            start: `${date}T${daySchedule.start_time_2}:00`,
            end: `${endDate}T${daySchedule.end_time_2}:00`,
            backgroundColor: "#F59E0B", // Orange for split shifts
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split",
              part: 2,
              scheduleId: schedule.id,
              shiftName: `Split Shift Part 2`,
              fullTitle: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            },
          });
        }
      } else {
        // Regular custom shift
        let endDate = date;
        if (daySchedule.end_time < daySchedule.start_time) {
          endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
        }

        events.push({
          title: `Custom (${daySchedule.start_time} - ${daySchedule.end_time})`,
          start: `${date}T${daySchedule.start_time}:00`,
          end: `${endDate}T${daySchedule.end_time}:00`,
          backgroundColor: "#8B5CF6", // Purple for custom shifts
          borderColor: "#7C3AED",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_regular",
            scheduleId: schedule.id,
            shiftName: "Custom Shift",
            fullTitle: `Custom (${daySchedule.start_time} - ${daySchedule.end_time})`,
          },
        });
      }
    });

    return events;
  };

  const generateDirectShiftEvents = (shift, coveredDates) => {

    const events = [];

    // Parse start time (ISO format)
    const shiftStart = moment(shift.starttime);

    // Parse end time (handle multiple formats)
    let shiftEnd;

    if (shift.endtime.includes("T")) {
      // ISO format like "2025-06-09T12:00:00Z"
      shiftEnd = moment(shift.endtime);
    } else if (shift.endtime.includes("M")) {
      // 12-hour format like "05:00 PM" or "5:00 AM"
      shiftEnd = moment(shift.endtime, ["hh:mm A", "h:mm A"]);
    } else if (shift.endtime.includes(":")) {
      // 24-hour format like "17:00"
      shiftEnd = moment(shift.endtime, "HH:mm");
    } else {
      // Fallback - try to parse as-is
      shiftEnd = moment(shift.endtime);
    }

    // Only proceed if both times are valid
    if (!shiftStart.isValid() || !shiftEnd.isValid()) {
      return events;
    }

    // Generate recurring events for the direct shift assignment
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    let currentDate = startOfMonth.clone();
    while (currentDate.isSameOrBefore(endOfMonth)) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      
      // Skip weekends for default org shifts AND skip dates covered by schedules
      if (currentDate.day() !== 0 && currentDate.day() !== 6 && !coveredDates.has(dateKey)) {
        const startTime = shiftStart.format("HH:mm");
        const endTime = shiftEnd.format("HH:mm");

        events.push({
          id: `direct-${shift.id}-${dateKey}`,
          title: `${shift.name} (${startTime} - ${endTime})`,
          start: `${dateKey}T${startTime}:00`,
          end: `${dateKey}T${endTime}:00`,
          backgroundColor: "#3B82F6", // Blue for direct assignments
          borderColor: "#2563EB",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "direct_assignment",
            shiftId: shift.id,
            shiftName: shift.name,
            fullTitle: `${shift.name} (${startTime} - ${endTime})`,
          },
        });
      }
      currentDate.add(1, "day");
    }

    return events;
  };

  const handleRequestShiftChange = () => {
    if (!selectedEmployee) {
      return;
    }
    setIsRequestModalOpen(true);
  };

  return (
    <div className="w-full lg:min-w-[75%] p-2 sm:p-4 bg-gray-100 rounded-lg shadow-lg">
      {employeeId && (
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-base sm:text-lg font-semibold">
            Employee Schedule Calendar
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-1100">
            <span>Direct Assignment: {shift ? shift.name : "None"}</span>
            <span>Approved Schedules: {scheduleShifts?.count || 0}</span>
          </div>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height="auto"
        contentHeight="auto"
        aspectRatio={
          typeof window !== "undefined" && window.innerWidth < 768 ? 0.8 : 1.35
        }
        initialView="dayGridMonth"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today",
        }}
        dayMaxEvents={
          typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3
        }
        moreLinkClick="popover"
        events={events}
        eventContent={(eventInfo) => <EventWithTooltip eventInfo={eventInfo} />}
        eventClassNames={() => [
          "transition-all",
          "hover:opacity-90",
          "hover:scale-105",
        ]}
        dayCellContent={(dayInfo) => {
          return {
            html: `<div class="text-sm sm:text-base">${dayInfo.dayNumberText}</div>`,
          };
        }}
      />

      {/* Request Shift Change Button */}
      {employeeId && (
        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={handleRequestShiftChange}
              className="w-full sm:w-auto text-sm sm:text-base"
              size={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "default"
                  : "lg"
              }
            >
              {isEditEmployeeShiftPermitted
                ? "Edit Employee Shift"
                : "Request Shift Change"}
            </Button>
          </div>
        </div>
      )}

      {/* Shift Change Request Modal */}
      {isRequestModalOpen && selectedEmployee && (
        <ShiftChangeRequestModal
          isOpen={isRequestModalOpen}
          setIsOpen={setIsRequestModalOpen}
          employee={selectedEmployee}
          reload={reload}
          refreshShiftChangeRequests={refreshShiftChangeRequests}
          shift_requested="Manager"
        />
      )}
    </div>
  );
};

export default Calendar;
