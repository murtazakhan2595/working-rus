import React from "react";
import Papa from "papaparse";
import moment from "moment";
import { ImportRecords } from "components";
import { useSelector } from "react-redux";
import { uploadHolidaysData } from "app/hooks/leaveTracker";
import { mapAttendanceData } from "app/utils/MappingObjects/mapAttendanceData";
import { getActiveShiftData } from "app/hooks/shiftManagement";

const ImportAttendance = ({ reloadData = () => {} }) => {
  const Employees = useSelector((state) => state.emp.employees_detail);
  const modifyUploadedFile = async (file) => {
    if (!file) {
      return null;
    }
    try {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const data = result.data;
          debugger;
          // ➕ Add new columns to each row
          const updatedData = data.map(async (row) => {
            debugger;
            const {
              DATE: date,
              "Employee ID": emp_id,
              "Check-in Time": checkin,
              "Check-out Time": checkout,
            } = row;
            const { id: employee_id } = Employees.find(
              (obj) => obj.serial_number == emp_id
            );
            const activeShift = await getActiveShiftData(
              employee_id,
              moment(date)
            );
            const { payable_hours, overtime_hours, total_hours, status } =
              mapAttendanceData({ checkin, checkout, date }, activeShift);
            return {
              Status: status,
              total_hours: total_hours,
              payable_hours: payable_hours,
              overtime_hours: overtime_hours,
              ...row,
            };
          });

          // Convert back to CSV
          const csv = Papa.unparse(updatedData);
          // Trigger file download
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          return blob;
        },
        error: (err) => {
          console.error("Parsing error:", err);
        },
      });
    } catch (error) {
      console.error("Error uploading holidays:", error);
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
