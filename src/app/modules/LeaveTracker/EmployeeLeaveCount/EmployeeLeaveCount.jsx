import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { getLeaveTypeListData, getLeaveListData } from "app/hooks/leaveTracker";
import { getLabelByValue } from "utils/getValuesFromTables";
import { LeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { exportRecordToExcel } from "utils/downloadUtils";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";

const EmployeeLeaveCount = ({ isTeamView = false }) => {
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Employees = GetDispatchStateList("employees", "emp") || [];
  const { id: user_id } = GetDispatchStateList("user_details", "emp") || {};
  const isViewLTPermitted = HasAccess("VIEW_ATT_UPDATE_LOGS");
  const isViewBLTPermitted = HasAccess("VIEW_BRN_ATT_UPDATES_LOGS");
  const isViewDLTermitted = HasAccess("VIEW_DPT_ATT_UPDATES_LOGS");
  const [filterData, setFilterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [Leaves, setLeaves] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    let isMounted = true;
    setFilterData(() => {
      if (isTeamView) return { managers: user_id };
      else return {};
    });
    return () => {
      isMounted = false;
    };
  }, [isTeamView]);

  const fetchLeaveTypeData = async (isMounted) => {
    try {
      setIsLoading(true);
      const LeavesTypes = await getLeaveTypeListData();
      if (LeavesTypes && isMounted) {
        setLeaveTypesData(LeavesTypes.results || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchLeaveTypeData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const Leaves = await getLeaveListData({
        filterData,
        options,
      });
      if (Leaves && isMounted) {
        setLeaves(Leaves);
      }
    } catch (error) {
      console.log(error);
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
  }, [filterData, options, ordering]);

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

  const exportAttendanceToExcel = async (event) => {
    event.preventDefault();
    const data = Leaves.results || [];
    if (!data || !Array.isArray(data)) return null;
    const dataToExport = await Promise.all(
      data?.map(async (row) => ({
        "Employee Id": row.employee_serial_number,
        "Employee Name": row.employee_name,
        "Employee Department": row["employee_department_name"],
        "Employee Designation": row["employee_designation_name"],
        "Employee Branch": await getLabelByValue(
          row["employee_branch_name"],
          Branches,
          "-"
        ),
        "Leave Type": row.leave_type_names,
        "Leave Duration": row.leave_duration_name,
        "Start Date": row.start_date,
        "End Date": row.end_date,
        "Total Days": row.total_days,
        "Full Paid Days": row.full_paid_days,
        "Half Paid Days": row.half_paid_days,
        Reason: row.reason,
      }))
    );
    exportRecordToExcel(
      dataToExport,
      "Leave",
      `Employee-Leaves-Record${filterData.date_range || ""}`
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Card>
        <CardHeader className="flex flex-row justify-between items-center gap-4">
          <div>
            <CardTitle className="text-primary">Leave Records</CardTitle>
            <CardDescription className="text-neutral-1100">
              {`Here you can view leaves of all employees.`}
            </CardDescription>
          </div>
          <Button onClick={exportAttendanceToExcel} variant="continue">
            Export
          </Button>
        </CardHeader>

        <CardContent>
          <FilterInput
            filters={[
              {
                type: "select",
                option: Employees,
                name: "employee",
                placeholder: "Employee",
              },
              {
                type: "select",
                option: Departments,
                name: "departmentt",
                placeholder: "Department",
              },
              {
                type: "select",
                option: Branches,
                name: "branch",
                placeholder: "Branch",
              },
              {
                type: "select",
                option: leaveTypesData || [],
                name: "leave_type",
                placeholder: "Leave Type",
              },
              {
                type: "date-range",
                name: "date_range",
                placeholder: "Leave Period",
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end mb-4"
          />
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={Leaves?.results || []}
              columns={LeaveAplicationColumns(false, fetchData)}
              pagination={true}
              dataTotalSize={Leaves?.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeLeaveCount;
