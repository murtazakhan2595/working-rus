import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import moment from "moment";
import { getAttendance } from "app/hooks/attendance";
import { GetDateRange } from "utils/renderValues";
import { exportRecordToExcel } from "utils/downloadUtils";
import ActionAlert from "components/ui/ActionAlert";
import { HasAccess } from "utils/PermissionUtils";
import { renderDate, formatDuration } from "utils/renderValues";

const ExportAttendance = ({ activeTab = "day", filterData = {} }) => {
  const isExportAttendancePermitted = HasAccess("EXPORT_ATTENDANCE");
  const [disableExport, setDisableExport] = useState(false);
  const [openActionMessage, setOpenActionMessage] = useState(false);
  const exportAttendanceToExcel = async () => {
    setDisableExport(true);
    try {
      const dateFilter =
        activeTab.toLowerCase() === "day"
          ? { date: moment().format("YYYY-MM-DD") }
          : { date_range: GetDateRange(activeTab) };
      const response = await getAttendance({
        filterData: { ...filterData, ...dateFilter },
        ordering: "date",
      });
      if (response) {
        const ResponseData = response.results;
        if (
          !ResponseData ||
          !Array.isArray(ResponseData) ||
          ResponseData.length === 0
        ) {
          setOpenActionMessage(true);
        } else {
          const dataToExport = await Promise.all(
            ResponseData?.map(async (row) => {
              return {
                ID: row['employee_serial_number'],
                Name: row.employee_name,
                Email: row["employee_email"],
                Department: row["employee_department"],
                Date: renderDate(row.date),
                "Total Shift Hours": formatDuration(row.total_hours),
                "Check-In": renderDate(row.checkin, "Not Check-in", "time"),
                "Check-Out": renderDate(
                  row.checkout,
                  "Check-out missing",
                  "time"
                ),
                "Payable Hours": row.payable_hours
                  ? formatDuration(row.payable_hours)
                  : "--",
                "Overtime Hours": row.overtime_hours
                  ? formatDuration(row.overtime_hours)
                  : "--",

                "Break Hours": formatDuration(row.break_duration),
                "Remaining Hours": row.checkout
                  ? formatDuration(
                      Math.max(
                        0,
                        (row.total_hours ?? 0) - (row.payable_hours ?? 0)
                      )
                    )
                  : "--",

                Status: row.status,
              };
            })
          );
          exportRecordToExcel(
            dataToExport,
            "Attendance",
            `Attendance_${dateFilter.date || dateFilter.date_range}`
          );
        }
        // setAttendanceData(attendanceData.results);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisableExport(false);
    }
  };
  if (!isExportAttendancePermitted) return null;

  return (
    <>
      {" "}
      <Button
        onClick={(e) => {
          e.preventDefault();
          exportAttendanceToExcel();
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
          title={"Export Attendance Failed."}
          description={
            "No attendance data was found in the given time range or filter."
          }
          messageType={"ERROR"}
        />
      )}
    </>
  );
};

export default ExportAttendance;
