import React from "react";
import Papa from "papaparse";
import moment from "moment";
import { ImportRecords } from "components";
import { useSelector } from "react-redux";
import { uploadHolidaysData } from "app/hooks/leaveTracker";
import { mapAttendanceData } from "app/utils/MappingObjects/mapAttendanceData";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { renderTime } from "utils/DateTimeUtils";

const ImportAttendance = ({ reloadData = () => {} }) => {
  const Employees = useSelector((state) => state.emp.employees_detail);

  // Helper to promisify Papa.parse
  const parseCSV = (file) =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      });
    });

  const modifyUploadedFile = async (file) => {
    if (!file) return null;

    try {
      // Parse CSV file into JSON
      const parsedData = await parseCSV(file);

      const updatedData = await Promise.all(
        parsedData.map(async (row) => {
          const {
            Date: date,
            "Employee ID": emp_id,
            "Check-in Time": checkin,
            "Check-out Time": checkout,
          } = row;

          debugger;

          const employee = Employees.find((obj) => obj.serial_number == emp_id);

          if (!employee) {
            return row;
          }
          const formattedDate = moment(date).format("YYYY-MM-DD");
          const formattedCheckin = renderTime(checkin, formattedDate);
          const formattedCheckout = renderTime(checkout, formattedDate);
          const activeShift = await getActiveShiftData(
            employee.id,
            formattedDate
          );
          debugger;
          const {
            total_hours = "0",
            payable_hours = "0",
            overtime_hours = "0",
            status = "Present",
          } = mapAttendanceData(
            {
              checkin: formattedCheckin,
              checkout: formattedCheckout,
              date: formattedDate,
            },
            activeShift
          ) || {};

          return {
            ...row,
            Status: status,
            total_hours,
            payable_hours,
            overtime_hours,
          };
        })
      );

      // Convert updated data back to CSV
      const csv = Papa.unparse(updatedData);

      // Create downloadable blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      return blob;
    } catch (error) {
      console.error("Error modifying uploaded file:", error);
      return null;
    }
  };

  return (
    <ImportRecords
      title={"Import Attendance"}
      description={
        "Upload a file to bulk import attendance data against employee Id. Make sure your data follows the required format."
      }
      downloadTemplateEndpoint={"/attendance/bulk-upload"}
      uploadEndpoint={"/attendance/bulk-uload"}
      module={"Attendance"}
      formatInformation={[
        { "Employee ID": ["Employee unique id"], required: true },
        { Date: ["Attendance Date"], required: true },
        { "Check-in Time": ["Employee check-in time"], required: true },
        { "Check-out Time": ["Employee check-out time"], required: true },
        { Remarks: ["Any addistional attendance details"], required: false },
        {
          Status: ["Attendance status(Present, Absent, Late)"],
          required: false,
        },
      ]}
      uploadRecord={uploadHolidaysData}
      modifyUploadedFile={modifyUploadedFile}
    />
  );
};

export default ImportAttendance;
