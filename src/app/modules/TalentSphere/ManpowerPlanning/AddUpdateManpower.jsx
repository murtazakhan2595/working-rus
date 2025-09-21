import { saveManpowerPanning, getManpowerById, getManpowerPlanningList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { ManpowerPlanning } from "app/utils/Types/TalentSphere";
import {
    TextAreaInput,
    SelectInputComponent,
    NumberInput,
} from "components/FormControl";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import React, { useEffect, useState } from "react";
import { SheetUI } from "components";
import { GetDispatchStateList } from "utils/Lists";
import { yearsDropdownList } from 'utils/Lists';
import { validateManpowerPlanningFormSchema } from 'app/utils/FormSchema/TalentSphereFormSchema';

const AddUpdateManpower = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, }) => {
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const [FormValues, setFormValues] = useState(ManpowerPlanning);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(ManpowerPlanning);
    const [ManpowerExist, setManpowerExist] = useState(false);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Add"} Manpower`,
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
        try {
            const filterData = { ...(department ? { department_name: department } : {}), ...(branch ? { branch_id: branch } : {}) }
            const response = await getEmployeeList({ filterData });
            if (response) {
                handleChange("existing_headcount", response.count);
            }
        } catch (error) {
            // Show error message
            console.error(error)
        }
    };

    const ValidateExistingRecord = async (branch, department, fiscalYear) => {
        try {
            const filterData = { ...(department ? { department: department } : {}), ...(branch ? { branch: branch } : {}), ...(fiscalYear ? { fiscal_year: fiscalYear } : {}) }
            const existingPlanning = await getManpowerPlanningList({ filterData: filterData });
            if (existingPlanning.count > 0)
                setManpowerExist(true);
            else
                setManpowerExist(false);

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
                    if (ManpowerExist) errors.manpower_planning = 'Manpower Planning for selected fiscal year already exist form same branch and department.'
                    return errors;
                },
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
                renderUpdatedFormValues: setFormValues,
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
                                name: "fiscal_year",
                                required: true,
                                label: "Fiscal Year",
                                options: YearsDropdown,
                                onFieldUpdate: async (_, value) => {
                                    await ValidateExistingRecord(FormValues?.branch, FormValues?.department, value);
                                },
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                required: true,
                                label: "Branch",
                                options: Branches,
                                onFieldUpdate: async (_, value, __, handleChange) => {
                                    await getExistingHeadCount(value, FormValues?.department, handleChange);
                                    await ValidateExistingRecord(value, FormValues?.department, FormValues.fiscal_year);
                                },
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "department",
                                required: true,
                                label: "Department",
                                options: Departments,
                                onFieldUpdate: async (_, value) => {
                                    await getExistingHeadCount(FormValues?.branch, value);
                                    await ValidateExistingRecord(FormValues?.branch, value, FormValues.fiscal_year);
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
