// src/app/modules/TransferAndRotation/JobRotationCalendar/JobRotationCalendar.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "components";
import { useSelector } from "react-redux";
import JobRotationCalendarView from "./JobRotationCalendarView";
import JobRotationFilters from "./JobRotationFilters";

const JobRotationCalendar = () => {
  const [filterData, setFilterData] = useState({});
  const [jobRotations, setJobRotations] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);

  const userProfile = useSelector((state) => state.user.userProfile);

  // Mock data for demonstration - replace with actual API calls
  const mockJobRotations = useMemo(
    () => [
      {
        id: 1,
        employee: {
          id: 101,
          name: "John Doe",
          emp_serial_no: "EMP001",
          profile_picture: null,
          department: "Engineering",
          position: "Software Engineer",
        },
        current_branch: {
          id: 1,
          name: "Karachi Main",
          code: "KHI-M",
        },
        new_branch: {
          id: 2,
          name: "Lahore Office",
          code: "LHR-O",
        },
        effective_date: "2025-08-15",
        status: "Pending Approval",
        cap_time_days: 30,
        request_date: "2025-07-20",
        requested_by: "HR Team",
        reason: "Career Development",
        approval_details: [],
      },
      {
        id: 2,
        employee: {
          id: 102,
          name: "Sarah Ahmed",
          emp_serial_no: "EMP002",
          profile_picture: null,
          department: "Marketing",
          position: "Marketing Manager",
        },
        current_branch: {
          id: 2,
          name: "Lahore Office",
          code: "LHR-O",
        },
        new_branch: {
          id: 3,
          name: "Islamabad Branch",
          code: "ISB-B",
        },
        effective_date: "2025-08-10",
        status: "Scheduled",
        cap_time_days: 45,
        request_date: "2025-07-15",
        requested_by: "Department Head",
        reason: "Operational Requirement",
        approval_details: [
          {
            approver: "Manager",
            status: "Approved",
            date: "2025-07-18",
          },
        ],
      },
      {
        id: 3,
        employee: {
          id: 103,
          name: "Ali Hassan",
          emp_serial_no: "EMP003",
          profile_picture: null,
          department: "Finance",
          position: "Financial Analyst",
        },
        current_branch: {
          id: 1,
          name: "Karachi Main",
          code: "KHI-M",
        },
        new_branch: {
          id: 2,
          name: "Lahore Office",
          code: "LHR-O",
        },
        effective_date: "2025-07-28",
        status: "In Progress",
        cap_time_days: 60,
        request_date: "2025-06-20",
        requested_by: "HR Team",
        reason: "Skill Enhancement",
        approval_details: [],
      },
      {
        id: 4,
        employee: {
          id: 104,
          name: "Fatima Khan",
          emp_serial_no: "EMP004",
          profile_picture: null,
          department: "HR",
          position: "HR Specialist",
        },
        current_branch: {
          id: 3,
          name: "Islamabad Branch",
          code: "ISB-B",
        },
        new_branch: {
          id: 1,
          name: "Karachi Main",
          code: "KHI-M",
        },
        effective_date: "2025-07-20",
        status: "Overdue",
        cap_time_days: 30,
        request_date: "2025-06-15",
        requested_by: "Department Head",
        reason: "Knowledge Transfer",
        approval_details: [],
      },
      {
        id: 5,
        employee: {
          id: 105,
          name: "Ahmed Malik",
          emp_serial_no: "EMP005",
          profile_picture: null,
          department: "Operations",
          position: "Operations Manager",
        },
        current_branch: {
          id: 2,
          name: "Lahore Office",
          code: "LHR-O",
        },
        new_branch: {
          id: 1,
          name: "Karachi Main",
          code: "KHI-M",
        },
        effective_date: "2025-09-01",
        status: "Cancelled",
        cap_time_days: 90,
        request_date: "2025-07-10",
        requested_by: "HR Team",
        reason: "Position Change",
        approval_details: [],
      },
    ],
    []
  );

  const fetchJobRotations = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await getJobRotations({
        //   filterData: filters,
        //   ordering: "-created_at"
        // });

        // Mock filtering logic
        let filteredRotations = [...mockJobRotations];

        if (filters.department) {
          filteredRotations = filteredRotations.filter(
            (rotation) => rotation.employee.department === filters.department
          );
        }

        if (filters.status) {
          filteredRotations = filteredRotations.filter(
            (rotation) => rotation.status === filters.status
          );
        }

        if (filters.employee_search) {
          filteredRotations = filteredRotations.filter(
            (rotation) =>
              rotation.employee.name
                .toLowerCase()
                .includes(filters.employee_search.toLowerCase()) ||
              rotation.employee.emp_serial_no
                .toLowerCase()
                .includes(filters.employee_search.toLowerCase())
          );
        }

        setJobRotations({
          results: filteredRotations,
          count: filteredRotations.length,
        });
      } catch (error) {
        console.error("Error fetching job rotations:", error);
      } finally {
        setLoading(false);
      }
    },
    [mockJobRotations]
  );

  useEffect(() => {
    fetchJobRotations(filterData);
  }, [filterData, fetchJobRotations]);

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
