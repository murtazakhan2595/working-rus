import AddCustomShift from "./AddCustomShift";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmployeeInformation } from "app/utils/Types/Employee";
import { getOnboardingDocument } from "app/hooks/officeSetting";
import {
  getEmployeeInformation,
  mapEmployeePayloadData,
  mapEmployeeDocsChecklist,
  mapEmployeeApplicantData,
} from "app/utils/MappingObjects/mapEmployeeData";
import {
  getEmployeeData,
  getNewEmployeeCode,
  saveEmployeeWorkInformationData,
} from "app/hooks/employee";
import {
  fetchEmployees,
  fetchReportingManagers,
  fetchEmployeesDetail,
} from "state/slices/EmpSlice";
import { validationEmployeeInfoFormSchema } from "app/utils/FormSchema/employeeFormSchema";
import Config from "constants/config";
import {
  GenderOptions,
  BloodGroupOptions,
  employeeStatus,
  workplaceTypes,
  countriesCallingCodes,
  countriesList,
  SalaryTypeOptions,
} from "data/Data";
import OnboardingChecklistSection from "./OnboardingChecklistSection";
import { getApplicantsData, getJobTypeList, saveUpdateApplication } from "app/hooks/talentSphere";

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
  NumberInput,
  DateRangeInput,
} from "components/FormControl";
import { GetDefaultUserRole } from "utils/getValuesFromTables";
import { formatDaysDuration } from "utils/DateTimeUtils";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { PageLoader, SheetUI } from "components";
import { getShift } from "app/hooks/attendance";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import moment from "moment";
import { validateOnboardingDocuments } from "app/utils/FormSchema/employeeFormSchema";
import { getEmployeeDocsChecklist } from "app/hooks/employee";
import { saveEmpoyeeDocBulk } from "app/hooks/employee";
import { useSelector } from "react-redux";
import { ReligionList } from "data/Data";

const EmployeeForm = ({ id = null, setIsOpen = () => { }, SalarySetupAllowed, formVariant = "", applicant_id = null }) => {
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
  const [FormValues, setFormvalues] = useState({});
  const [empId, setEmpId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [JobTypeList, setJobTypeList] = useState([]);
  const [customShiftData, setCustomShiftData] = useState(null);
  const [probation_period, setProbationPeriod] = useState(null);
  const [confirmation_date, setConfirmationDate] = useState(null);

  const getShiftList = async () => {
    const shiftData = await getShift();
    const job_types = await getJobTypeList({ filterData: {} });
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
    setJobTypeList(job_types.results || []);

  };

  const initializeFormData = async (isMounted) => {
    try {
      if (isMounted) {
        const updatedFormData = { ...EmployeeInformation };
        if (!empId) {
          const response = await getNewEmployeeCode();
          setEmpId(response);
          updatedFormData["serial_number"] = response;
        }

        // 🔧 Initialize onboarding documents here to prevent race condition
        try {
          const documentResponse = await getOnboardingDocument();
          if (documentResponse?.results) {
            const onboardingDocs = documentResponse.results.map((template) => ({
              templateId: template.id,
              name: template.name,
              isActive: false,
              hasExpiryDate: false,
              expiryDate: null,
              attachment: [],
            }));
            updatedFormData["onboardingDocuments"] = onboardingDocs;
          }
        } catch (error) {
          console.error(
            "❌ Parent: Error initializing onboarding docs:",
            error
          );
        }

        if (default_user) {
          updatedFormData["user_role"] = [default_user];
          setFormData(updatedFormData);
        }
      }
    } catch (error) {
      console.error("ERROR--", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
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
        }
      } catch (error) {
        console.error("ERROR--", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchApplicantData = async (isMounted) => {
      try {
        setIsLoading(true);
        const response = await getApplicantsData(applicant_id);
        const employeeData = await mapEmployeeApplicantData(response, Designations);
        const checklistData = await getEmployeeDocsChecklist({
          filterData: { employee_id: id },
        });
        const serial_number = await getNewEmployeeCode();
        setEmpId(serial_number);
        if (isMounted) {
          setFormData({
            ...EmployeeInformation,
            ...employeeData,
            serial_number,
            onboardingDocuments: checklistData?.results || [],
          });
          // setEmpId(`TXB-${employeeData.id.toString().padStart(4, "0")}`);
        }
      } catch (error) {
        console.error("ERROR--", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isMounted) {
      getShiftList();
    }
    if (id) fetchEmployeeData(isMounted);
    else if (applicant_id) fetchApplicantData(isMounted)
    else initializeFormData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [id, default_user]);

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
      debugger
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
      }
    } catch (error) {
      console.error("Error saving custom shift schedule:", error);
      toast.error("Failed to save custom shift schedule");
    }
  };
  const handleSubmit = async (data) => {
    const payload = { ...data, user_role: [...(data.user_role || []), default_user] }
    const employeePayload = mapEmployeePayloadData(payload);
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
        if (customShiftData && employeeId) {
          await saveCustomShiftSchedule(employeeId, customShiftData);
        }
        dispatch(fetchEmployees());
        dispatch(fetchReportingManagers());
        dispatch(fetchEmployeesDetail());
        if (applicant_id) {
          await saveUpdateApplication({ is_employee_created: true }, applicant_id);
        }
        if (id) {
          // Employee update flow
          return {
            status: true,
            messageType: "SUCCESS",
            title: `Employee Updated Successfully`,
            description: `Employee data of ${data.first_name} ${data.last_name} has been updated successfully.`,
          };
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
          return {
            status: true,
            messageType: "SUCCESS",
            title: `Form Submitted Successfully`,
            description: `${data.first_name} ${data.last_name} has been successfully registered and email has been sent to ${data.work_email}`,
          };
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
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!applicant_id)
      navigate("/profile-management");
  };

  if (isLoading) {
    return <PageLoader />;
  }
  const FormColumns = formVariant === 'sheet' ? 2 : 3;
  return (
    <>
      <SheetUI
        isOpen={true}
        setIsOpen={handleClose}
        variant={formVariant}
        sheetConfig={{ title: 'Create Employee' }}
        formConfig={{
          initialValues: formData,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          renderUpdatedFormValues: setFormvalues,
          DataList: Employees,
          validateFormSchema: (values) => {
            const errors = validationEmployeeInfoFormSchema(
              values,
              id ? true : false
            );
            const documentErrors = validateOnboardingDocuments(
              values?.onboardingDocuments
            );
            const finalErrors = {
              ...errors,
              ...(documentErrors ? documentErrors : {}),
            };

            return finalErrors;
          },
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: FormColumns,
          disableSubmit: isLoading,
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Employee Details`,
              InputFields: [
                {
                  InputField: TextInput,
                  name: "serial_number",
                  required: true,
                  label: "Employee ID",
                  disabled: true,
                },
                {
                  InputField: TextInput,
                  name: "username",
                  required: true,
                  label: "User Name",
                  validateDuplicate: true,
                },
                {
                  InputField: TextInput,
                  name: "first_name",
                  required: true,
                  label: "First Name",
                },
                {
                  InputField: TextInput,
                  name: "last_name",
                  required: true,
                  label: "Last Name",
                },
                {
                  InputField: EmailInput,
                  name: "work_email",
                  required: true,
                  label: "Email",
                  validateDuplicate: true,
                },
                {
                  InputField: PasswordInput,
                  name: "password",
                  required: !id,
                  label: "Password",
                  maxLength: 20,
                },
                {
                  InputField: PhoneNumberInput,
                  name: "mobile_no",
                  required: true,
                  label: "Contact no.",
                  countryCodeName: "country_code",
                  countryOptions: countriesCallingCodes,
                },
                {
                  InputField: SelectInputComponent,
                  name: "blood_group",
                  options: BloodGroupOptions,
                  required: false,
                  label: "Blood Group",
                },
                {
                  InputField: SelectInputComponent,
                  name: "gender",
                  options: GenderOptions,
                  required: false,
                  label: "Gender",
                },
                {
                  InputField: SelectInputComponent,
                  name: "religion",
                  options: ReligionList,
                  required: false,
                  label: "Religion",
                },
                {
                  InputField: TextInput,
                  name: "po_box_number",
                  required: false,
                  label: "PO Box Number",
                },
                {
                  InputField: TextAreaInput,
                  name: "residential_address",
                  required: true,
                  label: "Residential Address",
                  colsSpan: FormColumns,
                  maxRows: 3,
                },
                {
                  InputField: TextAreaInput,
                  name: "permanent_address",
                  required: false,
                  label: "Permanent Address",
                  colsSpan: FormColumns,
                  maxRows: 3,
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: `Official Information`,
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "department_name",
                  options: Departments,
                  required: true,
                  label: "Department",
                },
                {
                  InputField: SelectInputComponent,
                  name: "branch_id",
                  options: Branches,
                  required: true,
                  label: "Branch",
                },
                {
                  InputField: SelectInputComponent,
                  name: "employee_location",
                  options: countriesList,
                  required: true,
                  label: "Employee Location",
                },
                {
                  InputField: SelectInputComponent,
                  name: "nationality",
                  options: countriesList,
                  required: true,
                  label: "Nationality",
                },
                {
                  InputField: SelectInputComponent,
                  name: "national_service_status",
                  options: [
                    { value: "COMPLETED", label: "Completed" },
                    { value: "NOT_COMPLETED", label: "Not Completed" },
                  ],
                  required: true,
                  label: "National Service Status",
                  renderCondition:
                    FormValues.nationality === "United Arab Emirates",
                },
                {
                  InputField: SelectInputComponent,
                  name: "department_position",
                  options: Designations,
                  required: true,
                  label: "Designation",
                },
                {
                  InputField: SelectInputComponent,
                  name: "employee_type",
                  options: JobTypeList,
                  required: true,
                  label: "Employee Type",
                },
                {
                  InputField: SelectInputComponent,
                  name: "employee_status",
                  options: employeeStatus,
                  required: true,
                  label: "Employee Status",
                },
                {
                  InputField: SelectInputComponent,
                  name: "employee_work_type",
                  options: workplaceTypes,
                  required: true,
                  label: "Employee Work Type",
                },
                {
                  InputField: SelectInputComponent,
                  name: "direct_report",
                  options: Managers,
                  required: false,
                  label: "Direct Report",
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "indirect_report",
                  options: Managers,
                  required: false,
                  label: "Indirect Report",
                },
                {
                  InputField: DateInput,
                  name: "joining_date",
                  required: true,
                  label: "Joining Date",
                  onFieldUpdate: async (_, value, __, handleChange) => {
                    await handleChange("probation_date_range", value);
                  },
                },
                {
                  InputField: DateRangeInput,
                  name: "probation_date_range",
                  required: true,
                  label: "Probation Date Range",
                  minDate: FormValues.joining_date,
                  onFieldUpdate: async (_, value) => {
                    const [start_date, end_date] = value?.split(",") || "";
                    if (end_date && start_date) {
                      setConfirmationDate(moment(end_date).add(1, "days").format("YYYY-MM-DD"));
                      setProbationPeriod(formatDaysDuration(start_date, end_date));
                    }
                  },
                },
                {
                  InputField: TextInput,
                  name: "probation_period",
                  disabled: true,
                  value: probation_period || FormValues.probation_period,
                  label: "Probation Period",
                },
                {
                  InputField: DateInput,
                  name: "confirmation_date",
                  disabled: true,
                  value: confirmation_date || FormValues.confirmation_date,
                },
                {
                  InputField: CheckBoxInput,
                  name: "active_contract",
                  label: "Contract Employment",
                  colsSpan: FormColumns,
                },
                {
                  InputField: DateInput,
                  name: "contract_start_date",
                  required: true,
                  label: "Contract Start Date",
                  renderCondition: FormValues.active_contract,
                },
                {
                  InputField: DateInput,
                  name: "contract_end_date",
                  required: true,
                  label: "Contract End Date",
                  renderCondition: FormValues.active_contract,
                },
                {
                  InputField: TextAreaInput,
                  name: "jd_file",
                  required: false,
                  label: "Job Description",
                  maxRows: 5,
                  maxLength: 1000,
                  colsSpan: FormColumns,
                },
                {
                  InputField: TextAreaInput,
                  name: "kpi_file",
                  required: false,
                  label: "Job KPIs",
                  maxRows: 5,
                  maxLength: 1000,
                  colsSpan: FormColumns,
                },
              ],
            },
            ...(Config.SHIFT_CALENDAR
              ? [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Shift Details`,
                  InputFields: [
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
                      colsSpan: 2,
                    },
                  ],
                },
              ]
              : []),
            ...(SalarySetupAllowed
              ? [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Salary Details`,
                  InputFields: [
                    {
                      InputField: SelectInputComponent,
                      name: "salary_type",
                      options: SalaryTypeOptions,
                      required: true,
                      label: "Salary Type",
                    },
                    {
                      InputField: NumberInput,
                      name: "salary",
                      options: shiftList,
                      required: true,
                      label: `Employee ${FormValues.salary_type === "hourly"
                        ? "Hourly"
                        : "Monthly"
                        } Salary`,
                    },
                  ],
                },
              ]
              : []),
            {
              sheetCardExtension: true,
              sheetCardTitle: `Onboarding Checklist`,
              InputFields: [
                {
                  InputField: OnboardingChecklistSection,
                  name: "onboardingDocuments",
                  colsSpan: FormColumns,
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: `Third Party Integration`,
              InputFields: [
                {
                  InputField: TextInput,
                  name: "biometric_id",
                  required: false,
                  label: "Biometric Id",
                  validateDuplicate: true,
                },
              ],
            },
          ],
        }}
      />
    </>
  );
};

export default EmployeeForm;
