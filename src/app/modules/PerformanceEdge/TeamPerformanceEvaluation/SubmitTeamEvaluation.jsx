import { getEvaluationTypeList } from 'app/hooks/officeSetting';
import { getPeersList, getFormQuestions, getEvaluationSubmission, saveEvaluationSubmission, saveEvaluationSubmissionAnswers } from 'app/hooks/performanceEdge';
import { EvaluationForm } from "app/utils/Types/PerformanceEdge";
import { getEmployeeTenure } from "app/hooks/general";
import {
    TextAreaInput,
    TextInput,
    SelectInputComponent,
    RadioGroupInput,
    DateRangeInput,
    DateInput,
    TextInputDropdown,
    SelectMultiInputComponent,
} from "components/FormControl";
import { validateSubmitAssessmentFormSchema } from "app/utils/FormSchema/PerformanceEdgeFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { DisplaySection, DisplaySectionField } from 'app/modules/PerformanceEdge/MyPerformance/Sections';


const SubmitTeamEvaluation = ({
    FormDetails = null,
    form_id,
    isOpen = true,
    setIsOpen = () => { },
    reloadData = () => { },
    PreviewOnly = false,
    cycle_id = null,
}) => {
    const [formValues, setFormValues] = useState(FormDetails || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(FormDetails ?? EvaluationForm);
    const [PeersList, setPeersList] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: `${PreviewOnly ? 'Preview' : 'Start'} Assessment`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchFormData = async (isMounted) => {
            try {
                setIsLoading(true);
                const typeResponse = await getPeersList(cycle_id);
                if (typeResponse && isMounted) {
                    setPeersList(typeResponse.results);
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
        const fetchData = async (isMounted, form_id) => {
            try {
                setIsLoading(true);
                const response = await getFormQuestions(form_id, cycle_id);
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
        let isMounted = true;
        if (form_id) fetchData(isMounted, form_id);
        return () => {
            isMounted = false;
        };
    }, [form_id, cycle_id]);

    const handleClose = () => {
        setIsOpen(false);
        reloadData(true);
    };

    const submitAnswers = async (sections, submissionId) => {
        try {
            if (!submissionId) return null;
            for (const section of sections) {
                for (const field of section.fields) {
                    await saveEvaluationSubmissionAnswers({
                        submission: submissionId,
                        field: field.id,
                        answer_text: field.answer_text,
                        answer_choice: field.answer_choice,
                        rating: field.rating,
                    }, field.answer_id);
                }
            }

        } catch (error) {
            console.error(error)
        } finally {
            return 0;
        }
    };

    const handleSubmit = async (values, saveStatus) => {
        setIsSubmittingForm(true);
        try {
            const submission = await saveEvaluationSubmission({
                form: form_id,
                cycle: cycle_id,
                status: saveStatus === 'draft' ? 'draft' : 'submitted',
                is_submitted: saveStatus === 'draft' ? false : true,
            }, values.submissions.id);
            if (submission) {
                submitAnswers(values.sections, submission.id)
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Assessment Submitted Successfully`,
                    description: `Your assessment has been submitted successfully`,
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
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
                validateFormSchema: validateSubmitAssessmentFormSchema,
                submitButtonText: !PreviewOnly ? "Submit" : null,
                cancelButtonText: !PreviewOnly ? "Cancel" : null,
                additionalButtonConfig: [
                    { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, 'draft'), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                ],
                columns: 1,
                renderUpdatedFormValues: setFormValues,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
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
                            {
                                InputField: DateRangeInput,
                                name: "review_period",
                                disabled: true,
                                label: "Evaluation Period",
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "employee",
                                label: "Peer",
                                options: PeersList,
                            },
                        ],
                    },
                    // Conditionally render levels from formValues.level
                    ...(formValues?.sections
                        ? formValues.sections.map((section, index) => ({
                            sheetCardExtension: true,
                            sheetCardTitle: `${section.name} Section`,
                            sheetCardName: `sections[${index}]`,
                            InputFields: [
                                ...(section.fields
                                    ? section.fields.map((field, fieldIndex) => ([
                                        ...(field.evaluation_type === 'radio'
                                            ? [{
                                                InputField: RadioGroupInput,
                                                name: `sections[${index}].fields[${fieldIndex}].answer_choice`,
                                                label: `${fieldIndex + 1}. ${field.question}`,
                                                value: field.answer_choice,
                                                required: true,
                                                options: [
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]
                                            }]
                                            : []),
                                        ...(field.evaluation_type === 'dropdown'
                                            ? [{
                                                InputField: SelectInputComponent,
                                                name: `sections[${index}].fields[${fieldIndex}].rating`,
                                                label: `${fieldIndex + 1}. ${field.question}`,
                                                required: true,
                                                value: field.rating,
                                                options: [
                                                    { label: '1', value: 1 },
                                                    { label: '2', value: 2 },
                                                    { label: '3', value: 3 },
                                                    { label: '4', value: 4 },
                                                    { label: '5', value: 5 }
                                                ]
                                            }]
                                            : []),
                                        ...(field.evaluation_type === 'text'
                                            ? [{
                                                InputField: TextAreaInput,
                                                name: `sections[${index}].fields[${fieldIndex}].answer_text`,
                                                label: `${fieldIndex + 1}. ${field.question}`,
                                                required: true,
                                                value: field.answer_text,
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

export default SubmitTeamEvaluation;
