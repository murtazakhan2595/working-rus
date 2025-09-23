import {
    saveUpdateRequisitionRequest,
    getBenefitList,
    getRequisitionRequestData,
    getCareerLevelList,
    getEducationList,
    getRemoteWorkChecklistList,
    getJobTypeList,
} from "app/hooks/talentSphere";
import { Requisition } from "app/utils/Types/TalentSphere";
import { SheetUI, EmployeeDetailUI } from "components";
import { CoverFileUpload } from "components/FormControl";
import { NumberInput } from "components/FormControl";
import { TextInput, TextAreaInput, RadioGroupInput, SelectInputComponent, SwitchInput, SelectMultiInputComponent } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { GetDispatchStateList } from "utils/Lists";

const AddUpdateGenerateRequisitionForm = ({
    id = false,
    reloadData = () => { },
    isOpen = false,
    setIsOpen = () => { },
}) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const { id: employee_id } = GetDispatchStateList('userProfile', 'user');
    const [isLoading, setIsLoading] = useState(false);
    const [FormData, setFormData] = useState(Requisition);
    const [BenefitList, setBenefitList] = useState([]);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [EducationList, setEducationList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
    const [RemoteWorkCheckList, setRemoteWorkCheckList] = useState([]);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const isEditMode = Boolean(id);
    const [FormValues, setFormValues] = useState(Requisition);

    const FormSheetData = {
        triggerText: `${isEditMode ? "Edit" : "Add"} Requisition`,
        title: `${isEditMode ? "Edit" : "Add"} Requisition`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchBenefitData = async (isMounted) => {
            try {
                setIsLoading(true);
                // Add organizationId to filter if available
                const benefits = await getBenefitList();
                const education = await getEducationList();
                const career_level = await getCareerLevelList();
                const remote_work_checklist = await getRemoteWorkChecklistList();
                const job_type = await getJobTypeList();
                if (isMounted) {
                    setBenefitList(benefits.results);
                    setJobTypeList(job_type.results);
                    setEducationList(education.results);
                    setCareerLevelList(career_level.results);
                    setRemoteWorkCheckList(remote_work_checklist.results);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        fetchBenefitData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);


    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getRequisitionRequestData(id);
                if (isMounted) {
                    setFormData(response);
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
            const response = await saveUpdateRequisitionRequest(values, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Requisition ${isEditMode ? "Updated" : "Added"} Successfully!`,
                    description: `Requisition is ${isEditMode ? "updated" : "added"} successfully.`,
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
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Requestor Details",
                        InputFields: [
                            {
                                InputField: EmployeeDetailUI,
                                id: employee_id,
                                InformationKeys: ["id", "name", "department", "branch"],
                                variant: "FormView",
                                colsSpan: 2,
                                className: "grid grid-cols-2 gap-4",
                            },
                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Job Details`,
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                required: true,
                                label: "Branch",
                                options: Branches,
                                // onFieldUpdate: async (_, value, __, handleChange) => {
                                //     await getExistingHeadCount(value, FormValues?.department, handleChange);
                                //     await ValidateExistingRecord(value, FormValues?.department, FormValues.fiscal_year);
                                // },
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "department",
                                required: true,
                                label: "Department",
                                options: Departments,
                            },
                            {
                                InputField: TextInput,
                                name: "job_title",
                                required: true,
                                label: "Job Title",
                                validateDuplicate: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "required_skills",
                                required: true,
                                label: "Skills Required",
                                options: Departments,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "job_description",
                                label: "Job Description",
                                required: true,
                                maxRows: 3,
                                colsSpan: 2,
                            },

                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Work Mode Details`,
                        InputFields: [
                            {
                                InputField: RadioGroupInput,
                                name: "work_mode",
                                label: "Work Mode",
                                options: [
                                    { value: 'onsite', label: 'Onsite' },
                                    { value: 'hybrid', label: "Hybrid" },
                                    { value: 'remote', label: "Remote" },
                                ],
                                colsSpan: 2
                            },
                            ...(FormValues.work_mode === 'remote' ? [
                                {
                                    InputField: SelectMultiInputComponent,
                                    name: "remote_work_checklist",
                                    required: true,
                                    label: "Remote Work Checklist",
                                    options: RemoteWorkCheckList,
                                    colsSpan: 2
                                },
                            ] : [
                                {
                                    InputField: SelectInputComponent,
                                    name: "country",
                                    required: true,
                                    label: "Country",
                                    options: Branches,
                                    // onFieldUpdate: async (_, value, __, handleChange) => {
                                    //     await getExistingHeadCount(value, FormValues?.department, handleChange);
                                    //     await ValidateExistingRecord(value, FormValues?.department, FormValues.fiscal_year);
                                    // },
                                },
                                {
                                    InputField: SelectInputComponent,
                                    name: "city",
                                    required: true,
                                    label: "City",
                                    options: Departments,
                                },
                            ]),
                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Compensation & Benefits`,
                        InputFields: [
                            {
                                InputField: SwitchInput,
                                name: "enable_benefits",
                                label: "Add Benefits",
                                colsSpan: 2
                            },
                            ...(FormValues.enable_benefits ? [{
                                InputField: SelectMultiInputComponent,
                                name: "benefits",
                                required: true,
                                label: "Benefits",
                                options: BenefitList,
                                colsSpan: 2
                            }] : []),
                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: `Job Specification Details`,
                        InputFields: [
                            {
                                InputField: NumberInput,
                                name: "number_of_positions",
                                required: true,
                                label: "Number of Positions",
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "job_type",
                                required: true,
                                label: "Job Type",
                                options: JobTypeList,
                            },
                            {
                                InputField: NumberInput,
                                name: "min_age",
                                label: "Minimum Age",
                            },
                            {
                                InputField: NumberInput,
                                name: "max_age",
                                label: "Maximum Age",
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "education",
                                required: true,
                                label: "Education Requirement",
                                options: EducationList,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "career_level",
                                required: true,
                                label: "Career Level",
                                options: CareerLevelList,
                            },
                            {
                                InputField: NumberInput,
                                name: "experience_min",
                                required: true,
                                label: "Minimum Experiance (Year)",
                            },
                            {
                                InputField: NumberInput,
                                name: "experience_max",
                                required: true,
                                label: "Maximum Experiance (Year)",
                            },
                            {
                                InputField: NumberInput,
                                name: "salary_min",
                                required: true,
                                label: "Minimum Salary",
                            },
                            {
                                InputField: NumberInput,
                                name: "salary_max",
                                required: true,
                                label: "Maximum Salary",
                            },
                            {
                                InputField: TextAreaInput,
                                name: "justification",
                                label: "Justification",
                                maxRows: 3,
                                colsSpan: 2,
                            },
                            {
                                InputField: CoverFileUpload,
                                name: "attachment",
                                label: "Attachment",
                                colsSpan: 2,
                            },
                            {
                                InputField: SwitchInput,
                                name: "approval_required",
                                label: "Approval Required",
                                colsSpan: 2
                            },
                        ],
                    },
                ],
            }}
        />
    );
};

export default AddUpdateGenerateRequisitionForm;
