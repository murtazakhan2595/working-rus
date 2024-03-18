import { useState } from 'react'; 
import { BsFillPersonFill, BsFillPinAngleFill, BsFillEnvelopeFill } from 'react-icons/bs'
import { RiGraduationCapFill } from 'react-icons/ri'
import { FaCcVisa, FaCreditCard } from 'react-icons/fa';


const FormIndicator = ({ currentStep, setCurrentStep }) => {
    const arr2 = [
        { icon: <BsFillPersonFill />, name: 'Employee Profile', step: 1 },
        { icon: <FaCcVisa />, name: 'Visa Details', step: 2 },
        { icon: <BsFillEnvelopeFill />, name: 'Experience', step: 3 },
        { icon: <RiGraduationCapFill />, name: 'Academic', step: 4 },
        { icon: <FaCreditCard />, name: 'Banking', step: 5 },
        { icon: <BsFillPinAngleFill />, name: 'Work Information', step: 6 }
    ];

    // Function to handle click on a tab
    const handleTabClick = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className="flex items-center p-2">
            {arr2.map((step, index) => (
                <div
                    key={index}
                    className={`transition-all ${index + 1 <= currentStep
                        ? 'text-black font-bold cursor-pointer' // Add cursor-pointer for indicating it's clickable
                        : 'text-gray-400'
                        }`}
                    onClick={() => handleTabClick(step.step)} // Add onClick handler to navigate to the respective step
                >
                    <div className="flex justify-center items-center">
                        <div
                            className={`h-0.5 w-6 ml-1 md:w-8 lg:w-12 cursor-pointer ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'
                                }`}
                        ></div>
                        <div
                            className={`text-xs h-6 w-6 p-1 rounded-full border border-[#F9F9F9] flex justify-center items-center cursor-pointer text-white ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'
                                }`}
                        >
                            {step.icon}
                        </div>
                        <div className="tracking-wide lg:tracking-widest hidden md:block lg:block cursor-pointer">
                            {step.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FormIndicator;
