import { savePerformanceCycle, getPerformanceCycleById, getPerformanceCycleList, getEvaluationFormsList } from 'app/hooks/performanceEdge';
import { PerformanceCycle } from "app/utils/Types/PerformanceEdge";
import {
    DateRangeInput,
    TextInput,
    SelectInputComponent,
    CheckBoxInput,
    NumberInput,
    DateInput,
    TextInputDropdown,
    SelectMultiInputComponent,
} from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import { getDropdownList } from 'utils/Lists';
import { renderDate } from 'utils/renderValues';
const CreateUpdateCycleForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, isDuplicate = false }) => {
    const [DataList, setDataList] = useState([]);
    const [EmployeeEvaluationFormList, setEmployeeEvaluationFormList] = useState([]);
    const [PeerAssessmentFormList, setPeerAssessmentFormList] = useState([]);
    const [SelfAssessmentFormList, setSelfAssessmentFormList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(PerformanceCycle);
    const [FormValues, setFormValues] = useState(PerformanceCycle);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Create"} Performance Cycle`,
        description: null,
        footer: null,
    };
    // Initialize form data with role values if in edit mode

    useEffect(() => {
        const fetchFormData = async (isMounted) => {
            try {
                setIsLoading(true);
                const response = await getPerformanceCycleList();
                if (response && isMounted) {
                    setDataList(response.results);
                }
                const formResponse = await getEvaluationFormsList();
                if (formResponse && isMounted) {
                    const evaluationForms = formResponse.results;
                    const employeeEvaluatoionForm = evaluationForms.filter(obj => obj.form_type === 'MnagerEvaluationForm');
                    const peerAssessmentForm = evaluationForms.filter(obj => obj.form_type === 'PeerAssessmentForm');
                    const selfAssessmentForm = evaluationForms.filter(obj => obj.form_type === 'SelfAssessmentForm');
                    setEmployeeEvaluationFormList(getDropdownList(employeeEvaluatoionForm, 'form_name', 'id'));
                    setPeerAssessmentFormList(getDropdownList(peerAssessmentForm, 'form_name', 'id'));
                    setSelfAssessmentFormList(getDropdownList(selfAssessmentForm, 'form_name', 'id'));
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
            const response = await getPerformanceCycleById(id);
            if (isMounted) {
                setFormData(response);
                setFormValues(response);
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
            const payload = { ...values, forms: [...values.forms, values.self_assement_form, values.peer_assessment_form].filter(Boolean) };
            const response = await savePerformanceCycle(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Performance Cycle Submitted`,
                    description: `Performance Cycle is submitted successfully.`,
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
                DataList: DataList,
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Form Details",
                        InputFields: [
                            {
                                InputField: TextInput,
                                name: "name",
                                required: true,
                                label: "Name",
                                validateDuplicate: true,
                            },
                            {
                                InputField: SelectMultiInputComponent,
                                name: "forms",
                                label: "Employee Assessment Form",
                                options: EmployeeEvaluationFormList,
                                required: true,
                            },
                            {
                                InputField: DateRangeInput,
                                name: "review_period",
                                label: "Review Period",
                                required: true,
                            },
                            {
                                InputField: DateInput,
                                name: "issuance_date",
                                label: "Issuance Date",
                                required: true,
                                minDate: new Date(),
                            },
                            {
                                InputField: CheckBoxInput,
                                name: "self_assessment_enabled",
                                label: "Self Assessment Enabled",
                                colsSpan: 2,
                            },
                            ...(FormValues.self_assessment_enabled ? [{
                                InputField: SelectInputComponent,
                                name: "self_assement_form",
                                required: true,
                                label: "Self Assessment Form",
                                options: SelfAssessmentFormList,
                            }] : []),
                            {
                                InputField: CheckBoxInput,
                                name: "peer_assessment_enabled",
                                label: "Peer Assessment Enabled",
                                colsSpan: 2,
                            },
                            ...(FormValues.peer_assessment_enabled ? [{
                                InputField: SelectInputComponent,
                                name: "peer_assessment_form",
                                required: true,
                                label: "Peer Assessment Form",
                                options: PeerAssessmentFormList,
                            }] : []),

                        ],
                    },
                ],
            }}
        />

    );
};

export default CreateUpdateCycleForm;
