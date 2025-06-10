// src/app/modules/Attendance/ShiftCalendar/ShiftCalendar.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import { useSelector } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import AssignShift from "./Section/AssignShift";
import Emplist from "./ShiftCalendarTab/Emplist";
import ShiftRequest from "./ShiftRequest";
import ShiftCalendarFilters from "./Section/ShiftCalendarFilters";
import PendingSchedule from "./PendingSchedule/PendingSchedule";
import ScheduleShiftModal from "./Modals/ScheduleShiftModal";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { Button } from "components/ui/button";
import EmployeeShiftCalendar from "./MyShiftCalendar/EmployeeShiftCalendar";
import HistoryAndLogs from "./HistoryAndLogs";
import { HasAccess } from "utils/PermissionUtils";

const ShiftCalendar = () => {
  const [activeTab, setActiveTab] = useState("shift-calendar");
  const [teamMembers, setTeamMembers] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [pendingSchedules, setPendingSchedules] = useState({
    results: [],
    count: 0,
  });

  const isViewLogsPermitted = HasAccess("VIEW_SHIFT_HISTORY_LOGS");
  const isViewShiftCalendarPermitted = HasAccess("VIEW_SHIFT_CALENDAR");
  const isScheduleShiftPermitted = HasAccess("SCHEDULE_EMPLOYEE_SHIFT");
  const isViewPendingSchedulesPermitted = HasAccess("VIEW_PENDING_SCHEDULES");
  const isRequestChangeForTeam = HasAccess("REQUEST_SHIFT_CHANGE_FOR_TEAM");
  const Employees = useSelector((state) => state.emp.employees);
  const userData = Employees.find(
    (employee) => employee.id === userProfile?.id
  );
  // Handle tab change and reset filters
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Reset filters when changing tabs
    setFilterData({});
  };

  const fetchUsers = useCallback(
    async (filters = {}) => {
      try {
        const response = await getEmployeeCustomList({
          filterData: {
            ...filters,
          },
        });
        if (response) {
          setTeamMembers(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isRequestChangeForTeam, userProfile?.branch_id]
  );

  const fetchPendingSchedules = useCallback(async () => {
    try {
      const response = await getShiftSchedule({
        filterData: { status: "Pending" },
        ordering: "-id",
      });
      if (response) {
        setPendingSchedules(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPendingSchedules();
  }, [fetchUsers, fetchPendingSchedules]);

  const handleFilterChange = useCallback(
    (newFilterData) => {
      setFilterData(newFilterData);

      // Check if we need to fetch new data (for server-side filters)
      const serverSideFilters = {};
      let hasServerSideFilters = false;

      // Check for server-side filter keys that exist in newFilterData
      const serverSideKeys = ["department_name", "branch_name"];

      serverSideKeys.forEach((key) => {
        if (key in newFilterData) {
          // Include the filter even if it's empty (to clear server-side filter)
          serverSideFilters[key] = newFilterData[key];
          hasServerSideFilters = true;
        }
      });

      // Always fetch when server-side filters are involved (including clearing them)
      if (
        hasServerSideFilters ||
        Object.keys(filterData).some((key) => serverSideKeys.includes(key))
      ) {
        fetchUsers(serverSideFilters);
      }
    },
    [fetchUsers, filterData] // Add filterData to dependencies
  );

  // Apply client-side filters for team members
  const filteredTeamMembers = useMemo(() => {
    if (!teamMembers.results || !teamMembers.results.length) {
      return { results: [], count: 0 };
    }

    // If no filters are applied, return original data
    if (!filterData || Object.keys(filterData).length === 0) {
      return teamMembers;
    }

    let filteredResults = teamMembers.results;

    // Apply client-side filters
    if (filterData.search_term) {
      filteredResults = filteredResults.filter((employee) => {
        const searchString =
          `${employee.id} ${employee.first_name} ${employee.last_name}`.toLowerCase();
        return searchString.includes(filterData.search_term.toLowerCase());
      });
    }

    // Filter by department (as a client-side filter fallback)
    if (filterData.department_name) {
      filteredResults = filteredResults.filter(
        (employee) => employee.department_name === filterData.department_name
      );
    }

    // Filter by shift assignment status
    if (filterData.shift_status) {
      filteredResults = filteredResults.filter((employee) => {
        const hasShiftAssignment = !!employee.shift_assignment;
        if (filterData.shift_status === "assigned") {
          return hasShiftAssignment;
        } else if (filterData.shift_status === "not_assigned") {
          return !hasShiftAssignment;
        }
        return true;
      });
    }

    return {
      results: filteredResults,
      count: filteredResults.length,
    };
  }, [teamMembers, filterData]);

  // Apply filters to pending schedules
  const filteredPendingSchedules = useMemo(() => {
    if (!pendingSchedules.results || !pendingSchedules.results.length) {
      return { results: [], count: 0 };
    }

    // If no filters are applied, return original data
    if (!filterData || Object.keys(filterData).length === 0) {
      return pendingSchedules;
    }

    let filteredResults = pendingSchedules.results;

    // Apply search filter
    if (filterData.search_term) {
      filteredResults = filteredResults.filter((schedule) => {
        // Find the employee in teamMembers to get their details
        const employee = teamMembers.results?.find(
          (emp) => emp.id === schedule.employee
        );
        if (employee) {
          const searchString =
            `${employee.id} ${employee.first_name} ${employee.last_name}`.toLowerCase();
          return searchString.includes(filterData.search_term.toLowerCase());
        }
        // If employee not found in teamMembers, just search by employee ID
        return schedule.employee?.toString().includes(filterData.search_term);
      });
    }

    // Filter by department
    if (filterData.department_name) {
      filteredResults = filteredResults.filter((schedule) => {
        // Find the employee in teamMembers to get their department
        const employee = teamMembers.results?.find(
          (emp) => emp.id === schedule.employee
        );
        return employee?.department_name === filterData.department_name;
      });
    }

    return {
      results: filteredResults,
      count: filteredResults.length,
    };
  }, [pendingSchedules, filterData, teamMembers]);

  // Decide which data to display based on active tab
  const displayData =
    activeTab === "shift-calendar" ? filteredTeamMembers : teamMembers;
  const displayPendingSchedules =
    activeTab === "pending-schedule"
      ? filteredPendingSchedules
      : pendingSchedules;

  const tabsData = [
    ...(isViewShiftCalendarPermitted
      ? [
          {
            value: "shift-calendar",
            label: "Shift Calendar",
            component: <Emplist teamMembers={displayData} />,
          },
        ]
      : []),
    ...(isViewPendingSchedulesPermitted
      ? [
          {
            value: "pending-schedule",
            label: "Pending Schedule",
            component: (
              <PendingSchedule
                pendingSchedules={displayPendingSchedules}
                reload={fetchPendingSchedules}
                employees={teamMembers.results}
              />
            ),
          },
        ]
      : []),
    {
      value: "shift-request",
      label: "Shift Request",
      component: <ShiftRequest employees={teamMembers.results} />,
    },
    ...(isViewLogsPermitted
      ? [
          {
            value: "history-logs",
            label: "History & Logs",
            component: <HistoryAndLogs />,
          },
        ]
      : []),
  ];

  const headerContent = (
    <div className="flex gap-2">
      {activeTab === "shift-calendar" && (
        <AssignShift employees={displayData.results} />
      )}
      {activeTab === "pending-schedule" && isScheduleShiftPermitted && (
        <Button onClick={() => setIsScheduleModalOpen(true)}>
          Schedule Shift
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Header content={headerContent} />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        defaultValue="shift-calendar"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList className="flex justify-center mb-4">
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-40 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Show filters for both shift calendar and pending schedule tabs */}
        {(activeTab === "shift-calendar" ||
          activeTab === "pending-schedule") && (
          <ShiftCalendarFilters
            key={activeTab} // Add key prop to force remount on tab change
            onFilterChange={handleFilterChange}
            teamMembers={teamMembers}
            showShiftStatus={activeTab === "shift-calendar"} 
          />
        )}

        {/* Render TabsContent using the same data */}
        {tabsData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>

      {/* Schedule Shift Modal */}
      {isScheduleModalOpen && (
        <ScheduleShiftModal
          isOpen={isScheduleModalOpen}
          setIsOpen={setIsScheduleModalOpen}
          selectedDates={null}
          employees={displayData.results}
          onScheduleSuccess={() => {
            fetchPendingSchedules(); 
          }}
        />
      )}
    </div>
  );
};

export default ShiftCalendar;
