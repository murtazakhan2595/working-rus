import { saveUpdateOfferLetter, getOfferLetterData, getOfferLetterTemplateList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { OfferLetter } from "app/utils/Types/TalentSphere";
import {
    TextInput,
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
import { getApplicantsList } from 'app/hooks/talentSphere';
import { getDropdownList } from 'utils/Lists';

const GenerateOffer = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, initialData={}}) => {
    const Designations = GetDispatchStateList('designations', 'common');
    const Countries = GetDispatchStateList('countries', 'common');
    const Employees = GetDispatchStateList('employees', 'emp');
    const [FormValues, setFormValues] = useState({ ...OfferLetter, ...initialData});
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState({ ...OfferLetter, ...initialData});
    const [Applicants, setApplicants] = useState(false);
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
                const response = await getOfferLetterData(id);
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
                const applicants = await getApplicantsList({ filterData: { status: 'shortlisted' } });
                if (isMounted) {
                    setTemplateList(response.results || []);
                    const applicant_dropdown = getDropdownList(applicants.results, 'serial_id', 'id', 'candidate_name', '-');
                    setApplicants(applicant_dropdown);
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

    const handleSubmit = async (values, isDraft) => {
        setIsSubmittingForm(true);
        try {
            const payload = {
                ...values,
                status: isDraft === 'draft' ? 'draft' : 'pending',
            };
            const response = await saveUpdateOfferLetter(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Offer Letter Submitted Successfully!`,
                    description: `Offer letter has been submitted successfully waiting for approval.`,
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
                // validateFormSchema: validateManpowerPlanningFormSchema,
                submitButtonText: "Submit & Send for Approval",
                cancelButtonText: "Cancel",
                columns: 2,
                additionalButtonConfig: [
                    { buttonText: 'Save as Draft', variant: 'continue', onButtonClick: (values) => handleSubmit(values, 'draft'), disabled: isLoading || isSubmittingForm, loadingText: isSubmittingForm ? "Submitting Form..." : "" },
                ],
                renderUpdatedFormValues: setFormValues,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Applicant Details",
                        // sheetCardName: "manpower_planning",
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: `applicant`,
                                label: "Applicant",
                                required: true,
                                options: Applicants,
                                disabled: initialData.applicant,
                            },
                        ],
                    },
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
