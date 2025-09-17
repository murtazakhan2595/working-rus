import { saveManpowerPanning, getManpowerById } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { ManpowerPlanning } from "app/utils/Types/TalentSphere";
import {
    TextAreaInput,
    TextInput,
    SelectInputComponent,
    NumberInput,
    DateInput,
} from "components/FormControl";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import { GetDispatchStateList } from "utils/Lists";
import { yearsDropdownList } from 'utils/Lists';

const AddUpdateManpower = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, }) => {
    const UserDetails = GetDispatchStateList('user_details', 'emp');
    const Branches = GetDispatchStateList('branches', 'common');
    const Departments = GetDispatchStateList('departments', 'common');
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [FormValues, setFormValues] = useState(ManpowerPlanning);
    const [FormList, setFormList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(ManpowerPlanning);
    const [ExistingHeadcount, setExistingHeadcount] = useState([]);

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
            const payload = { ...values,};
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

    const getExistingHeadCount = async (branch, department) => {
        try {
            const filterData = { ...(department ? { department_name: department } : {}), ...(branch ? { branch_id: branch } : {}) }
            const response = await getEmployeeList({ filterData });
            if (response) {
                setExistingHeadcount(response.count);
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
                DataList: FormList,
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Form Details",
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "fiscal_year",
                                required: true,
                                label: "Fiscal Year",
                                options: YearsDropdown,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "branch",
                                required: true,
                                label: "Branch",
                                options: Branches,
                                onFieldUpdate: async (_, value) => {
                                    await getExistingHeadCount(value, FormValues?.department);
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
                                value: ExistingHeadcount,
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
                                required: true,
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

const AddNewKeyResult = React.memo(
    ({ name, onChange = () => { }, value = [], error }) => {
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const updatedSections = [
                ...(value || []),
                {
                    description: null,
                    target_value: null,
                    current_value: null,
                },
            ];
            onChange(name, updatedSections);
        };
        return (
            <div>
                <Button variant="outline" onClick={handleClick}>
                    Add Key Results
                </Button>
                <div className={errorClassName}>{error}</div>
            </div>
        );
    }
);

export default AddUpdateManpower;
