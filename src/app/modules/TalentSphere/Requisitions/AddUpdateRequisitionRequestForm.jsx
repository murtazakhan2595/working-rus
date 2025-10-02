import { getCitiesList } from "app/hooks/general";
import { getRequisitionRequestList } from "app/hooks/talentSphere";
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
import { CheckBoxInput } from "components/FormControl";
import { CoverFileUpload } from "components/FormControl";
import { NumberInput } from "components/FormControl";
import { TextInput, TextAreaInput, RadioGroupInput, SelectInputComponent, SwitchInput, SelectMultiInputComponent } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { GetDispatchStateList } from "utils/Lists";

const AddUpdateRequisitionRequestForm = ({
    id = false,
    reloadData = () => { },
    isOpen = false,
    setIsOpen = () => { },
    approvalRequired = false,
}) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const Countries = GetDispatchStateList('countries', 'common');
    const { id: employee_id } = GetDispatchStateList('userProfile', 'user');
    const [isLoading, setIsLoading] = useState(false);
    const [FormData, setFormData] = useState({ ...Requisition, approval_required: approvalRequired });
    const [BenefitList, setBenefitList] = useState([]);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [EducationList, setEducationList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
    const [RemoteWorkCheckList, setRemoteWorkCheckList] = useState([]);
    const [RequisitionList, setRequisitionList] = useState([]);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [Cities, setCities] = useState([]);
    const isEditMode = Boolean(id);
    const [FormValues, setFormValues] = useState({ ...Requisition, approval_required: approvalRequired });
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
                const requisition = await getRequisitionRequestList();
                if (isMounted) {
                    setBenefitList(benefits.results);
                    setJobTypeList(job_type.results);
                    setEducationList(education.results);
                    setCareerLevelList(career_level.results);
                    setRemoteWorkCheckList(remote_work_checklist.results);
                    setRequisitionList(requisition.results);
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

    const getCitiesDropdown = async (country) => {
        try {
            setIsLoading(true);
            const country_id = ((Countries || []).find(obj => obj.name === country) || {})?.id;
            if (country_id) {
                const cities = await getCitiesList({}, country_id);
                if (cities) {
                    setCities(cities.results);
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (values, is_draft = false) => {
        try {
            setIsSubmittingForm(true);
            const response = await saveUpdateRequisitionRequest({ ...values, is_draft: Boolean(is_draft === true) }, id);
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
                DataList: RequisitionList,
                submitButtonText: "Submit Request",
                cancelButtonText: "Cancel",
                columns: 2,
                additionalButtonConfig: [
                    { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, true), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                ],
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : isLoading ? "Loading Options..." : "",
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
                                    options: Countries,
                                    onFieldUpdate: async (_, value, __, handleChange) => {
                                        getCitiesDropdown(value);
                                        handleChange('city', null);
                                    },
                                },
                                {
                                    InputField: SelectInputComponent,
                                    name: "city",
                                    required: true,
                                    label: "City",
                                    options: Cities,
                                },
                                {
                                    InputField: CheckBoxInput,
                                    name: "is_emiratization_role",
                                    label: "Emiratization Role",
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
                                InputField: SelectInputComponent,
                                name: "gender_preference",
                                required: true,
                                label: "Gender Preference",
                                options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'None', value: 'none' },],
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
                                colsSpan: 2,
                                disabled: approvalRequired,
                            },
                        ],
                    },
                ],
            }}
        />
    );
};

export default AddUpdateRequisitionRequestForm;
