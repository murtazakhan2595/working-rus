import { saveUpdateInterviewFeedback, getInterviewById, getFeedBackFormData } from 'app/hooks/talentSphere';
import { InterviewFeedback } from "app/utils/Types/TalentSphere";
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
import React, { useEffect, useState, useCallback } from "react";
import { EmployeeDetailUI, SheetUI } from "components";
import { useSelector } from "react-redux";


const AddInterviewFeedback = ({
    id = null,
    isOpen = true,
    setIsOpen = () => { },
    reloadData = () => { },
    feedbackForm = null,
}) => {
    const { id: user_id, role: user_role } = useSelector((state) => state.user.userProfile);
    const [FormValues, setFormValues] = useState(InterviewFeedback);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(InterviewFeedback);

    const FormSheetData = {
        triggerText: "",
        title: `Interview Feedback`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchData = async (isMounted, interview_id) => {
            try {
                setIsLoading(true);
                // const response = await getInterviewById(interview_id);
                const FormResponse = await getFeedBackFormData(feedbackForm || 2);
                if (isMounted) {
                    const FormData = { ...InterviewFeedback, sections: FormResponse.sections }
                    setFormData(FormData);
                    setFormValues(FormData);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        if (id) fetchData(isMounted, id);
        return () => {
            isMounted = false;
        };
    }, [id, feedbackForm]);

    const handleClose = () => {
        setIsOpen(false);
        reloadData(true);
    };

    const handleSubmit = async (values, saveStatus) => {
        setIsSubmittingForm(true);
        try {
            const responses = (values.sections || []).flatMap(section =>
                (section.fields || []).map(field => ({
                    field_id: field.id,
                    response_numeric: field.response_numeric,
                    response_text: field.response_text
                })));
            const submission = await saveUpdateInterviewFeedback({
                ...values,
                panel_member: user_id,
                interview: id,
                feedback_form:feedbackForm || 2,
                is_submitted: saveStatus !== 'draft',
                responses: responses
            }, values.feedback_id);

            if (submission) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Feedback Submitted Successfully`,
                    description: `Your feedback for the interview has been submitted successfully`,
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
                validateFormSchema: () => { },
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                // additionalButtonConfig: !PreviewOnly ? [
                //     { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, 'draft'), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                // ] : [],
                columns: 1,
                renderUpdatedFormValues: setFormValues,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "General Feedback",
                        InputFields: [
                            {
                                InputField: TextAreaInput,
                                name: "comments",
                                required: true,
                                label: "Comments / Observations",
                            },
                            {
                                InputField: RadioGroupInput,
                                name: `rating`,
                                label: `Rating`,
                                required: true,
                                options: [
                                    { label: '1', value: 1 },
                                    { label: '2', value: 2 },
                                    { label: '3', value: 3 },
                                    { label: '4', value: 4 },
                                    { label: '5', value: 5 }
                                ]
                            },
                            {
                                InputField: RadioGroupInput,
                                name: `recommendation`,
                                label: `Recommendation`,
                                required: true,
                                options: [
                                    { label: 'Proceed', value: 'proceed' },
                                    { label: 'Hold', value: 'hold' },
                                    { label: 'Reject', value: 'reject' },
                                ]
                            },
                        ],
                    },
                    // Conditionally render levels from FormValues.level
                    ...(FormValues?.sections
                        ? FormValues.sections.map((section, index) => ({
                            sheetCardExtension: true,
                            sheetCardTitle: `${section.title} Section`,
                            sheetCardName: `sections[${index}]`,
                            InputFields: [
                                ...(section.fields
                                    ? section.fields.map((field, fieldIndex) => ([
                                        ...(field.field_type === 'RADIO'
                                            ? [{
                                                InputField: RadioGroupInput,
                                                name: `sections[${index}].fields[${fieldIndex}].response_text`,
                                                label: `${fieldIndex + 1}. ${field.label}`,
                                                value: field.response_text,
                                                required: true,
                                                options: [
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]
                                            }]
                                            : []),
                                        ...(field.field_type === 'RATING'
                                            ? [{
                                                InputField: RadioGroupInput,
                                                name: `sections[${index}].fields[${fieldIndex}].response_numeric`,
                                                label: `${fieldIndex + 1}. ${field.label}`,
                                                required: true,
                                                value: field.response_numeric,
                                                options: Array.from(
                                                    { length: field.rating_scale_max || 5 },
                                                    (_, index) => ({ label: index + 1, value: index + 1 })
                                                ),
                                            }]
                                            : []),
                                        ...(field.field_type === 'TEXT'
                                            ? [{
                                                InputField: TextAreaInput,
                                                name: `sections[${index}].fields[${fieldIndex}].response_text`,
                                                label: `${fieldIndex + 1}. ${field.label}`,
                                                required: true,
                                                value: field.response_text,
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

export default AddInterviewFeedback;
