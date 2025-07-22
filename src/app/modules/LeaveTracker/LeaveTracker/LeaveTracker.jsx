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
import { getLeaveStatsData, getLeaveListData } from "app/hooks/leaveTracker";
import { LeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";
import { exportRecordToExcel } from "utils/downloadUtils";
import { GlobalStatusOptions } from "data/Data";
import { getLeaveTypeListData } from "app/hooks/leaveTracker";
import { Button } from "components/ui/button";
import Stats from "components/ui/Stats";
import {
  CircleCheckBig,
  CircleX,
  FolderInput,
  FolderX,
  Loader,
} from "lucide-react";

const LeaveTracker = ({ isTeamView = false, activeView = "Requests" }) => {
  const isAdminView = HasAccess("VIEW_LEAVE_REQUEST");
  const isBranchView = HasAccess("VIEW_BRN_LEAVE_REQUEST");
  const isDepartmentView = HasAccess("VIEW_DPT_LEAVE_REQUEST");
  const Employees = GetEmployeeFilteredList(
    isTeamView,
    isAdminView,
    isBranchView,
    isDepartmentView
  );
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const {
    id: user_id,
    branch_id: user_branch,
    department_name: user_department,
  } = GetDispatchStateList("user_details", "emp") || {};

  const [activeTab, setActiveTab] = useState(activeView);
  const [filterData, setFilterData] = useState({ status: "pending" });
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [LeaveStats, setLeaveStats] = useState({});
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [Leaves, setLeaves] = useState();
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

  const TimeAdjustmentOuterTab = useMemo(() => {
    return ["Requests", "Records"];
  }, []);

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

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isTeamView) return { reporting_employees: [user_id] };
        else if (isAdminView) return {};
        else if (isBranchView) return { branch: user_branch };
        else if (isDepartmentView) return { department: user_department };
      });
    return () => {
      isMounted = false;
    };
  }, [isTeamView, isAdminView, isBranchView, isDepartmentView]);

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const Leaves = await getLeaveListData({
        filterData: { ...filterData, ...permittedViewFilterData },
        options,
        ordering,
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
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options, ordering, permittedViewFilterData]);

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


  useEffect(() => {
    const fetchLeaveStatData = async (isMounted) => {
      try {
        setIsLoading(true);
        const Stats = await getLeaveStatsData({
          filterData: permittedViewFilterData,
        });
        if (Stats && isMounted) {
          setLeaveStats(Stats || {});
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchLeaveStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [permittedViewFilterData]);
  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      // Handle other filters normally
      if (filterValue === "" || filterValue === null) {
        if (filterName === "status") {
          if (activeTab === "Requests") {
            updatedFilters[filterName] = "pending";
          } else if (activeTab === "Records") {
            updatedFilters[filterName] =
              "approved,rejected,cancelled_by_employee";
          }
        } else delete updatedFilters[filterName];
      } else {
        if (filterName === "status")
          updatedFilters[filterName] = filterValue.toLowerCase();
        else updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  const handleTabChange = (tab) => {
    if (tab === "Requests") {
      setFilterData((prev) => ({
        ...prev,
        status: "pending",
      }));
    } else if (tab === "Records") {
      setFilterData((prev) => ({
        ...prev,
        status: "approved,rejected,cancelled_by_employee",
      }));
    }
  };
  const exportAttendanceToExcel = async (event) => {
    event.preventDefault();
    try {
      const response = await getLeaveListData({
        filterData: { ...filterData },
        ordering: "-id",
      });
      if (response) {
        const ResponseData = response.results;
        if (
          !ResponseData ||
          !Array.isArray(ResponseData) ||
          ResponseData.length === 0
        ) {
          // setOpenActionMessage(true);
        } else {
          const dataToExport = await Promise.all(
            ResponseData?.map(async (row) => {
              return {
                "Employee Id": row.employee_serial_number,
                "Employee Name": row.employee_name,
                "Employee Department": row["employee_department_name"],
                "Employee Designation": row["employee_designation"],
                "Employee Branch": row["employee_branch_name"],
                "Leave Type": row.leave_type_name,
                "Leave Duration": row.leave_duration_name,
                "Start Date": row.start_date,
                "End Date": row.end_date,
                "Total Days": row.total_days,
                "Full Paid Days": row.full_paid_days,
                "Half Paid Days": row.half_paid_days,
                Reason: row.reason,
                Status: row.status,
              };
            })
          );
          console.log(dataToExport);
          exportRecordToExcel(
            dataToExport,
            "Leave",
            `Employee-Leaves-Record${filterData.date_range || ""}`
          );
        }
        // setAttendanceData(attendanceData.results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Stats
        stats={[
          { label: "Total", value: LeaveStats.Total, icon: FolderInput },
          {
            label: "Pending",
            value: LeaveStats.Pending,
            icon: Loader,
          },
          {
            label: "Accepted",
            value: LeaveStats.Approved,
            icon: CircleCheckBig,
          },
          {
            label: "Rejected",
            value: LeaveStats.Rejected,
            icon: CircleX,
          },
          {
            label: "Cancelled",
            value: LeaveStats.Cancelled,
            icon: FolderX,
          },
        ]}
      />

      <Tabs
        defaultValue="Requests"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
          handleTabChange(tab);
        }}
        value={activeTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {TimeAdjustmentOuterTab.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-fit data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center gap-4">
            <div>
              <CardTitle className="text-primary">Leave {activeTab}</CardTitle>
              <CardDescription className="text-neutral-1100">
                {`Here you can ${activeTab === "Requests" ? "manage and" : ""
                  } view leave ${activeTab.toLowerCase()}.`}
              </CardDescription>
            </div>
            {activeTab === "Records" && (
              <Button onClick={exportAttendanceToExcel} variant="continue">
                Export
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <FilterInput
              filters={[
                {
                  type: "select",
                  options: Employees,
                  name: "employee",
                  placeholder: "Employee",
                },
                ...(isAdminView || isBranchView
                  ? [
                    {
                      type: "select",
                      options: Departments,
                      name: "department",
                      placeholder: "Department",
                    },
                  ]
                  : []),
                ...(isAdminView || !isBranchView
                  ? [
                    {
                      type: "select",
                      options: Branches,
                      name: "branch",
                      placeholder: "Branch",
                    },
                  ]
                  : []),
                {
                  type: "select",
                  options: leaveTypesData || [],
                  name: "leave_type",
                  placeholder: "Leave Type",
                },
                {
                  type: "date-range",
                  name: "date_range",
                  placeholder: "Leave Period",
                },
                ...(activeTab === "Records"
                  ? [
                    {
                      type: "select",
                      options: [
                        ...GlobalStatusOptions(false),
                        {
                          label: "Cancelled",
                          value: "cancelled_by_employee",
                        },
                      ],
                      name: "status",
                      placeholder: "Status",
                    },
                  ]
                  : []),
              ]}
              onChange={handleFilterChange}
              className="justify-end mb-4"
            />
            {isLoading ? (
              <PageLoader />
            ) : (
              <TableCustom
                data={Leaves?.results || []}
                columns={LeaveAplicationColumns(
                  activeTab === "Requests",
                  fetchData
                )}
                pagination={true}
                dataTotalSize={Leaves?.count || 0}
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default LeaveTracker;
