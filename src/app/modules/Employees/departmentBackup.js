import Joi from 'joi';
import Button from './Button';
import { useState, useEffect } from 'react';
import CustomLoader from '../../../common/CustomLoader';
import Select from "react-select";
import moment from 'moment';
import Datepicker from '../Dashboard/Datepicker';
import CustomSelect from '../UpdateEmployee/customSelect';
import axios from "axios";
import { connect } from 'react-redux';

const jobRoles = [
    { label: 'Intern', value: 'Intern' },
    { label: 'Part-Time', value: 'Part-Time' },
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Freelancer', value: 'Freelancer' }
];

const employeeStatus = [
    { label: 'Active', value: 'Active' },
    { label: 'Terminated', value: 'Terminated' },
    { label: 'Deceased', value: 'Deceased' },
    { label: 'Resigned', value: 'Resigned' },
    { label: 'Probation', value: 'Probation' },
    { label: 'Notice Period', value: 'Notice Period' },
    { label: 'Exit', value: 'Exit' },
    { label: 'Absconded', value: 'Absconded' },
    { label: 'Legal Case', value: 'Legal Case' }
];

const HeadOfDepartment = [
    { label: 'Naveed (CEO)', value: 'Naveed' },
    { label: 'Komal (Peoples Teams Head)', value: 'Komal' },
    { label: 'Farhan (HR Manager)', value: 'Farhan' },
    { label: 'Arshad Ali (Business Development & Sales)', value: 'Arshad Ali' },
    { label: 'Haris (Pre-Sales)', value: 'Haris' },
    { label: 'Sadia (Project Management)', value: 'Sadia' },
    { label: 'Asra (Front End Lead)', value: 'Asra' },
    { label: 'Shujat (Backend Lead)', value: 'Shujat' },
    { label: 'Faisal (Operations)', value: 'Faisal' },
    { label: 'Imran (Marketing)', value: 'Imran' },
    { label: 'Prakash (VP Sales)', value: 'Prakash' },
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
    direct_report: Joi.string().required(),
    // indirect_report: Joi.string().required(),
    department_manager: Joi.string().required()
});



const Department = ({ errors, setErrors, prevstep, submitForm, baseUrl, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [managers, setManagers] = useState([]);
    const [showIndirectReport, setShowIndirectReport] = useState(false);




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
        indirect_report: defaultDeparmentInfo?.indirect_report ? defaultDeparmentInfo.indirect_report : null,
        department_manager: defaultDeparmentInfo?.department_manager ? defaultDeparmentInfo.department_manager : '',
        employee_type: defaultDeparmentInfo?.employee_type ? defaultDeparmentInfo.employee_type : '',
        employee_status: defaultDeparmentInfo?.employee_status ? defaultDeparmentInfo.employee_status : '',
        joining_date: defaultDeparmentInfo?.joining_date ? defaultDeparmentInfo.joining_date : null,
    };
    const [departmentInfo, setDepartmentInfo] = useState(intialDepartmentInfo)

    useEffect(() => {
        setDataInSessionStorage('departmentInfo', departmentInfo)
    }, [departmentInfo])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/emp/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setManagers(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors here if needed
            }
        };

        fetchData(); // Call the async function to fetch data
    }, []);

    const handleNextStep = async () => {
        setIsLoading(true);
        await submitForm();
        setIsLoading(false);

        // const { error } = departmentSchema.validate(
        //     {
        //         department_name: departmentInfo.department_name,
        //         department_position: departmentInfo.department_position,
        //         direct_report: departmentInfo.direct_report,
        //         indirect_report: departmentInfo.indirect_report,
        //         department_manager: departmentInfo.department_manager,
        //     },
        //     { abortEarly: false }
        // );

        // if (error) {
        //     const validationErrors = {};
        //     error.details.forEach((detail) => {
        //         validationErrors[detail.path[0]] = detail.message;
        //     });
        //     setErrors(validationErrors);
        // } else {
        //     await submitForm(); 
        //     setIsLoading(false);
        // }
    };

    const setDataInSessionStorage = (key, data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
    };


    const handleChange = (name, value, values) => {
        // Check if the name is 'employee_type' or 'employee_status'
        if (name === 'employee_type' || name === 'employee_status') {
            setDepartmentInfo({ ...departmentInfo, [name]: value.value });
        } else if (name === "indirect_report" || name === "direct_report") {
            const updatedValues = values || []; // In case 'values' is null
            const uniqueValues = [...new Set(updatedValues.map(option => option.label))]; // Extract labels
            setDepartmentInfo({
                ...departmentInfo,
                [name]: uniqueValues.join(', '), // Convert array to string
            });
        } else {
            setDepartmentInfo({ ...departmentInfo, [name]: value });
        }
        // Clear errors for the updated field
        setErrors({ ...errors, [name]: null });
    };

    const handleJoiningDate = (date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
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
                                            menuPlacement="top"
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
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
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
                                            menuPlacement="top"
                                            name="employee_status"
                                            // value={departmentInfo?.employee_status}
                                            value={employeeStatus.find(
                                                (option) => option.label === departmentInfo?.employee_status
                                            )}
                                            options={employeeStatus}
                                            isSearchable={false}
                                            className="focus:outline-none border-none"
                                            onChange={(selectedOption) => handleChange("employee_status", selectedOption.value)}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}

                                        />

                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label htmlFor="direct_report" className='font-sfpro tracking-wide font-medium
        text-input text-base mb-1'>Direct Report:</label>
                                    <CustomSelect
                                        menuPlacement="top"
                                        name='direct_report'
                                        placeholder="Search Direct Report To..."
                                        // value={managers.filter(manager => defaultDeparmentInfo.direct_report.includes(manager.label))}
                                        value={managers.find(manager => manager.label === defaultDeparmentInfo?.direct_report)}
                                        onChange={(selectedOption) => handleChange("direct_report", selectedOption, selectedOption)}
                                        // onChange={(selectedOptions) => handleEdit("direct_report", selectedOptions.map(option => option.label))}
                                        options={managers
                                            ?.filter(manager => manager.username) // Filter managers with user_role equal to 2
                                            .map((manager) => ({
                                                value: manager.id,
                                                label: manager.username,
                                            }))}
                                        isEdit={true} // Pass down the isEdit prop
                                        isMulti={true}
                                    />
                                    {errors.direct_report && <span className="text-red-500 text-sm ">{errors.direct_report}</span>}
                                </div>

                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <div className='flex gap-x-3'>

                                        <label htmlFor="indirect_report" className='font-sfpro tracking-wide font-medium text-input text-base mb-1'>
                                            Indirect Report:
                                        </label>

                                        <div className='flex items-center gap-2'>
                                            <input
                                                type="checkbox"
                                                checked={showIndirectReport}
                                                onChange={() => setShowIndirectReport(!showIndirectReport)}
                                            />
                                            <span>Yes</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type="checkbox"
                                                checked={!showIndirectReport}
                                                onChange={() => setShowIndirectReport(!showIndirectReport)}
                                            />
                                            <span>No</span>
                                        </div>
                                    </div>
                                    {showIndirectReport &&
                                        <>

                                            <CustomSelect
                                                menuPlacement="top"
                                                name='indirect_report'
                                                placeholder="Search Indirect Report To..."
                                                value={managers.find(manager => manager.label === defaultDeparmentInfo?.indirect_report)}
                                                onChange={(selectedOption) => handleChange("indirect_report", selectedOption, selectedOption)}
                                                // onChange={(selectedOptions) => handleEdit("indirect_report", selectedOptions.map(option => option.label))}
                                                options={managers
                                                    ?.filter(manager => manager.username) // Filter managers with user_role equal to 2
                                                    .map((manager) => ({
                                                        value: manager.id,
                                                        label: manager.username,
                                                    }))}
                                                isEdit={true} // Pass down the isEdit prop
                                                isMulti={true}
                                            />
                                            {errors.indirect_report && <span className="text-red-500 text-sm ">{errors.indirect_report}</span>}
                                        </>
                                    }
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">

                                {/* <div className='flex flex-col mt-2 md:mt-5 md:w-1/2 lg:w-[45.5%]'>
                                    <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                                   text-input text-base mb-1'>Department Manager:</label>
                                    <input type="text" value={departmentInfo.department_manager} name="department_manager" id="" placeholder='Department Manager Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.department_manager && <span className="text-red-500 text-sm ">{errors.department_manager}</span>}
                                </div> */}
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2  lg:w-[45.5%]'>
                                    <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                        text-input text-base mb-1'>Department Head:</label>
                                    <Select
                                        // isDisabled={isEdit ? false : true}
                                        menuPlacement="top"
                                        name='department_manager'
                                        value={HeadOfDepartment.find(manager => manager.label === departmentInfo?.department_manager)}
                                        onChange={(selectedOption) => handleChange("department_manager", selectedOption.value)}
                                        options={HeadOfDepartment}
                                        // options={managers
                                        //   ?.filter(manager => manager.user_role === 2) // Filter managers with user_role equal to 2
                                        //   .map((manager) => ({
                                        //     value: manager.id,
                                        //     label: manager.username,
                                        //   }))}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
                                                ? departmentInfo.joining_date.substr(6, 4)
                                                : null
                                        }
                                        name="joining_date"
                                        className="z-50"
                                        selected={moment(departmentInfo.joining_date, "DD-MM-YYYY").toDate()}
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

const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(Department);