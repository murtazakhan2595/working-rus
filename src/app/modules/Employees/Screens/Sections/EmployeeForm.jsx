import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../src/@/components/ui/label";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeInformation } from "../../../../../app/utils/Types/Employee";
import { getEmployeeInformation } from "../../../../../app/utils/MappingObjects/mapEmployeeData";
import {
  getEmployeeData,
  getNewEmployeeCode,
  saveEmployeeWorkInformationData,
} from "../../../../../app/hooks/employee";

import {
  fetchEmployees,
  fetchReportingManagers,
} from "../../../../../state/slices/EmpSlice";
import { validationEmployeeInfoFormSchema } from "../../../../../app/utils/FormSchema/employeeFormSchema";

import {
  HeadOfDepartmentOptions,
  employeeStatus,
  jobRoles,
  workplaceTypes,
  UserRoles,
  countriesCallingCodes,
  countriesList,
  salaryTypeOptions,
} from "../../../../../data/Data";

import {
  EmailInput,
  PhoneNumberInput,
  TextAreaInput,
  TextInput,
  SelectComponent,
  SelectMultiInputComponent,
  DateInput,
} from "../../../../../components/form-control";

import { getEmployeeid } from "utils/getValuesFromTables";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { PageLoader } from "components";

function getManagersStringSelected(managers) {
  if (managers) {
    const matchingObjects = managers.map((obj) => {
      return obj.value;
    });
    return matchingObjects.join(", ");
  }
  return [];
}

const SheetOnBorading = ({
  isEditMode,
  nextStep,
  setShowFormSubmittedModal,
  setEmail,
  id,
  employees,
  designations,
  departments,
  managers,
  isOpen,
  setIsOpen,
}) => {
  const formRef = React.createRef();

  console.log("RECEIVED ID:", id);
  console.log("EDIT MODE", isEditMode);

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EmployeeInformation);
  const [empId, setEmpId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [usernameAlreadyExist, setUsernameAlreadyExist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await getEmployeeData(id);
          const employeeData = await getEmployeeInformation(response);
          setFormData(employeeData);
          // setEmpId(`TXB-${employeeData.id.toString().padStart(4, "0")}`);
          setEmpId(employeeData.id);
          validateEmail(employeeData.work_email);
          validateUsername(employeeData.username);
        } else {
          const response = await getNewEmployeeCode();
          // setEmpId(`TXB-${response.toString().padStart(4, "0")}`);
          setEmpId(response);
        }
      } catch (error) {
        console.log(error);
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
    console.log(data);
    // return
    setIsLoading(true);
    let employeePayroll = {};
    if (data.salary_type === "hourly") {
      employeePayroll = {
        hourly_rate: data.salary,
        salary_type: data.salary_type,
        employee: empId,
        is_new: true,
      };
    } else {
      employeePayroll = {
        basic_salary: data.salary,
        salary_type: data.salary_type,
        employee: empId,
        is_new: true,
      };
    }
    try {
      // Check if an API call is already in progress
      data.indirect_report = data?.indirect_report
        ? getManagersStringSelected(data.indirect_report)
        : "";
      const response = await saveEmployeeWorkInformationData(data.id, data);
      if (response) {
        dispatch(fetchEmployees());
        dispatch(fetchReportingManagers());
        if (data.id) {
          toast.success("Employee Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          if (isEditMode) nextStep();
          else navigate("/profile-management");
        } else {
          await saveEmployeePayroll(employeePayroll);
          toast.success("Employee Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowFormSubmittedModal && setShowFormSubmittedModal(true);
          setIsOpen(false);
        }
      }
    } catch (error) {
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
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div
        side="right"
        className="w-full p-0 "
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="flex flex-col ">
          <div className="flex-grow ">
            <div className="p-0">
              {/* <CardHeader className="prose">
                <CardTitle> {id ? "Update" : "Add"} Employee</CardTitle>
              </CardHeader> */}
              <Formik
                initialValues={formData}
                innerRef={formRef}
                onSubmit={(values, { resetForm }) => {
                  console.log("Form Data:", values); // Log form data to console
                  handleSubmit(values, resetForm);
                }}
                validate={(values) => {
                  console.log(values);
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <TextInput
                            name={"employeeId"}
                            error={props.errors?.employeeId}
                            touch={props.touched?.employeeId}
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
                          <div>
                            <Label htmlFor="password">
                              <span className="text-red-600">* </span>Password
                            </Label>
                            <Input
                              type="password"
                              maxLength="20"
                              id="password"
                              name="password"
                              autoComplete="Off"
                              placeholder={"Enter User Name"}
                              onChange={(option) => {
                                props.handleChange("password")(option);
                              }}
                              value={
                                props.values?.password?.length <= 20
                                  ? props.values?.password
                                  : ""
                              }
                              className={
                                props.errors?.password &&
                                props.touched?.password
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            {props.errors?.password &&
                              props.touched?.password && (
                                <div className="text-red-600 invalid-feedback">
                                  {props.errors?.password}
                                </div>
                              )}
                          </div>
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
                          <TextAreaInput
                            name={"residential_address"}
                            error={props.errors?.residential_address}
                            touch={props.touched?.residential_address}
                            value={props.values?.residential_address}
                            label={"Address"}
                            required={true}
                            minRows={3}
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
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
                          <SelectComponent
                            name={"department_manager"}
                            options={HeadOfDepartmentOptions}
                            error={props.errors?.department_manager}
                            touch={props.touched.department_manager}
                            value={props.values.department_manager}
                            required={true}
                            label={"Department Head"}
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
                      </div>
                    </div>
                   {!id &&  <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Salary Details</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <SelectComponent
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
                    </div>}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            setIsOpen(false);
                          }}
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
            </div>
          </div>
        </div>
      </div>
    </>
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
