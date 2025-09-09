import { getEvaluationTypeList } from 'app/hooks/officeSetting';
import { saveEmployeeGoals, getEmployeeGoalsById, getEvaluationFormsList } from 'app/hooks/performanceEdge';
import { MyGoals } from "app/utils/Types/PerformanceEdge";
import { getEmployeeTenure } from "app/hooks/general";
import {
    TextAreaInput,
    TextInput,
    SelectInputComponent,
    RadioGroupInput,
    NumberInput,
    DateInput,
    TextInputDropdown,
    SelectMultiInputComponent,
} from "components/FormControl";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EmployeeDetailUI, SheetUI } from "components";
import { GetEmployeeFilteredList, GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import { AddNewSection, RemoveSection, AddNewSectionField } from 'app/modules/PerformanceEdge/GenerateForm/Sections';
const AddUpdateMyGoals = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, }) => {
    const UserDetails = GetDispatchStateList('user_details', 'emp');
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [formValues, setFormValues] = useState(null);
    const [FormList, setFormList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(MyGoals);
    const [EvaluationTypes, setEvaluationTypes] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: isEditMode ? "Edit My Goals" : "Add My Goals",
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchData = async (isMounted, id) => {
        try {
            setIsLoading(true);
            const response = await getEmployeeGoalsById(id);
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
            const payload = { ...values, employee: UserDetails.id };
            const response = await saveEmployeeGoals(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `My Goals Submitted Successfully`,
                    description: `My goals is submitted successfully`,
                }
            }
        } catch (error) {
            // Show error message
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                `Failed to ${isEditMode ? "update" : "add"} goals.`;
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
                DataList: FormList,
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Form Details",
                        InputFields: [
                            {
                                InputField: TextInput,
                                name: "title",
                                required: true,
                                label: "Goal Title",
                                validateDuplicate: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "alignment",
                                label: "Alignment",
                                options: [
                                    { value: "company", label: "Company Objective" },
                                    { value: "department", label: 'Departmental Objective' },
                                    { value: "none", label: 'None' },
                                ],
                            },

                            {
                                InputField: DateInput,
                                name: "due_date",
                                label: "Due Date",
                                required: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "status",
                                label: "Status",
                                options: [{ value: "not_started", label: "No Started" },
                                { value: "in_progress", label: 'In Progress' },
                                { value: "completed", label: 'Completed' },
                                { value: "on_hold", label: 'On Hold' },
                                { value: "canceled", label: "Cancelled" }],
                            },
                            {
                                InputField: TextAreaInput,
                                name: "description",
                                required: true,
                                label: "Description",
                                colsSpan: 2,
                            },

                        ],
                    },
                    // Conditionally render levels from formValues.level
                    ...(formValues?.key_results
                        ? formValues.key_results.map((key_result, index) => ({
                            sheetCardExtension: true,
                            sheetCardTitle: `Key Result ${index + 1}`,
                            InputFields: [
                                // {
                                //     InputField: RemoveSection,
                                //     name: "key_results",
                                //     value: key_result,
                                //     colsSpan: 2,
                                // },
                                {
                                    InputField: TextAreaInput,
                                    name: `key_results[${index}].description`,
                                    label: "Description",
                                    value: key_result.description,
                                    colsSpan: 2,
                                },

                                {
                                    InputField: NumberInput,
                                    name: `key_results[${index}].target_value`,
                                    label: "Target Value",
                                    value: key_result.target_value,
                                    // onFieldUpdate: async (_, __, ___, handleChange) => {
                                    //     handleChange(`levels[${index}].designation`, null);
                                    // },
                                },
                                {
                                    InputField: NumberInput,
                                    name: `key_results[${index}].current_value`,
                                    label: "Current Value",
                                    value: key_result.current_value,
                                    // onFieldUpdate: async (_, __, ___, handleChange) => {
                                    //     handleChange(`levels[${index}].designation`, null);
                                    // },
                                },

                            ],
                        }))
                        : []),
                    {
                        sheetCardExtension: false,
                        sheetCardTitle: `Key Results`,
                        InputFields: [
                            {
                                InputField: AddNewKeyResult,
                                name: "key_results",
                                colsSpan: 3,
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

// const RemoveKeyResult = React.memo(
//     ({ name, onChange = () => { }, value = [], section, index }) => {
//         const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
//         const handleClick = (event) => {
//             event.preventDefault();
//             event.stopPropagation();
//             setOpenDeleteConfirm(true);
//         };
//         const confirmDelete = async () => {
//             try {
//                 if (!section) return;
//                 const remaining_levels = value.filter(
//                     (levels) => levels.level_number !== section.level_number
//                 );
//                 onChange(name, remaining_levels || []);
//             } catch (error) {
//                 console.error("ERROR", error);
//             } finally {
//                 setOpenDeleteConfirm(false);
//             }
//         };
//         return (
//             <div className="relative">
//                 <Button
//                     variant="icon"
//                     onClick={handleClick}
//                     className="absolute top-[-20px] right-[-10px]"
//                 >
//                     <CircleX size={22} className="text-red-700" />
//                 </Button>
//                 {openDeleteConfirm && (
//                     <AlertDialogue
//                         title="Confirm Delete?"
//                         description={`This action can't be undone. All information associated with this level will be lost.`}
//                         isOpen={openDeleteConfirm}
//                         setIsOpen={() => setOpenDeleteConfirm(false)}
//                         handleContinue={confirmDelete}
//                     />
//                 )}
//             </div>
//         );
//     }
// );

export default AddUpdateMyGoals;
