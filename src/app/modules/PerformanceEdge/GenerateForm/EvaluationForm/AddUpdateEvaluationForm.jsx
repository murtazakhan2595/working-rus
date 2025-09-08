import { getEvaluationTypeList } from 'app/hooks/officeSetting';
import { saveEvaluationForm, getEvaluationFormById, getEvaluationFormsList } from 'app/hooks/performanceEdge';
import { EvaluationForm } from "app/utils/Types/PerformanceEdge";
import { getEmployeeTenure } from "app/hooks/general";
import {
    TextAreaInput,
    TextInput,
    SelectInputComponent,
    RadioGroupInput,
    NumberInput,
    DateInput,
    TextInputDropdown,
    SelectMultiInputComponent,
} from "components/FormControl";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { GetEmployeeFilteredList, GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import { AddNewSection, RemoveSection, AddNewSectionField } from 'app/modules/PerformanceEdge/GenerateForm/Sections';
const AddUpdateEvaluationForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, isDuplicate = false }) => {
    const UserDetails = GetDispatchStateList('user_details', 'emp');
    const Managers = GetDispatchStateList("reportingManagers", "emp") || []
    const Departments = GetDispatchStateList("departments", "common") || []
    const Branches = GetDispatchStateList("branches", "common") || []
    const Designations = GetDispatchStateList("designations", "common") || []
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [confirmSave, setConfirmSave] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [FormList, setFormList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(EvaluationForm);
    const [EvaluationTypes, setEvaluationTypes] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: isEditMode ? "Edit Job Rotation" : "Add New Job Rotation",
        description: null,
        footer: null,
    };
    // Initialize form data with role values if in edit mode

    useEffect(() => {
        const fetchFormData = async (isMounted) => {
            try {
                setIsLoading(true);
                const typeResponse = await getEvaluationTypeList();
                if (typeResponse && isMounted) {
                    setEvaluationTypes(typeResponse.results);
                }

                const response = await getEvaluationFormsList();
                if (response && isMounted) {
                    setFormList(response.results);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        let isMounted = true;
        fetchFormData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    const fetchData = async (isMounted, id) => {
        try {
            setIsLoading(true);
            const response = await getEvaluationFormById(id);
            if (isMounted) {
                setFormData({ ...response, ...(isDuplicate ? { form_name: '' } : {}) });
                setFormValues({ ...response, ...(isDuplicate ? { form_name: '' } : {}) });
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
        reloadData(true);
    };

    const getBranchTenure = async (employee_id, branch_id) => {
        try {
            const response = await getEmployeeTenure(employee_id);
            const branchTenure = response.find(obj => obj.branch_id === branch_id);
            console.log(response, UserDetails, branchTenure)
            return `${branchTenure?.months || 0} months`;
        } catch (error) { console.log(error); }
        return '0 months';
    }

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, form_type: 'MnagerEvaluationForm' };
            const response = await saveEvaluationForm(payload, id);
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
                columns: 3,
                renderUpdatedFormValues: setFormValues,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                DataList: FormList,
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Form Details",
                        InputFields: [
                            {
                                InputField: TextInput,
                                name: "form_name",
                                required: true,
                                label: "Form Name",
                                validateDuplicate: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "evaluation_type",
                                required: true,
                                label: "Evaluation Type",
                                options: EvaluationTypes,
                            },
                            {
                                InputField: SelectMultiInputComponent,
                                name: "nationalities",
                                label: "Nationalities",
                                options: countriesList,
                                SelectAllOption: true,
                            },
                            {
                                InputField: SelectMultiInputComponent,
                                name: "departments",
                                label: "Departments",
                                options: Departments,
                                SelectAllOption: true,
                            },

                        ],
                    },
                    // Conditionally render levels from formValues.level
                    ...(formValues?.sections
                        ? formValues.sections.map((section, index) => ({
                            sheetCardExtension: true,
                            sheetCardTitle: `Weightage Section ${index + 1}`,
                            InputFields: [

                                {
                                    InputField: TextInput,
                                    name: `sections[${index}].name`,
                                    label: "Name",
                                    value: section.name,
                                    // onFieldUpdate: async (_, __, ___, handleChange) => {
                                    //     handleChange(`levels[${index}].designation`, null);
                                    // },
                                },

                                {
                                    InputField: NumberInput,
                                    name: `sections[${index}].weightage`,
                                    label: "Weightage",
                                    value: section.weightage,
                                    // onFieldUpdate: async (_, __, ___, handleChange) => {
                                    //     handleChange(`levels[${index}].designation`, null);
                                    // },
                                },
                                {
                                    InputField: RemoveSection,
                                    name: "sections",
                                    section: section,
                                },

                                ...(section.fields
                                    ? section.fields.map((field, fieldIndex) => ([
                                        {
                                            InputField: TextInput,
                                            name: `sections[${index}].fields[${fieldIndex}].question`,
                                            label: "Question",
                                            value: field.question,
                                            colsSpan: 2,
                                        },
                                        {
                                            InputField: SelectInputComponent,
                                            name: `sections[${index}].fields[${fieldIndex}].evaluation_type`,
                                            label: "Evaluation Type",
                                            value: field.evaluation_type,
                                            options: [{ label: 'Radio', value: 'radio' }, { label: 'Dropdown', value: 'dropdown' }, { label: 'Text', value: 'text' }]
                                        },
                                        {
                                            InputField: NumberInput,
                                            name: `sections[${index}].fields[${fieldIndex}].weightage`,
                                            label: "Weightage",
                                            value: field.weightage,
                                        },
                                        {
                                            InputField: RemoveSection,
                                            name: `sections[${index}].fields`,
                                            section: field,
                                        },
                                    ])).flat()
                                    : []
                                ),
                                {
                                    InputField: AddNewSectionField,
                                    name: `sections[${index}].fields`,
                                    colsSpan: 3,
                                    value: section.fields,
                                },
                            ],
                        }))
                        : []),
                    {
                        sheetCardExtension: false,
                        sheetCardTitle: `Form Sections`,
                        InputFields: [
                            {
                                InputField: AddNewSection,
                                name: "sections",
                                colsSpan: 3,
                            },
                        ],
                    },
                ],
            }}
        />

    );
};

export default AddUpdateEvaluationForm;
