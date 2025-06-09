// ScheduleCalendar.jsx with Tooltips
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "src/@/components/ui/tooltip";

// Event Content Component with Tooltip
const EventWithTooltip = ({ eventInfo }) => {
  const fullTitle = eventInfo.event.title;
  const shortTitle =
    fullTitle.length > 18 ? fullTitle.substring(0, 15) + "..." : fullTitle;

  // Extract additional details from extendedProps
  const { type, shiftName, scheduleId, duration } =
    eventInfo.event.extendedProps;

  // Create detailed tooltip content
  const getTooltipContent = () => {
    const start = moment(eventInfo.event.start).format("HH:mm");
    const end = eventInfo.event.end
      ? moment(eventInfo.event.end).format("HH:mm")
      : null;

    // Format type for display
    const formatType = (type) => {
      switch (type) {
        case "org_schedule":
          return "Organization Schedule";
        case "custom_regular":
          return "Custom Schedule";
        case "custom_split_1":
          return "Split Shift - Part 1";
        case "custom_split_2":
          return "Split Shift - Part 2";
        case "custom_off":
          return "Day Off";
        default:
          return "Scheduled Shift";
      }
    };

    return (
      <div className="space-y-1">
        <p className="font-medium">{shiftName || eventInfo.event.title}</p>
        {end ? (
          <p className="text-xs">
            Time: {start} - {end}
          </p>
        ) : (
          <p className="text-xs">All Day</p>
        )}
        <p className="text-xs">Type: {formatType(type)}</p>
        {duration && <p className="text-xs">Duration: {duration}</p>}
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
            {!eventInfo.event.allDay && (
              <div className="text-[7px] sm:text-[8px] lg:text-[9px] leading-tight truncate">
                {moment(eventInfo.event.start).format("HH:mm")} -{" "}
                {moment(eventInfo.event.end).format("HH:mm")}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ScheduleCalendar = ({ pendingSchedule }) => {
  console.log("Pending Schedule", pendingSchedule);
  const [events, setEvents] = useState([]);
  const prevScheduleRef = useRef(null);

  useEffect(() => {
    // Skip effect if pendingSchedule is null or undefined
    if (!pendingSchedule) {
      setEvents([]);
      prevScheduleRef.current = null;
      return;
    }

    // Skip effect if the schedule hasn't actually changed
    if (
      prevScheduleRef.current &&
      prevScheduleRef.current.id === pendingSchedule.id
    ) {
      return;
    }

    // Update the reference to current schedule
    prevScheduleRef.current = pendingSchedule;

    // Generate calendar events from the schedule data
    generateCalendarEvents(pendingSchedule);
  }, [pendingSchedule]);

  const generateCalendarEvents = (schedule) => {
    console.log("=== DEBUG: generateCalendarEvents ===");
    console.log("Full schedule object:", schedule);
    console.log("schedule.is_org_based:", schedule.is_org_based);
    console.log("schedule.shift_details:", schedule.shift_details);
    console.log("schedule.custom_schedule:", schedule.custom_schedule);

    try {
      const events = [];

      if (schedule.is_org_based && schedule.shift_details) {
        console.log("INFO - Generating org-based schedule events", schedule);
        events.push(...generateOrgScheduleEvents(schedule));
      } else if (schedule.custom_schedule) {
        console.log("INFO - Generating custom schedule events", schedule);
        events.push(...generateCustomScheduleEvents(schedule));
      } else {
        console.log("WARNING - No valid schedule type found:", {
          is_org_based: schedule.is_org_based,
          has_shift_details: !!schedule.shift_details,
          has_custom_schedule: !!schedule.custom_schedule,
        });
      }

      console.log("Generated events:", events);
      setEvents(events);
    } catch (error) {
      console.error("Error generating calendar events:", error);
      setEvents([]);
    }
  };

  const generateOrgScheduleEvents = (schedule) => {
    console.log("=== DEBUG: generateOrgScheduleEvents ===");
    console.log("schedule:", schedule);
    console.log("shift_details:", schedule.shift_details);
    const events = [];
    const shiftDetails = schedule.shift_details;

    if (!shiftDetails) return events;
    console.log("shiftDetails.weekdays:", shiftDetails.weekdays);
    console.log("shiftDetails.starttime:", shiftDetails.starttime);
    console.log("shiftDetails.endtime:", shiftDetails.endtime);

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
        const startTime = moment(
          shiftDetails.starttime.replace("Z", "")
        ).format("HH:mm");
        const endTime = moment(shiftDetails.endtime.replace("Z", "")).format(
          "HH:mm"
        );

        // Handle overnight shifts
        let eventEndDate = currentDate.format("YYYY-MM-DD");
        if (endTime < startTime) {
          // End time is next day
          eventEndDate = currentDate.clone().add(1, "day").format("YYYY-MM-DD");
        }

        // Calculate duration
        const duration = calculateDuration(startTime, endTime);

        events.push({
          title: `${shiftDetails.name} (${startTime} - ${endTime})`,
          start: `${currentDate.format("YYYY-MM-DD")}T${startTime}:00`,
          end: `${eventEndDate}T${endTime}:00`,
          backgroundColor: "#10B981", // Green for org shifts
          borderColor: "#059669",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "org_schedule",
            shiftName: shiftDetails.name,
            scheduleId: schedule.id,
            duration: duration,
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

    // Iterate through each date in custom_schedule
    Object.entries(customSchedule).forEach(([date, daySchedule]) => {
      if (daySchedule.is_off) {
        // Add off day event
        events.push({
          title: "OFF",
          start: date,
          allDay: true,
          backgroundColor: "#6B7280",
          borderColor: "#4B5563",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_off",
            shiftName: "Day Off",
            scheduleId: schedule.id,
            fullTitle: "Day Off",
          },
        });
      } else if (daySchedule.is_split) {
        // Add split shift events
        if (daySchedule.start_time_1 && daySchedule.end_time_1) {
          const duration1 = calculateDuration(
            daySchedule.start_time_1,
            daySchedule.end_time_1
          );

          events.push({
            title: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            start: `${date}T${daySchedule.start_time_1}:00`,
            end: `${date}T${daySchedule.end_time_1}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split_1",
              shiftName: "Custom Split Shift - Part 1",
              scheduleId: schedule.id,
              duration: duration1,
              fullTitle: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            },
          });
        }

        if (daySchedule.start_time_2 && daySchedule.end_time_2) {
          // Handle next day end time if needed
          let endDate = date;
          if (
            daySchedule.end_time_2 === "00:00" ||
            daySchedule.end_time_2 < daySchedule.start_time_2
          ) {
            endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
          }

          const duration2 = calculateDuration(
            daySchedule.start_time_2,
            daySchedule.end_time_2
          );

          events.push({
            title: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            start: `${date}T${daySchedule.start_time_2}:00`,
            end: `${endDate}T${daySchedule.end_time_2}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split_2",
              shiftName: "Custom Split Shift - Part 2",
              scheduleId: schedule.id,
              duration: duration2,
              fullTitle: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            },
          });
        }
      } else {
        // Regular custom shift
        let endDate = date;
        if (
          daySchedule.end_time === "00:00" ||
          daySchedule.end_time < daySchedule.start_time
        ) {
          endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
        }

        const duration = calculateDuration(
          daySchedule.start_time,
          daySchedule.end_time
        );

        events.push({
          title: `Custom (${daySchedule.start_time} - ${daySchedule.end_time})`,
          start: `${date}T${daySchedule.start_time}:00`,
          end: `${endDate}T${daySchedule.end_time}:00`,
          backgroundColor: "#8B5CF6",
          borderColor: "#7C3AED",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_regular",
            shiftName: "Custom Shift",
            scheduleId: schedule.id,
            duration: duration,
            fullTitle: `Custom (${daySchedule.start_time} - ${daySchedule.end_time})`,
          },
        });
      }
    });

    return events;
  };

  const calculateDuration = (startTime, endTime) => {
    const start = moment(startTime, "HH:mm:ss");
    const end = moment(endTime, "HH:mm:ss");

    // Handle overnight shifts
    if (end.isBefore(start)) {
      end.add(1, "day");
    }

    const duration = moment.duration(end.diff(start));
    return `${duration.hours().toString().padStart(2, "0")}:${duration
      .minutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 h-fit">
      {pendingSchedule && (
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-lg font-semibold">
            {pendingSchedule.schedule_name}
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-1100">
            <span>
              Type:{" "}
              {pendingSchedule.is_org_based
                ? "Organization Shift"
                : "Custom Schedule"}
            </span>
            <span>
              Period: {moment(pendingSchedule.start_date).format("MMM DD")} -{" "}
              {moment(pendingSchedule.end_date).format("MMM DD, YYYY")}
            </span>
            <span>Total Hours: {pendingSchedule.total_weekly_hours}h</span>
          </div>
          {pendingSchedule.is_org_based && pendingSchedule.shift_details && (
            <div className="mt-1 text-sm">
              Shift: {pendingSchedule.shift_details.name} (
              {moment(pendingSchedule.shift_details.starttime).format("HH:mm")}{" "}
              - {moment(pendingSchedule.shift_details.endtime).format("HH:mm")})
            </div>
          )}
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        events={events}
        eventContent={(eventInfo) => <EventWithTooltip eventInfo={eventInfo} />}
        eventClassNames={() => [
          "transition-all",
          "hover:opacity-90",
          "hover:scale-105",
        ]}
      />
    </div>
  );
};

export default ScheduleCalendar;
