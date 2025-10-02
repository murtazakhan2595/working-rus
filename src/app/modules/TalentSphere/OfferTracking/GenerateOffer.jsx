import { saveManpowerPanning, getManpowerById, getOfferLetterTemplateList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { OfferLetter } from "app/utils/Types/TalentSphere";
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
import { DateInput } from 'components/FormControl';

const GenerateOffer = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, applicant }) => {
    const Designations = GetDispatchStateList('designations', 'common');
    const Countries = GetDispatchStateList('countries', 'common');
    const Employees = GetDispatchStateList('employees', 'emp');
    const [FormValues, setFormValues] = useState(OfferLetter);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState(OfferLetter);
    const [ManpowerExist, setManpowerExist] = useState(false);
    const [TemplateList, setTemplateList] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Generate"} Offer Letter`,
        description: null,
        footer: null,
    };

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

    useEffect(() => {
        const fetchDataOptions = async (isMounted) => {
            try {
                setIsLoading(true);
                const response = await getOfferLetterTemplateList();
                if (isMounted) {
                    setTemplateList(response.results||[]);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        fetchDataOptions(isMounted, id);
        return () => {
            isMounted = false;
        };
    }, []);

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
                renderUpdatedFormValues: (values) => {
                    setFormValues(values);
                },
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Offer Details",
                        // sheetCardName: "manpower_planning",
                        InputFields: [
                            {
                                InputField: NumberInput,
                                name: `offered_salary`,
                                label: "Offered Salary",
                                required: true,
                            },
                            {
                                InputField: DateInput,
                                name: `expected_joining_date`,
                                label: "Expected Joining Date",
                                required: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "designation",
                                required: true,
                                label: "Designation",
                                options: Designations,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "reporting_manager",
                                required: true,
                                label: "Reporting Manager",
                                options: Employees,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: "work_location",
                                required: true,
                                label: "Work Location",
                                options: Countries,
                            },
                        ],
                    },
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Template Details",
                        // sheetCardName: "manpower_planning",
                        InputFields: [
                           
                            {
                                InputField: SelectInputComponent,
                                name: "template",
                                required: true,
                                label: "Template",
                                options: TemplateList,
                            },
                        ],
                    },
                ],
            }}
        />

    );
};


export default GenerateOffer;
