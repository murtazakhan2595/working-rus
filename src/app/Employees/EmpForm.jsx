import React, { useState } from 'react'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonalInfo from './PersonalInfo';
import SubmitCV from './SubmitCV';
import ProfessionalExp from './ProfessionalExp';
import AcademicRecords from './AcademicRecords';
import BankDetails from './BankDetails';
import Department from './Department';
import FormIndicator from './FormIndicator';
import { useNavigate } from 'react-router-dom';

const initialData = {
    // firstname: '',
    // lastname: '',
    // fathername: '',
    // mothername: '',
    // phonenumber: '',
    // dateofbirth: '',
    // personalemail: '',
    // workemail: '',
    // currentaddress: '',
    // permanentaddress: '',
    // nic: '',
    // passportnumber: '',
    // cv: null,
    // emergencyfname: '',
    // emergencylname: '',
    // emergencypnumber: '',
    // relation: '',
    // experienceSections: null,
    // certification: null,
}
const EmpForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [subStep, setSubStep] = useState(1);
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const totalSteps = 5;

    const handleFormChange = (name, value, experienceIndex) => {
        if (experienceIndex !== undefined) {
            const updatedExperienceSections = formData.experienceSections ? [...formData.experienceSections] : [];
            if (updatedExperienceSections.length <= experienceIndex) {
                for (let i = updatedExperienceSections.length; i <= experienceIndex; i++) {
                    updatedExperienceSections.push({});
                }
            }

            updatedExperienceSections[experienceIndex] = {
                ...updatedExperienceSections[experienceIndex],
                [name]: value
            };

            setFormData({
                ...formData,
                experienceSections: updatedExperienceSections
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
            setErrors({ ...errors, [name]: null });
        }
    };

    const submitForm = async () => {
        try {
            console.log(formData);
            await axios.post('your-api-endpoint', formData);
            toast.success('Form submitted successfully!', {
                position: 'top-center',
                autoClose: 3000, // Close after 3 seconds
            });
            setTimeout(() => {
                navigate('/');
            }, 3000);

            setFormData(initialData);
        } catch (error) {
            toast.error('Form submission failed. Please try again.', {
                position: 'top-center',
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
                <FormIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

                <div className="flex justify-end text-sm text-baseBlue mt-2 mr-6 lg:mr-8 lg:text-base">
                    Step {currentStep} of {totalSteps}
                </div>

                {currentStep === 1 && (
                    <PersonalInfo formData={formData} nextstep={nextStep} handleChange={handleFormChange} errors={errors} setErrors={setErrors} />
                )}
                {currentStep === 2 && subStep === 1 && (
                    <SubmitCV formData={formData} errors={errors} setErrors={setErrors} substep={subStep} prevstep={prevStep} nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 2 && subStep === 2 && (
                    <ProfessionalExp formData={formData} errors={errors} setErrors={setErrors} substep={subStep} prevstep={prevStep} nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 3 && (
                    <AcademicRecords formData={formData} errors={errors} setErrors={setErrors} prevstep={prevStep} nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 4 && (
                    <BankDetails formData={formData} errors={errors} setErrors={setErrors} prevstep={prevStep} nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 5 && (
                    <Department formData={formData} prevstep={prevStep} errors={errors} setErrors={setErrors} handleChange={handleFormChange} submitForm={submitForm} />
                )}
            </div>
            <ToastContainer />
        </>
    );
};

export default EmpForm;