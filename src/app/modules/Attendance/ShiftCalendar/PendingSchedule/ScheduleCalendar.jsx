// Simplified ScheduleCalendar.jsx - No API fetching needed
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

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
    try {
      const events = [];

      if (schedule.is_org_based && schedule.shift_details) {
        console.log("INFO - Generating org-based schedule events 1", schedule);
        // Handle organization-based schedule
        events.push(...generateOrgScheduleEvents(schedule));
      } else if (schedule.custom_schedule) {
        console.log("INFO 1 - Generating custom schedule events", schedule);
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

        // Handle overnight shifts
        let eventEndDate = currentDate.format("YYYY-MM-DD");
        if (endTime < startTime) {
          // End time is next day
          eventEndDate = currentDate.clone().add(1, "day").format("YYYY-MM-DD");
        }

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
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="font-semibold text-xs">
                {eventInfo.event.title}
              </div>
              {!eventInfo.event.allDay && (
                <div className="text-xs ">
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
