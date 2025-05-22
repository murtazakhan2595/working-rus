// src/app/modules/Attendance/ShiftCalendar/ShiftCalendar.jsx
import React, { useState, useEffect } from "react";
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
import Emplist from "./Section/Emplist";
import ScheduleShift from "./Section/ScheduleShift";
import ShiftRequest from "./Section/ShiftRequest";
import ShiftCalendarFilters from "./Section/ShiftCalendarFilters";
import PendingSchedule from "./PendingSchedule/PendingSchedule";
import { getShiftSchedule } from "app/hooks/shiftManagement";

const ShiftCalendar = () => {
  const [activeTab, setActiveTab] = useState("shift-calendar");
  const [teamMembers, setTeamMembers] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const userProfile = useSelector((state) => state.user.userProfile);
  const [pendingSchedules, setPendingSchedules] = useState({
    results: [],
    count: 0,
  })

  // Define tabs data
  const tabsData = [
    {
      value: "schedule-shift",
      label: "Schedule Shift",
      component: <ScheduleShift employees={teamMembers.results} />,
    },
    {
      value: "pending-schedule",
      label: "Pending Schedule",
      component: <PendingSchedule pendingSchedules={pendingSchedules}/>,
    },
    {
      value: "shift-calendar",
      label: "Shift Calendar",
      component: <Emplist teamMembers={teamMembers} />,
    },
    {
      value: "shift-request",
      label: "Shift Request",
      component: <ShiftRequest employees={teamMembers.results} />,
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await getEmployeeCustomList();
      if (response) {
        setTeamMembers(response);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPendingSchedules = async () => {
    try {
      const response = await getShiftSchedule();
      if(response){
        setPendingSchedules(response);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchPendingSchedules();

  }, [userProfile]);

  // Handle filter changes from the ShiftCalendarFilters component
  const handleFilterChange = (newFilterData) => {
    setFilterData(newFilterData);
    applyFilters(newFilterData);
  };

  // Apply filters to the team members
  const applyFilters = (filters) => {
    if (!teamMembers.results || !teamMembers.results.length) {
      return;
    }

    let filteredResults = teamMembers.results.filter((employee) => {
      // Filter by ID or Name
      if (
        filters.id_and_first_name &&
        !`${employee.id} ${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(filters.id_and_first_name.toLowerCase())
      ) {
        return false;
      }

      // Filter by department
      if (
        filters.department_name &&
        employee.department_name !== filters.department_name
      ) {
        return false;
      }

      // Filter by shift assignment status
      if (filters.shift_status) {
        const hasShiftAssignment = !!employee.shift_assignment;
        if (
          (filters.shift_status === "assigned" && !hasShiftAssignment) ||
          (filters.shift_status === "not_assigned" && hasShiftAssignment)
        ) {
          return false;
        }
      }

      return true;
    });

    // setFilteredTeamMembers({
    //   ...teamMembers,
    //   results: filteredResults,
    //   count: filteredResults.length,
    // });
  };

  return (
    <div>
      <Header content={<AssignShift employees={teamMembers.results} />} />

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
    </div>
  );
};

export default ShiftCalendar;
