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
import { getEmployeeList } from "app/hooks/general";
import Emplist from "./ShiftCalendarTab/Emplist";
import ShiftRequest from "./ShiftRequest";
import ShiftCalendarFilters from "./Section/ShiftCalendarFilters";
import PendingSchedule from "./PendingSchedule/PendingSchedule";
import DraftSchedule from "./PendingSchedule/DraftSchedule";
import ScheduleShiftModal from "./Modals/ScheduleShiftModal";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { Button } from "components/ui/button";
import EmployeeShiftCalendar from "./MyShiftCalendar/EmployeeShiftCalendar";
import HistoryAndLogs from "./HistoryAndLogs";
import { HasAccess } from "utils/PermissionUtils";
import OrganizationalChart from "app/modules/OfficeSetting/Screens/OrganizationalChart";
import AssignShift from "./Section/AssignShift";

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
  const [draftSchedules, setDraftSchedules] = useState({
    results: [],
    count: 0,
  });

  const isViewLogsPermitted = HasAccess("VIEW_SHIFT_HISTORY_LOGS");
  const isViewShiftCalendarPermitted = HasAccess("VIEW_SHIFT_CALENDAR");
  const isScheduleShiftPermitted = HasAccess("SCHEDULE_EMPLOYEE_SHIFT");
  const isViewPendingSchedulesPermitted = HasAccess("VIEW_PENDING_SCHEDULES");
  const isEditPendingSchedulesPermitted = HasAccess("EDIT_PENDING_SCHEDULES");
  const isAssignShiftPermitted = HasAccess("ASSIGN_SHIFT");

  // Handle tab change and reset filters
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Reset filters when changing tabs
    setFilterData({});

    // Re-fetch data when switching to specific tabs
    if (newTab === "schedule-shift") {
      fetchDraftSchedules();
    } else if (newTab === "pending-schedule") {
      fetchPendingSchedules();
    }
  };

  const fetchUsers = useCallback(
    async (filters = {}) => {
      try {
        const filterDataToSend = {
          ...filters,
        };
        if (!isEditPendingSchedulesPermitted && userProfile?.id) {
          filterDataToSend.direct_report = userProfile.id;
        }
        const response = await getEmployeeList({
          filterData: {
            ...filterDataToSend
          },
        });
        if (response) {
          if (filters.shift_status) {
            if (filters.shift_status === 'assigned') {
              const assignedEmp = response.results.filter(obj => obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            } else if (filters.shift_status === 'not_assigned') {
              const assignedEmp = response.results.filter(obj => !obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            }
          } else
            setTeamMembers(response);
        }
      } catch (err) {
        // Remove console.error
      }
    },
    [isEditPendingSchedulesPermitted, userProfile]
  );

  const fetchPendingSchedules = useCallback(async () => {
    try {
      const response = await getShiftSchedule({
        filterData: { status: "PENDING" }, // Backend will filter out drafts by default
        ordering: "-id",
      });
      if (response) {
        setPendingSchedules(response);
      }
    } catch (err) {
      // Remove console.error
    }
  }, []);

  const fetchDraftSchedules = useCallback(async () => {
    try {
      const filterData = { draft: true }; // Get only draft schedules

      // Add assigned_by_id filter so users only see their own draft schedules
      if (userProfile?.id) {
        filterData.assigned_by_id = userProfile.id;
      }

      const response = await getShiftSchedule({
        filterData,
        ordering: "-id",
      });

      if (response) {
        setDraftSchedules(response);
      }
    } catch (err) {
      // Remove console.error
    }
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === "shift-calendar") {
      fetchUsers(filterData);
    }
    if (activeTab === "pending-schedule") {
      fetchPendingSchedules();
    }
    if (activeTab === "schedule-shift") {
      fetchDraftSchedules();
    }
  }, [activeTab, filterData, fetchUsers, fetchPendingSchedules, fetchDraftSchedules]);

  const handleFilterChange = useCallback(
    (newFilterData) => {
      setFilterData(newFilterData);
      if (activeTab === "shift-calendar") {
        fetchUsers(newFilterData);
      }
      // Do NOT call fetchPendingSchedules or fetchDraftSchedules here
    },
    [fetchUsers, activeTab]
  );

  // Decide which data to display based on active tab
  const displayData = teamMembers;
  const displayPendingSchedules = pendingSchedules;
  const displayDraftSchedules = draftSchedules;

  const tabsData = [
    ...(isScheduleShiftPermitted
      ? [
        {
          value: "schedule-shift",
          label: "Schedule Shift",
          component: (
            <DraftSchedule
              draftSchedules={displayDraftSchedules}
              reload={() => {
                fetchDraftSchedules();
                fetchPendingSchedules(); // Also reload pending schedules when draft is processed
              }}
              employees={teamMembers.results}
            />
          ),
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
              reload={() => {
                fetchPendingSchedules();
                fetchDraftSchedules(); // Also reload draft schedules when schedule is rejected
              }}
              employees={teamMembers.results}
            />
          ),
        },
      ]
      : []),
    ...(isViewShiftCalendarPermitted
      ? [
        {
          value: "shift-calendar",
          label: "Shift Calendar",
          component: <Emplist teamMembers={displayData} />,
        },
      ]
      : []),

    {
      value: "shift-request",
      label: "Shift Request",
      component: <ShiftRequest />,
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
      {activeTab === "shift-calendar" && isAssignShiftPermitted && (
        <AssignShift employees={displayData.results} />
      )}
      {activeTab === "schedule-shift" && isScheduleShiftPermitted && (
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
        <div className="">
          <TabsList>
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Show filters for shift calendar, schedule shift, and pending schedule tabs */}
        {(activeTab === "schedule-shift" ||
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
          isDraft={activeTab === "schedule-shift"} // Pass isDraft based on current tab
          onScheduleSuccess={() => {
            if (activeTab === "schedule-shift") {
              fetchDraftSchedules(); // Reload draft schedules if on schedule shift tab
            } else {
              fetchPendingSchedules(); // Reload pending schedules for other tabs
            }
          }}
        />
      )}
    </div>
  );
};

export default ShiftCalendar;
