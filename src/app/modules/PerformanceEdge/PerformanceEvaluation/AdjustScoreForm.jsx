import { saveCalibration, getPerformanceCycleById, getPerformanceCycleList, getEvaluationFormsList } from 'app/hooks/performanceEdge';
import { CalibrationPanel } from "app/utils/Types/PerformanceEdge";
import {
    TextAreaInput,
    TextInput,
} from "components/FormControl";
import React, { useEffect, useState } from "react";
import { SheetUI } from "components";

const AdjustScoreForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, final_score = 0, FinalEvaluationId }) => {
    const [isLoading, setIsLoading] = useState(false);
    // const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(CalibrationPanel);

    const FormSheetData = {
        triggerText: "",
        title: `Calibrated Score`,
        description: null,
        footer: null,
    };

    const fetchData = async (isMounted, id) => {
        try {
            setIsLoading(true);
            const response = await getPerformanceCycleById(id);
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
        reloadData(true);
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, final_evaluation: FinalEvaluationId };
            const response = await saveCalibration(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Calibrated Score Submitted`,
                    description: `New adjusted score submitted successfully. The evaluation will be updated shortly`,
                }
            }
        } catch (error) {
            // Show error message
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
                        sheetCardTitle: "Adjust Score",
                        InputFields: [
                            {
                                InputField: TextInput,
                                name: "final_score",
                                value: final_score,
                                label: "Manager's Score",
                                disabled: true,
                            },
                            {
                                InputField: TextInput,
                                name: "new_score",
                                label: "Adjusted Score",
                                required: true,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "justification",
                                label: "Justification",
                                required: true,
                                colsSpan: 2,
                            },
                        ],
                    },
                ],
            }}
        />

    );
};

export default AdjustScoreForm;
