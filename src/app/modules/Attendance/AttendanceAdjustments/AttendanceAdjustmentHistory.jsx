import React, { useState, useEffect } from "react";
import { FilterInput } from "components/FormControl";
import { getAttendanceAdjustmentLogsList } from "app/hooks/attendance";
import { AttendanceAdjustmentLogsColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { CardDescription, CardTitle, CardContent } from "components/ui/card";
import { PageLoader, TableCustom } from "components";

import { GetEmployeeFilteredList, GetCommonFilteredList } from "utils/Lists";
import { GlobalStatusOptions } from "data/Data";
const AttendanceAdjustmentHistory = ({
  isTeamView = false,
  isDepartmentView = false,
  isBranchView = false,
  adminView = false,
}) => {
  const Employees = GetEmployeeFilteredList(
    isTeamView,
    adminView,
    isBranchView,
    isDepartmentView
  );
  const Department = GetCommonFilteredList("departments");
  const Branches = GetCommonFilteredList("branches");
  const [TimeAdjustmentLogsList, setTimeAdjustmentLogsList] = useState({
    results: [],
    count: 0,
  });
  const [isloading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedStatus, setSelectedStatus] = useState("");

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

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const response = await getAttendanceAdjustmentLogsList({
        filterData,
        options,
        ordering,
      });

      if (isMounted && response) {
        setTimeAdjustmentLogsList(response);
      }
    } catch (error) {
      console.error("Error fetching Approval Hierarchy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-4 px-6">
      <CardTitle className="text-primary pt-6">
        Attendance Adjustments History & Logs
      </CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can view attendance adjustments history of every request.
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "select",
            placeholder: "Employee",
            name: "employee",
            options: Employees,
          },
          ...(adminView || isBranchView
            ? [
                {
                  type: "select",
                  placeholder: "Department",
                  name: "department_name",
                  options: Department,
                },
              ]
            : []),
          ...(adminView || isDepartmentView
            ? [
                {
                  type: "select",
                  placeholder: "Branch",
                  name: "branch_id",
                  options: Branches,
                },
              ]
            : []),
          {
            type: "date-range",
            placeholder: "Attendance Date",
            name: "attendance_date",
            // className:'min-w-[310px]'
          },
          {
            type: "select",
            placeholder: "Status",
            name: "statuses",
            options: GlobalStatusOptions(false),
            values: selectedStatus,
          },
        ]}
        onChange={handleFilterChange}
        className="justify-end"
      />
      <CardContent className="px-0">
        {isloading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={AttendanceAdjustmentLogsColumns}
            data={TimeAdjustmentLogsList.results || []}
            pagination={true}
            dataTotalSize={TimeAdjustmentLogsList?.count || 0}
            className="TimeAdjustmentLogsList-table"
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </div>
  );
};

export default AttendanceAdjustmentHistory;
