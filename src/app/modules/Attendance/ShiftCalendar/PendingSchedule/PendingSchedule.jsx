// src/app/modules/Attendance/ShiftCalendar/Section/PendingSchedule.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import CustomTable from "components/CustomTable";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import moment from "moment";
import { EmployeeOverview, EmployeeID } from "components";
import { pendingScheduleColumns } from "./PendingScheduleColumn";

const PendingSchedule = () => {
  const [pendingSchedules, setPendingSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedShiftType, setSelectedShiftType] = useState("");
  const [ordering, setOrdering] = useState("-id");

  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const userProfile = useSelector((state) => state.user.userProfile);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Fetch pending schedules from API
  const fetchPendingSchedules = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getShiftSchedule({
          status: "Pending",
          ...options,
          filterData,
          ordering,
        });

        if (response && response.results) {
          // Transform the API response to match our UI needs
          const transformedSchedules = response.results.map((schedule) => ({
            id: schedule.id,
            employee_id: schedule.employee,
            employee_name: `Employee ${schedule.employee}`, // You might want to fetch employee names separately
            shift_id: schedule.shift,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            is_split_shift: schedule.is_split_shift,
            split_start_time: schedule.split_start_time,
            split_end_time: schedule.split_end_time,
            is_off_day: schedule.is_off_day,
            status: schedule.status,
            assigned_by: schedule.assigned_by,
            created_at: schedule.created_at,
            // Add branch info if available
            branch_name: "Branch Name", // This should come from employee data
            submitted_by: `Manager ${schedule.assigned_by}`,
            submitted_date: moment(schedule.created_at).format("YYYY-MM-DD"),
          }));

          setPendingSchedules(transformedSchedules);
          setTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching pending schedules:", error);
      toast.error("Failed to load pending schedules");
      // Fallback to empty array
      setPendingSchedules([]);
      setTotalCount(0);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    if (filterName === "branch_name") {
      setSelectedBranch(filterValue);
    } else if (filterName === "shift_type") {
      setSelectedShiftType(filterValue);
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

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (isLoading) return;
    fetchPendingSchedules(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  // Get unique branches for filter (you might want to fetch this from API)
  const uniqueBranches = [
    ...new Set(pendingSchedules.map((s) => s.branch_name)),
  ];
  const branchOptions = uniqueBranches.map((branch) => ({
    value: branch,
    label: branch,
  }));

  // Shift type options for filter
  const shiftTypeOptions = [
    { value: "regular", label: "Regular Shift" },
    { value: "split", label: "Split Shift" },
    { value: "off", label: "OFF Day" },
  ];

  const scheduleFilters = [
    {
      type: "search",
      placeholder: "Employee Name or ID",
      name: "employee_search",
    },
    {
      type: "select-one",
      option: branchOptions,
      name: "branch_name",
      placeholder: "Branch",
      values: selectedBranch,
    },
    {
      type: "select-two",
      option: shiftTypeOptions,
      name: "shift_type",
      placeholder: "Shift Type",
      values: selectedShiftType,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Pending Shift Schedules for Approval
          </CardTitle>
          <CardDescription className="text-neutral-1100">
            Review and approve shift schedules submitted by Branch Managers.
            Total {totalCount} pending schedule(s) for review.
          </CardDescription>
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 lg:mt-0 md:mt-0 xl:mt-0 justify-end flex"
          >
            <FilterInput
              filters={scheduleFilters}
              onChange={handleFilterChange}
            />
          </div>
        </CardHeader>

        <CardContent>
          <CustomTable
            columns={pendingScheduleColumns(fetchPendingSchedules)}
            data={isLoading ? [] : pendingSchedules}
            pagination={true}
            dataTotalSize={totalCount}
            tableOptions={tableOptions}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingSchedule;
