import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { employeeData } from "app/hooks/attendance";
import ShiftChangeRequestModal from "./ShiftChangeRequestModal";

const Calendar = ({ shift, scheduleShifts, employeeId, reload }) => {
  const isHr = true;
  const [events, setEvents] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const prevDataRef = useRef(null);


  const userProfile = useSelector((state) => state.user.userProfile);

  // Check if user is Branch Manager or Cluster Manager
  const canRequestShiftChange = true;

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

      // 1. PRIORITY: Add approved schedule shifts first
      if (scheduleShifts?.results && scheduleShifts.results.length > 0) {
        scheduleShifts.results.forEach((schedule) => {
          if (schedule.is_org_based && schedule.shift_details) {
            // Organization-based scheduled shift
            events.push(...generateOrgScheduleEvents(schedule));
          } else if (schedule.custom_schedule) {
            // Custom scheduled shift
            events.push(...generateCustomScheduleEvents(schedule));
          }
        });
      }

      // 2. FALLBACK: Add direct shift assignment (only for dates not covered by schedules)
      if (shift && events.length === 0) {
        // Only show direct assignment if no schedules exist
        events.push(...generateDirectShiftEvents(shift));
      }

      setEvents(events);
    } catch (error) {
      console.error("Error generating calendar events:", error);
      setEvents([]);
    }
  };

  const generateOrgScheduleEvents = (schedule) => {
    const events = [];
    const shiftDetails = schedule.shift_details;

    if (!shiftDetails) return events;

    // Parse weekdays from JSON string
    let weekdays = [];
    try {
      weekdays = JSON.parse(shiftDetails.weekdays);
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

      if (shortWeekdays.includes(dayName)) {
        const startTime = moment(shiftDetails.starttime).format("HH:mm");
        const endTime = moment(shiftDetails.endtime).format("HH:mm");

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
          },
        });
      }
    });

    return events;
  };

  const generateDirectShiftEvents = (shift) => {
    const events = [];

    // Generate recurring events for the direct shift assignment
    // Show for current month only
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    let currentDate = startOfMonth.clone();
    while (currentDate.isSameOrBefore(endOfMonth)) {
      // Skip weekends for default org shifts (you can modify this logic)
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        const startTime = moment(shift.starttime).format("HH:mm");
        const endTime = moment(shift.endtime).format("HH:mm");

        events.push({
          title: `${shift.name} (${startTime} - ${endTime})`,
          start: `${currentDate.format("YYYY-MM-DD")}T${startTime}:00`,
          end: `${currentDate.format("YYYY-MM-DD")}T${endTime}:00`,
          backgroundColor: "#3B82F6", // Blue for direct assignments
          borderColor: "#2563EB",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "direct_assignment",
            shiftId: shift.id,
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
    <div className="min-w-[75%] p-4 bg-gray-100 rounded-lg shadow-lg">
      {employeeId && (
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-lg font-semibold">
            Employee Schedule Calendar
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-1100">
            <span>Direct Assignment: {shift ? shift.name : "None"}</span>
            <span>Approved Schedules: {scheduleShifts?.count || 0}</span>
          </div>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height="70vh"
        initialView="dayGridMonth" // Only monthly view
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "", // Remove view switching buttons
        }}
        events={events}
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="font-semibold text-xs">
                {eventInfo.event.title}
              </div>
            </div>
          );
        }}
        dayMaxEvents={3} // Limit events per day for better visibility
        moreLinkClick="popover"
      />

      {/* Legend */}
      <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
        <div className="text-sm font-medium mb-2">Legend:</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Direct Assignment</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Org Schedule</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Custom Schedule</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Split Shift</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>OFF Day</span>
          </div>
        </div>
      </div>
      {/* Request Shift Change Button - Only visible to Branch/Cluster Managers */}
      {employeeId && canRequestShiftChange && (
        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm text-end">
          <Button onClick={handleRequestShiftChange} className="" size="lg">
            {isHr ? "Edit Employee Shift" : "Request Shift Change"}
          </Button>
        </div>
      )}

      {/* Shift Change Request Modal */}
      {isRequestModalOpen && selectedEmployee && (
        <ShiftChangeRequestModal
          isOpen={isRequestModalOpen}
          setIsOpen={setIsRequestModalOpen}
          employee={selectedEmployee}
          reload={reload}
          shift_requested="Manager"
        />
      )}
    </div>
  );
};

export default Calendar;
