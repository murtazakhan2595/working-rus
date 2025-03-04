import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../src/@/components/ui/label";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeInformation } from "app/utils/Types/Employee";
import {
  getEmployeeInformation,
  mapEmployeePayloadData,
} from "app/utils/MappingObjects/mapEmployeeData";
import {
  getEmployeeData,
  getNewEmployeeCode,
  saveEmployeeWorkInformationData,
} from "app/hooks/employee";

import { fetchEmployees, fetchReportingManagers } from "state/slices/EmpSlice";
import { validationEmployeeInfoFormSchema } from "app/utils/FormSchema/employeeFormSchema";

import {
  GenderOptions,
  BloodGroupOptions,
  employeeStatus,
  jobRoles,
  workplaceTypes,
  UserRoles,
  countriesCallingCodes,
  countriesList,
  salaryTypeOptions,
  probationPeriodOptions,
} from "data/Data";

import {
  EmailInput,
  PhoneNumberInput,
  TextAreaInput,
  TextInput,
  SelectInputComponent,
  SelectMultiInputComponent,
  DateInput,
  CheckBoxInput,
  PasswordInput,
} from "components/FormControl";

import { getEmployeeid } from "utils/getValuesFromTables";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { PageLoader } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { getShift } from "app/hooks/attendance";
import AddShiftForm from "app/modules/OfficeSetting/sections/Shift/AddShiftForm";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";

async function getManagersStringSelected(managers) {
  if (managers) {
    const matchingObjects = await Promise.all(
      managers.map((obj) => {
        return obj;
      })
    );
    return matchingObjects.join(", ");
  }
  return "";
}

const SheetOnBorading = ({
  isEditMode,
  nextstep,
  setShowFormSubmittedModal,
  setEmail,
  id,
  employees,
  designations,
  departments,
  managers,
  isOpen,
  setIsOpen,
  discard = false,
}) => {
  const formRef = React.createRef();

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EmployeeInformation);
  const [empId, setEmpId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [usernameAlreadyExist, setUsernameAlreadyExist] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [addShift, setAddShift] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [shiftSelect, setShiftSelect] = useState(false);

  const getShiftList = async () => {
    const shiftData = await getShift();
    if (shiftData) {
      const shiftList = shiftData.results.map((shift) => {
        return {
          value: shift.id,
          label: `${shift.name} (${moment(shift.starttime).format(
            "h:mm a"
          )} - ${moment(shift.endtime).format("h:mm a")})`,
        };
      });
      setShiftList(shiftList);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await getEmployeeData(id);
          const employeeData = await getEmployeeInformation(response);
          setFormData(employeeData);
          // setEmpId(`TXB-${employeeData.id.toString().padStart(4, "0")}`);
          setEmpId(response.serial_number);
          validateEmail(employeeData.work_email);
          validateUsername(employeeData.username);
          getShiftList();
          if (employeeData.shift_assignment) {
            setShiftSelect(true);
          }
        } else {
          const response = await getNewEmployeeCode();
          // setEmpId(`TXB-${response.toString().padStart(4, "0")}`);
          setEmpId(response);
          getShiftList();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateEmail = (email) => {
    const employee = employees.filter(
      (emp) => emp.work_email === email && emp.value !== id
    );
    if (employee && employee.length > 0) {
      setEmailAlreadyExist(true);
    } else {
      setEmailAlreadyExist(false);
    }
  };
  const validateUsername = (username) => {
    const employee = employees.filter(
      (emp) => emp.label === username && emp.value !== id
    );
    if (employee && employee.length > 0) {
      setUsernameAlreadyExist(true);
    } else {
      setUsernameAlreadyExist(false);
    }
  };
  const handleSubmit = async (data) => {
    setIsLoading(true);
    const employeePayload = mapEmployeePayloadData(data);
    try {
      // Format indirect report if it exists
      if (data?.indirect_report)
        employeePayload.indirect_report = await getManagersStringSelected(
          data.indirect_report
        );
      // Save employee work information
      const response = await saveEmployeeWorkInformationData(
        data.id,
        employeePayload
      );
      // return
      if (response) {
        const employeeId = response.id; // Extract employee ID from the response
        // Dispatch fetch actions to update the state
        dispatch(fetchEmployees());
        dispatch(fetchReportingManagers());
        if (data.id) {
          // Employee update flow
          toast.success("Employee Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          if (isEditMode) {
            nextstep();
          } else navigate("/profile-management");
        } else {
          let employeePayroll = {};
          // Determine the payroll data structure based on salary type
          if (data.salary_type === "hourly") {
            employeePayroll = {
              hourly_rate: data.salary,
              salary_type: data.salary_type,
              is_new: true,
            };
          } else {
            employeePayroll = {
              basic_salary: data.salary,
              salary_type: data.salary_type,
              is_new: true,
            };
          }
          // Employee creation flow
          await saveEmployeePayroll({
            ...employeePayroll,
            employee: employeeId,
          });
          toast.success("Employee Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowFormSubmittedModal && setShowFormSubmittedModal(true);
          setIsOpen(false);
        }
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      if (
        error.response &&
        error.response.data.username[0] ===
          "A user with that username already exists."
      ) {
        toast.error("A user with that username already exists.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("API Error:", error);
        toast.error(error.message || "An error occurred", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
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
        discard,
        navigate,
      })}

      <div
        side="right"
        className="w-full p-0 "
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div
          className={`flex flex-col   ${window.location.pathname.substring(1)}`}
        >
          <div className="flex-grow ">
            <div className="p-0">
              {/* <CardHeader className="prose">
                <CardTitle> {id ? "Update" : "Add"} Employee</CardTitle>
              </CardHeader> */}
              <Formik
                initialValues={formData}
                innerRef={formRef}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validate={(values) => {
                  const errors = validationEmployeeInfoFormSchema(
                    values,
                    id ? true : false
                  );
                  if (!id && values.work_email && emailAlreadyExist) {
                    errors.work_email = "Email already exist";
                  }
                  if (!id && values.username && usernameAlreadyExist) {
                    errors.username = "Username already exist";
                  }
                  return errors;
                }}
              >
                {(props) => (
                  <form
                    onSubmit={props.handleSubmit}
                    className="mt-6 space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Employee Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <TextInput
                            name={"serial_number"}
                            error={props.errors?.serial_number}
                            touch={props.touched?.serial_number}
                            value={getEmployeeid(empId)}
                            label={"Employee ID"}
                            required={true}
                            disabled={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"username"}
                            error={props.errors?.username}
                            touch={props.touched?.username}
                            value={props.values?.username}
                            label={"User Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                              validateUsername(value);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextInput
                            name={"first_name"}
                            error={props.errors?.first_name}
                            touch={props.touched?.first_name}
                            value={props.values?.first_name}
                            label={"First Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"last_name"}
                            error={props.errors?.last_name}
                            touch={props.touched?.last_name}
                            value={props.values?.last_name}
                            label={"Last Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <EmailInput
                            name={"work_email"}
                            error={props.errors?.work_email}
                            touch={props.touched?.work_email}
                            value={props.values?.work_email}
                            label={"Email"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                              setEmail && setEmail(value);
                              validateEmail(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <PasswordInput
                            name={"password"}
                            error={props.errors?.password}
                            touch={props.touched?.password}
                            value={props.values?.password}
                            placeholder={"Enter Password"}
                            label={"Password"}
                            maxLength="20"
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                          
                        </div>
                        <div className="space-y-2">
                          <PhoneNumberInput
                            name={"mobile_no"}
                            error={props.errors.mobile_no}
                            touch={props.touched?.mobile_no}
                            value={props.values?.mobile_no}
                            required={true}
                            label={"Contact no."}
                            countryCode={props.values?.country_code}
                            countryCodeName={"country_code"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                            countryOptions={countriesCallingCodes} // Pass the country options here
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"blood_group"}
                            options={BloodGroupOptions}
                            error={props.errors?.blood_group}
                            touch={props.touched.blood_group}
                            value={props.values.blood_group}
                            required={false}
                            label={"Blood Group"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"gender"}
                            options={GenderOptions}
                            error={props.errors?.gender}
                            touch={props.touched.gender}
                            value={props.values.gender}
                            required={false}
                            label={"Gender"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>

                        <div className="col-span-1 space-y-2 xl:col-span-3 lg:col-span-2 md:col-span-2">
                          <TextAreaInput
                            name={"residential_address"}
                            error={props.errors?.residential_address}
                            touch={props.touched?.residential_address}
                            value={props.values?.residential_address}
                            label={"Address"}
                            required={true}
                            maxRows={3}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Official Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"department_name"}
                            options={departments}
                            error={props.errors?.department_name}
                            touch={props.touched.department_name}
                            value={props.values.department_name}
                            label={"Department"}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"employee_location"}
                            options={countriesList}
                            error={props.errors?.employee_location}
                            touch={props.touched.employee_location}
                            value={props.values.employee_location}
                            required={true}
                            label={"Employee Location"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"department_position"}
                            options={designations}
                            error={props.errors?.department_position}
                            touch={props.touched.department_position}
                            value={props.values.department_position}
                            label={"Designation"}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"user_role"}
                            options={UserRoles}
                            error={props.errors?.user_role}
                            touch={props.touched.user_role}
                            value={props.values.user_role}
                            required={true}
                            label={"Role"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"employee_type"}
                            options={jobRoles}
                            error={props.errors?.employee_type}
                            touch={props.touched.employee_type}
                            value={props.values.employee_type}
                            required={true}
                            label={"Employee Type"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"employee_status"}
                            options={employeeStatus}
                            error={props.errors?.employee_status}
                            touch={props.touched.employee_status}
                            value={props.values.employee_status}
                            required={true}
                            label={"Employee status"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"employee_work_type"}
                            options={workplaceTypes}
                            error={props.errors?.employee_work_type}
                            touch={props.touched.employee_work_type}
                            value={props.values.employee_work_type}
                            required={true}
                            label={"Employee Work Type"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"direct_report"}
                            options={managers}
                            error={props.errors?.direct_report}
                            touch={props.touched.direct_report}
                            value={props.values.direct_report}
                            label={"Direct Report"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"indirect_report"}
                            options={managers}
                            error={props.errors?.indirect_report}
                            touch={props.touched.indirect_report}
                            value={props.values.indirect_report}
                            label={"Indirect Report"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <DateInput
                            name={"joining_date"}
                            error={props.errors?.joining_date}
                            touch={props.touched?.joining_date}
                            value={props.values?.joining_date}
                            required={true}
                            label={"Joining Date"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"probation_period"}
                            options={probationPeriodOptions}
                            error={props.errors?.probation_period}
                            touch={props.touched.probation_period}
                            value={props.values.prbation_period}
                            required={true}
                            label={"Probation Period"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <CheckBoxInput
                            label="Contract Employment"
                            name="active_contract"
                            value={props.values.active_contract}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                        {props.values.active_contract && (
                          <>
                            <div className="space-y-2">
                              <DateInput
                                name={"contract_start_date "}
                                error={props.errors?.contract_start_date}
                                touch={props.touched?.contract_start_date}
                                value={props.values?.contract_start_date}
                                required={true}
                                label={"Contract Start Date"}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <DateInput
                                name={"contract_end_date "}
                                error={props.errors?.contract_end_date}
                                touch={props.touched?.contract_end_date}
                                value={props.values?.contract_end_date}
                                required={true}
                                label={"Contract End Date"}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Shift Details</h3>
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <CheckBoxInput
                            label="Choose Shift"
                            name="shift-select"
                            value={shiftSelect}
                            onChange={(name, value) => {
                              setShiftSelect(value);
                            }}
                          />
                        </div>
                        {shiftSelect && (
                          <div className="space-y-2">
                            <SelectInputComponent
                              name={"shift_assignment"}
                              options={shiftList}
                              error={props.errors?.shift_assignment}
                              touch={props.touched.shift_assignment}
                              value={props.values.shift_assignment}
                              label={"Shift"}
                              required={true}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <CheckBoxInput
                          label="Custom Shift"
                          name="custom-shift"
                          value={addShift}
                          onChange={(name, value) => {
                            setAddShift(value);
                          }}
                        />
                      </div>
                    </div>
                    {!id && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Salary Details
                        </h3>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                          <div className="space-y-2">
                            <SelectInputComponent
                              name={"salary_type"}
                              options={salaryTypeOptions}
                              error={props.errors?.salary_type}
                              touch={props.touched.salary_type}
                              value={props.values.salary_type}
                              label={"Salary Type"}
                              required={true}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <TextInput
                              name={"salary"}
                              error={props.errors?.salary}
                              touch={props.touched?.salary}
                              value={props.values?.salary}
                              label={
                                props.values.salary_type === "hourly"
                                  ? "Employee Hourly Salary"
                                  : "Employee Monthly Salary"
                              }
                              required={true}
                              onChange={(field, value) => {
                                props.handleChange(field)(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                        {!nextstep && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleClose}
                            type="button"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button type="submit" size="lg" variant="default">
                          {id ? "Update" : "Add"}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {addShift && (
        <ShiftAction
          isOpen={addShift}
          setIsOpen={setAddShift}
          reload={getShiftList}
        />
      )}
    </>
  );
};

const ShiftAction = ({ isOpen, setIsOpen, reload }) => {
  const formSheetData = {
    triggerText: null,
    title: "Update Shift Details",
    description: null,
    footer: null,
  };
  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="568px"
    >
      <AddShiftForm
        isOpen={isOpen}
        setIsOpen={(value) => {
          reload();
          setIsOpen(value);
        }}
      />
    </SheetComponent>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    employees: state.emp.employees,
    departments: state.common.departments,
    designations: state.common.designations,
    managers: state.emp.reportingManagers,
  };
};
export default connect(mapStateToProps)(SheetOnBorading);
