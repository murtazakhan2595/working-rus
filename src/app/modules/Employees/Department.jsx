import Joi from 'joi';
import Button from './Button';
import { useState, useEffect } from 'react';
import CustomLoader from '../../../common/CustomLoader';
import Select from "react-select";
import moment from 'moment';
import Datepicker from '../Dashboard/Datepicker';

const jobRoles = [
    { label: 'Intern', value: 'Intern' },
    { label: 'Part-Time', value: 'Part-Time' },
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Freelancer', value: 'Freelancer' }
];

const employeeStatus = [
    { label: 'Active', value: 'active' },
    { label: 'Terminated', value: 'terminated' },
    { label: 'Deceased', value: 'deceased' },
    { label: 'Resigned', value: 'resigned' },
    { label: 'Probation', value: 'probation' },
    { label: 'Notice Period', value: 'notice_period' },
    { label: 'Exit', value: 'exit' },
    { label: 'Absconded', value: 'absconded' },
    { label: 'Legal Case', value: 'legal_case' }
];


const departmentSchema = Joi.object({
    department_name: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label('Department Name')
        .messages({
            "string.empty": `Department Name is required`,
            "string.pattern.base": `Department Name must only contain letters and spaces`,
        }),
    department_position: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label('Position')
        .messages({
            "string.empty": `Position is required`,
            "string.pattern.base": `Position must only contain letters and spaces`,
        }),
    direct_report: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label('Direct Report')
        .messages({
            "string.empty": `Direct Report is required`,
            "string.pattern.base": `Direct Report must only contain letters and spaces`,
        }),
    indirect_report: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label('Indirect Report')
        .messages({
            "string.empty": `Indirect Report is required`,
            "string.pattern.base": `Indirect Report must only contain letters and spaces`,
        }),
    department_manager: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label('Department Manager')
        .messages({
            "string.empty": `Department Manager is required`,
            "string.pattern.base": `Department Manager must only contain letters and spaces`,
        }),
});



const Department = ({ errors, setErrors, prevstep, submitForm }) => {
    const [isLoading, setIsLoading] = useState(false);


    const getDataFromSessionStorage = (key) => {
        const serializedData = sessionStorage.getItem(key);
        const data = JSON.parse(serializedData);
        return data;
    };
    const defaultDeparmentInfo = getDataFromSessionStorage("departmentInfo")
    const intialDepartmentInfo = {
        department_name: defaultDeparmentInfo?.department_name ? defaultDeparmentInfo.department_name : '',
        department_position: defaultDeparmentInfo?.department_position ? defaultDeparmentInfo.department_position : '',
        direct_report: defaultDeparmentInfo?.direct_report ? defaultDeparmentInfo.direct_report : '',
        indirect_report: defaultDeparmentInfo?.indirect_report ? defaultDeparmentInfo.indirect_report : '',
        department_manager: defaultDeparmentInfo?.department_manager ? defaultDeparmentInfo.department_manager : '',
        employee_type: defaultDeparmentInfo?.employee_type ? defaultDeparmentInfo.employee_type : '',
        joining_date: defaultDeparmentInfo?.joining_date ? defaultDeparmentInfo.joining_date : null,
    };
    const [departmentInfo, setDepartmentInfo] = useState(intialDepartmentInfo)


    useEffect(() => {
        setDataInSessionStorage('departmentInfo', departmentInfo)
    }, [departmentInfo])

    const handleNextStep = async () => {
        setIsLoading(true);
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
        } else {
            setIsLoading(true); // Show loader
            await submitForm(); // Submit the form
            setIsLoading(false);
        }
    };
    const setDataInSessionStorage = (key, data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
    };
    const handleChange = (name, value) => {
        setDepartmentInfo({ ...departmentInfo, [name]: value })
        setErrors({ ...errors, [name]: null });

    };

    const handleJoiningDate = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD").toLowerCase();
        handleChange("joining_date", formattedDate);
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
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label
                                        className="font-sfpro tracking-wide 
                  font-medium text-input text-base mb-1"
                                    >
                                        Employee Type:
                                    </label>
                                    <div
                                    // onClick={handleEditClick}
                                    >
                                        <Select
                                            name="employee_type"
                                            value={jobRoles.find(
                                                (option) => option.label === departmentInfo.employee_type
                                            )}
                                            options={jobRoles}
                                            isSearchable={false}
                                            className="focus:outline-none border-none"
                                            onChange={(selectedOption) =>
                                                handleChange("employee_type", selectedOption.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {/* <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label
                    className="font-sfpro tracking-wide 
                  font-medium text-input text-base mb-1"
                  >
                    Employee status:
                  </label>
                  <div
                  // onClick={handleEditClick}
                  >
                    <Select
                      name="employee_status"
                      isDisabled={isEdit ? false : true}
                      value={employeeStatus.find(
                        (option) => option.value === defaultData?.employee_status?.value
                      )}
                      options={employeeStatus}
                      isSearchable={false}
                      className="focus:outline-none border-none"
                      onChange={(selectedOption) => handleEdit("employee_status", selectedOption)}
                    />
                  </div>
                </div> */}
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
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label
                                        htmlFor="date_of_birth"
                                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                                    >
                                        Joining Date:
                                    </label>
                                    <Datepicker
                                        // disabled={isEdit ? false : true}
                                        // readOnly={!isEdit}
                                        day={
                                            departmentInfo.joining_date
                                                ? departmentInfo.joining_date.substr(0, 2)
                                                : null
                                        }
                                        month={
                                            departmentInfo.joining_date
                                                ? departmentInfo.joining_date.substr(3, 2)
                                                : null
                                        }
                                        year={
                                            departmentInfo.joining_date
                                                ? departmentInfo.joining_date.substr(8, 4)
                                                : null
                                        }
                                        name="joining_date"
                                        className="z-50"
                                        selected={moment(departmentInfo.joining_date, "YYYY-MM-DD").toDate()}
                                        // onClick={handleFieldClick}
                                        onChange={handleJoiningDate}
                                    />
                                    {/* {errors.joining_date && (
                    <span className="text-red-500 text-sm ">
                      {errors.joining_date}
                    </span>
                  )} */}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40">
                    <Button onClick={prevstep} text={'Previous'} />
                    <Button onClick={handleNextStep} text={isLoading ? <div className='flex items-center gap-x-2'><span>Submit </span><CustomLoader /></div> : 'Submit'} />

                </div>
            </div >
        </>
    )
}

export default Department