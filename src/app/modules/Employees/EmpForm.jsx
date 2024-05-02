import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalInfo from "./PersonalInfo";
import { connect } from "react-redux";
import SubmitCV from "./SubmitCV";
import ProfessionalExp from "./ProfessionalExp";
import AcademicRecords from "./AcademicRecords";
import BankDetails from "./BankDetails";
import Department from "./Department";
import FormIndicator from "./FormIndicator";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { RiArrowDownSFill } from "react-icons/ri";
import VisaDetails from "./VisaDetails";

const EmpForm = ({ baseUrl, token, userProfile }) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visaDetailsFiles, setVisaDetailsFiles] = useState({});

  const totalSteps = 6;

  const submitForm = async () => {
    try {
      for (const key in visaDetailsFiles) {
        if (visaDetailsFiles.hasOwnProperty(key)) {
          const files = visaDetailsFiles[key];
          for (const file of files) {
            let attachmentResponse = await axios.post(
              `${baseUrl}/attachment/`,
              {
                employee_id: userProfile.id,
                name: key,
                description: `${key} File`,
                document: {
                  name: file.name,
                  data: file.data,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (attachmentResponse.status !== 201) {
              toast.error("Attachements submission Failed. Please try again.", {
                position: "top-center",
                autoClose: 3000,
              });
            }
          }
        }
      }

      toast.success("Form submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      sessionStorage.clear();
      setTimeout(() => {
        navigate("/");
        sessionStorage.clear();
        // return;
      }, 3000);

    } catch (error) {
      toast.error("Form submission failed. Please try again.", {
        position: "top-center",
        autoClose: 3000, // Close after 3 seconds
      });
    }
  };

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



  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    cookies.set("token", "", { path: "*" });
    setUserLogout();
    navigate("/");
  };


  return (
    <>
      <div className="py-6 bg-[#F9F9F9] lg:w-full">
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-4">
          <div></div>
          <h1 className="text-center font-bold font-sfpro text-lg tracking-wide lg:text-2xl md:mb-6">
            Employment Information
          </h1>
          <div className="relative ">
            <div
              className="flex py-2 justify-end px-[.5rem] items-center gap-3 rounded-lg rounded-tl-full rounded-bl-full md:rounded-tl-md md:rounded-bl-md bg-gray-200 cursor-pointer"
              onClick={handleDropdownClick}
            >
              <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>
              <div className="text-[#283b91] hidden md:block lg:block">
                {userProfile.username}
              </div>
              <div className="text-[#283b91]">
                <RiArrowDownSFill />
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#283b91] border rounded-lg shadow-lg">
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-100 hover:text-[#283b91] text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

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
            setVisaDetailsFilesProps={setVisaDetailsFiles}
            visaDetailsFilesProps={visaDetailsFiles}
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
            submitForm={submitForm}
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
    baseUrl: state.user.baseUrl,
    token: state.user.token,
  };
};
export default connect(mapStateToProps, { setUserLogout })(EmpForm);