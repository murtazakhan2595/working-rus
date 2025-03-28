import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import luxonPlugin from "@fullcalendar/luxon3";
import rrulePlugin from "@fullcalendar/rrule";
import { DateTime } from "luxon";

const Calendar = ({ shift }) => {
  const [events, setEvents] = useState([]);
  const prevShiftRef = useRef(null);

  useEffect(() => {
    // Skip effect if shift is null or undefined
    if (!shift) {
      setEvents([]);
      prevShiftRef.current = null;
      return;
    }

    // Skip effect if the shift hasn't actually changed
    if (
      prevShiftRef.current &&
      prevShiftRef.current.id === shift.id &&
      prevShiftRef.current.starttime === shift.starttime &&
      prevShiftRef.current.endtime === shift.endtime
    ) {
      return;
    }

    // Update the reference to current shift
    prevShiftRef.current = shift;

    try {
      const startDate = DateTime.fromISO(shift.starttime);
      const endDate = DateTime.fromISO(shift.endtime);
      const duration = endDate.diff(startDate, ["hours", "minutes"]);
      const formattedDuration = `${duration.hours
        .toString()
        .padStart(2, "0")}:${duration.minutes.toString().padStart(2, "0")}`;

      // Create the event object
      const event = {
        title: `${shift.name} Shift`,
        rrule: {
          freq: "daily",
          dtstart: shift.starttime,
        },
        duration: formattedDuration,
      };

      setEvents([event]);
    } catch (error) {
      console.error("Error processing shift data:", error);
      setEvents([]);
    }
  }, [shift]);

  return (
    <div className="min-w-[75%] p-4 bg-gray-100 rounded-lg shadow-lg">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          luxonPlugin,
          rrulePlugin,
        ]}
        height="70vh"
        initialView="timeGridWeek"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
      />
    </div>
  );
};

export default Calendar;
