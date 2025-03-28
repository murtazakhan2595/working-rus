import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import React, { useEffect, useState } from "react";
import Emplist from "./Section/Emplist";
import AssignShift from "./Section/AssignShift";
import { useSelector } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { getShift } from "app/hooks/attendance";
import ShiftCalendarFilters from "./Section/ShiftCalendarFilters";

const ShiftCalender = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [teamMembers, setTeamMembers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
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

        const shifts = await getShift();
        if (shifts) {
          console.log("Shifts", shifts);
          setShifts(shifts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Handle filter changes from the ShiftCalendarFilters component
  const handleFilterChange = (newFilterData) => {
    setFilterData(newFilterData);
    applyFilters(newFilterData);
  };

  // Apply filters to the team members
  const applyFilters = (filters) => {
    let filtered = { ...teamMembers };

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
        content={
          <AssignShift
            employees={teamMembers.results}
            shifts={shifts.results}
          />
        }
      />

      {/* Add the filters component */}
      <ShiftCalendarFilters
        onFilterChange={handleFilterChange}
        teamMembers={teamMembers}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsContent value="all">
          <Emplist teamMembers={filteredTeamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftCalender;
