// Simplified ScheduleCalendar.jsx - No API fetching needed
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

const pendingSchedule = {
  id: 4,
  employee: 104,
  shift_id: null,
  schedule_name: "Custom Arrangement - Week Jan 15-21",
  start_date: "2024-01-15",
  end_date: "2024-01-21",
  is_org_based: false,
  custom_schedule: {
    "2025-05-22": {
      is_off: false,
      is_split: false,
      start_time: "09:00",
      end_time: "17:00",
    },
    "2025-05-23": {
      is_off: false,
      is_split: true,
      start_time_1: "09:00",
      end_time_1: "13:00",
      start_time_2: "14:00",
      end_time_2: "18:00",
    },
    "2025-05-24": {
      is_off: true,
    },
    "2025-05-25": {
      is_off: false,
      is_split: false,
      start_time: "10:00",
      end_time: "18:00",
    },
    "2025-05-26": {
      is_off: false,
      is_split: false,
      start_time: "16:00",
      end_time: "00:00", // Next day
    },
  },
  total_weekly_hours: 32.0,
  status: "Pending",
  assigned_by: 201,
  approved_by: null,
  approval_date: null,
  created_at: "2024-01-10T10:30:00Z",

  // No shift details for custom schedules
  shiftDetails: null,

  // Employee details
  employeeDetails: {
    id: 104,
    first_name: "Alice",
    last_name: "Brown",
    employee_id: "EMP004",
  },
};

const ScheduleCalendar = ({}) => {
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
    try {
      const events = [];

      if (schedule.is_org_based && schedule.shiftDetails) {
        // Handle organization-based schedule
        events.push(...generateOrgScheduleEvents(schedule));
      } else if (schedule.custom_schedule) {
        // Handle custom schedule
        events.push(...generateCustomScheduleEvents(schedule));
      }

      setEvents(events);
    } catch (error) {
      console.error("Error generating calendar events:", error);
      setEvents([]);
    }
  };

  const generateOrgScheduleEvents = (schedule) => {
    const events = [];
    const shift = schedule.shiftDetails;

    // Get weekdays array from shift
    const weekdays = shift.weekdays
      ? shift.weekdays.split(",")
      : ["mon", "tue", "wed", "thu", "fri"];

    // Create individual events for each day in the date range
    const startDate = moment(schedule.start_date);
    const endDate = moment(schedule.end_date);

    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const dayName = currentDate.format("ddd").toLowerCase();

      // Check if this day is in the shift's weekdays
      if (weekdays.includes(dayName)) {
        const eventStart =
          currentDate.format("YYYY-MM-DD") + "T" + shift.starttime;
        const eventEnd = currentDate.format("YYYY-MM-DD") + "T" + shift.endtime;

        if (shift.type === "Split") {
          events.push({
            title: `${shift.name} (Split)`,
            start: eventStart,
            end: eventEnd,
            backgroundColor: "#3B82F6",
            borderColor: "#2563EB",
            textColor: "#FFFFFF",
          });
        } else {
          events.push({
            title: shift.name,
            start: eventStart,
            end: eventEnd,
            backgroundColor: "#10B981",
            borderColor: "#059669",
            textColor: "#FFFFFF",
          });
        }
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
        });
      } else if (daySchedule.is_split) {
        // Add split shift events
        if (daySchedule.start_time_1 && daySchedule.end_time_1) {
          events.push({
            title: "Custom Shift (Part 1)",
            start: `${date}T${daySchedule.start_time_1}:00`,
            end: `${date}T${daySchedule.end_time_1}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
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

          events.push({
            title: "Custom Shift (Part 2)",
            start: `${date}T${daySchedule.start_time_2}:00`,
            end: `${endDate}T${daySchedule.end_time_2}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
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

        events.push({
          title: "Custom Shift",
          start: `${date}T${daySchedule.start_time}:00`,
          end: `${endDate}T${daySchedule.end_time}:00`,
          backgroundColor: "#8B5CF6",
          borderColor: "#7C3AED",
          textColor: "#FFFFFF",
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
    <div className="flex-1 h-fit ">
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
          {pendingSchedule.is_org_based && pendingSchedule.shiftDetails && (
            <div className="mt-1 text-sm text-gray-600">
              Shift: {pendingSchedule.shiftDetails.name} (
              {pendingSchedule.shiftDetails.starttime} -{" "}
              {pendingSchedule.shiftDetails.endtime})
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
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="font-semibold text-xs">
                {eventInfo.event.title}
              </div>
              {!eventInfo.event.allDay && (
                <div className="text-xs opacity-80">
                  {moment(eventInfo.event.start).format("HH:mm")} -{" "}
                  {moment(eventInfo.event.end).format("HH:mm")}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default ScheduleCalendar;
