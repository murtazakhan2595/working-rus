import { saveUpdateHeadcountRequest, getManpowerById, getManpowerPlanningList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { HeadcountRequest } from "app/utils/Types/TalentSphere";
import {
    TextAreaInput,
    SelectInputComponent,
    NumberInput,
} from "components/FormControl";
import { BudgetStatusOptions } from "data/Data";
import React, { useEffect, useState } from "react";
import { SheetUI } from "components";
import { GetDispatchStateList } from "utils/Lists";
import { yearsDropdownList } from 'utils/Lists';
import { validateManpowerPlanningFormSchema } from 'app/utils/FormSchema/TalentSphereFormSchema';
import { calculateTotal, calculatePercentage } from 'utils/renderValues';
import { getConsumedBudgetStatus } from 'app/utils/MappingObjects/mapTalentSphere';
import { CoverFileUpload } from 'components/FormControl';

const AddUpdateManpowerHeadcountRequest = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, }) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const {
        id: user_id,
        branch_id: user_branch,
        department_name: user_department,
    } = GetDispatchStateList("user_details", "emp") || {};
    const [FormValues, setFormValues] = useState({ ...HeadcountRequest, branch: user_branch });
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState({ ...HeadcountRequest, branch: user_branch });
    const [ManpowerExist, setManpowerExist] = useState(false);
    const [BudgetStatus, setBudgetStatus] = useState(null);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Add"} Manpower Headcount Request`,
        description: null,
        footer: null,
    };

    const YearsDropdown = React.useMemo(() => yearsDropdownList(2020, 2030), []);

    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getManpowerById(id);
                if (isMounted) {
                    setFormData({ ...response });
                    setFormValues({ ...response });
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
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, };
            const response = await saveUpdateHeadcountRequest(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Request Submitted Successfully!`,
                    description: `Manpower headcount request planing has been submitted successfully.`,
                }
            }
        } catch (error) {
            // Show error message
            console.log(error)
        } finally {
            setIsSubmittingForm(false);
        }
    };

    const getExistingHeadCount = async (branch, department, handleChange) => {
        try {
            if (branch && department) {
                const filterData = {
                    ...(department ? { department: department } : {}),
                    ...(branch ? { branch: branch } : {}),
                    fiscal_year: (new Date).getFullYear(),
                }
                const response = await getManpowerPlanningList({ filterData });
                if (response) {
                    const headcount_details = response.results[0] || {};
                    handleChange("consumed_headcount", headcount_details.existing_headcount || 0);
                    handleChange("allocated_headcount", headcount_details.planned_headcount || 0);
                    handleChange("remaining_headcount", (headcount_details.planned_headcount || 0) - (headcount_details.existing_headcount || 0));
                }
            } else {
                handleChange("consumed_headcount", 0);
                handleChange("allocated_headcount", 0);
                handleChange("remaining_headcount", 0);

            }
        } catch (error) {
            // Show error message
            console.error(error)
        }
    };

    const renderConsumedBudgetStatus = async (consumed_budget, total_budget, handleChange) => {
        try {
            if (consumed_budget && total_budget) {
                const percentage = calculatePercentage(consumed_budget, total_budget);
                const consumed_budget_status = getConsumedBudgetStatus(percentage)
                setBudgetStatus(consumed_budget_status);
            } else {
                setBudgetStatus(null);
            }
        } catch (error) {
            // Show error message
            console.error(error)
        }
    };

    const ValidateExistingRecord = async (branch, department, fiscalYear) => {
        try {
            if (branch && department && fiscalYear) {
                const filterData = { ...(department ? { department: department } : {}), ...(branch ? { branch: branch } : {}), ...(fiscalYear ? { fiscal_year: fiscalYear } : {}) }
                const existingPlanning = await getManpowerPlanningList({ filterData: filterData });
                if (existingPlanning.count > 0) {
                    setManpowerExist(true);
                    return 0;
                }
            }
            setManpowerExist(false);
            return 0;

        } catch (error) {
            // Show error message
            console.error(error)
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
                    const errors = validateManpowerPlanningFormSchema(values);
                    if (ManpowerExist) errors.manpower_planning = 'Manpower headcount request for selected fiscal year already exist form same branch and department.'
                    return errors;
                },
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
                renderUpdatedFormValues: (values) => {
                    setFormValues(values);
                },
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Planning Details",
                        sheetCardName: "manpower_planning",
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                required: true,
                                label: "Branch",
                                options: Branches,
                                onFieldUpdate: async (_, value, __, handleChange) => {
                                    await getExistingHeadCount(value, FormValues?.department, handleChange);
                                },
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "department",
                                required: true,
                                label: "Department",
                                options: Departments,
                                onFieldUpdate: async (_, value, __, handleChange) => {
                                    await getExistingHeadCount(FormValues?.branch, value, handleChange);
                                },
                            },
                            {
                                InputField: NumberInput,
                                name: `allocated_headcount`,
                                label: "Allocated Headcount",
                                disabled: true,
                            },
                            {
                                InputField: NumberInput,
                                name: `consumed_headcount`,
                                label: "Consumed Headcount",
                                disabled: true,
                            },
                            {
                                InputField: NumberInput,
                                name: `remaining_headcount`,
                                label: "Remaining Headcount",
                                disabled: true,
                            },

                            {
                                InputField: NumberInput,
                                name: `requested_headcount`,
                                label: "Requested Headcount",
                                required: true,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "reason",
                                required: true,
                                label: "Reason",
                                colsSpan: 2,
                            },
                            {
                                InputField: CoverFileUpload,
                                name: `attachment`,
                                label: "Attachment",
                                disabled: true,
                                colsSpan: 2,
                            },
                        ],
                    },
                ],
            }}
        />

    );
};


export default AddUpdateManpowerHeadcountRequest;
