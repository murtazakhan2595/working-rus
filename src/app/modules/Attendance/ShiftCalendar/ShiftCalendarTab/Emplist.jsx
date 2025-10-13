import ViewShiftChangeRequests from "./ViewShiftChangeRequests";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { fetchEmployeeShiftData, } from "./shiftScheduleUtils";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import { PageLoader } from "components";
import { getEmployeeDropdownList } from "app/hooks/general";
import { Button } from "components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ShiftStatusOptions = [
  { value: "assigned", label: "Assigned" },
  { value: "not_assigned", label: "Not Assigned" },
];

const Emplist = () => {
  const Departments = useSelector((state) => state.common.departments);
  const userProfile = useSelector((state) => state.user.userProfile);
  // const isTeamViewCalendarPermitted = true;
  // const isViewOrganizationCalendarPermitted = true
  const isViewShiftChangeRequestsPermitted = HasAccess("VIEW_SHIFT_CHANGE_REQUESTS")
  const isViewOrganizationCalendarPermitted = HasAccess("VIEW_SHIFT_CALENDAR")
  const isTeamViewCalendarPermitted = HasAccess("VIEW_TEAM_SHIFT_CALENDAR")
  const [isLoading, setIsLoading] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState(null);
  const [TeamMembers, setTeamMembers] = useState("");
  const [scheduleShifts, setScheduleShifts] = useState({ results: [], count: 0, });
  const [filterData, setFilterData] = useState({});
  const [refreshRequests, setRefreshRequests] = useState(0);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(60);
  const [totalCount, setTotalCount] = useState(0);

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
        
        // Check if user has any permission to view calendars
        if (!userProfile.role.includes(1) && !isViewOrganizationCalendarPermitted && !isTeamViewCalendarPermitted) {
          setTeamMembers({ results: [], count: 0 });
          setIsLoading(false);
          return;
        }
        
        const filters = { 
          ...filterData, 
          ...(userProfile.role.includes(1) || isViewOrganizationCalendarPermitted 
              ? {} 
              : isTeamViewCalendarPermitted 
                ? { reporting_employee: userProfile.id }
                : {}
          ) 
        }
        const response = await getEmployeeDropdownList({
          filterData: filters,
          employee_status: "Active,Probation,Notice Period",
          options: { 
            page: currentPage, 
            sizePerPage: itemsPerPage
          },
        });
        console.log("filters", filters, response);
        if (response) {
          // Set total count for pagination
          setTotalCount(response.count);
          
          if (filterData.shift_status) {
            if (filterData.shift_status === 'assigned') {
              const assignedEmp = response.results.filter(obj => obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            } else if (filterData.shift_status === 'not_assigned') {
              const assignedEmp = response.results.filter(obj => !obj.default_shift);
              setTeamMembers({ results: assignedEmp, count: assignedEmp.length });
            }
          } else {
            setTeamMembers(response);
          }
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
  }, [filterData, userProfile, isTeamViewCalendarPermitted, isViewOrganizationCalendarPermitted, currentPage, itemsPerPage]);

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
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
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
                <p className="text-sm">{totalCount || 0}</p>
              </div>
              {/* Pagination Info */}
              {totalCount > 0 && (
                <div className="flex justify-between items-center text-xs text-slate-600 mt-2">
                  <span>
                    Showing {startItem}-{endItem} of {totalCount}
                  </span>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
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
              {(!TeamMembers?.results || TeamMembers.results?.length === 0) && (
                <div className="text-center py-4 text-slate-600">
                  {!userProfile.role.includes(1) && !isViewOrganizationCalendarPermitted && !isTeamViewCalendarPermitted
                    ? "You don't have permission to view shift calendars. Please contact your administrator."
                    : "No employees match the selected filters"
                  }
                </div>
              )}
            </CardContent>
          )}
          
          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
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
