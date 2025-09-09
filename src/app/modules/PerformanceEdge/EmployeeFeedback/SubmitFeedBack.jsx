import { saveEmployeeFeedback } from 'app/hooks/performanceEdge';
import { EmployeeFeedback } from "app/utils/Types/PerformanceEdge";
import {
    TextAreaInput,
    SelectInputComponent,
    CheckBoxInput,
} from "components/FormControl";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import { GetDispatchStateList } from "utils/Lists";


const SubmitFeedBack = ({ isOpen = true, setIsOpen = () => { } }) => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(EmployeeFeedback);

    const FormSheetData = {
        triggerText: "",
        title: "Employee Feedback Form",
        description: null,
        footer: null,
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values };
            const response = await saveEmployeeFeedback(payload);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Feedback Submitted Successfully`,
                }
            }
        } catch (error) {
            // Show error message
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                `Failed to submit forms`;
            toast.error(errorMessage);
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
                submitButtonText: "Submit Feedback",
                cancelButtonText: "Cancel",
                columns: 2,
                disableSubmit: isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Form Details",
                        InputFields: [

                            {
                                InputField: SelectInputComponent,
                                name: "satisfaction_rating",
                                label: "Satifaction Rating",
                                options: [
                                    { value: 1, label: "1" },
                                    { value: 2, label: "2" },
                                    { value: 3, label: "3" },
                                    { value: 4, label: "4" },
                                    { value: 5, label: "5" },
                                ],
                                required: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "category",
                                label: "Categpry",
                                options: [{ value: "not_started", label: "No Started" },
                                { value: "usability", label: 'Usability' },
                                { value: "process_clarity", label: 'Process Clarity' },
                                { value: "technical_issue", label: 'Technical Issue' },
                                { value: "feature_request", label: "Feature Request" }],
                                required: true,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "comments",
                                required: true,
                                label: "Comments",
                                colsSpan: 2,
                            },
                            {
                                InputField: CheckBoxInput,
                                name: "is_anonymous",
                                label: "Submit feedback as anonymous person?",
                                validateDuplicate: true,
                                colsSpan: 2
                            },

                        ],
                    },
                ],
            }}
        />

    );
};

export default SubmitFeedBack;
