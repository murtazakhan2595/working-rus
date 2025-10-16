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
import {
  exportAttendanceShiftReport,
  exportTimeAdjustmentReport,
  exportRemainingReports,
} from "app/hooks/reports";
import { toast } from "react-toastify";

// Import all existing report components (1️⃣-3️⃣)
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

// Import Time Adjustment components (3️⃣)
import TimeAdjustmentRequestReport from "./Sections/TimeAdjustmentReports/TimeAdjustmentRequestReport";
import TimeAdjustmentStatusReport from "./Sections/TimeAdjustmentReports/TimeAdjustmentStatusReport";
import ReasonAnalysisReport from "./Sections/TimeAdjustmentReports/ReasonAnalysisReport";
import ManagerApprovalReport from "./Sections/TimeAdjustmentReports/ManagerApprovalReport";
import RepeatAdjustmentReport from "./Sections/TimeAdjustmentReports/RepeatAdjustmentReport";

// Import NEW Attendance Updates & Audit components (4️⃣)
import UpdatedAttendanceReport from "./Sections/AttendanceUpdatesAuditReports/UpdatedAttendanceReport";
import HRAdminCorrectionReport from "./Sections/AttendanceUpdatesAuditReports/HRAdminCorrectionReport";
import AuditTrailReport from "./Sections/AttendanceUpdatesAuditReports/AuditTrailReport";
import ComplianceBreachReport from "./Sections/AttendanceUpdatesAuditReports/ComplianceBreachReport";
import AttendanceUpdateHistoryReport from "./Sections/AttendanceUpdatesAuditReports/AttendanceUpdateHistoryReport";

// Import NEW Exception & Special Condition components (5️⃣)
import MissingPunchReport from "./Sections/ExceptionSpecialConditionReports/MissingPunchReport";
import MultiplePunchReport from "./Sections/ExceptionSpecialConditionReports/MultiplePunchReport";
import HalfDayReport from "./Sections/ExceptionSpecialConditionReports/HalfDayReport";
import GracePeriodUsageReport from "./Sections/ExceptionSpecialConditionReports/GracePeriodUsageReport";
import FrequentBreaksReport from "./Sections/ExceptionSpecialConditionReports/FrequentBreaksReport";
import RemoteWorkReport from "./Sections/ExceptionSpecialConditionReports/RemoteWorkReport";
import BusinessTripReport from "./Sections/ExceptionSpecialConditionReports/BusinessTripReport";

// Import NEW Department & Managerial components (6️⃣)
import DepartmentAttendanceReport from "./Sections/DepartmentManagerialReports/DepartmentAttendanceReport";
import TeamAttendanceReport from "./Sections/DepartmentManagerialReports/TeamAttendanceReport";
import ManagerAttendanceReport from "./Sections/DepartmentManagerialReports/ManagerAttendanceReport";
import BranchAttendanceReport from "./Sections/DepartmentManagerialReports/BranchAttendanceReport";
import ComparativeAttendanceReport from "./Sections/DepartmentManagerialReports/ComparativeAttendanceReport";

// Import NEW Analytics, Trends & Compliance components (7️⃣)
import AttendanceTrendReport from "./Sections/AnalyticsTrendsComplianceReports/AttendanceTrendReport";
import ShiftUtilizationReport from "./Sections/AnalyticsTrendsComplianceReports/ShiftUtilizationReport";
import OvertimeTrendReport from "./Sections/AnalyticsTrendsComplianceReports/OvertimeTrendReport";
import AttritionRiskReport from "./Sections/AnalyticsTrendsComplianceReports/AttritionRiskReport";
import LaborLawComplianceReport from "./Sections/AnalyticsTrendsComplianceReports/LaborLawComplianceReport";
import PayrollIntegrationReport from "./Sections/AnalyticsTrendsComplianceReports/PayrollIntegrationReport";
import AlertsThresholdReport from "./Sections/AnalyticsTrendsComplianceReports/AlertsThresholdReport";

const AttendanceAndShiftReports = () => {
  // Permission checks
  const isAdminView = HasAccess("VIEW_ATTENDANCE_REPORTS") || true;
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

  // Complete tab configuration with ALL REPORT CATEGORIES (1️⃣-7️⃣)
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
    {
      value: "time_adjustment",
      label: "Time Adjustments",
      description: "Manual corrections, system errors, and employee requests",
      reports: [
        {
          value: "time_adjustment_request_report",
          label: "Adjustment Requests",
          component: TimeAdjustmentRequestReport,
        },
        {
          value: "adjustment_status_report",
          label: "Status Overview",
          component: TimeAdjustmentStatusReport,
        },
        {
          value: "reason_analysis_report",
          label: "Reason Analysis",
          component: ReasonAnalysisReport,
        },
        {
          value: "manager_approval_report",
          label: "Manager Approvals",
          component: ManagerApprovalReport,
        },
        {
          value: "repeat_adjustment_report",
          label: "Repeat Requests",
          component: RepeatAdjustmentReport,
        },
      ],
    },
    // NEW: 4️⃣ Attendance Updates & Audit Reports
    {
      value: "attendance_updates_audit",
      label: "Updates & Audit",
      description: "Tracks modifications made by HR/admin for transparency",
      reports: [
        {
          value: "updated_attendance_report",
          label: "Updated Attendance",
          component: UpdatedAttendanceReport,
        },
        {
          value: "hr_admin_correction_report",
          label: "HR/Admin Corrections",
          component: HRAdminCorrectionReport,
        },
        {
          value: "audit_trail_report",
          label: "Audit Trail",
          component: AuditTrailReport,
        },
        {
          value: "compliance_breach_report",
          label: "Compliance Breaches",
          component: ComplianceBreachReport,
        },
        {
          value: "attendance_update_history",
          label: "Update History",
          component: AttendanceUpdateHistoryReport,
        },
      ],
    },
    // NEW: 5️⃣ Exception & Special Condition Reports
    {
      value: "exception_special_conditions",
      label: "Exceptions & Special",
      description: "Reports for unusual attendance/shift cases",
      reports: [
        {
          value: "missing_punch_report",
          label: "Missing Punches",
          component: MissingPunchReport,
        },
        {
          value: "multiple_punch_report",
          label: "Multiple Punches",
          component: MultiplePunchReport,
        },
        {
          value: "half_day_report",
          label: "Half Days",
          component: HalfDayReport,
        },
        {
          value: "grace_period_usage_report",
          label: "Grace Period Usage",
          component: GracePeriodUsageReport,
        },
        {
          value: "frequent_breaks_report",
          label: "Frequent Breaks",
          component: FrequentBreaksReport,
        },
        {
          value: "remote_work_report",
          label: "Remote Work",
          component: RemoteWorkReport,
        },
        {
          value: "business_trip_report",
          label: "Business Trips",
          component: BusinessTripReport,
        },
      ],
    },
    // NEW: 6️⃣ Department & Managerial Reports
    {
      value: "department_managerial",
      label: "Department & Managerial",
      description: "Useful for team-level analysis",
      reports: [
        {
          value: "department_attendance_report",
          label: "Department Attendance",
          component: DepartmentAttendanceReport,
        },
        {
          value: "team_attendance_report",
          label: "Team Attendance",
          component: TeamAttendanceReport,
        },
        {
          value: "manager_attendance_report",
          label: "Manager-wise Attendance",
          component: ManagerAttendanceReport,
        },
        {
          value: "branch_attendance_report",
          label: "Branch/Location Attendance",
          component: BranchAttendanceReport,
        },
        {
          value: "comparative_attendance_report",
          label: "Comparative Report",
          component: ComparativeAttendanceReport,
        },
      ],
    },
    // NEW: 7️⃣ Analytics, Trends & Compliance Reports
    {
      value: "analytics_trends_compliance",
      label: "Analytics & Compliance",
      description: "For HR & compliance dashboards",
      reports: [
        {
          value: "attendance_trend_report",
          label: "Attendance Trends",
          component: AttendanceTrendReport,
        },
        {
          value: "shift_utilization_report",
          label: "Shift Utilization",
          component: ShiftUtilizationReport,
        },
        {
          value: "overtime_trend_report",
          label: "Overtime Trends",
          component: OvertimeTrendReport,
        },
        {
          value: "attrition_risk_report",
          label: "Attrition Risk",
          component: AttritionRiskReport,
        },
        {
          value: "labor_law_compliance_report",
          label: "UAE Labor Law Compliance",
          component: LaborLawComplianceReport,
        },
        {
          value: "payroll_integration_report",
          label: "Payroll Integration",
          component: PayrollIntegrationReport,
        },
        {
          value: "alerts_threshold_report",
          label: "Alerts & Thresholds",
          component: AlertsThresholdReport,
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

      // Handle time adjustment reports
      const timeAdjustmentReports = [
        "time_adjustment_request_report",
        "adjustment_status_report",
        "reason_analysis_report",
        "manager_approval_report",
        "repeat_adjustment_report",
      ];

      // Handle new remaining reports (4️⃣-7️⃣)
      const remainingReports = [
        // 4️⃣ Attendance Updates & Audit Reports
        "updated_attendance_report",
        "hr_admin_correction_report",
        "audit_trail_report",
        "compliance_breach_report",
        "attendance_update_history",
        // 5️⃣ Exception & Special Condition Reports
        "missing_punch_report",
        "multiple_punch_report",
        "half_day_report",
        "grace_period_usage_report",
        "frequent_breaks_report",
        "remote_work_report",
        "business_trip_report",
        // 6️⃣ Department & Managerial Reports
        "department_attendance_report",
        "team_attendance_report",
        "manager_attendance_report",
        "branch_attendance_report",
        "comparative_attendance_report",
        // 7️⃣ Analytics, Trends & Compliance Reports
        "attendance_trend_report",
        "shift_utilization_report",
        "overtime_trend_report",
        "attrition_risk_report",
        "labor_law_compliance_report",
        "payroll_integration_report",
        "alerts_threshold_report",
      ];

      let success = false;

      if (timeAdjustmentReports.includes(activeReport)) {
        success = await exportTimeAdjustmentReport(
          activeReport,
          combinedFilters
        );
      } else if (remainingReports.includes(activeReport)) {
        success = await exportRemainingReports(activeReport, combinedFilters);
      } else {
        // Handle original reports (1️⃣-2️⃣ + existing reports)
        success = await exportAttendanceShiftReport(
          activeReport,
          combinedFilters
        );
      }

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
                Comprehensive Attendance & Shift Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Complete attendance and shift reporting system with 7 major categories"}
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
        {/* Main Tab Navigation - Updated to show 8 tabs */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-4 gap-1">
              {reportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-plum-200 data-[state=active]:text-plum-1100 text-xs lg:text-sm px-2 py-1"
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
