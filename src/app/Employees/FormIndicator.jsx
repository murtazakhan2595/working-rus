import { BsFillPersonFill, BsFillPinAngleFill, BsFillEnvelopeFill } from 'react-icons/bs'
import { RiGraduationCapFill } from 'react-icons/ri'
import { FaCreditCard } from 'react-icons/fa';

const FormIndicator = ({ currentStep, setCurrentStep }) => {
    const arr2 = [
        { icon: <BsFillPersonFill />, name: 'Personal Information' },
        { icon: <BsFillEnvelopeFill />, name: 'Experience' },
        { icon: <RiGraduationCapFill />, name: 'Academic' },
        { icon: <FaCreditCard />, name: 'Banking' },
        { icon: <BsFillPinAngleFill />, name: 'Department' }
    ];

    return (
        <div className="flex items-center p-2">
            {arr2.map((step, index) => (
                <div
                    key={index}
                    className={`transition-all ${index + 1 <= currentStep
                        ? 'text-black font-bold'
                        : 'text-gray-400'
                        }`}
                >
                    <div className="flex justify-center items-center">
                        <div
                            className={`h-0.5 w-8 ml-1 md:w-8 lg:w-24 ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'
                                }`}
                        ></div>
                        <div
                            className={`text-xs h-6 w-6 p-1 rounded-full border border-[#F9F9F9] flex justify-center items-center text-white ${index + 1 <= currentStep ? 'bg-[#25A8E0]' : 'bg-[#E2E2E2]'
                                }`}
                        >
                            {step.icon}
                        </div>
                        <div className="tracking-wide lg:tracking-widest hidden md:block lg:block">
                            {step.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FormIndicator