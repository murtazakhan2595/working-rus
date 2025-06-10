import { getEmployeeCustomList } from "app/hooks/general";
import { RenderTeamMembers } from "app/modules/Dashboard/Screens/MyTeams";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { toast } from "react-toastify";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import CustomTable from "components/CustomTable";
import { CardDescription } from "components/ui/card";
import { EmployeeColumns } from "./shiftChangeRequestColumns";
import moment from "moment";
import {
  fetchEmployeeShiftData,
  getChangeRequestComparison,
} from "./shiftScheduleUtils";
import { HasAccess } from "utils/PermissionUtils";
import { FilterInput } from "components/FormControl";
import { useSelector } from "react-redux";

const Emplist = ({ teamMembers }) => {
  const isEditEmployeeShiftPermitted = HasAccess("EDIT_EMPLOYEE_SHIFT");
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [scheduleShifts, setScheduleShifts] = useState({
    results: [],
    count: 0,
  });

  const [filterData, setFilterData] = useState({
    status: "",
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

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const isViewShiftChangeRequestsPermitted= HasAccess("VIEW_SHIFT_CHANGE_REQUESTS")
 const Branches = useSelector((state) => state.common.branches);
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
      const { employeeShift: shift, scheduleShifts: schedules } =
        await fetchEmployeeShiftData(memberId);

      setEmployeeShift(shift);
      setScheduleShifts(schedules);
    } catch (error) {
      toast.error("Failed to fetch employee shift data");
      setEmployeeShift(null);
      setScheduleShifts({
        results: [],
        count: 0,
      });
    }
  };

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

  const fetchShiftChangeRequests = async () => {
    try {
      const response = await getShiftSchedule({
        filterData: {
          status: selectedStatus ? selectedStatus : undefined,
          is_change_request: "true,false",
          shift_requested: "Manager",
          employee_branch: selectedBranch ? selectedBranch : undefined,
        },
        ordering: ordering,
        options
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
  useEffect(() => {
    fetchShiftChangeRequests();
  }, [ordering, options, filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if(filterName === "status"){
      setSelectedStatus(filterValue);
    }
    if(filterName === "employee_branch"){
      setSelectedBranch(filterValue);
    }
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
          reload={fetchShiftChangeRequests}
        />
      </div>

      {isViewShiftChangeRequestsPermitted && (
        <Card className="mt-6">
          <CardHeader>
            <div>
              <CardTitle className="text-primary">
                Shift Change Requests
              </CardTitle>
              <CardDescription className="text-neutral-1100">
                View and manage shift change requests from Managers.
              </CardDescription>
            </div>
            <div className="flex justify-end">
              <FilterInput
                filters={[
                  
                  {
                    type: "select-one",
                    option: [
                      { label: "Pending", value: "Pending" },
                      { label: "Approved", value: "Approved" },
                      { label: "Rejected", value: "Rejected" },
                    ],
                    name: "status",
                    placeholder: "Status",
                    values: selectedStatus,
                  },
                  ...(isEditEmployeeShiftPermitted
                    ? [
                        {
                          type: "select-two",
                          option: Branches,
                          name: "employee_branch",
                          placeholder: "Filter by Branch",
                          values: selectedBranch,
                        },
                      ]
                    : []),
                ]}
                onChange={handleFilterChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CustomTable
              columns={EmployeeColumns(fetchShiftChangeRequests)}
              data={shiftChangeRequests?.results || []}
              pagination={true}
              dataTotalSize={shiftChangeRequests?.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Emplist;
