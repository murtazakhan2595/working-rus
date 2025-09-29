import {
    saveUpdateVacancy,
    getVacancyData,
    getRequisitionRequestData,
    getCareerLevelList,
    getEducationList,
    getRemoteWorkChecklistList,
    getJobTypeList,
} from "app/hooks/talentSphere";
import { PublishVacancy } from "app/utils/Types/TalentSphere";
import { SheetUI, EmployeeDetailUI } from "components";
import { CheckBoxInput } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { CoverFileUpload } from "components/FormControl";
import { NumberInput } from "components/FormControl";
import { TextInput, TextAreaInput, RadioGroupInput, SelectInputComponent, SwitchInput, SelectMultiInputComponent } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { GetDispatchStateList } from "utils/Lists";

const AddUpdateVacancyForm = ({
    id = false,
    reloadData = () => { },
    isOpen = false,
    setIsOpen = () => { },
    requisition_id = null,
}) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const { id: employee_id } = GetDispatchStateList('userProfile', 'user');
    const [isLoading, setIsLoading] = useState(false);
    const [FormData, setFormData] = useState({ ...PublishVacancy });
    const [BenefitList, setBenefitList] = useState([]);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [EducationList, setEducationList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
    const [RemoteWorkCheckList, setRemoteWorkCheckList] = useState([]);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const isEditMode = Boolean(id);
    const [FormValues, setFormValues] = useState({ ...PublishVacancy });

    const FormSheetData = {
        triggerText: `${isEditMode ? "Edit" : "Add"} Vacancy`,
        title: `${isEditMode ? "Edit" : "Add"} Vacancy`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchBenefitData = async (isMounted, requisition_id) => {
            try {
                setIsLoading(true);
                // Add organizationId to filter if available
                const requisition = await getRequisitionRequestData(requisition_id);
                if (isMounted) {
                    const FormDetails = {
                        ...FormData, requisition: requisition.id,
                        job_title: requisition.job_title,
                        department: requisition.department,
                        branch: requisition.branch,
                    }
                    setFormData(FormDetails)
                    setFormValues(FormDetails)
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        if (requisition_id) fetchBenefitData(isMounted, requisition_id);
        return () => {
            isMounted = false;
        };
    }, [requisition_id]);


    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getVacancyData(id);
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
        try {
            setIsSubmittingForm(true);
            const response = await saveUpdateVacancy({ ...values,organization:1 }, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Vacancy ${isEditMode ? "Updated" : "Added"} Successfully!`,
                    description: `Vacancy is ${isEditMode ? "updated" : "added"} successfully.`,
                };
            }
        } catch (error) {
            console.error("ERROR", error);
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
                initialValues: FormData,
                enableReinitialize: true,
                handleSubmit: handleSubmit,
                validateFormSchema: () => { },
                renderUpdatedFormValues: (values) => {
                    setFormValues(values);
                },
                DataList: BenefitList,
                submitButtonText: "Publish",
                cancelButtonText: "Cancel",
                columns: 2,
                additionalButtonConfig: [
                    { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, true), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                ],
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Vacancy Details",
                        InputFields: [
                            {
                                InputField: DateInput,
                                name: "publish_date",
                                required: true,
                                label: "Publish Date",
                            },
                            {
                                InputField: DateInput,
                                name: "due_date",
                                required: true,
                                label: "Due Date",
                                description: 'Last date for vacancy visibility.'
                            },
                            {
                                InputField: RadioGroupInput,
                                name: "requisition_type",
                                label: "Requisition Type",
                                options: [
                                    { value: 'internal', label: 'Internal' },
                                    { value: 'external', label: "External" },
                                    { value: 'both', label: "Both" },
                                ],
                                colsSpan: 2
                            },
                            ...(FormValues.requisition_type === 'external' || FormValues.requisition_type === 'both' ? [
                                {
                                    InputField: CheckBoxInput,
                                    name: "post_on_cohrus",
                                    label: "Cohrus Career Portal",
                                    colsSpan: 2
                                },
                                {
                                    InputField: CheckBoxInput,
                                    name: "post_on_linkedin",
                                    label: "LinkedIn",
                                    colsSpan: 2
                                },
                                {
                                    InputField: CheckBoxInput,
                                    name: "post_on_indeed",
                                    label: "Indeed",
                                    colsSpan: 2
                                },
                                {
                                    InputField: CheckBoxInput,
                                    name: "post_on_other",
                                    label: "Other available social/job portals",
                                    colsSpan: 2
                                },
                            ] : []),
                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Requisition Details`,
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                disabled: true,
                                label: "Branch",
                                options: Branches,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "department",
                                disabled: true,
                                label: "Department",
                                options: Departments,
                            },
                            {
                                InputField: TextInput,
                                name: "job_title",
                                disabled: true,
                                label: "Job Title",
                            },
                        ],
                    },
                ],
            }}
        />
    );
};

export default AddUpdateVacancyForm;
