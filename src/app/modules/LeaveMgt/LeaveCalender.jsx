// src/components/LeaveCalendar.js
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const LeaveCalendar = ({ events, filters }) => {
//   const filteredEvents = events.filter((event) => {
//     // Apply filters to events based on the filters object
//     return (
//       event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
//       (filters.department === "" || event.department === filters.department) &&
//       (filters.location === "" || event.location === filters.location) &&
//       new Date(event.start).getMonth() === filters.month &&
//       new Date(event.start).getFullYear() === filters.year
//     );
//   });

//   console.log("events:", events);
//   console.log("filteredEvents:", filteredEvents);

  // Replace filteredEvents with static data for testing
const filteredEvents = [
    { title: 'John Doe Leave', start: new Date(2024, 0, 24), end: new Date(2024, 0, 26) },
    { title: 'Alice Smith Leave', start: new Date(2024, 0, 24), end: new Date(2024, 0, 26) },
    { title: 'Bob Johnson Leave', start: new Date(2024, 0, 24), end: new Date(2024, 0, 26) },
  ];
  

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        views={["month"]}
        step={60}
        showMultiDayTimes
        style={{ height: "500px", border: "1px solid #ccc" }} 
      />
    </div>
  );
};

export default LeaveCalendar;
