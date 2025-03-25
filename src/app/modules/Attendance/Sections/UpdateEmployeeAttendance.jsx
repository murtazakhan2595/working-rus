import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Attendance } from "app/utils/Types/Attendance";
import { validateUpdateAttendanceFormSchema } from "app/utils/FormSchema/AttendanceFormSchema";
import { HRDocumentTargetAudience, HRDocumentCategory } from "data/Data";
import {
  TimePicker,
  RadioGroupInput,
  SelectInputComponent,
  DateInput,
  TextInput,
} from "components/FormControl";
import { SheetUI } from "components";
import { SheetCardExtension } from "components/SheetCardExtension";
import { saveAttendance } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";

const FormSheetData = {
  triggerText: "Submit",
  title: "Update Employee Attendance",
  description: null,
  footer: null,
  width: "70vw", // Default width for sheet variant
  className: "max-w-[700px] w-full",
};

const UpdateEmployeeAttendance = ({
  isOpen = true,
  id,
  setIsOpen = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const handleClose = () => {
    setCloseSheet(true);
  };
  return (
    <SheetUI isOpen={isOpen} setIsOpen={setIsOpen} sheetConfig={FormSheetData}>
      <Form id={id} setIsOpen={setIsOpen} handleClose={handleClose} />
    </SheetUI>
  );
};

const Form = ({
  isEmployee = false,
  id = null,
  setIsOpen = () => {},
  handleClose = () => {},
}) => {
  const formRef = React.createRef();
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const UserDetails = useSelector((state) => state.emp.user_details);
  const Mangers = useSelector((state) => state.emp.reportingManagers);
  const Employees = useSelector((state) => state.emp.employees);
  const [formData, setFormData] = useState(Attendance);
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
    <Formik
      initialValues={formData}
      innerRef={formRef}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values, resetForm);
      }}
      validate={(values) => {
        const errors = validateUpdateAttendanceFormSchema(values);
        console.error(errors, values, "Errors");
        return errors;
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <SheetCardExtension title="Employee Details">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
              <div className="space-y-4">
                <SelectInputComponent
                  name={"employee_id"}
                  options={Employees}
                  error={props.errors?.employee_id}
                  touch={props.touched?.employee_id}
                  value={props.values?.employee_id}
                  required={true}
                  disabled={isEmployee}
                  label={"Employee"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    if (value)
                      setSelectedEmployee(
                        Employees.find((obj) => obj.value === value)
                      );
                    else setSelectedEmployee({});
                  }}
                />
              </div>
              <div className="col-span-2 space-y-4"></div>
              <div className="space-y-4">
                <SelectInputComponent
                  name={"department"}
                  options={Departments}
                  error={props.errors?.department}
                  touch={props.touched?.department}
                  value={selectedEmployee.department_name}
                  required={false}
                  disabled={true}
                  label={"Department"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
              <div className="space-y-4">
                <SelectInputComponent
                  name={"designation"}
                  options={Designations}
                  error={props.errors?.designation}
                  touch={props.touched?.designation}
                  value={selectedEmployee.department_position}
                  required={false}
                  disabled={true}
                  label={"Designation"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
              <div className="space-y-4">
                <SelectInputComponent
                  name={"reporting_manager"}
                  options={Mangers}
                  error={props.errors?.reporting_manager}
                  touch={props.touched?.reporting_manager}
                  value={selectedEmployee.direct_report}
                  required={false}
                  disabled={true}
                  label={"Reporting Manager"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
            </div>
          </SheetCardExtension>
          <SheetCardExtension title="Attendance Details">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
              <div className="space-y-4 col-span-3">
                <RadioGroupInput
                  name={"status"}
                  label={"Status"}
                  error={props.errors?.status}
                  touch={props.touched?.status}
                  value={props.values?.status}
                  options={[
                    { value: "Present", label: "Present" },
                    { value: "Absent", label: "Absent" },
                    { value: "Late", label: "Late" },
                    { value: "Weekend", label: "Weekend" },
                  ]}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="space-y-4">
                <DateInput
                  name={"date"}
                  error={props.errors?.date}
                  touch={props.touched?.date}
                  value={props.values?.date}
                  required={true}
                  label={"Attendance Date"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
              {props.values?.status !== "Absent" && (
                <>
                  <div className="space-y-4">
                    <TimePicker
                      name={"checkin"}
                      error={props.errors?.checkin}
                      touch={props.touched?.checkin}
                      value={props.values?.checkin}
                      date={props.values?.date}
                      required={true}
                      label={"Check-In Time"}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <TimePicker
                      name={"checkout"}
                      error={props.errors?.checkout}
                      touch={props.touched?.checkout}
                      value={props.values?.checkout}
                      date={props.values?.date}
                      required={true}
                      label={"Check-Out Time"}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </SheetCardExtension>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                size="lg"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" variant="default">
                {id ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default UpdateEmployeeAttendance;
