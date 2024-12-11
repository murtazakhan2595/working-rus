import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import luxonPlugin from "@fullcalendar/luxon3";
import rrulePlugin from "@fullcalendar/rrule";
import { DateTime } from "luxon"; // Import Luxon's DateTime

const Calendar = ({ shifts }) => {

  console.log("Shifts", shifts);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (shifts && shifts.length > 0) {
      const eventsArray = shifts.map((shift) => {
        const startDate = DateTime.fromISO(shift.shift_start_time);
        const endDate = DateTime.fromISO(shift.shift_end_time);

        // Calculate the duration using Luxon's Duration
        const duration = endDate.diff(startDate, ["hours", "minutes"]); // Duration in hours and minutes

        // Format the duration to "HH:mm" format
        const formattedDuration = `${duration.hours
          .toString()
          .padStart(2, "0")}:${duration.minutes.toString().padStart(2, "0")}`;

        console.log("Formatted Duration for shift", formattedDuration);

        // Create recurring event using rrule
        return {
          title: `${shift.emp_name} Shift`,
          rrule: {
            freq: "daily", // Repeat daily
            dtstart: shift.shift_start_time,
            // until: "2025-12-31T17:00:00", // Optional: define an end date for the recurring event
          },
          duration: formattedDuration,
        };
      });

      console.log("Events Array", eventsArray);
      setEvents(eventsArray);
    }else{
      setEvents([]);
    }
  }, [shifts]); // Update when shifts prop changes

  console.log("Events", events);

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
        initialView="timeGridWeek" // Start with a weekly view
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events} // Pass the dynamic events
      />
    </div>
  );
};

export default Calendar;
