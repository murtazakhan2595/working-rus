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
  console.log("userProfile", userData);

  const fetchUsers = useCallback(
    async (filters = {}) => {
      try {
        if (isRequestChangeForTeam) {
          filters.branch_id = userProfile?.branch_id;
        }
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
      const hasServerSideFilters = Object.keys(newFilterData).some((key) => {
        // Only department_name and branch_name are server-side filters
        if (
          (key === "department_name" || key === "branch_name") &&
          newFilterData[key]
        ) {
          serverSideFilters[key] = newFilterData[key];
          return true;
        }
        return false;
      });

      // If there are server-side filters, fetch new data
      if (hasServerSideFilters) {
        fetchUsers(serverSideFilters);
      }
    },
    [fetchUsers]
  );

  // Apply client-side filters using useMemo to avoid unnecessary recalculations
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
    if (filterData.id_and_first_name) {
      filteredResults = filteredResults.filter((employee) => {
        const searchString =
          `${employee.id} ${employee.first_name} ${employee.last_name}`.toLowerCase();
        return searchString.includes(
          filterData.id_and_first_name.toLowerCase()
        );
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

  const displayData = filteredTeamMembers;

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
                pendingSchedules={pendingSchedules}
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
        onValueChange={setActiveTab}
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

        {/* Add the filters component for the shift calendar tab */}
        {activeTab === "shift-calendar" && (
          <ShiftCalendarFilters
            onFilterChange={handleFilterChange}
            teamMembers={teamMembers}
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
          employees={displayData}
          onScheduleSuccess={() => {
            fetchPendingSchedules(); // Reload pending schedules after successful scheduling
          }}
        />
      )}
    </div>
  );
};

export default ShiftCalendar;
