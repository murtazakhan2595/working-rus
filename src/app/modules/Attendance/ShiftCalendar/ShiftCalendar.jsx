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
import PendingSchedule from "./Section/PendingSchedule";
import ShiftRequest from "./Section/ShiftRequest";
import ShiftCalendarFilters from "./Section/ShiftCalendarFilters";

const ShiftCalendar = () => {
  const [activeTab, setActiveTab] = useState("shift-calendar");
  const [teamMembers, setTeamMembers] = useState({ results: [], count: 0 });
  const [filteredTeamMembers, setFilteredTeamMembers] = useState({
    results: [],
    count: 0,
  });
  const [filterData, setFilterData] = useState({});
  const userProfile = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    const fetchData = async () => {
      const requestFilterData = {
        ...(userProfile.role === 2 ? { direct_report: userProfile.id } : {}),
      };
      try {
        const response = await getEmployeeCustomList({
          filterData: requestFilterData,
        });
        if (response) {
          setTeamMembers(response);
          setFilteredTeamMembers(response);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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

    setFilteredTeamMembers({
      ...teamMembers,
      results: filteredResults,
      count: filteredResults.length,
    });
  };

  return (
    <div>
      <Header
        content={<AssignShift employees={teamMembers.results} />}
        title="Shift Management"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule-shift">Schedule Shift</TabsTrigger>
          <TabsTrigger value="pending-schedule">Pending Schedule</TabsTrigger>
          <TabsTrigger value="shift-calendar">Shift Calendar</TabsTrigger>
          <TabsTrigger value="shift-request">Shift Request</TabsTrigger>
        </TabsList>

        {/* Add the filters component for the shift calendar tab */}
        {activeTab === "shift-calendar" && (
          <ShiftCalendarFilters
            onFilterChange={handleFilterChange}
            teamMembers={teamMembers}
          />
        )}

        <TabsContent value="schedule-shift">
          <ScheduleShift employees={teamMembers.results} />
        </TabsContent>

        <TabsContent value="pending-schedule">
          <PendingSchedule />
        </TabsContent>

        <TabsContent value="shift-calendar">
          <Emplist teamMembers={filteredTeamMembers} />
        </TabsContent>

        <TabsContent value="shift-request">
          <ShiftRequest employees={teamMembers.results} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftCalendar;
