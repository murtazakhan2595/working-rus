import { getEvaluationTypeList } from 'app/hooks/officeSetting';
import { saveEvaluationForm, getMyPerformanceFormsById, getEvaluationFormsList, saveEvaluationSubmission, saveEvaluationSubmissionAnswers } from 'app/hooks/performanceEdge';
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
import { DisplaySection, DisplaySectionField } from 'app/modules/PerformanceEdge/MyPerformance/Sections';
const StartAssessmentForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { } }) => {
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
            const response = await getMyPerformanceFormsById(id);
            if (isMounted) {
                setFormData({ ...response, });
                setFormValues({ ...response, });
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

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            debugger
            if (!values.submissions || values.submissions.length === 0) {
                const submission = await saveEvaluationSubmission({
                    form: 3,
                    cycle: values.id,
                    status: 'draft',
                });
            } else {
                for (const form of values.forms) {
                    const sections = form.sections;
                    for (const section of sections) {
                        const fields = section.fields;
                        for (const field of fields) {
                            const anwsers = saveEvaluationSubmissionAnswers({
                                submission: values.submissions[0].submission_id,
                                field: field.id,
                                rating: field.rating,
                            });
                        }

                    }
                }
            }
            const payload = { ...values, form_type: 'EmployeeEvaluationForm' };
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
                                name: "name",
                                disabled: true,
                                label: "Name",
                            },
                        ],
                    },
                    // Conditionally render levels from formValues.level
                    ...(formValues?.sections
                        ? formValues.sections.map((section, index) => ({
                            sheetCardExtension: true,
                            sheetCardTitle: `${section.name} Section`,
                            InputFields: [
                                {
                                    InputField: DisplaySection,
                                    section: section,
                                    colsSpan: 2,
                                },
                                ...(section.fields
                                    ? section.fields.map((field, fieldIndex) => ([
                                        {
                                            InputField: DisplaySectionField,
                                            field: field,
                                            colsSpan: 2,
                                            fieldNumber: fieldIndex
                                        },
                                        ...(field.evaluation_type === 'radio'
                                            ? [{
                                                InputField: RadioGroupInput,
                                                name: `sections[${index}].fields[${fieldIndex}].rating`,
                                                label: "",
                                                value: field.rating,
                                                options: [
                                                    { label: '1', value: '1' },
                                                    { label: '2', value: '2' },
                                                    { label: '3', value: '3' }
                                                ]
                                            }]
                                            : []),
                                    ])).flat()
                                    : []
                                ),
                            ],
                        }))
                        : []),

                ],
            }}
        />

    );
};

export default StartAssessmentForm;
