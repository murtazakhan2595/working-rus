import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import ProbationDateRange from "./ProbationDateRange";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeInformation } from "app/utils/Types/Employee";
import { getOnboardingDocument } from "app/hooks/officeSetting";

import {
  getEmployeeInformation,
  mapEmployeePayloadData,
  mapEmployeeDocsChecklist,
} from "app/utils/MappingObjects/mapEmployeeData";
import {
  getEmployeeData,
  getNewEmployeeCode,
  saveEmployeeWorkInformationData,
  saveEmployeeDocChecklist,
  getDocumentChecklist,
} from "app/hooks/employee";
import {
  fetchEmployees,
  fetchReportingManagers,
  fetchEmployeesDetail,
} from "state/slices/EmpSlice";
import { validationEmployeeInfoFormSchema } from "app/utils/FormSchema/employeeFormSchema";
import { DisbursementTypeOptions } from "data/Data";
import Config from "constants/config";
import {
  GenderOptions,
  BloodGroupOptions,
  employeeStatus,
  jobRoles,
  workplaceTypes,
  UserRoles,
  countriesCallingCodes,
  countriesList,
  SalaryTypeOptions,
} from "data/Data";
import OnboardingChecklistSection from "./OnboardingChecklistSection";
import ThirdPartIntegration from "./ThirdPartIntegration";

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
import ImportEmployeesButton from "../Sections/ImportEmployeesButton"; // Adjust the path as needed

import { getEmployeeid, GetDefaultUserRole } from "utils/getValuesFromTables";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { PageLoader } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { getShift } from "app/hooks/attendance";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import EmployeeCustomShiftModal from "./EmployeeCustomShiftModal";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";
import { cn } from "src/@/lib/utils";
import { CalendarDays } from "lucide-react";
import { DateRangeInput } from "components/FormControl";
import { validateOnboardingDocuments } from "app/utils/FormSchema/employeeFormSchema";
import { getEmployeeDocsChecklist } from "app/hooks/employee";
import { saveEmpoyeeDocBulk } from "app/hooks/employee";
import { useSelector } from "react-redux";
const EmployeeForm = ({
  setShowFormSubmittedModal = () => {},
  setEmail = () => {},
  id,
  setIsOpen = () => {},
  discard = false,
  SalarySetupAllowed,
}) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Managers = useSelector((state) => state.emp.reportingManagers);
  const Branches = useSelector((state) => state.common.branches);
  const Designations = useSelector((state) => state.common.designations);
  const Departments = useSelector((state) => state.common.departments);
  const Employees = useSelector((state) => state.emp.employees);
  const userProfile = useSelector((state) => state.user.userProfile);

  const default_user = GetDefaultUserRole()?.id;
  const [formData, setFormData] = useState({});
  const [empId, setEmpId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [usernameAlreadyExist, setUsernameAlreadyExist] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [addShift, setAddShift] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [shiftSelect, setShiftSelect] = useState(false);
  const [customShiftData, setCustomShiftData] = useState(null);

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

  const fetchEmployeeData = async (isMounted) => {
    try {
      setIsLoading(true);
      const response = await getEmployeeData(id);
      const employeeData = await getEmployeeInformation(response);
      const checklistData = await getEmployeeDocsChecklist({
        filterData: { employee_id: id },
      });
      if (isMounted) {
        setFormData({
          ...employeeData,
          onboardingDocuments: checklistData?.results || [],
        });
        // setEmpId(`TXB-${employeeData.id.toString().padStart(4, "0")}`);
        setEmpId(response.serial_number);
        validateEmail(employeeData.work_email);
        validateUsername(employeeData.username);
        if (employeeData.shift_assignment) {
          setShiftSelect(true);
        }
        getShiftList();
      }
    } catch (error) {
      console.error("ERROR--", error);
    } finally {
      setIsLoading(false);
    }
  };
  const initializeFormData = async (isMounted) => {
    try {
      if (isMounted) {
        if (!empId) {
          const response = await getNewEmployeeCode();
          setEmpId(response);
        }

        // 🔧 Initialize onboarding documents here to prevent race condition
        let onboardingDocs = [];
        try {
          const documentResponse = await getOnboardingDocument();
          if (documentResponse?.results) {
            onboardingDocs = documentResponse.results.map((template) => ({
              templateId: template.id,
              name: template.name,
              isActive: false,
              hasExpiryDate: false,
              expiryDate: null,
              attachment: [],
            }));
          }
        } catch (error) {
          console.error(
            "❌ Parent: Error initializing onboarding docs:",
            error
          );
        }

        if (default_user) {
          const updated = {
            ...EmployeeInformation,
            user_role: [default_user],
            onboardingDocuments: onboardingDocs, // Set from parent
          };
          setFormData(updated);
        }

        getShiftList();
      }
    } catch (error) {
      console.error("ERROR--", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchEmployeeData(isMounted);
    else initializeFormData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [id, default_user]);

  const validateEmail = (email) => {
    if (!Employees || !Array.isArray(Employees) || Employees.length === 0)
      return false;
    const employee = Employees.filter(
      (emp) => emp.work_email === email && parseInt(emp.id) !== parseInt(id)
    );
    if (employee && employee?.length > 0) {
      setEmailAlreadyExist(true);
    } else {
      setEmailAlreadyExist(false);
    }
  };
  const validateUsername = (username) => {
    if (!Employees || !Array.isArray(Employees) || Employees.length === 0)
      return false;
    const employee = Employees.filter(
      (emp) => emp.username === username && parseInt(emp.id) !== parseInt(id)
    );
    if (employee && employee?.length > 0) {
      setUsernameAlreadyExist(true);
    } else {
      setUsernameAlreadyExist(false);
    }
  };

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
        status: "Approved", // Direct approval for employee creation
        is_off_day: shiftData.dailySchedule.some((day) => day.isOff),
      };

      const response = await saveShiftSchedule(payload);
      if (response) {
        console.log(
          "Custom shift schedule saved successfully for employee:",
          employeeId
        );
      }
    } catch (error) {
      console.error("Error saving custom shift schedule:", error);
      toast.error("Failed to save custom shift schedule");
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
        const checklistData = mapEmployeeDocsChecklist({
          onboardingDocuments: data.onboardingDocuments,
          employeeId,
        });
        await saveEmpoyeeDocBulk(checklistData);

        // Save custom shift schedule if configured
        if (customShiftData && !id) {
          await saveCustomShiftSchedule(employeeId, customShiftData);
        }
        dispatch(fetchEmployees());
        dispatch(fetchReportingManagers());
        dispatch(fetchEmployeesDetail());
        if (id) {
          // Employee update flow
          toast.success("Employee Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/profile-management");
        } else {
          if (SalarySetupAllowed) {
            const employeePayroll = {
              salary_type: data.salary_type,
              is_new: true,
            };
            // Determine the payroll data structure based on salary type
            if (data.salary_type === "hourly") {
              employeePayroll.hourly_rate = data.salary;
            } else {
              employeePayroll.ctc = data.salary;
              employeePayroll.basic_salary = data.salary;
            }
            // Employee creation flow
            await saveEmployeePayroll({
              ...employeePayroll,
              employee: employeeId,
            });
          }
          toast.success("Employee Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowFormSubmittedModal && setShowFormSubmittedModal(true);
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
        className={`flex flex-col   ${window.location.pathname.substring(1)}`}
      >
        <div className="flex-grow ">
          <div className="p-0">
            <Formik
              initialValues={formData}
              innerRef={formRef}
              enableReinitialize={true}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                try {
                  const errors = validationEmployeeInfoFormSchema(
                    values,
                    id ? true : false
                  );
                  const documentErrors = validateOnboardingDocuments(
                    values?.onboardingDocuments
                  );

                  if (values.work_email && emailAlreadyExist) {
                    errors.work_email = "Email already exist";
                  }
                  if (values.username && usernameAlreadyExist) {
                    errors.username = "Username already exist";
                  }
                  const finalErrors = {
                    ...errors,
                    ...(documentErrors ? documentErrors : {}),
                  };
                  console.error(finalErrors, values, "Errors");

                  return finalErrors;
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
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
                          label={"Residential Address"}
                          required={true}
                          maxRows={3}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      {/* New UAE Address Fields */}
                      <div className="col-span-1 space-y-2 xl:col-span-3 lg:col-span-2 md:col-span-2">
                        <TextAreaInput
                          name={"permanent_address"}
                          error={props.errors?.permanent_address}
                          touch={props.touched?.permanent_address}
                          value={props.values?.permanent_address}
                          label={"Permanent Address"}
                          required={false}
                          maxRows={3}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          name={"po_box_number"}
                          error={props.errors?.po_box_number}
                          touch={props.touched?.po_box_number}
                          value={props.values?.po_box_number}
                          label={"PO Box Number"}
                          required={false}
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
                          options={Departments}
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
                          name={"branch_id"}
                          options={Branches}
                          error={props.errors?.branch_id}
                          touch={props.touched.branch_id}
                          value={props.values.branch_id}
                          required={true}
                          label={"Branch"}
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
                          name={"nationality"}
                          options={countriesList}
                          error={props.errors.nationality}
                          touch={props.touched.nationality}
                          value={props.values.nationality}
                          required={true}
                          label={"Nationality"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <SelectInputComponent
                          name={"department_position"}
                          options={Designations}
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
                          options={Managers}
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
                          options={Managers}
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
                        value={customShiftData ? true : addShift}
                        onChange={(name, value) => {
                          if (!customShiftData) {
                            setAddShift(value);
                          } else if (!value) {
                            // Allow unchecking to clear custom shift
                            setCustomShiftData(null);
                            setAddShift(false);
                          } else {
                            setAddShift(true);
                          }
                        }}
                      />
                      {customShiftData && (
                        <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                          <div className="text-sm font-medium text-purple-800">
                            ✓ Custom Schedule Configured:{" "}
                            {customShiftData.scheduleName}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            Weekly Hours:{" "}
                            {customShiftData.totalHours?.weekly?.toFixed(1) ||
                              0}{" "}
                            hours
                          </div>
                          <button
                            type="button"
                            className="text-xs text-purple-600 hover:text-purple-800 mt-1"
                            onClick={() => setAddShift(true)}
                          >
                            Edit Schedule
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {SalarySetupAllowed && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Salary Details</h3>
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <SelectInputComponent
                            name={"salary_type"}
                            options={SalaryTypeOptions}
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
                      maxLength={1000}
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
                      maxLength={1000}
                      required={false}
                      maxRows={5}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <OnboardingChecklistSection formikProps={props} />
                  </div>
                  <div className="space-y-4">
                    <ThirdPartIntegration formikProps={props} />
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
                      <Button
                        type="submit"
                        size="lg"
                        variant="default"
                        onClick={(e) => {
                          e.preventDefault();
                          validateEmail(props.values.work_email);
                          validateUsername(props.values?.username);
                          props.handleSubmit();
                        }}
                      >
                        {id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </div>
                  {addShift && (
                    <EmployeeCustomShiftModal
                      isOpen={addShift}
                      setIsOpen={setAddShift}
                      onShiftDataSave={(shiftData) => {
                        setCustomShiftData(shiftData);
                        setAddShift(false);
                      }}
                      existingShiftData={customShiftData}
                    />
                  )}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeForm;
