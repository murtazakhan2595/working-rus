// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/ExportPerformanceReports.jsx
import React, { useState } from "react";
import { Button } from "components/ui/button";
import { exportPerformanceReports } from "app/hooks/performanceEdge";
import ActionAlert from "components/ui/ActionAlert";

const ExportPerformanceReports = ({ filterData = {} }) => {
  const [disableExport, setDisableExport] = useState(false);
  const [openActionMessage, setOpenActionMessage] = useState(false);

  const exportReportsToExcel = async () => {
    setDisableExport(true);
    try {
      const payload = {
        format: "excel",
        ...filterData, // Spread filterData directly as query params
      };

      const response = await exportPerformanceReports(payload);

      if (response && response.data) {
        // Extract filename from Content-Disposition header or use default
        const contentDisposition = response.headers["content-disposition"];
        let filename = `performance_report_${
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

        // Create blob URL and trigger download
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

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("File downloaded successfully");
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

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          exportReportsToExcel();
        }}
        variant="continue"
        disabled={disableExport}
      >
        {disableExport ? "Exporting Data..." : "Export"}
      </Button>
      {openActionMessage && (
        <ActionAlert
          isOpen={openActionMessage}
          onClose={() => {
            setOpenActionMessage(false);
          }}
          title={"Export Performance Reports Failed."}
          description={
            "No performance data was found for the current filters or an error occurred during export."
          }
          messageType={"ERROR"}
        />
      )}
    </>
  );
};

export default ExportPerformanceReports;
