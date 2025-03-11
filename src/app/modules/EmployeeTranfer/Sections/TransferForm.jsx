import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { EmployeeTranfer } from "app/utils/Types/EmployeeTranfer";
import { validationEmpTranferFormSchema } from "app/utils/FormSchema/employeeTransferFromSchema";
import { countriesList } from "data/Data";
import {
  RadioGroupInput,
  TextAreaInput,
  SelectInputComponent,
  DateInput,
} from "components/FormControl";
import { PageLoader } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  getEmployeeTranferData,
  addUpdateEmpTransferDetails,
} from "app/hooks/employeeTranfer";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";

const FormSheetData = {
  triggerText: "Submit",
  title: "Tranfer Employee Request Form",
  description: null,
  footer: null,
};

const TransferForm = ({
  transfer_type = "INTERNAL",
  id = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const formRef = React.createRef();
  let dispatch = useDispatch();
  const Departments = useSelector((state) => state.common.departments);
  const AllEmployees = useSelector((state) => state.emp.employees);
  const Employees = React.useMemo(() => {
    return AllEmployees?.filter(
      (employee) => employee.employee_status === "Active"
    );
  }, [AllEmployees]);
  const [formData, setFormData] = useState({
    ...EmployeeTranfer,
    transfer_type: transfer_type,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const response = await getEmployeeTranferData(id);
      if (isMounted) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      const response = await addUpdateEmpTransferDetails(data, id);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

      <SheetComponent
        {...FormSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        width="568px"
        setIsOpen={setIsOpen}
      >
        <Formik
          initialValues={formData}
          innerRef={formRef}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
          validate={(values) => {
            const errors = validationEmpTranferFormSchema(values);
            console.error(errors, values, "Errors");
            return errors;
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-2">
                <div className="space-y-4 col-span-2">
                  <RadioGroupInput
                    name={"transfer_type"}
                    label={"Tranfer Type"}
                    error={props.errors?.transfer_type}
                    touch={props.touched?.transfer_type}
                    value={props.values?.transfer_type}
                    options={[
                      { value: "INTERNAL", label: "Internal" },
                      { value: "EXTERNAL", label: "External" },
                    ]}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    disabled={true}
                  />
                </div>
                <div className="space-y-4">
                  <SelectInputComponent
                    name={"employee_id"}
                    options={Employees}
                    error={props.errors?.employee_id}
                    touch={props.touched?.employee_id}
                    value={props.values?.employee_id}
                    required={true}
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
                <div className="space-y-4"></div>
                <div className="space-y-4">
                  <SelectInputComponent
                    name={"old_department"}
                    options={Departments}
                    error={props.errors?.old_department}
                    touch={props.touched?.old_department}
                    value={selectedEmployee.department_name}
                    required={false}
                    disabled={true}
                    label={"Current Department"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <SelectInputComponent
                    name={"employee_location"}
                    options={countriesList}
                    error={props.errors?.employee_location}
                    touch={props.touched?.employee_location}
                    value={selectedEmployee?.employee_location}
                    required={false}
                    disabled={true}
                    label={"Current Location"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <SelectInputComponent
                    name={"new_department"}
                    options={Departments}
                    error={props.errors?.new_department}
                    touch={props.touched?.new_department}
                    value={props.values?.new_department}
                    label={"New Department"}
                    required={true}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>

                {props.values?.transfer_type === "EXTERNAL" && (
                  <div className="space-y-4">
                    <SelectInputComponent
                      name={"new_location"}
                      options={countriesList}
                      error={props.errors?.new_location}
                      touch={props.touched?.new_location}
                      value={props.values?.new_location}
                      required={true}
                      label={"New Location"}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <DateInput
                    name={"effective_transfer_date"}
                    error={props.errors?.effective_transfer_date}
                    touch={props.touched?.effective_transfer_date}
                    value={props.values?.effective_transfer_date}
                    required={true}
                    label={"Effective Tranfer Date"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <SelectInputComponent
                    name={"reason_of_transfer"}
                    options={countriesList}
                    error={props.errors?.reason_of_transfer}
                    touch={props.touched?.reason_of_transfer}
                    value={props.values?.reason_of_transfer}
                    required={true}
                    label={"Reason for Transfer"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  <TextAreaInput
                    name={"notes"}
                    error={props.errors?.notes}
                    touch={props.touched?.notes}
                    value={props.values?.notes}
                    label={"Note"}
                    required={false}
                    maxRows={5}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
              </div>
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
      </SheetComponent>
    </>
  );
};

export default TransferForm;
