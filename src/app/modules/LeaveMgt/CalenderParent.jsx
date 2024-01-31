import React, { useState } from "react";
import LeaveCalendar from "./LeaveCalender";

const CalenderParent = () => {
  const [events, setEvents] = useState([
    {
      title: "John Doe Leave",
      start: new Date(2024, 2, 5),
      end: new Date(2024, 2, 10),
    },
    {
      title: "Alice Smith Leave",
      start: new Date(2024, 3, 15),
      end: new Date(2024, 3, 20),
    },
    {
      title: "Bob Johnson Leave",
      start: new Date(2024, 4, 8),
      end: new Date(2024, 4, 12),
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    location: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    console.log('Current Filters:', filters);
  };
  

  const departments = ["HR", "Engineering", "Marketing"];
  const locations = ["Office A", "Office B", "Remote"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = [2023, 2024, 2025, 2026];

  return (
    <div>
      <div>
        <label>Search by Name:</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <label>Filter by Department:</label>
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
        >
          <option value="">All</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <label>Filter by Location:</label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          <option value="">All</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <label>Filter by Month:</label>
        <select
          value={filters.month}
          onChange={(e) => handleFilterChange("month", e.target.value)}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        <label>Filter by Year:</label>
        <select
          value={filters.year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={{ height: "600px" }}>
        <LeaveCalendar events={events} filters={filters} />
      </div>
    </div>
  );
};

export default CalenderParent;
