import { saveUpdateOfferLetter, getOfferLetterData, getOfferLetterTemplateList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { OfferLetter } from "app/utils/Types/TalentSphere";
import {
    TextInput,
    SelectInputComponent,
    NumberInput,
    TextAreaInput,
} from "components/FormControl";
import React, { useEffect, useState } from "react";
import { SheetUI } from "components";
import { GetDispatchStateList } from "utils/Lists";
import { DateInput } from 'components/FormControl';
import { getApplicantsList } from 'app/hooks/talentSphere';
import { getDropdownListWithExtraKeys } from 'utils/Lists';

const GenerateOffer = ({ id, offer_id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, initialData = {} }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState({ ...OfferLetter, ...initialData });
    const [Applicants, setApplicants] = useState(false);
    const [TemplateList, setTemplateList] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Generate"} Offer Letter`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchData = async (isMounted) => {
            try {
                setIsLoading(true);
                const response = await getOfferLetterData(id ?? offer_id);
                if (isMounted) {
                    setFormData({ ...response });
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        if (id || offer_id) fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [id, offer_id]);

    useEffect(() => {
        const fetchDataOptions = async (isMounted) => {
            try {
                setIsLoading(true);
                const response = await getOfferLetterTemplateList({ filterData: { is_active: true } });
                const applicants = await getApplicantsList({ filterData: { status: 'shortlisted' } });
                if (isMounted) {
                    setTemplateList(response.results || []);
                    const filtered_applicant = (applicants.results || []).filter(obj => {
                        if (obj.offer_letters && obj.offer_letters.length === 0)
                            return true;
                        else if (obj.offer_letters[obj.offer_letters.length - 1]?.status === 'rejected')
                            return true;
                        return false;
                    });
                    const applicant_dropdown = getDropdownListWithExtraKeys(
                        filtered_applicant,
                        'serial_id',
                        'id',
                        ['recruitment_shortlist', 'job_title', 'location'],
                        null,
                        'candidate_name',
                        '-'
                    );
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
                status: isDraft === 'draft' ? 'draft' : 'pending_approval',
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
                                disabled: initialData.applicant || id || offer_id,
                                onFieldUpdate: async (_, value, __, handleChange) => {
                                    const applicant = Applicants.find(obj => obj.value === value);
                                    handleChange('expected_joining_date', applicant.recruitment_shortlist.expected_joining_date);
                                    handleChange('designation', applicant.job_title);
                                    handleChange('work_location', applicant.location);

                                },
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
                            },
                            {
                                InputField: TextInput,
                                name: "designation",
                                label: "Designation",
                            },
                            {
                                InputField: TextInput,
                                name: "work_location",
                                label: "Work Location",
                            },
                            // {
                            //     InputField: TextAreaInput,
                            //     name: "remarks",
                            //     label: "Remarks",
                            //     colsSpan: 2,
                            // },
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
