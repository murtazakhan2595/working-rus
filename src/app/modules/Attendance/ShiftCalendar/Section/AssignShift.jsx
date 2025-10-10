import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import { getShift } from "app/hooks/attendance";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import { SheetUI } from "components";
import { SelectInputComponent } from "components/FormControl";
import AddCustomShift from "app/modules/Employees/Screens/EmployeeForm/AddCustomShift";
import { Button } from "components/ui/button";

const AssignShift2 = ({ employees }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [customShiftData, setCustomShiftData] = useState(null);
  const userProfile = useSelector((state) => state.user.userProfile);

  const empOptions = employees?.map((emp) => ({
    value: emp.id,
    label: emp.label,
  }));

  const getShiftList = async () => {
    const shiftData = await getShift();
    if (shiftData) {
      const shiftList = shiftData.results.map((shift) => ({
        value: shift.id,
        label: `${shift.name} (${moment(shift.starttime).format(
          "h:mm a"
        )} - ${moment(shift.endtime).format("h:mm a")})`,
      }));
      setShiftList(shiftList);
    }
  };

  useEffect(() => {
    getShiftList();
  }, []);

  const formatTimeForBackend = (timeStr) => {
    if (!timeStr) return null;
    return moment(timeStr).format("HH:mm");
  };

  const formatDateForBackend = (dateStr) => {
    return moment(dateStr).format("YYYY-MM-DD");
  };

  const saveCustomShiftSchedule = async (employeeId, shiftData) => {
    try {
      const [startDate, endDate] = shiftData.dateRange.split(",");

      // Build custom_schedule object
      const customSchedule = {};
      shiftData.dailySchedule.forEach((day) => {
        if (day.isOff) {
          customSchedule[day.date] = {
            is_off: true,
          };
        } else if (day.isSplit) {
          customSchedule[day.date] = {
            is_off: false,
            is_split: true,
            start_time_1: formatTimeForBackend(day.splitStartTime1),
            end_time_1: formatTimeForBackend(day.splitEndTime1),
            start_time_2: formatTimeForBackend(day.splitStartTime2),
            end_time_2: formatTimeForBackend(day.splitEndTime2),
          };
        } else {
          customSchedule[day.date] = {
            is_off: false,
            is_split: false,
            start_time: formatTimeForBackend(day.startTime),
            end_time: formatTimeForBackend(day.endTime),
          };
        }
      });

      const payload = {
        employee: employeeId,
        shift: null,
        schedule_name: shiftData.scheduleName,
        start_date: formatDateForBackend(startDate),
        end_date: formatDateForBackend(endDate),
        is_org_based: false,
        custom_schedule: customSchedule,
        total_weekly_hours: shiftData.totalHours.weekly.toString(),
        assigned_by: userProfile?.employee_id || userProfile?.id,
        is_off_day: shiftData.dailySchedule.some((day) => day.isOff),
        shift_requested: "HR",
      };

      const response = await saveShiftSchedule(payload);
      if (response) {
        toast.success("Custom shift schedule assigned successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error saving custom shift schedule:", error);
      toast.error("Failed to save custom shift schedule");
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Save shift assignment to employee
      const response = await saveEmployeeWorkInformationData(data.employee, {
        shift_assignment: data.shift_assignment,
      });

      if (response) {
        // Save custom shift schedule if configured
        if (customShiftData && data.employee) {
          await saveCustomShiftSchedule(data.employee, customShiftData);
        }

        toast.success("Shift assigned successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setIsOpen(false);
        setCustomShiftData(null);

        return {
          status: true,
          messageType: "SUCCESS",
          title: "Shift Assigned Successfully",
          description: "Shift has been assigned to the employee successfully.",
        };
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message || "An error occurred", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCustomShiftData(null);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
      >
        Assign Shift
      </Button>

      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant="sheet"
        sheetConfig={{ 
          title: 'Assign Shift',
          description: 'Assign shifts to employees'
        }}
        formConfig={{
          initialValues: {
            employee: "",
            shift_assignment: "",
          },
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          submitButtonText: "Assign Shift",
          cancelButtonText: "Cancel",
          columns: 1,
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Employee & Shift Selection`,
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "employee",
                  options: empOptions || [],
                  required: true,
                  label: "Employee",
                },
                {
                  InputField: SelectInputComponent,
                  name: "shift_assignment",
                  options: shiftList,
                  required: false,
                  label: "Shift",
                },
                {
                  InputField: AddCustomShift,
                  customShiftData: customShiftData,
                  setCustomShiftData: setCustomShiftData,
                  colsSpan: 1,
                },
              ],
            },
          ],
        }}
      />
    </>
  );
};

export default AssignShift2;