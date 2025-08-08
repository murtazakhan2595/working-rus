import React, { useState } from "react";

import { connect } from "react-redux";

import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { DateInput, CoverFileUpload, SelectInputComponent } from "components/FormControl";

import { NoticePeriod } from "data/Data";

import SheetComponent from "components/ui/SheetComponent";
import RequestTerminationForm from "./Sections/RequestTerminationForm";
import { SheetUI, EmployeeDetailUI } from "components";


const RequestTerminationCard = ({
  closeModel,
  Employees,
  TerminationReasons,
  isOpen,
  setIsOpen = () => { },
}) => {
  const [FormData, setFormData] = useState({
    final_working_day: "",
    termination_letter: "",
    notice_period: "",
    employee_id: "",
    reason_of_termination: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSubmit = async (values, resetForm) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append key-value pairs to the FormData object
    formData.append("exit_date", values.last_working_day);
    formData.append("exit_interview_date", values.exit_interview_date);
    formData.append("final_working_day", values.last_working_day);
    formData.append("exit_category", "TERMINATION");
    formData.append("termination_letter", values.termination_letter);
    formData.append("notice_period", values.notice_period);
    formData.append("employee_id", values.terminate_employee);
    formData.append("reason_of_termination", values.reason_for_terminating);

    try {
      // Send the FormData object via the employeeExit function
      const response = await employeeExit(formData);
      if (response) {
        toast.success("Termination request submitted successfully");
        closeModel();
        resetForm();
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit the form");
    }
  };

  const FormSheetData = {
    triggerText: "Request Termination",
    title: "Request Termination",
    description: null,
    footer: null,
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {

        },
        // renderUpdatedFormValues: SetLeaveFormValues,
        submitButtonText: "Submit Request",
        cancelButtonText: "Cancel",
        // disableSubmit: isSubmittingForm,
        loadingMessage: "Submiting Form",
        columns: 2,
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "employee_id",
                required: true,
                label: "Employee",
                onFieldUpdate: async (_, value) => {
                  const employee = value
                    ? Employees.find((obj) => obj.value === value)
                    : null;

                  setSelectedEmployee(employee);
                },
                options: Employees,
              },
              {
                InputField: EmployeeDetailUI,
                id: selectedEmployee?.id,
                InformationKeys: ["department", "branch", "position", "work_location", "manager", "joining_date", "employment_type", "contact_no",],
                variant: "FormView",
                colsSpan: 3,
                className: "grid grid-cols-2 gap-4",
              },
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: "Leave Details",
            sheetCardName: "leave_details",
            InputFields: [
              {
                InputField: DateInput,
                name: "last_working_day",
                label: "Last Working Day",
                required: true,
              },

              {
                InputField: SelectInputComponent,
                name: "notice_period",
                label: "Notice Period",
                required: true,
                options: NoticePeriod || [],
              },
              {
                InputField: DateInput,
                name: "reason_for_terminating",
                label: "Reason for Terminating",
                required: true,
                options: TerminationReasons,
              },
              {
                InputField: CoverFileUpload,
                name: "termination_letter",
                label: "Termination Letter",
                required: true,
              },
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>

    // <SheetComponent
    //   {...formSheetData}
    //   contentClassName="custom-sheet-width"
    //   isOpen={isOpen}
    //   setIsOpen={setIsOpen}
    // >
    //   <RequestTerminationForm
    //     formData={initialValues}
    //     formRef={formRef}
    //     handleSubmit={handleSubmit}
    //     isOpen={isOpen}
    //     setIsOpen={setIsOpen}
    //     userProfile={userProfile}
    //   />
    // </SheetComponent>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
    organizations: state.common.organizations,
    userProfile: state.user.userProfile,
    designations: state.common.designations,
    departments: state.common.departments,
    managers: state.emp.reportingManagers,
  };
};
export default connect(mapStateToProps)(RequestTerminationCard);
