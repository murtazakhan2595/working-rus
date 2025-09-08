// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/ExportPerformanceReports.jsx
import React, { useState } from "react";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/@/components/ui/dropdown-menu";
import { exportPerformanceReports } from "app/hooks/performanceEdge";
import ActionAlert from "components/ui/ActionAlert";
import { ChevronDown, FileText, Table, Download } from "lucide-react";

const ExportPerformanceReports = ({
  filterData = {},
  reportType = "overview",
  dashboardData = {},
}) => {
  const [disableExport, setDisableExport] = useState(false);
  const [openActionMessage, setOpenActionMessage] = useState(false);

  const exportToExcel = async () => {
    setDisableExport(true);
    try {
      const payload = {
        format: "excel",
        report_type: reportType,
        ...filterData,
      };

      const response = await exportPerformanceReports(payload);

      if (response && response.data) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = `performance_report_${reportType}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        const blob = new Blob([response.data], {
          type:
            response.headers["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setOpenActionMessage(true);
      }
    } catch (error) {
      console.error("Export error:", error);
      setOpenActionMessage(true);
    } finally {
      setDisableExport(false);
    }
  };

  const exportToCSV = () => {
    setDisableExport(true);
    try {
      let csvData = [];
      let headers = [];
      let filename = `performance_report_${reportType}_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      switch (reportType) {
        case "distribution":
          headers = ["Rating", "Count", "Percentage"];
          const distribution = dashboardData.rating_distribution || {};
          const total = Object.values(distribution).reduce(
            (sum, count) => sum + count,
            0
          );
          csvData = Object.entries(distribution).map(([rating, count]) => [
            `Rating ${rating}`,
            count,
            total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0%",
          ]);
          break;

        case "department_comparison":
          headers = ["Department", "Average Rating", "Evaluation Count"];
          csvData =
            dashboardData.average_ratings?.by_department?.map((dept) => [
              dept.dept_name,
              Number(dept.average).toFixed(1),
              dept.count,
            ]) || [];
          break;

        case "high_performers":
          headers = ["Employee Name", "Department", "Final Score"];
          csvData =
            dashboardData.top_performers?.map((performer) => [
              performer.name,
              performer.department,
              performer.final_score,
            ]) || [];
          break;

        case "low_performers":
          headers = ["Employee Name", "Department", "Final Score"];
          csvData =
            dashboardData.low_performers?.map((performer) => [
              performer.name,
              performer.department,
              performer.final_score,
            ]) || [];
          break;

        case "completion_rates":
          headers = [
            "Department",
            "Completed",
            "Pending",
            "Completion Percentage",
          ];
          csvData =
            dashboardData.completion_rates?.by_department?.map((dept) => [
              dept.dept_name,
              dept.completed,
              dept.pending,
              `${dept.percentage.toFixed(1)}%`,
            ]) || [];
          break;

        case "trends":
          headers = ["Month", "Average Rating"];
          csvData =
            dashboardData.performance_trend?.monthly_averages?.map((trend) => [
              new Date(trend.month).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              }),
              Number(trend.average_rating).toFixed(1),
            ]) || [];
          break;

        default:
          // Overview - export summary stats
          headers = ["Metric", "Value"];
          csvData = [
            ["Total Evaluations", dashboardData.total_evaluations?.count || 0],
            [
              "Completed Evaluations",
              dashboardData.completion_rates?.overall?.completed || 0,
            ],
            [
              "Pending Evaluations",
              dashboardData.completion_rates?.overall?.pending || 0,
            ],
            [
              "Overall Average Rating",
              dashboardData.average_ratings?.overall_average
                ? Number(dashboardData.average_ratings.overall_average).toFixed(
                    1
                  )
                : "0",
            ],
            [
              "Total Calibrations",
              dashboardData.calibration_summary?.total_calibrations || 0,
            ],
            [
              "Average Calibration Adjustment",
              dashboardData.calibration_summary?.avg_adjustment || 0,
            ],
          ];
      }

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV Export error:", error);
      setOpenActionMessage(true);
    } finally {
      setDisableExport(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={disableExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            {disableExport ? "Exporting..." : "Export"}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={exportToExcel}
            className="flex items-center gap-2"
          >
            <Table size={16} />
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Export to CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openActionMessage && (
        <ActionAlert
          isOpen={openActionMessage}
          onClose={() => setOpenActionMessage(false)}
          title="Export Failed"
          description="No performance data was found for the current filters or an error occurred during export."
          messageType="ERROR"
        />
      )}
    </>
  );
};

export default ExportPerformanceReports;
