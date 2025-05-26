import { getEmployeeCustomList } from "app/hooks/general";
import { RenderTeamMembers } from "app/modules/Dashboard/Screens/MyTeams";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { getShiftById, employeeData } from "app/hooks/attendance";
import { toast } from "react-toastify";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import CustomTable from "components/CustomTable";
import { CardDescription } from "components/ui/card";
import { EmployeeColumns } from "../ShiftCalendarTab/shiftChangeRequestColumns";

const Emplist = ({ teamMembers }) => {
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState(null);
  const [scheduleShifts, setScheduleShifts] = useState({
    results: [],
    count: 0,
  });
  const [shiftChangeRequests, setShiftChangeRequests] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({
      page: 1,
      sizePerPage: 10,
    });
  const [ordering, setOrdering] = useState("-id");
  console.log("scheduleShifts", scheduleShifts);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const handleSelect = async (memberId) => {
    setActiveMember(memberId);

    try {
      // Fetch employee data
      const empData = await employeeData(memberId);

      // Fetch approved scheduled shifts
      const empScheduleShift = await getShiftSchedule({
        filterData: { status: "Approved", employee: memberId },
      });

      // Check if employee has any shift data
      if (!empData?.shift_assignment && empScheduleShift?.count === 0) {
        // Don't show error - employee might have future schedules or can have shifts assigned
        setEmployeeShift(null);
        setScheduleShifts({
          results: [],
          count: 0,
        });
        return;
      }

      // Fetch direct shift assignment if exists
      if (empData?.shift_assignment) {
        const shiftData = await getShiftById(empData.shift_assignment);
        if (shiftData) {
          setEmployeeShift({
            ...shiftData,
          });
        }
      } else {
        setEmployeeShift(null);
      }

      // Set scheduled shifts
      if (empScheduleShift) {
        setScheduleShifts(empScheduleShift);
      } else {
        setScheduleShifts({
          results: [],
          count: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching employee shift data:", error);
      toast.error("Failed to fetch employee shift data");
      setEmployeeShift(null);
      setScheduleShifts({
        results: [],
        count: 0,
      });
    }
  };

  // If active member is no longer in filtered list, reset the calendar view
  useEffect(() => {
    if (activeMember && teamMembers?.results) {
      const memberStillInList = teamMembers.results.some(
        (member) => member.id === activeMember
      );

      if (!memberStillInList) {
        setActiveMember(null);
        setEmployeeShift(null);
        setScheduleShifts({
          results: [],
          count: 0,
        });
      }
    }
  }, [teamMembers, activeMember]);

  useEffect(() => {
    const fetchShiftChangeRequests = async () => {
      try {
        const response = await getShiftSchedule({
          filterData: { status: "Pending", is_change_request: true },
        });
        if (response) {
          setShiftChangeRequests(response);
        }
      } catch (error) {
        console.error("Error fetching shift change requests:", error);
      }
    };

    fetchShiftChangeRequests();
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <Card className="min-w-[25%]">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                <p className="text-sm">All Members</p>
                <p className="text-sm">{teamMembers?.count || 0}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[550px] overflow-auto">
            {teamMembers?.count > 0 &&
              teamMembers?.results?.map((member, index) => (
                <Listview
                  teamMemeber={member}
                  key={index}
                  handleSelect={handleSelect}
                  activeMember={activeMember}
                />
              ))}
            {(!teamMembers?.results || teamMembers.results.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                No employees match the selected filters
              </div>
            )}
          </CardContent>
        </Card>
        <Calendar
          shift={employeeShift}
          scheduleShifts={scheduleShifts}
          employeeId={activeMember}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-primary">Shift Change Requests</CardTitle>
          <CardDescription className="text-neutral-1100">
            View and manage shift change requests from employees. You can
            approve or reject requests directly from this section.
          </CardDescription>
          {/* <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 lg:mt-0 md:mt-0 xl:mt-0 justify-end flex"
          >
            <FilterInput
              filters={
                activeTab === "assets" ? assetsFilters : categoriesFilters
              }
              onChange={
                activeTab === "assets"
                  ? handleAssetsFilterChange
                  : handleCategoriesFilterChange
              }
            />
          </div> */}
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={EmployeeColumns}
            data={shiftChangeRequests?.results || []}
            pagination={true}
            dataTotalSize={shiftChangeRequests?.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Emplist;
