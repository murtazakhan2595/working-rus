import { saveManpowerPanning, getManpowerById, getManpowerPlanningList } from 'app/hooks/talentSphere';
import { getEmployeeCustomList } from 'app/hooks/general';
import { ManpowerPlanning } from "app/utils/Types/TalentSphere";
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

const AddUpdateManpower = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, edit_by_branch_dpt = false, initialData = null }) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const [FormValues, setFormValues] = useState(ManpowerPlanning);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id || edit_by_branch_dpt);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(ManpowerPlanning);
    const [BudgetStatus, setBudgetStatus] = useState(null);
    const [ManpowerList, setManpowerList] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Update" : "Add"} Manpower`,
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
                    renderConsumedBudgetStatus(response.consumed_budget, response.total_allocated_budget)
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

    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                const response = await getManpowerPlanningList();
                if (isMounted) {
                    if (response.results && response.results.length > 0) {
                        setManpowerList(response.results);
                    }
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        let isMounted = true;
        //if edit by branh and department is initially get the unique record for that to edit
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const filterData = { ...(initialData.department ? { department: initialData.department } : {}), ...(initialData.branch ? { branch: initialData.branch } : {}), fiscal_year: [new Date().getFullYear()] }
                const response = await getManpowerPlanningList({ filterData: filterData });
                if (isMounted) {
                    if (response.results && response.results.length > 0) {
                        setFormData({ ...response.results[0] });
                        setFormValues({ ...response.results[0] });
                    }
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        //if edit by branh and department is initially get the unique record for that to edit
        if (edit_by_branch_dpt && initialData) fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [edit_by_branch_dpt, initialData]);

    const handleClose = () => {
        setIsOpen(false);
        reloadData(true);
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, };
            const response = await saveManpowerPanning(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Manpower Submitted Successfully!`,
                    description: `Manpower planing has been submitted successfully.`,
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
        setIsLoading(true);
        try {
            if (branch && department) {
                const filterData = {
                    ...(department ? { department_name: department } : {}),
                    ...(branch ? { branch_id: branch } : {}),
                    employee_status: "Active,Probation,Notice Period",
                }
                const response = await getEmployeeCustomList({ filterData });
                if (response) {
                    handleChange("existing_headcount", response.count);
                    const consumed_budget = calculateTotal(response.results || [], 'basic_salary')
                    handleChange("consumed_budget", consumed_budget || 0);
                }
            } else {
                handleChange("existing_headcount", 0);
                handleChange("consumed_budget", 0);
            }
        } catch (error) {
            // Show error message
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    };

    const renderConsumedBudgetStatus = async (consumed_budget, total_budget) => {
        try {
            if ((consumed_budget !== null || consumed_budget !== undefined) && (total_budget !== null || total_budget !== undefined)) {
                const percentage = calculatePercentage(consumed_budget, total_budget);
                const consumed_budget_status = getConsumedBudgetStatus(percentage || 0)
                setBudgetStatus(consumed_budget_status);
            } else {
                setBudgetStatus(null);
            }
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
                validateFormSchema: validateManpowerPlanningFormSchema,
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
                renderUpdatedFormValues: (values) => {
                    setFormValues(values);
                    renderConsumedBudgetStatus(values.consumed_budget, values.total_allocated_budget)
                },
                DataList: ManpowerList,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isLoading ? "Loading Data..." : isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Planning Details",
                        sheetCardName: "manpower_planning",
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "fiscal_year",
                                required: true,
                                label: "Fiscal Year",
                                options: YearsDropdown,
                                validateDuplicate: true,
                                combinationKeys: ['branch', 'department'],
                                duplicateErrorMessage: 'Manpower planning for selected fiscal year already exist form same branch and department.',
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                required: true,
                                label: "Branch",
                                options: Branches,
                                validateDuplicate: true,
                                combinationKeys: ['fiscal_year', 'department'],
                                duplicateErrorMessage: 'Manpower planning for selected branch already exist form same fiscal year and department.',
                                onFieldUpdate: (_, value, __, handleChange) => {
                                    getExistingHeadCount(value, FormValues?.department, handleChange);
                                },
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "department",
                                required: true,
                                label: "Department",
                                options: Departments,
                                validateDuplicate: true,
                                combinationKeys: ['fiscal_year', 'branch'],
                                duplicateErrorMessage: 'Manpower planning for selected department already exist form same fiscal year and branch.',
                                onFieldUpdate: (_, value, __, handleChange) => {
                                    getExistingHeadCount(FormValues?.branch, value, handleChange);
                                },
                            },
                            {
                                InputField: NumberInput,
                                name: `planned_headcount`,
                                label: "Planned Headcount",
                                required: true,
                            },
                            {
                                InputField: NumberInput,
                                name: `existing_headcount`,
                                label: "Existing Headcount",
                                disabled: true,
                            },
                            {
                                InputField: NumberInput,
                                name: `total_allocated_budget`,
                                label: "Total Allocated Budget",
                                required: true,
                            },
                            {
                                InputField: NumberInput,
                                name: `consumed_budget`,
                                label: "Consumed Budget",
                                disabled: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: `consumed_budget_status`,
                                label: "Consumed Budget Status",
                                disabled: true,
                                value: BudgetStatus,
                                options: BudgetStatusOptions,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "justification",
                                required: (parseFloat(FormValues.planned_headcount) || 0) > ((parseFloat(FormValues.existing_headcount) || 0)),
                                label: "Justification",
                                colsSpan: 2,
                            },

                        ],
                    },
                ],
            }}
        />

    );
};


export default AddUpdateManpower;
