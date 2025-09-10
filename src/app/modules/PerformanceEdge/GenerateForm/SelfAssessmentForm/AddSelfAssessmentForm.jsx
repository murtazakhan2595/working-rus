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
import { validateAssessmentFormSchema } from "app/utils/FormSchema/PerformanceEdgeFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { GetEmployeeFilteredList, GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import { AddNewSection, RemoveSection, AddNewSectionField } from 'app/modules/PerformanceEdge/GenerateForm/Sections';
import { StartAssessmentForm } from 'app/modules/PerformanceEdge';


const AddSelfAssessmentForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, isDuplicate = false }) => {
    const Departments = GetDispatchStateList("departments", "common") || []
    const Branches = GetDispatchStateList("branches", "common") || []
    const Designations = GetDispatchStateList("designations", "common") || []
    const [formValues, setFormValues] = useState(null);
    const [FormList, setFormList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id && !isDuplicate);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(EvaluationForm);
    const [PreviewForm, setPreviewForm] = useState(false);
    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Create"} Self Assessment Form`,
        description: null,
        footer: null,
    };
    // Initialize form data with role values if in edit mode

    useEffect(() => {
        const fetchFormData = async (isMounted) => {
            try {
                setIsLoading(true);
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


    useEffect(() => {
        let isMounted = true;
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getEvaluationFormById(id);
                if (isMounted) {
                    setFormData({ ...response, ...(isDuplicate ? { form_name: '', id: null } : {}) });
                    setFormValues({ ...response, ...(isDuplicate ? { form_name: '', id: null } : {}) });
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData(isMounted, id);
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleClose = () => {
        setIsOpen(false);
        reloadData(true);
    };

    const handleSubmit = async (values, save_mode) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, form_type: 'SelfAssessmentForm', ...(save_mode === 'draft' ? { status: 'Inactive' } : { status: 'Active' }) };
            const response = await saveEvaluationForm(payload, isDuplicate ? null : id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Self Assessment Form ${isEditMode ? 'Updated' : 'Created'} Submitted`,
                    description: ``,
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
            setIsSubmittingForm(false);
        }
    };
    console.log(formValues);

    return (
        <>
            <SheetUI
                isOpen={isOpen}
                setIsOpen={handleClose}
                variant="sheet"
                sheetConfig={FormSheetData}
                formConfig={{
                    initialValues: formData,
                    enableReinitialize: true,
                    handleSubmit: handleSubmit,
                    validateFormSchema: validateAssessmentFormSchema,
                    submitButtonText: "Save & Cancel",
                    // cancelButtonText: "Cancel",
                    additionalButtonConfig: [
                        { buttonText: 'Preview', variant: 'outline', onButtonClick: () => setPreviewForm(true) },
                        { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, 'draft'), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                    ],
                    columns: 2,
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
                                    InputField: SelectMultiInputComponent,
                                    name: "nationalities",
                                    label: "Nationalities",
                                    options: countriesList,
                                    SelectAllOption: true,
                                },
                                {
                                    InputField: SelectMultiInputComponent,
                                    name: "branches",
                                    label: "Branches",
                                    options: Branches,
                                    SelectAllOption: true,
                                },
                                {
                                    InputField: SelectMultiInputComponent,
                                    name: "departments",
                                    label: "Departments",
                                    options: Departments,
                                    SelectAllOption: true,
                                },
                                {
                                    InputField: SelectMultiInputComponent,
                                    name: "designation",
                                    label: "Designations",
                                    options: Designations,
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
                                        required: true,
                                    },
                                    {
                                        InputField: RemoveSection,
                                        name: "sections",
                                        section: section,
                                    },

                                    ...(section.fields
                                        ? section.fields.map((field, fieldIndex) => ([
                                            {
                                                InputField: () => { return <div key={`sections[${index}]`} className='font-bold'>Section Field {fieldIndex + 1}</div> },
                                            },
                                            {
                                                InputField: RemoveSection,
                                                name: `sections[${index}].fields`,
                                                section: field,
                                                index: fieldIndex,
                                            },
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
                                        ])).flat()
                                        : []
                                    ),
                                    {
                                        InputField: AddNewSectionField,
                                        name: `sections[${index}].fields`,
                                        colsSpan: 2,
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
                                    colsSpan: 2,
                                },
                            ],
                        },
                    ],
                }}
            />
            {PreviewForm && (
                <StartAssessmentForm
                    isOpen={PreviewForm}
                    setIsOpen={setPreviewForm}
                    FormDetails={formValues}
                    PreviewOnly={true}
                />
            )}
        </>
    );
};

export default AddSelfAssessmentForm;
