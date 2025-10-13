import ViewShiftChangeRequests from "./ViewShiftChangeRequests";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { getEmployeeCustomList } from "app/hooks/general";
import { fetchEmployeeShiftData, } from "./shiftScheduleUtils";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import { PageLoader } from "components";
import { getEmployeeDropdownList } from "app/hooks/general";

const ShiftStatusOptions = [
  { value: "assigned", label: "Assigned" },
  { value: "not_assigned", label: "Not Assigned" },
];

const Emplist = () => {
  const Departments = useSelector((state) => state.common.departments);
  const userProfile = useSelector((state) => state.user.userProfile);
  const isViewShiftChangeRequestsPermitted = HasAccess("VIEW_SHIFT_CHANGE_REQUESTS")
  const [isLoading, setIsLoading] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState(null);
  const [TeamMembers, setTeamMembers] = useState("");
  const [scheduleShifts, setScheduleShifts] = useState({ results: [], count: 0, });
  const [filterData, setFilterData] = useState({});
  const [refreshRequests, setRefreshRequests] = useState(0);

  const handleSelect = async (memberId) => {
    setActiveMember(memberId);
    await setEmployeeShiftDetails(memberId);
  }

  const setEmployeeShiftDetails = async (memberId) => {
    try {
      const { employeeShift: shift, scheduleShifts: schedules } = await fetchEmployeeShiftData(memberId ?? activeMember);
      setEmployeeShift(shift);
      setScheduleShifts(schedules);
    } catch (error) {
      setEmployeeShift(null);
      setScheduleShifts({
        results: [],
        count: 0,
      });
    }
  }

  useEffect(() => {
    const fetchEmpList = async () => {
      try {
        setIsLoading(true);
        setActiveMember(null);
        const filters = { ...filterData, ...(userProfile.role.includes(1) ? {} : { reporting_employee: userProfile.id }) }
        const response = await getEmployeeDropdownList({
          filterData: filters,
          employee_status: "Active,Probation,Notice Period",
        });
        console.log("filters", filters, response);
        if (response) {
          if (filterData.shift_status) {
            if (filterData.shift_status === 'assigned') {
              const assignedEmp = response.results.filter(obj => obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            } else if (filterData.shift_status === 'not_assigned') {
              const assignedEmp = response.results.filter(obj => !obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            }
          } else
            setTeamMembers(response);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchEmpList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, userProfile]);

  const refreshShiftChangeRequests = () => {
    setRefreshRequests(prev => prev + 1);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  return (
    <div>
      <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2 mb-4">
        <div className="flex">
          <FilterInput
            filters={[
              {
                type: "select",
                options: ShiftStatusOptions,
                name: "shift_status",
                placeholder: "Shift Status",
                className: "w-[150px]",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "emp_search",
            },
            {
              type: "select",
              options: Departments,
              name: "department_name",
              placeholder: "Department",
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>
      <div className="flex gap-2">
        <Card className="min-w-[25%]">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                <p className="text-sm">All Members</p>
                <p className="text-sm">{TeamMembers?.count || 0}</p>
              </div>
            </CardTitle>
          </CardHeader>
          {isLoading ? (
            <PageLoader />
          ) : (
            <CardContent className="max-h-[550px] overflow-auto">
              {TeamMembers?.count > 0 &&
                TeamMembers?.results?.map((member, index) => (
                  <Listview
                    teamMemeber={member}
                    key={index}
                    handleSelect={handleSelect}
                    activeMember={activeMember}
                  />
                ))}
              {(!TeamMembers?.results ||
                TeamMembers.results?.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No employees match the selected filters
                </div>
              )}
            </CardContent>
          )}
        </Card>
        <Calendar
          shift={employeeShift}
          scheduleShifts={scheduleShifts}
          employeeId={activeMember}
          reload={setEmployeeShiftDetails}
          refreshShiftChangeRequests={refreshShiftChangeRequests}
        />
      </div>

      {isViewShiftChangeRequestsPermitted && (
        <ViewShiftChangeRequests refreshTrigger={refreshRequests} />
      )}
    </div>
  );
};

export default Emplist;
