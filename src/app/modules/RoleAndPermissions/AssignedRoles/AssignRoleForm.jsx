import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { SheetUI } from "components";
import {
  TextInput,
  SelectInputComponent,
  SelectMultiInputComponent,
} from "components/FormControl";
import { saveAssignedRole, getUserRoleList } from "app/hooks/rolesPermisions";
import { useSelector } from "react-redux";
import { GetDefaultUserRole } from "utils/getValuesFromTables";

const AssignRoleForm = ({ isOpen, setIsOpen, edit, reload }) => {
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const isEditMode = Boolean(edit?.data);
  const default_role = GetDefaultUserRole()?.id;

  // Get employees from Redux state
  const employees = useSelector((state) => state.emp.employees);

  // Initialize form data with assigned role values if in edit mode
  const [formData, setFormData] = useState({});

  // Load available roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getUserRoleList({
          filterData: { status: "active" },
        });
        setAvailableRoles(response.results);
      } catch (error) {
        toast.error("Failed to load roles");
        console.error("Error loading roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (!edit?.data || typeof edit.data !== "object") return;

    const {
      employee,
      user_role,
      id,
      first_name,
      last_name,
      serial_number,
      department_name,
      branch,
      email,
    } = edit.data;

    // Safely extract and prepare formData
    const updatedFormData = {
      ...edit.data,
      employee: employee?.id || "",
      roles: Array.isArray(user_role)
        ? user_role.filter((role) => role !== default_role)
        : [],
    };
    setFormData(updatedFormData);

    // Set employeeData safely
    if (id && first_name && last_name && serial_number) {
      setEmployeeData({
        value: id,
        label: `${first_name} ${last_name} (${serial_number})`,
        employeeId: id,
        department: department_name || "",
        branch: branch || "",
        email: email || "",
      });
    }
  }, [edit?.data]);

  const validateForm = (values) => {
    const errors = {};

    if (!employeeData && !values.employee) {
      errors.employee = "Employee is required";
    }

    // if (!values.roles || values.roles.length === 0) {
    //   errors.roles = "At least one role must be selected";
    // }

    return errors;
  };

  const handleSubmit = async (values) => {
    const payload = {
      employeeId: employeeData?.id || employeeData?.value || values.employee,
      roles: [...values.roles,default_role],
    };

    setFormValues({ ...values, ...payload });
    setConfirmSave(true);
  };

  const confirmSubmit = async () => {
    if (!formValues || (!employeeData && !formValues.employeeId)) return;

    try {
      const payload = {
        user_role: formValues.roles,
      };

      const response = await saveAssignedRole(formValues.employeeId, payload);

      if (response) {
        toast.success(
          `Roles ${isEditMode ? "Updated" : "Assigned"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);

        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "assign"} roles.`;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Transform employees for SelectInputComponent
  const employeeOptions = employees.map((emp) => ({
    value: emp.value,
    label: `${emp.label} - ${emp.username}`,
    department: emp.department || "N/A",
    branch: emp.branch || "N/A",
    email: emp.email || "",
  }));

  const roleOptions = React.useMemo(() => {
    if (!Array.isArray(availableRoles) || availableRoles.length === 0)
      return [];

    return availableRoles
      .filter(
        (role) =>
          role &&
          typeof role === "object" &&
          role.id !== 1 &&
          role.name !== "Super Admin" &&
          role.id !== default_role
      )
      .map((role) => ({
        value: role.id,
        label: role.name,
        description: role.description || "",
      }));
  }, [availableRoles, default_role]);

  const FormSheetData = {
    triggerText: "Assign Role",
    title: `${isEditMode ? "Edit" : "Assign"} Roles`,
    description: null,
    footer: null,
  };

  // Get employee display values with fallbacks
  const getEmployeeDisplayValues = () => {
    if (!employeeData) return {};

    return {
      employee_name: employeeData.name || employeeData.label || "N/A",
      employee_id:
        employeeData.serial_number ||
        employeeData.employeeId ||
        employeeData.empId ||
        "N/A",
      employee_department:
        employeeData.department_name || employeeData.department || "N/A",
      employee_branch: employeeData.branch || "N/A",
    };
  };

  // Create employee fields array based on mode and employee data
  const getEmployeeFields = () => {
    const baseFields = [];

    if (isEditMode) {
      // In edit mode, just show the employee name
      const displayValues = getEmployeeDisplayValues();
      baseFields.push({
        InputField: TextInput,
        name: "employee_display",
        label: "Employee",
        disabled: true,
        colsSpan: 2,
        value: `${displayValues.employee_name} (${displayValues.employee_id})`,
      });
    } else {
      // In create mode, show the select dropdown
      baseFields.push({
        InputField: SelectInputComponent,
        name: "employee",
        required: true,
        label: "Select Employee",
        options: employeeOptions,
        placeholder: "Select an employee",
        colsSpan: 2,
        onFieldUpdate: (field, value) => {
          // Find the full employee data
          const selectedEmp = employees.find((emp) => emp.value === value);
          if (selectedEmp) {
            setEmployeeData(selectedEmp);
          }
        },
      });
    }

    // Add employee details fields if employee is selected
    // if (employeeData) {
    //   const displayValues = getEmployeeDisplayValues();

    //   baseFields.push(
    //     {
    //       InputField: TextInput,
    //       name: "employee_name_display",
    //       label: "Name",
    //       disabled: true,
    //       colsSpan: 1,
    //       value: displayValues.employee_name,
    //       placeholder: displayValues.employee_name || "N/A",
    //     },
    //     {
    //       InputField: TextInput,
    //       name: "employee_id_display",
    //       label: "Employee ID",
    //       disabled: true,
    //       colsSpan: 1,
    //       value: displayValues.employee_id,
    //       placeholder: displayValues.employee_id || "N/A",
    //     },
    //     {
    //       InputField: TextInput,
    //       name: "department_name",
    //       label: "Department",
    //       disabled: true,
    //       colsSpan: 1,
    //       value: displayValues.employee_department,
    //       placeholder: displayValues.employee_department || "N/A",
    //     },
    //     {
    //       InputField: TextInput,
    //       name: "employee_branch_display",
    //       label: "Branch",
    //       disabled: true,
    //       colsSpan: 1,
    //       value: displayValues.employee_branch,
    //       placeholder: displayValues.employee_branch || "N/A",
    //     }
    //   );

    //   // Add clear button for create mode
    //   if (!isEditMode) {
    //     baseFields.push({
    //       InputField: ({ onChange }) => (
    //         <div className="flex justify-end col-span-2">
    //           <Button
    //             type="button"
    //             variant="outline"
    //             size="sm"
    //             onClick={() => {
    //               setEmployeeData(null);
    //               onChange("employee", "");
    //             }}
    //           >
    //             Clear
    //           </Button>
    //         </div>
    //       ),
    //       name: "clear_button",
    //       colsSpan: 2,
    //     });
    //   }
    // }

    return baseFields;
  };

  return (
    <>
      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant=""
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: formData,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          validateFormSchema: validateForm,
          submitButtonText: isEditMode ? "Update" : "Assign",
          cancelButtonText: "Cancel",
          columns: 2,
          renderUpdatedFormValues: setFormValues,
          formFiels: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Employee Selection",
              InputFields: getEmployeeFields(),
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: "Role Selection",
              InputFields: [
                {
                  InputField: SelectMultiInputComponent,
                  name: "roles",
                  // required: true,
                  label: "Select Roles",
                  options: roleOptions,
                  placeholder: "Select roles",
                  colsSpan: 2,
                },
              ],
            },
          ],
        }}
      ></SheetUI>

      {confirmSave && (
        <AlertDialogue
          title="Confirm Role Assignment"
          description={`Are you sure you want to ${
            isEditMode ? "update" : "assign"
          } these roles to ${employeeData?.name || employeeData?.label}?`}
          isOpen={confirmSave}
          setIsOpen={setConfirmSave}
          handleContinue={() => {
            confirmSubmit();
            setConfirmSave(false);
          }}
        />
      )}
    </>
  );
};

export default AssignRoleForm;
