import React, { useState } from 'react'
import PersonalInfo from './PersonalInfo';
import SubmitCV from './SubmitCV';
import ProfessionalExp from './ProfessionalExp';
import AcademicRecords from './AcademicRecords';
import BankDetails from './BankDetails';
import Department from './Department';
import { BsFillPersonFill, BsFillPinAngleFill, BsFillEnvelopeFill } from 'react-icons/bs'
import { RiGraduationCapFill } from 'react-icons/ri'
import { FaCreditCard } from 'react-icons/fa'

const initialData = {
    firstname: '',
    lastname: '',
    fathername: '',
    mothername: '',
    phonenumber: '',
    dateofbirth: '',
    personalemail: '',
    workemail: '',
    currentaddress: '',
    permanentaddress: '',
    nic: '',
    passportnumber: '',
    cv: null,
    emergencyfname: '',
    emergencylname: '',
    emergencypnumber: '',
    relation: '',
    experienceSections: [{
        organization: '',
        designation: '',
        exstartdate: '',
        exenddate: '',
        file: null
    }],
    certification: null,
}
const EmpForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [subStep, setSubStep] = useState(1);
    const [formData, setFormData] = useState(initialData);
    const [fileData, setFileData] = useState([{}])

    const totalSteps = 5;

    const handleFormChange = (name, value, experienceIndex) => {
        if (experienceIndex !== undefined) {
            const updatedExperienceSections = [...formData.experienceSections];
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
        }
    };

    // Next Step
    const nextStep = () => {
        if (currentStep === 2) {
            if (subStep < 2) {
                setSubStep(subStep + 1);
            } else {
                setCurrentStep(currentStep + 1);
                setSubStep(1)
            }
        } else if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep === 2) {
            if (subStep > 1) {
                setSubStep(subStep - 1)
            } else {
                setCurrentStep(currentStep - 1);
                setSubStep(2)
            }
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    const arr2 = [
        { icon: <BsFillPersonFill />, name: 'Personal Information' },
        { icon: <BsFillEnvelopeFill />, name: 'Experience' },
        { icon: <RiGraduationCapFill />, name: 'Academic' },
        { icon: <FaCreditCard />, name: 'Banking' },
        { icon: <BsFillPinAngleFill />, name: 'Department' }
    ];

    // const handleFileChangeStep1 = (selectedFile) => {
    //     setFileData([...fileData, { step1File: selectedFile }]);
    // };

    // const handleFileChangeStep2 = (selectedFile) => {
    //     setFileData([...fileData, { step2File: selectedFile }]);
    // };

    // const handleFileChangeStep3 = (selectedFile) => {
    //     setFileData([...fileData, { step3File: selectedFile }]);
    // };

    // const handleFileChangeStep4 = (selectedFile) => {
    //     setFileData([...fileData, { step4File: selectedFile }]);
    // };


    const submitForm = () => {
        console.log(formData)
        console.log(fileData)

        setFormData(initialData)
    }

    return (
        <>
            <div className='py-6 bg-[#F9F9F9] lg:w-full'>
                <h1 className=' text-center font-bold font-sfpro text-lg tracking-wide lg:text-2xl md:mb-6'>Employment Information</h1>
                <div className='flex items-center p-2 '>
                    {arr2.map((step, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer transition-all ${index + 1 <= currentStep
                                ? 'text-black font-bold ' // Active
                                : 'text-gray-400' // Inactive
                                }`}
                            onClick={() => setCurrentStep(index + 1)}
                        >
                            <div className='flex justify-center items-center'>
                                <div className={`h-0.5 w-8 ml-1 md:w-8 lg:w-24 ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'}`}></div>
                                <div className={`text-xs h-6 w-6 p-1 rounded-full border border-[#F9F9F9] flex justify-center items-center text-white ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'}`}>
                                    {step.icon}
                                </div>
                                <div className='tracking-wide lg:tracking-widest hidden md:block lg:block'>{step.name}</div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className='flex justify-end text-sm text-baseBlue mt-2 mr-6 lg:mr-8
                 lg:text-base'>Step {currentStep} of {totalSteps}</div>

                {currentStep === 1 &&
                    <PersonalInfo formData={formData} nextstep={nextStep}
                        handleChange={handleFormChange} />
                }
                {currentStep === 2 && subStep === 1 && (
                    <SubmitCV substep={subStep} prevstep={prevStep} nextstep={nextStep}
                        handleChange={handleFormChange} />
                )}
                {currentStep === 2 && subStep === 2 && (
                    <ProfessionalExp formData={formData} substep={subStep} prevstep={prevStep}
                        nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 3 && (
                    <AcademicRecords formData={formData} prevstep={prevStep} nextstep={nextStep}
                        handleChange={handleFormChange} />
                )}
                {currentStep === 4 && (
                    <BankDetails formData={formData} prevstep={prevStep} nextstep={nextStep} handleChange={handleFormChange} />
                )}
                {currentStep === 5 && (
                    <Department formData={formData} prevstep={prevStep} handleChange={handleFormChange} submitForm={submitForm} />
                )}
            </div>
        </>
    )
}

export default EmpForm