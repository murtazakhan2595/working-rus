import { saveUpdateOfferTracking, getOfferTrackingData, getEmailTemplateList } from 'app/hooks/talentSphere';
import { getEmployeeList } from 'app/hooks/general';
import { OfferTracking } from "app/utils/Types/TalentSphere";
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

const SentOfferForm = ({ id, isOpen = true, setIsOpen = () => { }, reloadData = () => { }, initialData }) => {
    const Designations = GetDispatchStateList('designations', 'common');
    const Countries = GetDispatchStateList('countries', 'common');
    const Employees = GetDispatchStateList('employees', 'emp');
    const [FormValues, setFormValues] = useState({ ...OfferTracking, ...initialData });
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = Boolean(id);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [formData, setFormData] = useState({ ...OfferTracking, ...initialData });
    const [ManpowerExist, setManpowerExist] = useState(false);
    const [TemplateList, setTemplateList] = useState([]);

    const FormSheetData = {
        triggerText: "",
        title: `${isEditMode ? "Edit" : "Send"} Offer Letter`,
        description: null,
        footer: null,
    };

    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getOfferTrackingData(id);
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
                const response = await getEmailTemplateList({ filterData: { is_active: true, template_type: 'OFFER_SENT' } });
                if (isMounted) {
                    setTemplateList(response.results || []);
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
            const payload = {
                ...values,
            };
            const response = await saveUpdateOfferTracking(payload, id);
            if (response) {
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: `Offer Letter Send Successfully!`,
                    description: `Offer letter has been send to applicant successfully, waiting for approval.`,
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
                submitButtonText: "Save & Send to Applicant",
                cancelButtonText: "Cancel",
                columns: 2,
                renderUpdatedFormValues: setFormValues,
                disableSubmit: isLoading || isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        sheetCardExtension: true,
                        sheetCardTitle: "Offer Details",
                        // sheetCardName: "manpower_planning",
                        InputFields: [
                            {
                                InputField: DateInput,
                                name: `validity_date`,
                                label: "Validity Date",
                                required: true,
                            },
                            {
                                InputField: DateInput,
                                name: `joining_date`,
                                label: "Joining Date",
                                required: true,
                            },
                            {
                                InputField: SelectInputComponent,
                                name: `offer_letter_id`,
                                label: "Template",
                                required: true,
                                options: TemplateList,
                                description: "If template option is empty, create an email template with the template type set as “Offer Send” from the Talent Sphere → Organizational Setup module."
                            },
                        ],
                    },
                ],
            }}
        />

    );
};


export default SentOfferForm;
