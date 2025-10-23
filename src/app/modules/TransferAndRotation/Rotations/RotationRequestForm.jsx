import {
  saveJobRotation,
  getJobRotationReasons,
  getJobRotationRequests,
  getJobRotationById,
} from "app/hooks/transferAndRotation";
import { JobRotation } from "app/utils/Types/TransferAndRotation";
import { getEmployeeTenure } from "app/hooks/general";
import {
  TextAreaInput,
  TextInput,
  SelectInputComponent,
  RadioGroupInput,
  NumberInput,
  DateInput,
  TextInputDropdown,
} from "components/FormControl";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { GetEmployeeFilteredList, GetDispatchStateList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";
import { saveRotationReasons } from "app/hooks/transferAndRotation";

const RotationRequestForm = ({
  id,
  isOpen = true,
  setIsOpen = () => {},
  isAdminView,
  isBranchView,
  isDepartmentView,
  isEmployee = false,
}) => {
  const Employees = GetEmployeeFilteredList(
    false,
    isAdminView,
    isBranchView,
    isDepartmentView
  );
  const UserDetails = GetDispatchStateList("user_details", "emp");
  const Managers = GetDispatchStateList("reportingManagers", "emp") || [];
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Designations = GetDispatchStateList("designations", "common") || [];
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [JobRotationList, setJobRotationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formData, setFormData] = useState(JobRotation);
  const [RotationReasons, setRotationReasons] = useState([]);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Job Rotation" : "Add New Job Rotation",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode

  const fetchRotationData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available
      const rotationResonsResponse = await getJobRotationReasons();
      if (rotationResonsResponse && isMounted) {
        setRotationReasons(
          getDropdownList(rotationResonsResponse.results, "name", "name")
        );
      }
      const response = await getJobRotationRequests();
      if (response && isMounted) {
        setJobRotationList(response.results);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchRotationData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getJobRotationById(id);
      if (isMounted) {
        setFormData(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (isEmployee) {
      setSelectedEmployee(UserDetails);

      const fetchBranchTenure = async () => {
        try {
          const branch_tenure = await getBranchTenure(
            UserDetails.id,
            UserDetails.branch_id
          );
          setFormData((prev) => ({
            ...prev,
            employee: UserDetails.id,
            branch_tenure: branch_tenure,
          }));
        } catch (error) {
          console.error("Failed to fetch branch tenure:", error);
        }
      };

      fetchBranchTenure();
    }
  }, [isEmployee, UserDetails]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const getBranchTenure = async (employee_id, branch_id) => {
    try {
      const response = await getEmployeeTenure(employee_id);
      const branchTenure = response.find((obj) => obj.branch_id === branch_id);
      console.log(response, UserDetails, branchTenure);
      return `${branchTenure?.months || 0} months`;
    } catch (error) {
      console.log(error);
    }
    return "0 months";
  };

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true);
    try {
      const payload = {
        ...values,
        custom_reason:
          values.custom_reason === "other"
            ? values.custom_reason_text
            : values.custom_reason,
        created_by: isEmployee ? "employee" : "manager",
      };
      const response = await saveJobRotation(payload, id);
      if (response) {
        const reason = values.custom_reason?.trim().toLowerCase();
        if (reason && !isEmployee) {
          const exists = RotationReasons.some(
            (obj) => obj.value.trim().toLowerCase() === reason
          );
          if (!exists) {
            await saveRotationReasons({ name: reason });
          }
        }

        return {
          status: true,
          messageType: "SUCCESS",
          title: `Rotation Request Submitted`,
          description: `Rotation request for ${selectedEmployee?.name} is submitted successfully`,
        };
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} role.`;
      toast.error(errorMessage);
    } finally {
      setConfirmSave(false);
      setIsSubmittingForm(false);
    }
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const errors = {};
          return errors;
        },
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        renderUpdatedFormValues: setFormValues,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "employee",
                required: true,
                label: "Employee",
                options: Employees,
                disabled: isEmployee,
                onFieldUpdate: async (_, value, __, handleChange) => {
                  const employee = value
                    ? Employees.find((obj) => obj.value === value)
                    : {};
                  setSelectedEmployee(employee);
                  const branch_tenure = await getBranchTenure(
                    employee.id,
                    employee.branch_id
                  );
                  handleChange("branch_tenure", branch_tenure);
                },
              },
              {
                InputField: SelectInputComponent,
                name: "department",
                disabled: true,
                label: "Current Department",
                options: Departments,
                value: selectedEmployee.department_name,
              },
              {
                InputField: SelectInputComponent,
                name: "designation",
                disabled: true,
                label: "Current Designation",
                value: selectedEmployee.department_position,
                options: Designations,
              },
              {
                InputField: SelectInputComponent,
                name: "branch",
                disabled: true,
                label: "Current Branch",
                options: Branches,
                value: selectedEmployee.branch_id,
              },
              {
                InputField: SelectInputComponent,
                name: "reporting_manager",
                disabled: true,
                label: "Current Reporting Manager",
                placeholder: "Reporting Manager",
                value: selectedEmployee.direct_report,
                options: Managers,
              },
              {
                InputField: TextInput,
                name: "branch_tenure",
                disabled: true,
                label: "Branch Tenure",
              },
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: `Rotation Details`,
            InputFields: [
              {
                InputField: RadioGroupInput,
                label: "Rotation Type",
                name: "rotation_type",
                colsSpan: 2,
                required: true,
                options: [
                  { value: "temporary", label: "Temporary" },
                  { value: "permanent", label: "Permanent" },
                ],
              },
              {
                InputField: SelectInputComponent,
                name: "new_department",
                label: "New Department",
                options: Departments,
              },
              {
                InputField: SelectInputComponent,
                name: "new_designation",
                label: "New Designation",
                options: Designations,
              },
              {
                InputField: SelectInputComponent,
                name: "new_branch",
                label: "New Branch",
                options: Branches,
                required: true,
              },
              {
                InputField: SelectInputComponent,
                name: "new_reporting_manager",
                label: "New Reporting Manager",
                placeholder: "Reporting Manager",
                options: Managers,
              },
              {
                InputField: DateInput,
                label: "Effective Date",
                name: "effective_date",
                required: true,
                minDate: new Date(),
              },
              {
                InputField: DateInput,
                label: "Expiry Date",
                name: "rotation_expiry_date",
                required: formValues?.rotation_type === "temporary",
                renderCondition: formValues?.rotation_type === "temporary",
                minDate: formValues?.effective_date || new Date(),
              },
              {
                InputField: NumberInput,
                label: "Rotation Cap Time",
                name: "rotation_cap_time",
                required: true,
                maxLength: 4,
              },
              {
                InputField: TextInputDropdown,
                name: "custom_reason",
                required: true,
                label: "Reason",
                options: [
                  ...RotationReasons,
                  { label: "Other", value: "other" },
                ],
              },
              ...(formValues?.custom_reason === "other"
                ? [
                    {
                      InputField: TextInput,
                      name: "custom_reason_text",
                      label: "Other Reason",
                      colsSpan: 2,
                      rows: 2,
                    },
                  ]
                : []),
              {
                InputField: TextAreaInput,
                name: "notes",
                colsSpan: 2,
                rows: 2,
                label: "Notes",
              },
            ],
          },
        ],
      }}
    />
  );
};

export default RotationRequestForm;
