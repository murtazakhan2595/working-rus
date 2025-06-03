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
  isEmployee = false,
}) => {
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
  const [formData, setFormData] = useState(
    !isEmployee ? Attendance : AttendanceAdjustment
  );
  const [formValues, setFormValues] = useState(
    !isEmployee ? Attendance : AttendanceAdjustment
  );
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [activeSplitShift, setActiveAplitShift] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const FilteredEmployees = React.useMemo(() => {
    if (!Array.isArray(Employees) || Employees.length === 0) return [];
    if (isEmployee)
      return Employees.filter(
        (employee) => parseInt(employee.id) === parseInt(UserDetails.id)
      );
    return Employees;
  }, [Employees, isEmployee, UserDetails]);

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

  const fetchAttendanceData = async (isMounted, date) => {
    setIsLoading(true);
    try {
      const response = await getAttendance({
        filterData: { date: date, employee_id: selectedEmployee.id },
      });
      if (isMounted && response) {
        if (response.results && response.results.length > 0) {
          const attendanceRecord = response.results[0];
          const active_shift = await GetEmployeeActiveShift(
            selectedEmployee.id,
            {},
            attendanceRecord.date
          );
          setActiveAplitShift(active_shift.is_split_shift);
          if (isEmployee) {
            const data = mapAdjustmentFromAttendnaceData(attendanceRecord);
            setFormData(data);
            setFormValues(data);
          } else {
            setFormData(attendanceRecord);
            setFormValues(attendanceRecord);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (formValues.date && selectedEmployee.id) {
      fetchAttendanceData(isMounted, formValues.date);
    }
    return () => {
      isMounted = false;
    };
  }, [formValues.date]);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (isEmployee) {
      setSelectedEmployee(UserDetails);
      setFormData((prev) => {
        return { ...prev, employee_id: UserDetails.id };
      });
    }
  }, [isEmployee, UserDetails]);

  const handleSubmit = async (data) => {
    try {
      const response = isEmployee
        ? await saveUpdateAttendanceAdjustment(data)
        : await saveAttendance(data, selectedEmployee, id);
      // return
      if (response) {
        if (id) {
          toast.success("Attendance Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Attendance Submitted Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setIsOpen(false);
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
        validateFormSchema: isEmployee
          ? validateAttendanceAdjustmentFormSchema
          : validateUpdateAttendanceFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 3,
        renderUpdatedFormValues: setFormValues,
        disableSubmit: isLoading,
        formFiels: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "employee_id",
                required: true,
                disabled: isEmployee,
                label: "Employee",
                onFieldUpdate: (field, value) => {
                  if (value)
                    setSelectedEmployee(
                      Employees.find((obj) => obj.value === value)
                    );
                  else setSelectedEmployee({});
                },
                options: FilteredEmployees,
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
              },
              {
                InputField: TimePicker,
                name: isEmployee ? "requested_checkin" : "checkin",
                required: true,
                label: "Check-In Time",
                date: formValues?.date,
              },

              {
                InputField: TimePicker,
                name: isEmployee ? "requested_checkout" : "checkout",
                required: true,
                label: "Check-Out Time",
                date: formValues?.date,
              },

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
                disabled: isEmployee,
              },
              ...(isEmployee
                ? [
                    {
                      InputField: TextAreaInput,
                      name: "reason",
                      required: true,
                      label: "Reason",
                      colsSpan: 3,
                      rows: 3,
                    },
                  ]
                : []),
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>
  );
};

export default UpdateEmployeeAttendance;
