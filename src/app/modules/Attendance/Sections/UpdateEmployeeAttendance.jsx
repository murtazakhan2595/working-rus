import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Attendance, AttendanceAdjustment } from "app/utils/Types/Attendance";
import { mapAdjustmentFromAttendnaceData } from "app/utils/MappingObjects/mapAttendanceData";
import {
  validateUpdateAttendanceFormSchema,
  validateAttendanceAdjustmentFormSchema,
} from "app/utils/FormSchema/AttendanceFormSchema";
import { SheetUI } from "components";
import {
  saveAttendance,
  getAttendanceData,
  getAttendance,
  saveUpdateAttendanceAdjustment,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import {
  RadioGroupInput,
  SelectInputComponent,
  TimePicker,
  DateInput,
} from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";
import { TextAreaInput } from "components/FormControl";
import { GetEmployeeFilteredList } from "utils/Lists";
import { GetEmployeeActiveShift } from "app/modules/Attendance/ShiftCalendar/Section/getEmployeeActiveShift";
import { renderDate } from "utils/renderValues";
import { getShiftById } from "app/hooks/attendance";
const FormSheetData = {
  triggerText: "Submit",
  title: "Update Employee Attendance",
  description: null,
  footer: null,
  className: "max-w-[678px] w-full",
};

const UpdateEmployeeAttendance = ({
  isOpen = true,
  id,
  setIsOpen = () => {},
}) => {
  const defaultShift = useSelector(
    (state) => state.attendance.assignedShiftData
  );
  const isDptAttendancePermitted = HasAccess("UPDATE_DPT_EMP_ATTENDANCE");
  const isBrnAttendancePermitted = HasAccess("UPDATE_BRN_EMP_ATTENDANCE");
  const isAttendancePermitted = HasAccess("UPDATE_EMPLOYEE_ATTENDANCE");
  const Employees = GetEmployeeFilteredList(
    false,
    isAttendancePermitted,
    isBrnAttendancePermitted,
    isDptAttendancePermitted
  );
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const UserDetails = useSelector((state) => state.emp.user_details);
  const Mangers = useSelector((state) => state.emp.reportingManagers);
  const [formData, setFormData] = useState(Attendance);
  const [formValues, setFormValues] = useState(Attendance);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [ActiveShift, setActiveShift] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (isMounted) => {
    try {
      const response = await getAttendanceData(id);
      if (isMounted && response) {
        setFormData(response);
        setFormValues(response);
        setSelectedEmployee(
          Employees.find((obj) => obj.value === response.employee_id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendanceData = async (isMounted, date, selectedEmployee) => {
    setIsLoading(true);
    if (date && selectedEmployee.id) {
      try {
        const response = await getAttendance({
          filterData: { date: date, employee_id: selectedEmployee.id },
        });
        const default_shift_id = selectedEmployee.default_shift;
        const default_shift = await getShiftById(default_shift_id);
        const active_shift = await GetEmployeeActiveShift(
          selectedEmployee.id,
          default_shift,
          date
        );
        setActiveShift(active_shift);
        if (isMounted && response) {
          if (response.results && response.results.length > 0) {
            const attendanceRecord = response.results[0];
            setFormData(attendanceRecord);
            setFormValues(attendanceRecord);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        date: data.date,
        id: data.id || id,
        checkin: data.checkin,
        checkout: data.checkout,
        employee_id: data.employee_id,
      };
      const response = await saveAttendance(
        payload,
        ActiveShift,
        data.id || id
      );
      // return
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Attendance Updated for ${selectedEmployee.name}`,
          description: `Attendance updated for ${
            selectedEmployee.name
          } for ${renderDate(data.date)} `,
        };
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };
  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const error = validateUpdateAttendanceFormSchema(
            values,
            Boolean(ActiveShift.status && ActiveShift.is_split_shift)
          );
          if (values.date && !ActiveShift.status) {
            if (!ActiveShift.shift_assigned) {
              error.date = `No Shift was assigned to ${selectedEmployee.name} for this date. Kindly update the shift to record attendance`;
            } else if (ActiveShift.isOffToday) {
              error.date = `${selectedEmployee.name} is on ${
                ActiveShift?.OffLabel?.toLowerCase() || ""
              } for this date`;
            }
          }
          return error;
        },
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 3,
        renderUpdatedFormValues: setFormValues,
        disableSubmit: isLoading,
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "employee_id",
                required: true,
                label: "Employee",
                onFieldUpdate: async (_, value) => {
                  const employee = value
                    ? Employees.find((obj) => obj.value === value)
                    : {};

                  setSelectedEmployee(employee);
                  await fetchAttendanceData(true, formValues.date, employee);
                },
                options: Employees,
              },
              {
                InputField: SelectInputComponent,
                name: "department",
                required: true,
                disabled: true,
                label: "Department",
                options: Departments,
                value: selectedEmployee.department_name,
              },
              {
                InputField: SelectInputComponent,
                name: "designation",
                required: true,
                disabled: true,
                label: "Designation",
                value: selectedEmployee.department_position,
                options: Designations,
              },
              {
                InputField: SelectInputComponent,
                name: "reporting_manager",
                required: true,
                disabled: true,
                label: "Reporting Manager",
                placeholder: "Reporting Manager",
                value: selectedEmployee.direct_report,
                options: Mangers,
              },
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: "Attendance Details",
            InputFields: [
              {
                InputField: DateInput,
                name: "date",
                required: true,
                label: "Attendance Date",
                maxDate: new Date(),
                onFieldUpdate: async (_, value) => {
                  await fetchAttendanceData(true, value, selectedEmployee);
                },
              },
              {
                InputField: TimePicker,
                name: "checkin",
                required: true,
                label: "Check-In Time",
                date: formValues?.date,
                ...(ActiveShift.status && ActiveShift.is_split_shift
                  ? { description: "Check-in for first shift" }
                  : {}),
              },

              {
                InputField: TimePicker,
                name: "checkout",
                required: true,
                label: "Check-Out Time",
                date: formValues?.date,
                ...(ActiveShift.status && ActiveShift.is_split_shift
                  ? { description: "Check-out for first shift" }
                  : {}),
              },
              ...(ActiveShift.status && ActiveShift.is_split_shift
                ? [
                    {
                      InputField: TimePicker,
                      name: "second_checkin",
                      required: true,
                      label: "Check-In Time",
                      date: formValues?.date,
                      description: "Check-in for second shift",
                    },

                    {
                      InputField: TimePicker,
                      name: "second_checkout",
                      required: true,
                      label: "Check-Out Time",
                      date: formValues?.date,
                      description: "Check-out for second shift",
                    },
                  ]
                : []),
              {
                InputField: RadioGroupInput,
                name: "status",
                required: true,
                disabled: false,
                label: "Status",
                options: [
                  { value: "Present", label: "Present" },
                  { value: "Absent", label: "Absent" },
                  { value: "Late", label: "Late" },
                  { value: "Weekend", label: "Weekend" },
                ],
                colsSpan: 3,
              },
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>
  );
};

export default UpdateEmployeeAttendance;
