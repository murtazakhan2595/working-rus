import React, { useState, useEffect } from "react";
import {
    getBlacklistReasonList,
    saveUpdateApplication,
    saveUpdateResumeBankApplication,
    saveUpdateRejectedApplication,
    saveUpdateShortlistedApplicant,
    saveUpdateBlacklistApplicant,
} from "app/hooks/talentSphere";
import { SheetUI } from "components";
import {
    RejectedApplication,
    ResumeBankApplication,
    ShortlistedApplicant,
    BlacklistApplicant,
} from "app/utils/Types/TalentSphere";
import { GetDispatchStateList } from "utils/Lists";
import {
    TextAreaInput,
    SelectInputComponent,
    NumberInput,
    DateInput,
    SelectMultiInputComponent,
} from "components/FormControl";
import moment from "moment";
import { toast } from "react-toastify";

const StatusConfig = {
    rejected: {
        successMessage: "Application Rejected Successfully!",
        saveStatusAuditLogs: saveUpdateRejectedApplication,
        sheet: { title: "Rejection Reason" },
        initialForm: RejectedApplication,
        fields: () => [
            {
                InputField: TextAreaInput,
                name: "rejection_reason",
                required: true,
                label: "Reason",
            },
        ],
    },
    shortlisted: {
        successMessage: "Application Shortlisted Successfully!",
        saveStatusAuditLogs: saveUpdateShortlistedApplicant,
        sheet: { title: "Add Shortlisting Details" },
        initialForm: ShortlistedApplicant,
        fields: () => [
            {
                InputField: NumberInput,
                name: "desired_salary",
                required: true,
                label: "Desired Salary",
            },
            {
                InputField: DateInput,
                name: "expected_joining_date",
                required: true,
                label: "Expected Joining Date",
            },
            {
                InputField: TextAreaInput,
                name: "remarks",
                label: "Remarks",
            },
        ],
    },
    resume_bank: {
        successMessage: "Application Moved to Resume Bank Successfully!",
        saveStatusAuditLogs: saveUpdateResumeBankApplication,
        sheet: { title: "Add to Resume Bank" },
        initialForm: ResumeBankApplication,
        fields: (BlacklistReasons, Departments, Designations) => [
            {
                InputField: SelectInputComponent,
                name: "recommended_department",
                options: Departments,
                required: true,
                label: "Recommended Department",
            },
            {
                InputField: SelectInputComponent,
                name: "recommended_designation",
                required: true,
                label: "Recommended Designation",
                options: Designations,
            },
        ],
    },
    screened: {
        successMessage: "Application Screened Successfully!",
        saveStatusAuditLogs: saveUpdateApplication,
        sheet: { title: "Add to Screen" },
        initialForm: {},
        fields: () => [],
        isDefault: true,
    },
    blacklisted: {
        successMessage: "Application Blacklisted Successfully!",
        saveStatusAuditLogs: saveUpdateBlacklistApplicant,
        sheet: { title: "Blacklist Details" },
        initialForm: BlacklistApplicant,
        fields: (BlacklistReasons) => [
            {
                InputField: SelectMultiInputComponent,
                name: "reason_ids",
                required: true,
                label: "Blacklist Reasons",
                options: BlacklistReasons,
            },
            {
                InputField: TextAreaInput,
                name: "remarks",
                label: "Remarks",
            },
        ],
    },
    remove_blacklist: {
        successMessage: "Application Removed from Blacklisted Successfully!",
        saveStatusAuditLogs: saveUpdateBlacklistApplicant,
        sheet: { title: "Blacklist Details" },
        initialForm: BlacklistApplicant,
        fields: () => [],
    },
    default: {
        successMessage: "Application Holded Successfully!",
        saveStatusAuditLogs: saveUpdateApplication,
        isDefault: true,
    },
    revert_hold: {
        successMessage: "Application Removed from Hold Successfully!",
        saveStatusAuditLogs: saveUpdateApplication,
        isDefault: true,
    },
    remove_resume_bank: {
        successMessage: "Application Removed from Resume Bank Successfully!",
        saveStatusAuditLogs: saveUpdateApplication,
        isDefault: true,
    },
};

const UpdateApplicantStatus = ({
    status,
    status_variant,
    applicant,
    initialData,
    reloadData = () => { },
    isOpen,
    setIsOpen = () => { },
    statusUpdated = () => { },
}) => {
    const { id: user_id } = GetDispatchStateList("userProfile", "user");
    const Designations = GetDispatchStateList("designations", "common");
    const Departments = GetDispatchStateList("departments", "common");

    const [BlacklistReasons, setBlacklistReasons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const config = StatusConfig[status_variant] || StatusConfig.default;
    const { saveStatusAuditLogs, successMessage, initialForm, sheet, isDefault, fields } =
        config;

    useEffect(() => {
        if (status_variant === "blacklisted") {
            const fetchReasons = async () => {
                try {
                    setIsLoading(true);
                    const reasons = await getBlacklistReasonList({
                        filterData: { is_active: true },
                    });
                    setBlacklistReasons(reasons?.results || []);
                } catch (error) {
                    console.error("Error fetching blacklist reasons:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReasons();
        }
    }, [status_variant]);

    useEffect(() => {
        if (status_variant === "remove_blacklist") {
            handleSubmit({ ...initialData, remove: true })
        } else if (status_variant === 'screened') {
            handleSubmit({ id: applicant, status: status, screened_by: user_id, screened_date: moment().format('YYYY-MM-DD') })
        } else if (status_variant === 'default' || status_variant === 'revert_hold' || status_variant === 'remove_resume_bank') {
            handleSubmit({ id: applicant, status: status })
        }
    }, [status_variant]);

    const handleSubmit = async (values) => {
        try {
            debugger
            const response = await saveStatusAuditLogs({ ...values, applicant }, values.id);
            if (response) {
                if (!isDefault) {
                    await saveUpdateApplication({ status }, applicant);
                }
                statusUpdated(true);
                reloadData(true);
                setIsOpen(false);
                toast.success(`${successMessage}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                return {
                    status: true,
                    messageType: "SUCCESS",
                    title: successMessage,
                    description: "Applicant status updated successfully.",
                };
            }
        } catch (error) {
            console.error("Error updating applicant status:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <SheetUI
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant="sheet"
            sheetConfig={sheet}
            formConfig={{
                initialValues: { ...initialForm, ...initialData },
                enableReinitialize: true,
                handleSubmit,
                validateFormSchema: () => ({}),
                submitButtonText: "Confirm",
                cancelButtonText: "Cancel",
                disableSubmit: isLoading,
                loadingMessage: isLoading ? "Loading Options..." : "",
                columns: 1,
                formFields: [
                    {
                        sheetCardExtension: false,
                        InputFields: fields
                            ? fields(BlacklistReasons, Departments, Designations).filter(Boolean)
                            : [],
                    },
                ],
            }}
        />
    );
};

export default UpdateApplicantStatus;
