import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { FilterInput } from "components/FormControl";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import { exportAttendanceShiftReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import DailyAttendanceReport from "./Sections/DailyAttendanceReport";
import MonthlyAttendanceReport from "./Sections/MonthlyAttendanceReport";
import YearlyAttendanceReport from "./Sections/YearlyAttendanceReport";
import AbsenteeismReport from "./Sections/AbsenteeismReport";
import LateArrivalReport from "./Sections/LateArrivalReport";
import { EarlyDepartureReport } from "./Sections/EarlyDepartureReport";
import { NoPunchReport } from "./Sections/NoPunchReport";
import { OvertimeReport } from "./Sections/OvertimeReport";
import { IdleUndertimeReport } from "./Sections/IdleUndertimeReport";
import { AttendanceVsLeaveReport } from "./Sections/AttendanceVsLeaveReport";
import { ShiftAllocationReport } from "./Sections/ShiftAllocationReport";
import { ShiftComplianceReport } from "./Sections/ShiftComplianceReport";
import { ShiftCoverageReport } from "./Sections/ShiftCoverageReport";
import { ShiftSwappingReport } from "./Sections/ShiftSwappingReport";
import { WeeklyShiftCalendarReport } from "./Sections/WeeklyShiftCalendarReport";
import { HolidaySpecialShiftReport } from "./Sections/HolidaySpecialShiftReport";
import { WeekendWorkReport } from "./Sections/WeekendWorkReport";

const AttendanceAndShiftReports = () => {
  // Permission checks
  const isAdminView = HasAccess("VIEW_ATTENDANCE_REPORTS") || true; // Default to true for now
  const isBranchView = HasAccess("VIEW_BRN_ATTENDANCE_REPORTS") || true;
  const isDepartmentView = HasAccess("VIEW_DPT_ATTENDANCE_REPORTS") || true;

  // Redux data
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const { branch_id: user_branch, department_name: user_department } =
    useSelector((state) => state.emp.user_details);

  // State management
  const [activeTab, setActiveTab] = useState("daily_reports");
  const [filterData, setFilterData] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration
  const reportTabs = [
    {
      value: "daily_reports",
      label: "Daily Reports",
      description: "Daily, monthly, and yearly attendance tracking",
      reports: [
        {
          value: "daily_attendance",
          label: "Daily Attendance",
          component: DailyAttendanceReport,
        },
        {
          value: "monthly_attendance",
          label: "Monthly Summary",
          component: MonthlyAttendanceReport,
        },
        {
          value: "yearly_attendance",
          label: "Yearly Report",
          component: YearlyAttendanceReport,
        },
      ],
    },
    {
      value: "attendance_issues",
      label: "Attendance Issues",
      description: "Late arrivals, absences, and attendance exceptions",
      reports: [
        {
          value: "absenteeism_report",
          label: "Absenteeism",
          component: AbsenteeismReport,
        },
        {
          value: "late_arrival_report",
          label: "Late Arrivals",
          component: LateArrivalReport,
        },
        {
          value: "early_departure_report",
          label: "Early Departures",
          component: EarlyDepartureReport,
        },
        {
          value: "no_punch_report",
          label: "Missing Punches",
          component: NoPunchReport,
        },
      ],
    },
    {
      value: "time_management",
      label: "Time Management",
      description: "Overtime, undertime, and leave analysis",
      reports: [
        {
          value: "overtime_report",
          label: "Overtime",
          component: OvertimeReport,
        },
        {
          value: "idle_undertime_report",
          label: "Idle/Undertime",
          component: IdleUndertimeReport,
        },
        {
          value: "attendance_vs_leave_report",
          label: "Attendance vs Leave",
          component: AttendanceVsLeaveReport,
        },
      ],
    },
    {
      value: "shift_management",
      label: "Shift Management",
      description: "Shift allocation, compliance, and coverage analysis",
      reports: [
        {
          value: "shift_allocation_report",
          label: "Shift Allocation",
          component: ShiftAllocationReport,
        },
        {
          value: "shift_compliance_report",
          label: "Shift Compliance",
          component: ShiftComplianceReport,
        },
        {
          value: "shift_coverage_report",
          label: "Shift Coverage",
          component: ShiftCoverageReport,
        },
        {
          value: "shift_swapping_report",
          label: "Shift Swapping",
          component: ShiftSwappingReport,
        },
        {
          value: "weekly_shift_calendar",
          label: "Weekly Calendar",
          component: WeeklyShiftCalendarReport,
        },
        {
          value: "holiday_special_shift_report",
          label: "Holiday/Special",
          component: HolidaySpecialShiftReport,
        },
        {
          value: "weekend_work_report",
          label: "Weekend Work",
          component: WeekendWorkReport,
        },
      ],
    },
  ];

  // State for nested tab navigation
  const [activeReport, setActiveReport] = useState("daily_attendance");

  // Set permitted view filter data based on permissions
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setPermittedViewFilterData(() => {
        if (isAdminView) return {};
        else if (isBranchView) return { branch_id: user_branch };
        else if (isDepartmentView) return { department_name: user_department };
        else return {};
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    isAdminView,
    isBranchView,
    isDepartmentView,
    user_branch,
    user_department,
  ]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (
        filterValue === "" ||
        filterValue === null ||
        filterValue === undefined ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterData({});
  }, []);

  // Export current report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const success = await exportAttendanceShiftReport(
        activeReport,
        combinedFilters
      );

      if (success) {
        toast.success("Report exported successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Get current tab and report info
  const currentTab = reportTabs.find((tab) => tab.value === activeTab);
  const currentReport = currentTab?.reports?.find(
    (report) => report.value === activeReport
  );

  // Set default report when tab changes
  useEffect(() => {
    const newTab = reportTabs.find((tab) => tab.value === activeTab);
    if (newTab?.reports?.length > 0) {
      setActiveReport(newTab.reports[0].value);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-plum-1100">
                Attendance & Shift Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive attendance and shift reporting system"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleClearFilters}
                variant="outline"
                disabled={Object.keys(filterData).length === 0}
              >
                Reset Filters
              </Button>
              <Button
                onClick={handleExportReport}
                disabled={isExporting}
                variant="default"
              >
                {isExporting ? "Exporting..." : "Export to Excel"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Global Filters */}
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by Employee Name",
                name: "employee_name",
              },
              {
                type: "select-one",
                option: Departments,
                name: "department_name",
                placeholder: "Department",
                values: filterData.department_name,
              },
              {
                type: "select-two",
                option: Branches,
                name: "branch_id",
                placeholder: "Branch",
                values: filterData.branch_id,
              },
              {
                type: "select-three",
                option: [
                  { value: "Present", label: "Present" },
                  { value: "Late", label: "Late" },
                  { value: "Absent", label: "Absent" },
                  { value: "On Leave", label: "On Leave" },
                  { value: "Remote", label: "Remote" },
                ],
                name: "status",
                placeholder: "Status",
                values: filterData.status,
              },
              {
                type: "select-four",
                option: [
                  { value: "Morning", label: "Morning" },
                  { value: "Evening", label: "Evening" },
                  { value: "Night", label: "Night" },
                  { value: "Rotational", label: "Rotational" },
                ],
                name: "shift_type",
                placeholder: "Shift Type",
                values: filterData.shift_type,
              },
              {
                type: "daterange",
                name: "date_range",
                placeholder: "Select Date Range",
                values: filterData.date_range,
              },
            ]}
            filterValues={filterData}
            onChange={handleFilterChange}
            className="justify-end"
          />
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="daily_reports"
      >
        {/* Main Tab Navigation */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              {reportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-plum-200 data-[state=active]:text-plum-1100 text-xs lg:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {reportTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardContent className="pt-6">
                {/* Sub-report Navigation */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-6">
                  {tab.reports?.map((report) => (
                    <Button
                      key={report.value}
                      variant={
                        activeReport === report.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveReport(report.value)}
                      className="text-xs"
                    >
                      {report.label}
                    </Button>
                  ))}
                </div>

                {/* Render Active Report Component */}
                {currentReport && (
                  <div className="mt-4">
                    <currentReport.component
                      filterData={filterData}
                      permittedViewFilterData={permittedViewFilterData}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AttendanceAndShiftReports;
