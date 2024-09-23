import React, { useEffect } from "react";
import { Formik } from "formik";
import { Col, Form, Row } from "reactstrap";

import { connect } from "react-redux";

import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../src/@/components/ui/sheet";

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
  const [initialValues, setInitialValues] = React.useState({});

  const [isOpen, setIsOpen] = React.useState(false);
  const formRef = React.createRef();

  const handleSubmit = async (values, resetForm) => {
    const payload = {
      exit_date: values.last_working_day,
      exit_interview_date: values.exit_interview_date,
      final_working_day: values.last_working_day,
      exit_category: "termination",
      termination_letter: values.termination_letter,
      notice_period: values.notice_period,
      employee_id: values.terminate_employee,
      reason_of_termination: values.reason_for_terminating,
      status_termination: "viwed by manager",
    };
    console.log("payload", payload);
    try {
      console.log("payload", payload);
      const response = await employeeExit(payload);
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
      width="500px"
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
