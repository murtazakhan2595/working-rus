import React, { useState } from "react";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { SheetUI } from "components";
import { TextInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux";
import { DateInput } from "components/FormControl";
import { CheckBoxInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";

const UploadExitInterviewDetails = ({ isOpen, setIsOpen, exit_id, exitData }) => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const Employee = useSelector((state) => state.emp.employees)
    const FormData = React.useMemo(() => ({
        exit_interview_date: exitData.exit_interview_date,
        exit_interview_notes: exitData.exit_interview_notes,
        exit_interview_conducted: exitData.exit_interview_conducted,
        exit_interviewer_name: exitData.exit_interviewer_name,
        rehire_eligibility_notes: exitData.rehire_eligibility_notes,
    }), [exitData]);

    const FormSheetData = {
        triggerText: null,
        title: "Upload Exit Interview Details",
        description: null,
        footer: null,
    };

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = values;
            if (values.exit_interview_conducted) payload.clearance_status = 'EXIT_INTERVIEW';
            // Save the final settlement
            const response = await saveEmployeeExitDetail(payload, exit_id);
            if (response) {
                return {
                    status: true,
                    title: "Exit Interview Completed Succesfully",
                    description:
                        "Exit interview details are submitted successfully.",
                    messageType: "Success",
                };
            }
        } catch (error) {
            console.error("Error in final settlement submission:", error);
        } finally {
            setIsSubmittingForm(false);
        }
    };
    return (
        <SheetUI
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant="sheet"
            sheetConfig={FormSheetData}
            formConfig={{
                initialValues: FormData,
                enableReinitialize: true,
                handleSubmit: handleSubmit,
                validateFormSchema: () => { },
                submitButtonText: "Submit",
                cancelButtonText: "Cancel",
                columns: 2,
                disableSubmit: isSubmittingForm,
                loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
                formFields: [
                    {
                        InputFields: [
                            {
                                InputField: SelectInputComponent,
                                name: "exit_interviewer_name",
                                label: "Interviewer Name",
                                required: true,
                                options: Employee
                            },
                            {
                                InputField: DateInput,
                                name: "exit_interview_date",
                                label: "Interview Date",
                                required: true,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "exit_interview_notes",
                                label: "Interview Notes",
                                required: false,
                                colsSpan: 2,
                            },
                            {
                                InputField: TextAreaInput,
                                name: "rehire_eligibility_notes",
                                label: "Rehire Eligibility Notes",
                                required: false,
                                colsSpan: 2,
                            },
                            {
                                InputField: CheckBoxInput,
                                name: "exit_interview_conducted",
                                label: "Is Interview Conducted",
                                required: false,
                            },
                        ].filter(Boolean),
                    },
                ],
            }}
        ></SheetUI>
    );
};

export default UploadExitInterviewDetails;
