// src/app/modules/Attendance/ShiftManagement/Components/ShiftCalendarView.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

const ShiftCalendarView = ({
  shifts = [],
  employeeName = "",
  editable = false,
  onShiftChange = () => {},
}) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert shifts to calendar events
    const calendarEvents = shifts.map((shift) => {
      if (shift.is_off) {
        return {
          title: "OFF",
          start: shift.date,
          allDay: true,
          backgroundColor: "#3b82f6", // Blue for OFF days
          borderColor: "#3b82f6",
          editable: editable,
        };
      } else {
        const startTime = moment(shift.start_time).format("HH:mm");
        const endTime = moment(shift.end_time).format("HH:mm");

        return {
          title: `${startTime} - ${endTime}`,
          start: shift.start_time,
          end: shift.end_time,
          backgroundColor: "#22c55e", // Green for working days
          borderColor: "#22c55e",
          editable: editable,
        };
      }
    });

    setEvents(calendarEvents);
  }, [shifts, editable]);

  const handleEventDrop = (info) => {
    if (!editable) return;

    const { event } = info;
    const updatedShift = {
      date: event.startStr.split("T")[0],
      is_off: event.title === "OFF",
      start_time: event.startStr,
      end_time: event.endStr || event.startStr,
    };

    onShiftChange(updatedShift);
  };

  const handleEventClick = (info) => {
    if (!editable) return;

    // You could show a modal here to edit the shift
    console.log("Event clicked:", info.event);
  };

  return (
    <div className="h-[500px] bg-white rounded-md border">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        initialView="timeGridWeek"
        editable={editable}
        selectable={editable}
        events={events}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        height="100%"
      />
    </div>
  );
};

export default ShiftCalendarView;
