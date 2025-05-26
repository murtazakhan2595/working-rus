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
import { EmployeeColumns } from "./shiftChangeRequestColumns";
import moment from "moment";

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

  // Add this function above your component or import it
  const getChangeRequestComparison = async (changeRequest) => {
    // Find all approved schedules that overlap with this date range
    const overlappingSchedules = await getShiftSchedule({
      filterData: {
        employee: changeRequest.employee,
        end_date_gte: changeRequest.start_date,
        start_date_lte: changeRequest.end_date,
        status: "Approved",
        is_change_request: false,
      },
    });

    // Build comparison data
    const comparisonData = [];
    const startDate = moment(changeRequest.start_date);
    const endDate = moment(changeRequest.end_date);

    let current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      const dateStr = current.format("YYYY-MM-DD");

      // Find original shift from overlapping schedules
      let originalShift = "No Shift";

      for (const schedule of overlappingSchedules.results || []) {
        if (
          current.isBetween(schedule.start_date, schedule.end_date, "day", "[]")
        ) {
          if (schedule.custom_schedule && schedule.custom_schedule[dateStr]) {
            const day = schedule.custom_schedule[dateStr];
            if (day.is_off) {
              originalShift = "OFF";
            } else if (day.is_split) {
              originalShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
            } else {
              originalShift = `${day.start_time}-${day.end_time}`;
            }
          }
          break;
        }
      }

      // Get requested shift
      let requestedShift = "No Shift";
      if (changeRequest.custom_schedule[dateStr]) {
        const day = changeRequest.custom_schedule[dateStr];
        if (day.is_off) {
          requestedShift = "OFF";
        } else if (day.is_split) {
          requestedShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
        } else {
          requestedShift = `${day.start_time}-${day.end_time}`;
        }
      }

      if (originalShift !== requestedShift) {
        comparisonData.push({
          date: dateStr,
          current_shift: originalShift,
          requested_shift: requestedShift,
          has_change: true,
        });
      }

      current.add(1, "day");
    }

    return comparisonData;
  };

  // Update your useEffect
  useEffect(() => {
    const fetchShiftChangeRequests = async () => {
      try {
        const response = await getShiftSchedule({
          filterData: {
            status: "Pending",
            is_change_request: true,
            // Add any branch/employee filters based on user role
            ordering: ordering,
            page: options.page,
            page_size: options.sizePerPage,
          },
        });

        if (response && response.results) {
          // Load comparison data for each request
          const requestsWithComparison = await Promise.all(
            response.results.map(async (request) => {
              const comparisonData = await getChangeRequestComparison(request);
              return {
                ...request,
                comparison_data: comparisonData,
              };
            })
          );

          setShiftChangeRequests({
            ...response,
            results: requestsWithComparison,
          });
        }
      } catch (error) {
        console.error("Error fetching shift change requests:", error);
        toast.error("Failed to load shift change requests");
      }
    };

    fetchShiftChangeRequests();
  }, [ordering, options.page, options.sizePerPage]);

  console.log("shiftChangeRequests", shiftChangeRequests);
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
