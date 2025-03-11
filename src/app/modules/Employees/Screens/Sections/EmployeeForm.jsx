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
  saveDocumentChecklist,
  getDocumentChecklist,
} from "app/hooks/employee";
import {
  fetchEmployees,
  fetchReportingManagers,
  fetchEmployeesDetail,
} from "state/slices/EmpSlice";
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
} from "data/Data";
import { format } from "date-fns";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { Calendar } from "src/@/components/ui/calendar";

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
import ImportEmployeesButton from "./ImportEmployeesButton"; // Adjust the path as needed

import { getEmployeeid } from "utils/getValuesFromTables";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { PageLoader } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { getShift } from "app/hooks/attendance";
import AddShiftForm from "app/modules/OfficeSetting/sections/Shift/AddShiftForm";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";
import { cn } from "src/@/lib/utils";
import { CalendarDays } from "lucide-react";
import { DateRangeInput } from "components/FormControl";

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

  const [checklistData, setChecklistData] = useState({
    is_resume: false,
    is_signed_offer_letter: false,
    is_educational_documents: false,
    is_professional_certificates: false,
    is_picture: false,
    is_id_card: false,
    is_passport_copy: false,
    is_visa_copy: false,
    is_leave_application: false,
    is_increment_letter: false,
    is_confirmation_letter: false,
    is_others: false,
  });

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
          // Call the actual API to get document checklist
          const checklist = await getDocumentChecklist(id);

          // Check if we got data back and there are results
          if (checklist && checklist.results && checklist.results.length > 0) {
            // Use the first result as our checklist data
            setChecklistData(checklist.results[0]);
          } else {
            // No existing checklist found, set to null to create new
            setChecklistData({
              is_resume: false,
              is_signed_offer_letter: false,
              is_educational_documents: false,
              is_professional_certificates: false,
              is_picture: false,
              is_id_card: false,
              is_passport_copy: false,
              is_visa_copy: false,
              is_leave_application: false,
              is_increment_letter: false,
              is_confirmation_letter: false,
              is_others: false,
            });
          }

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
    const employeePayload = mapEmployeePayloadData(data, formData);
    try {
      // Save employee work information
      const response = await saveEmployeeWorkInformationData(
        id,
        employeePayload
      );
      // return
      if (response) {
        const employeeId = response.id;
        // Save document checklist
        await saveDocumentChecklist({
          employee_id: employeeId,
          ...checklistData,
        });
        // Dispatch fetch actions to update the state
        dispatch(fetchEmployees());
        dispatch(fetchReportingManagers());
        dispatch(fetchEmployeesDetail());
        if (id) {
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
                  console.error(errors,values,"Errors");
                  return errors;
                }}
              >
                {(props) => (
                  <form
                    onSubmit={props.handleSubmit}
                    className="mt-6 space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Employee Details
                        </h3>
                        {/* Import button goes here */}
                        <ImportEmployeesButton />
                      </div>
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
                        <ProbationDateRange formikProps={props} />
                        <div className="space-y-2">
                          <DateInput
                            name={"confirmation_date"}
                            error={props.errors?.confirmation_date}
                            touch={props.touched?.confirmation_date}
                            value={props.values?.confirmation_date}
                            required={true}
                            label={"Confirmation Date"}
                            disabled={true}
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
                                name={"contract_start_date"}
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
                                name={"contract_end_date"}
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
                    <div className="col-span-2 space-y-2">
                      <TextAreaInput
                        name={"jd_file"}
                        error={props.errors?.jd_file}
                        touch={props.touched?.jd_file}
                        value={props.values?.jd_file}
                        label={"Job Description"}
                        required={false}
                        maxRows={5}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </div>
                    <div className="col-span-2 space-y-2 ">
                      <TextAreaInput
                        name={"kpi_file"}
                        error={props.errors?.kpi_file}
                        touch={props.touched?.kpi_file}
                        value={props.values?.kpi_file}
                        label={"Job KPIs"}
                        required={false}
                        maxRows={5}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        Onboarding Checklist
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_resume"
                            value={checklistData?.is_resume}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_resume: value,
                              });
                            }}
                            label="Resume"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_signed_offer_letter"
                            value={checklistData?.is_signed_offer_letter}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_signed_offer_letter: value,
                              });
                            }}
                            label="Signed Offer Letter"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_educational_documents"
                            value={checklistData?.is_educational_documents}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_educational_documents: value,
                              });
                            }}
                            label="Educational Documents"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_professional_certificates"
                            value={checklistData?.is_professional_certificates}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_professional_certificates: value,
                              });
                            }}
                            label="Professional Certificate"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_picture"
                            value={checklistData?.is_picture}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_picture: value,
                              });
                            }}
                            label="Picture with White Background"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_id_card"
                            value={checklistData?.is_id_card}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_id_card: value,
                              });
                            }}
                            label="Country Residency ID Card"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_passport_copy"
                            value={checklistData.is_passport_copy}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_passport_copy: value,
                              });
                            }}
                            label="Passport Copy"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_visa_copy"
                            value={checklistData.is_visa_copy}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_visa_copy: value,
                              });
                            }}
                            label="Visa Page Copy"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_leave_application"
                            value={checklistData.is_leave_application}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_leave_application: value,
                              });
                            }}
                            label="Leave Applications"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_increment_letter"
                            value={checklistData.is_increment_letter}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_increment_letter: value,
                              });
                            }}
                            label="Increment Letters"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_confirmation_letter"
                            value={checklistData.is_confirmation_letter}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_confirmation_letter: value,
                              });
                            }}
                            label="Confirmation Letters"
                          />
                        </div>
                        <div className="flex items-center">
                          <CheckBoxInput
                            name="is_others"
                            value={checklistData.is_others}
                            onChange={(field, value) => {
                              setChecklistData({
                                ...checklistData,
                                is_others: value,
                              });
                            }}
                            label="Others"
                          />
                        </div>
                      </div>
                    </div>
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

const ProbationDateRange = ({ formikProps }) => {
  // Calculate probation period whenever date range changes
  useEffect(() => {
    if (
      formikProps.values?.probation_start_date &&
      formikProps.values?.probation_end_date
    ) {
      const start = moment(formikProps.values.probation_start_date);
      const end = moment(formikProps.values.probation_end_date);

      if (end.isBefore(start)) {
        formikProps.setFieldValue("probation_period", "Invalid date range");
        return;
      }

      // Calculate the difference in a human-readable format
      const duration = moment.duration(end.diff(start));
      const years = duration.years();
      const months = duration.months();
      const days = duration.days();

      // Format the duration
      let periodText = "";
      if (years > 0) {
        periodText += `${years} ${years === 1 ? "Year" : "Years"}`;
      }

      if (months > 0) {
        periodText += periodText ? " and " : "";
        periodText += `${months} ${months === 1 ? "Month" : "Months"}`;
      }

      if (days > 0) {
        periodText += periodText ? " and " : "";
        periodText += `${days} ${days === 1 ? "Day" : "Days"}`;
      }

      if (!periodText) {
        periodText = "Same day (0 days)";
      }

      formikProps.setFieldValue("probation_period", periodText);
    } else {
      formikProps.setFieldValue("probation_period", "");
    }
  }, [
    formikProps.values?.probation_start_date,
    formikProps.values?.probation_end_date,
  ]);

  // Handle date range selection
  const handleDateRangeChange = (name, value) => {
    if (!value) {
      // Reset all values if date range is cleared
      formikProps.setFieldValue("probation_start_date", null);
      formikProps.setFieldValue("probation_end_date", null);
      formikProps.setFieldValue("confirmation_date", null);
      return;
    }

    const [startDate, endDate] = value.split(",");

    // Set start date
    if (startDate) {
      formikProps.setFieldValue("probation_start_date", startDate);
    }

    // Set end date and auto-calculate confirmation date
    if (endDate) {
      formikProps.setFieldValue("probation_end_date", endDate);
      formikProps.setFieldValue(
        "confirmation_date",
        moment(endDate).add(1, "days").format("YYYY-MM-DD")
      );
    }
  };

  // Get current date range value for component
  const getDateRangeValue = () => {
    if (!formikProps.values?.probation_start_date) return null;

    let value = formikProps.values.probation_start_date;

    if (formikProps.values?.probation_end_date) {
      value += `,${formikProps.values.probation_end_date}`;
    }

    return value;
  };

  const handlePeriodChange = (field, value) => {
    formikProps.setFieldValue("probation_period", value);
  };

  // Get display error message for date range
  const getDateRangeError = () => {
    if (formikProps.errors?.probation_start_date) {
      return formikProps.errors.probation_start_date;
    } else if (formikProps.errors?.probation_end_date) {
      return formikProps.errors.probation_end_date;
    }
    return null;
  };

  // Get touched state for date range
  const getDateRangeTouched = () => {
    return (
      formikProps.touched?.probation_start_date ||
      formikProps.touched?.probation_end_date
    );
  };

  return (
    <>
      <div className="space-y-2">
        <DateRangeInput
          name="probation_date_range"
          label="Probation Period Range"
          value={getDateRangeValue()}
          onChange={handleDateRangeChange}
          error={getDateRangeError()}
          touch={getDateRangeTouched()}
          required={true}
          icon={<CalendarDays className="h-4 w-4" />}
          placeholder="Select Probation Date Range"
          minDate={formikProps.values?.joining_date} // Enforce that probation can't start before joining date
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name="probation_period"
          error={formikProps.errors?.probation_period}
          touch={formikProps.touched?.probation_period}
          value={formikProps.values?.probation_period}
          label="Probation Period"
          onChange={handlePeriodChange}
          required={true}
          disabled={true}
        />
      </div>
    </>
  );
};