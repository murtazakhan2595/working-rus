import Joi from 'joi';
import Button from './Button';
import {useState , useEffect} from 'react'

const departmentSchema = Joi.object({
    department_name: Joi.string().required().label('Department Name'),
    department_position: Joi.string().required().label('Position'),
    direct_report: Joi.string().required().label('Direct Report'),
    indirect_report: Joi.string().required().label('Indirect Report'),
    department_manager: Joi.string().required().label('Department Manager'),
});

const Department = ({ errors, setErrors, prevstep, submitForm }) => {

    const getDataFromSessionStorage = (key) => {
        const serializedData = sessionStorage.getItem(key);
        const data = JSON.parse(serializedData);
        return data;
      };
      const defaultDeparmentInfo = getDataFromSessionStorage("departmentInfo")
      const intialDepartmentInfo = { 
        department_name : defaultDeparmentInfo?.department_name ? defaultDeparmentInfo.department_name : '' ,
        department_position : defaultDeparmentInfo?.department_position ? defaultDeparmentInfo.department_position : '',
        direct_report : defaultDeparmentInfo?.direct_report ? defaultDeparmentInfo.direct_report : '',
        indirect_report : defaultDeparmentInfo?.indirect_report ? defaultDeparmentInfo.indirect_report : '',
        department_manager : defaultDeparmentInfo?.department_manager ? defaultDeparmentInfo.department_manager :''
         };
      const [departmentInfo , setDepartmentInfo] = useState(intialDepartmentInfo)


      useEffect(() => {
        setDataInSessionStorage('departmentInfo',departmentInfo)
      }, [departmentInfo])

    const handleNextStep = () => {
        const { error } = departmentSchema.validate(
            {
                department_name: departmentInfo.department_name,
                department_position: departmentInfo.department_position,
                direct_report: departmentInfo.direct_report,
                indirect_report: departmentInfo.indirect_report,
                department_manager: departmentInfo.department_manager,
            },
            { abortEarly: false }
        );

        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;;
            });
            setErrors(validationErrors);
            console.log(validationErrors)
        } else {
            // Proceed to the next step
            submitForm();
        }
    };
    const setDataInSessionStorage = (key, data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
      };
    const handleChange = (name, value) => {
        setDepartmentInfo({...departmentInfo,[name]:value})
        setErrors({ ...errors, [name]: null });
       
    };
    return (
        <>
            <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
                <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Department Information:</h2>
                <div className='flex flex-col md:flex-row lg:gap-x-36'>
                    <div className='order-2 md:order-1 md:w-[55%]'>
                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="department_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Name:</label>
                                    <input type="text" value={departmentInfo.department_name} name="department_name" id="" placeholder='Department Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.department_name && <span className="text-red-500 text-sm ">{errors.department_name}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="department_position" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Position:</label>
                                    <input type="text" value={departmentInfo.department_position} name="department_position" id="" placeholder='Position Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.department_position && <span className="text-red-500 text-sm ">{errors.department_position}</span>}

                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="direct_report" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Direct Report:</label>
                                    <input type="text" value={departmentInfo.direct_report} name="direct_report" id="" placeholder='Direct Report Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.direct_report && <span className="text-red-500 text-sm ">{errors.direct_report}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="indirect_report" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Indirect Report:</label>
                                    <input type="text" value={departmentInfo.indirect_report} name="indirect_report" id="" placeholder='Indirect Report Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.indirect_report && <span className="text-red-500 text-sm ">{errors.indirect_report}</span>}
                                </div>

                            </div>

                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2 lg:w-[45.5%]'>
                                    <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Manager:</label>
                                    <input type="text" value={departmentInfo.department_manager} name="department_manager" id="" placeholder='Department Manager Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.department_manager && <span className="text-red-500 text-sm ">{errors.department_manager}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40">
                    <Button onClick={prevstep} text={'Previous'} />
                    <Button onClick={handleNextStep} text={'Submit'} />

                </div>
            </div >
        </>
    )
}

export default Department