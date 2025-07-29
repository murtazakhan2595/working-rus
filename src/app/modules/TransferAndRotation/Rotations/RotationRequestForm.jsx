import {
    saveUpdateUserRole,
    getUserRoleList,
    saveUpdateUserRolePermission,
    getUserRoleData,
} from "app/hooks/rolesPermisions";
import { UserRole } from "app/utils/Types/RolesPermission";
import {
    TextAreaInput,
    TextInput,
    SelectInputComponent,
    CheckBoxInputTree,
    RadioGroupInput
} from "components/FormControl";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { GetEmployeeFilteredList, GetDispatchStateList } from "utils/Lists";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateInput } from "components/FormControl";
import { NumberInput } from "components/FormControl";

const RotationRequestForm = ({ id, isOpen = true, setIsOpen = () => { }, isAdminView, isBranchView, isDepartmentView }) => {
    const Employees = GetEmployeeFilteredList(
        false,
        isAdminView,
        isBranchView,
        isDepartmentView
    );
    const Managers = GetDispatchStateList("reportingManagers", "emp") || []
    const Departments = GetDispatchStateList("departments", "common") || []
    const Branches = GetDispatchStateList("branches", "common") || []
    const Designations = GetDispatchStateList("designations", "common") || []
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [confirmSave, setConfirmSave] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [UserRoles, setUserRoles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const FormSheetData = {
        triggerText: "",
        title: isEditMode ? "Edit Role" : "Add New Role",
        description: null,
        footer: null,
    };
    // Initialize form data with role values if in edit mode
    const [formData, setFormData] = useState(UserRole);

    const fetchUserRolesData = async (isMounted) => {
        try {
            setIsLoading(true);
            // Add organizationId to filter if available

            const response = await getUserRoleList();

            if (isMounted) {
                setUserRoles(
                    response.results?.map((item) => {
                        return { name: item.name, id: item.id };
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchUserRolesData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    const fetchData = async (isMounted, id) => {
        try {
            setIsLoading(true);
            const response = await getUserRoleData(id);
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

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            // Save role
            const response = await saveUpdateUserRole(values, id);
            if (response) {
                if (response.id) {
                    await saveUpdateUserRolePermission(
                        {
                            ...formValues,
                            role: response.id,
                            id: formData.role_permission_id,
                        },
                        formData.role_permission_id
                    );
                }
                // Ensure table is reloaded
                toast.success(
                    `User Role ${isEditMode ? "Updated" : "Added"} Successfully!`,
                    {
                        position: toast.POSITION.TOP_RIGHT,
                    }
                );
                handleClose();
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
                    const errors = validateUserRoleFormSchema(values);
                    return errors;
                },
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
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
                                onFieldUpdate: async (_, value) => {
                                    const employee = value
                                        ? Employees.find((obj) => obj.value === value)
                                        : {};
                                    setSelectedEmployee(employee);
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
                                options: Departments,
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
                                placeholder: "Reporting Manager",
                                value: selectedEmployee.branch_tenure,
                            },

                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Rotation Details`,
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "new_department",
                                label: "New Department",
                                options: Departments,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "designation",
                                label: "New Designation",
                                options: Designations,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "new_branch",
                                label: "New Branch",
                                options: Departments,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "reporting_manager",
                                label: "New Reporting Manager",
                                placeholder: "Reporting Manager",
                                options: Managers,
                            },
                            {
                                InputField: DateInput,
                                label: 'Effective Date',
                                name: 'effective_date',
                            },
                            {
                                InputField: RadioGroupInput,
                                label: 'Rotation Type',
                                name: 'rotation_type',
                                colsSpan: 2,
                                options: [{ value: "temporary", label: "Temporary" }, { value: "permanent", label: "Permanent" },]
                            },
                            {
                                InputField: DateInput,
                                label: 'Rotation Type',
                                name: 'rotation_expiry_date',
                                required: formValues?.rotation_type?.temporary,
                            },
                            {
                                InputField: NumberInput,
                                label: 'Rotation Cap Time',
                                name: 'rotation_cap_time',
                            },
                            {
                                InputField: TextInput,
                                name: "name",
                                required: true,
                                label: "Role Name",
                            },
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
