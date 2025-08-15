// src/app/modules/TransferAndRotation/JobRotationCalendar/JobRotationCalendar.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "components";
import { useSelector } from "react-redux";
import JobRotationCalendarView from "./JobRotationCalendarView";
import JobRotationFilters from "./JobRotationFilters";
import { getJobRotationRequests } from "app/hooks/transferAndRotation";

const JobRotationCalendar = () => {
  const [filterData, setFilterData] = useState({});
  const [jobRotations, setJobRotations] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);

  const userProfile = useSelector((state) => state.user.userProfile);
  const fetchJobRotations = 
    async () => {
      try {
        setLoading(true);
        const response = await getJobRotationRequests({
          filterData: filterData,
          ordering: "-created_at",
        });
        console.log("Fetched job rotations:", response);

        setJobRotations({
          results: response.results,
          count: response.count,
        });
      } catch (error) {
        console.error("Error fetching job rotations:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchJobRotations(filterData);
  }, [filterData]);

  const handleFilterChange = useCallback((newFilterData) => {
    setFilterData(newFilterData);
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />

      {/* Filters */}
      <JobRotationFilters
        onFilterChange={handleFilterChange}
        jobRotations={jobRotations}
      />

      {/* Calendar View */}
      <JobRotationCalendarView
        jobRotations={jobRotations}
        loading={loading}
        reload={() => fetchJobRotations(filterData)}
      />
    </div>
  );
};

export default JobRotationCalendar;
