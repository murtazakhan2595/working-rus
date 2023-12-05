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


const EmpForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [errors, setErrors] = useState({});

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep === 2) {
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
    if (currentStep === 2) {
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
        <h1 className="text-center font-bold font-sfpro text-lg tracking-wide lg:text-2xl md:mb-6">
          Employment Information
        </h1>
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
        {currentStep === 2 && subStep === 1 && (
          <SubmitCV
            errors={errors}
            setErrors={setErrors}
            substep={subStep}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 2 && subStep === 2 && (
          <ProfessionalExp
            errors={errors}
            setErrors={setErrors}
            substep={subStep}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 3 && (
          <AcademicRecords
            errors={errors}
            setErrors={setErrors}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 4 && (
          <BankDetails
            errors={errors}
            setErrors={setErrors}
            prevstep={prevStep}
            nextstep={nextStep}
          />
        )}
        {currentStep === 5 && (
          <Department
            prevstep={prevStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>
      <ToastContainer/> 
    </>
  );
};

export default EmpForm
