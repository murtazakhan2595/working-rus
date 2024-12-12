import React from "react";

import { connect } from "react-redux";

import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";


import SheetComponent from "components/ui/SheetComponent";
import RequestTerminationForm from "./Sections/RequestTerminationForm";

const { RxCross2 } = require("react-icons/rx");

const RequestTerminationCard = ({
  organizations,
  closeModel,
  userProfile,
  designations,
  departments,
  managers,
}) => {
  const [initialValues, setInitialValues] = React.useState({
    terminate_employee: "",
    reason_for_terminating: "",
    notice_period: "",
    last_working_day: "",
    exit_interview_date:"",
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const formRef = React.createRef();

  const handleSubmit = async (values, resetForm) => {
    // Create a new FormData object
    const formData = new FormData();
  
    // Append key-value pairs to the FormData object
    formData.append("exit_date", values.last_working_day);
    formData.append("exit_interview_date", values.exit_interview_date);
    formData.append("final_working_day", values.last_working_day);
    formData.append("exit_category", "termination");
    formData.append("termination_letter", values.termination_letter);
    formData.append("notice_period", values.notice_period);
    formData.append("employee_id", values.terminate_employee);
    formData.append("reason_of_termination", values.reason_for_terminating);
    formData.append("status_termination", "viewed by manager");
  
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
  
  const formSheetData = {
    triggerText: "Request Termination +",
    title: "Request Termination",

    description: null,
    footer: null,
  };
  return (
    <SheetComponent
      {...formSheetData}
      contentClassName="custom-sheet-width"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <RequestTerminationForm
        formData={initialValues}
        formRef={formRef}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfile={userProfile}
      />
    </SheetComponent>
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
