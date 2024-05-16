import React, { useState } from "react";
import PersonalInfo from "./UpdatePersonalInfo";
import SubmitCV from "./UpdateCV";
import "react-toastify/dist/ReactToastify.css";
import ProfessionalExp from "./UpdateProExp";
import AcademicRecords from "./UpdateAcademicInfo";
import BankDetails from "./UpdateBankDetails";
import Department from "./UpdateDepartment";
import FormIndicator from "./UpdateFormIndicator";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import VisaDetails from "./UpdateVisaDetails";
import PageHeader from '../../shared/templates/PageHeader'


const ViewEmpForm = ({ userProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [errors, setErrors] = useState({});
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep === 3) {
      if (subStep < 2) {
        setSubStep(subStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
        setSubStep(1);
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 3) {
      if (subStep > 1) {
        setSubStep(subStep - 1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubStep(2);
    }
  };

  return (
    <>
      <div className="py-6 bg-[#F9F9F9] lg:w-full">
        <PageHeader
          title={'Employment Information'}
        />

        <FormIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <div className="flex justify-end text-sm text-baseBlue mt-2 mr-6 lg:mr-8 lg:text-base">
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep === 1 && (
          <PersonalInfo
            nextstep={nextStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}

        {currentStep === 2 && (
          <VisaDetails
            prevstep={prevStep}
            nextstep={nextStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {currentStep === 3 && subStep === 1 && (
          <SubmitCV
            errors={errors}
            setErrors={setErrors}
            substep={subStep}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 3 && subStep === 2 && (
          <ProfessionalExp
            errors={errors}
            setErrors={setErrors}
            substep={subStep}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 4 && (
          <AcademicRecords
            errors={errors}
            setErrors={setErrors}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 5 && (
          <BankDetails
            errors={errors}
            setErrors={setErrors}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 6 && (
          <Department
            prevstep={prevStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>
      <ToastContainer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(ViewEmpForm);
