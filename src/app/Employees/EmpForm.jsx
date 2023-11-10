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
import moment from "moment";

const EmpForm = ({ baseUrl, token, userProfile }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [errors, setErrors] = useState({});

  const totalSteps = 5;

  const handleFormChange = (name, value) => {
    setErrors({ ...errors, [name]: null });
  };
  const submitForm = async () => {
    try {
      const getDataFromSessionStorage = (key) => {
        const serializedData = sessionStorage.getItem(key);
        const data = JSON.parse(serializedData);
        return data;
      };
      let personalInfo = getDataFromSessionStorage("personalInfo");
      let bankInfo = getDataFromSessionStorage("bankInfo");
      let departmentInfo = getDataFromSessionStorage("departmentInfo");
      let academicInfo = getDataFromSessionStorage("academicInfo");
      let certifications = getDataFromSessionStorage("certifications");
      // let profilePhoto = getDataFromSessionStorage("profilePhoto");
      let proExp = getDataFromSessionStorage("proExp");
      if (personalInfo && personalInfo.country_code && personalInfo.mobile_no) {
        personalInfo.mobile_no = personalInfo.country_code + personalInfo.mobile_no;
        delete personalInfo.country_code;
      }
      if (personalInfo && personalInfo.emergency_country_code && personalInfo.emergency_phone_no) {
        personalInfo.emergency_phone_no = personalInfo.emergency_country_code + personalInfo.emergency_phone_no;
        delete personalInfo.emergency_country_code;
      }
      if (!personalInfo?.passport) {
        delete personalInfo.passport_number;
      }
      let userDetials = { ...personalInfo, ...bankInfo, ...departmentInfo ,is_filled:true};
      let response = await axios.patch(
        `${baseUrl}/emp/${userProfile.id}`,
        userDetials,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        proExp.map(async (exp) => {
          let experience = {
            employee_id: userProfile.id,
            exp_organization: exp.exp_organization,
            exp_designation: exp.exp_designation,
            exp_start_date: moment(exp.exp_start_date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            exp_end_date: moment(exp.exp_end_date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
          };
          let res = await axios.post(`${baseUrl}/experience/`, experience, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.status !== 201) {
            toast.error("Form submission failed. Please try again.", {
              position: "top-center",
              autoClose: 3000,
            });
            return
          }
        });


          let education = {
            employee_id: userProfile.id,
            education_level: academicInfo.education_level,
            program: academicInfo.program,
            institute_name: academicInfo.institute_name,
            edu_start_date: moment(academicInfo.edu_start_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
            edu_end_date: moment(academicInfo.edu_end_date, "DD-MM-YYYY").format("YYYY-MM-DD")
          };
          let resEdu = await axios.post(`${baseUrl}/education/`, education, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (resEdu.status !== 201) {
            toast.error("Form submission failed. Please try again.", {
              position: "top-center",
              autoClose: 3000,
            });
            return
          }
          certifications.map(async (crt) => {
            let certification = {
              employee_id: userProfile.id,
              certification_name: crt.certification_name,
              completion_date: crt.completion_date,
              expiry_date: crt.expiry_date,
              certification_body: "string",
            };
            let res = await axios.post(`${baseUrl}/certification/`, certification, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (res.status !== 201) {
              toast.error("Form submission failed. Please try again.", {
                position: "top-center",
                autoClose: 3000,
              });
              return
            }
          });
        


        toast.success("Form submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        sessionStorage.clear();
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error("Form submission failed. Please try again.", {
          position: "top-center",
          autoClose: 3000, // Close after 3 seconds
        });
      }
    } catch (error) {
      toast.error("Form submission failed. Please try again.", {
        position: "top-center",
        autoClose: 3000, // Close after 3 seconds
      });
    }
  };

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
            handleChange={handleFormChange}
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
            handleChange={handleFormChange}
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
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)(EmpForm);
