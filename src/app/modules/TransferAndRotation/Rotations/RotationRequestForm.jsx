import { saveJobRotation, getJobRotationReasons, getJobRotationRequests, getJobRotationById } from 'app/hooks/transferAndRotation';
import { JobRotation } from "app/utils/Types/TransferAndRotation";
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
                setRotationReasons(rotationResonsResponse.results);
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

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, created_by: "manager" };
            const response = await saveJobRotation(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Rotation Request Submitted`,
                    description: `Rotation request for ${selectedEmployee?.name} is submitted successfully`,
                }
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
                                name: "new_designation",
                                label: "New Designation",
                                options: Designations,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "new_branch",
                                label: "New Branch",
                                options: Branches,
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
                                label: 'Effective Date',
                                name: 'effective_date',
                                required: true,
                            },
                            {
                                InputField: RadioGroupInput,
                                label: 'Rotation Type',
                                name: 'rotation_type',
                                colsSpan: 2,
                                required: true,
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
                                required: true,
                            },
                            {
                                InputField: TextInputDropdown,
                                name: "custom_reason",
                                required: true,
                                label: "Reason",
                                options: RotationReasons,
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
