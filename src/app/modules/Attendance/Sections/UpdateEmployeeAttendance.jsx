import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Attendance } from "app/utils/Types/Attendance";
import { validateUpdateAttendanceFormSchema } from "app/utils/FormSchema/AttendanceFormSchema";
import { SheetUI } from "components";
import { saveAttendance } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import {
  RadioGroupInput,
  SelectInputComponent,
  TimePicker,
  DateInput,
} from "components/FormControl";

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
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const UserDetails = useSelector((state) => state.emp.user_details);
  const Mangers = useSelector((state) => state.emp.reportingManagers);
  const Employees = useSelector((state) => state.emp.employees);
  const [formData, setFormData] = useState(Attendance);
  const [formValues, setFormValues] = useState(Attendance);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  //   const fetchData = async (isMounted) => {
  //     try {
  //       const response = await getEmployeeTransferData(id);
  //       if (isMounted && response) {
  //         setFormData(response);
  //         setSelectedEmployee(
  //           Employees.find((obj) => obj.value === response.employee_id)
  //         );
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useEffect(() => {
  //     let isMounted = true;
  //     if (id) {
  //       fetchData(isMounted);
  //     }
  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [id]);

  useEffect(() => {
    if (isEmployee) {
      setSelectedEmployee(UserDetails);
      setFormData((prev) => {
        return { ...prev, employee_id: UserDetails.id };
      });
    }
  }, [isEmployee]);

  const handleSubmit = async (data) => {
    try {
      const response = await saveAttendance(data, id);
      // return
      if (response) {
        if (id) {
          toast.success("Employee Tranfer Request Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Employee Tranfer Request Submitted Successfully!", {
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
        validateFormSchema: validateUpdateAttendanceFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 3,
        renderUpdatedFormValues: setFormValues,
        formFiels: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFiels: [
              {
                InputField: SelectInputComponent,
                name: "employee_id",
                required: true,
                disabled: isEmployee,
                label: "Employee",
                onChange: (field, value) => {
                  if (value)
                    setSelectedEmployee(
                      Employees.find((obj) => obj.value === value)
                    );
                  else setSelectedEmployee({});
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
            InputFiels: [
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
              {
                InputField: DateInput,
                name: "date",
                required: true,
                label: "Attendance Date",
              },
              ...(formValues?.status !== "Absent"
                ? [
                    {
                      InputField: TimePicker,
                      name: "checkin",
                      required: true,
                      label: "Check-In Time",
                      date: formValues?.date,
                    },
                  ]
                : []),
              ...(formValues?.status !== "Absent"
                ? [
                    {
                      InputField: TimePicker,
                      name: "checkout",
                      required: true,
                      label: "Check-Out Time",
                      date: formValues?.date,
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
