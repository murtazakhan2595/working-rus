import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import { getShift } from "app/hooks/attendance";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import { SheetUI } from "components";
import { SelectInputComponent, SelectMultiInputComponent } from "components/FormControl";
import AddCustomShift from "app/modules/Employees/Screens/EmployeeForm/AddCustomShift";
import { Button } from "components/ui/button";
import { GetDispatchStateList } from 'utils/Lists';

const AssignShift2 = ({ }) => {
  const employees = GetDispatchStateList('employees', 'emp');
  const [isOpen, setIsOpen] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [customShiftData, setCustomShiftData] = useState(null);
  const userProfile = useSelector((state) => state.user.userProfile);
  const Branches = useSelector((state) => state.common.branches);
  const Departments = useSelector((state) => state.common.departments);
  // Filter states for branch and department
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  // Track selected employee to preserve during filtering
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const baseEmpOptions = employees?.map((emp) => ({
    value: emp.id,
    label: emp.label,
    branch_id: emp.branch_id,
    department_name: emp.department_name,
  }));

  // Create filtered employee list based on branch and department filters
  // Also preserve already selected employee even if they don't match filters
  const empOptions = useMemo(() => {
    let filteredEmployees = baseEmpOptions || [];

    // Apply branch filter
    if (selectedBranch && Array.isArray(selectedBranch) && selectedBranch.length) {
      filteredEmployees = filteredEmployees.filter(emp => selectedBranch.includes(emp.branch_id));
    }

    // Apply department filter
    if (selectedDepartment && Array.isArray(selectedDepartment) && selectedDepartment.length) {
      filteredEmployees = filteredEmployees.filter(emp => selectedDepartment.includes(emp.department_name));
    }

    // Find already selected employee that might not be in filtered list
    const selectedButNotInFilter = selectedEmployee &&
      !filteredEmployees.find(emp => emp.value === selectedEmployee.value)
      ? [selectedEmployee]
      : [];

    // Combine filtered employees with selected employee (remove duplicates)
    const allEmployees = [...filteredEmployees, ...selectedButNotInFilter];

    return allEmployees;
  }, [baseEmpOptions, selectedBranch, selectedDepartment, selectedEmployee]);

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
    setSelectedBranch("");
    setSelectedDepartment("");
    setSelectedEmployee(null);
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
              sheetCardTitle: `Employee Filtering`,
              InputFields: [
                {
                  InputField: SelectMultiInputComponent,
                  name: "branch_filter",
                  label: "Filter by Branch",
                  options: Branches || [],
                  value: selectedBranch,
                  onChange: (field, value) => setSelectedBranch(value),
                  placeholder: "All Branches",
                  required: false,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "department_filter",
                  label: "Filter by Department",
                  options: Departments || [],
                  value: selectedDepartment,
                  onChange: (field, value) => setSelectedDepartment(value),
                  placeholder: "All Departments",
                  required: false,
                },
                {
                  InputField: ({ name, value, ...props }) => (
                    <div className="text-xs text-muted-900 col-span-2">
                      Showing {empOptions?.length || 0} employees
                      {selectedBranch || selectedDepartment ? ' (filtered)' : ' (all)'}
                      {selectedEmployee && ` • 1 selected`}
                    </div>
                  ),
                },
              ],
            },
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
                  onFieldUpdate: async (field, value, formValues, setFieldValue) => {
                    // Track selected employee for filter preservation
                    const selected = baseEmpOptions?.find(emp => emp.value === value);
                    setSelectedEmployee(selected || null);
                  },
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