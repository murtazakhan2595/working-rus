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
import { HeadOfDepartment, department, employeeStatus, jobRoles, workplaceTypes } from '../../../data/Data';
import { getEmployeeDepartemtInfoData, saveEmployeeDepartemtInfoData } from '../../hooks/employee';
import { EmployeeDepartmentInfo } from '../../utils/Types/Employee'
import { validationDepartmentInfoFormSchema } from '../../utils/FormSchema/employeeFormSchema'
import { getAllCountries } from 'countries-and-timezones';

const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
}));

function getManagerSelected(managers, managersList) {
    if (managers) {
        managers = managers.split(', ') || [];
        const matchingObjects = managersList.filter(obj => {
            return managers.find(element => obj.label === element);
        });

        return matchingObjects;
    }

    return [];

}

const Department = ({ errors, setErrors, prevstep, submitForm, userProfile, baseUrl, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [managers, setManagers] = useState([]);
    const [departmentInfo, setDepartmentInfo] = useState({})

    useEffect(() => {
        getEmployeeDepartemtInfoData(baseUrl, userProfile?.id, token).then(response => {
            setDepartmentInfo(response);
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/emplistofmanager/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    let managersList = response.data;
                    managersList = managersList
                        ?.filter(manager => manager.username)
                        .map((manager) => ({
                            value: manager.id,
                            label: manager.username,
                        }))
                    setManagers(managersList);
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
        const { error } = validationDepartmentInfoFormSchema.validate(
            {
                department_name: departmentInfo.department_name,
                department_position: departmentInfo.department_position,
                department_manager: departmentInfo.department_manager,
                employee_status: departmentInfo.employee_status,
                employee_type: departmentInfo.employee_type,
                employee_work_type: departmentInfo.employee_work_type,
                employee_location: departmentInfo.employee_location,
                joining_date: departmentInfo.joining_date,
                direct_report: departmentInfo.direct_report,
            },
            { abortEarly: false }
        );
        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;
            });
            setErrors(validationErrors);
        } else {
            departmentInfo.is_filled = true;
            saveEmployeeDepartemtInfoData(baseUrl, userProfile?.id, token, departmentInfo);
            await submitForm();
            setIsLoading(false);
        }
    };

    const handleChange = (name, value, values) => {
        if (name === 'employee_type' || name === 'employee_status') {
            setDepartmentInfo({ ...departmentInfo, [name]: value.value });
        } else if (name === "department_name") {
            setDepartmentInfo({ ...departmentInfo, [name]: value.value });
        }
        if (name === "indirect_report" || name === "direct_report") {
            const updatedValues = values || [];
            const uniqueValues = [...new Set(updatedValues.map(option => option.label))];
            setDepartmentInfo({
                ...departmentInfo,
                [name]: uniqueValues.join(', '), // Convert array to string
            });
        } else {
            setDepartmentInfo({ ...departmentInfo, [name]: value });
        }
        setErrors({ ...errors, [name]: null });
    };

    const handleJoiningDate = (date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
        handleChange("joining_date", formattedDate);
    };

    const HeadOfDepartmentOptions = HeadOfDepartment?.map((manager) => ({
        label: (
            <div>
                <div style={{ fontWeight: 'bold', color: '#000' }}>{manager?.label?.split(' - ')[0]}</div>
                <div style={{ fontSize: '13px', color: '#777', fontWeight: 'normal' }}>{manager?.label?.split(' - ')[1]}</div>
            </div>
        ),
        value: manager.value
    }));

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
                                    {/* <input type="text" value={departmentInfo.department_name} name="department_name" id="" placeholder='Department Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    /> */}

                                    <Select
                                        name="department_name"
                                        className="focus:outline-none border-none"
                                        options={department}
                                        value={department.find(
                                            (option) => option.label === departmentInfo.department_name
                                        )}
                                        onChange={(selectedOption) =>
                                            handleChange("department_name", selectedOption.value)
                                        }
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
                                            value={jobRoles?.find(
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
                                    {errors.employee_type && <span className="text-red-500 text-sm ">{errors.employee_type}</span>}

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
                                            value={employeeStatus?.find(
                                                (option) => option.label === departmentInfo?.employee_status
                                            )}
                                            options={employeeStatus}
                                            isSearchable={false}
                                            className="focus:outline-none border-none"
                                            onChange={(selectedOption) => handleChange("employee_status", selectedOption.value)}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                        {errors.employee_status && <span className="text-red-500 text-sm ">{errors.employee_status}</span>}

                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label
                                        className="font-sfpro tracking-wide
                  font-medium text-input text-base mb-1"
                                    >
                                        Employee Work Type:
                                    </label>
                                    <div
                                    // onClick={handleEditClick}
                                    >
                                        <Select
                                            menuPlacement="top"
                                            name="employee_type"
                                            value={workplaceTypes?.find(
                                                (option) => option.label === departmentInfo.employee_work_type
                                            )}
                                            options={workplaceTypes}
                                            isSearchable={false}
                                            className="focus:outline-none border-none"
                                            onChange={(selectedOption) =>
                                                handleChange("employee_work_type", selectedOption.value)
                                            }
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    {errors.employee_work_type && <span className="text-red-500 text-sm ">{errors.employee_work_type}</span>}

                                </div>
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label
                                        className="font-sfpro tracking-wide
                  font-medium text-input text-base mb-1"
                                    >
                                        Employee Location:
                                    </label>
                                    <div
                                    // onClick={handleEditClick}
                                    >
                                        <Select
                                            menuPlacement="top"
                                            name="employee_location"
                                            // value={departmentInfo?.employee_status}
                                            value={countryOptions?.find(
                                                (option) => option.label === departmentInfo?.employee_location
                                            )}
                                            options={countryOptions}
                                            isSearchable={false}
                                            className="focus:outline-none border-none"
                                            onChange={(selectedOption) => handleChange("employee_location", selectedOption.value)}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                        {errors.employee_location && <span className="text-red-500 text-sm ">{errors.employee_location}</span>}

                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                                    <label htmlFor="direct_report" className='font-sfpro tracking-wide font-medium text-input text-base mb-1'>Direct Report:</label>

                                    <CustomSelect
                                        menuPlacement="top"
                                        name='direct_report'
                                        placeholder="Search Direct Report To..."
                                        value={getManagerSelected(departmentInfo.direct_report, managers)}
                                        onChange={(selectedOptions) => handleChange("direct_report", selectedOptions, selectedOptions)}
                                        options={managers}
                                        isEdit={true}
                                        isMulti={true}
                                    />


                                    {errors.direct_report && <span className="text-red-500 text-sm ">{errors.direct_report}</span>}
                                </div>

                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <div className='flex gap-x-3'>

                                        <label htmlFor="indirect_report" className='font-sfpro tracking-wide font-medium text-input text-base mb-1'>
                                            Indirect Report:
                                        </label>

                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-sm'>Yes</p>
                                            <input type="checkbox"
                                                name='is_indirect_report_applicable_yes'
                                                checked={departmentInfo.is_indirect_report_applicable}
                                                onChange={(e) => handleChange('is_indirect_report_applicable', e.target.checked)}
                                            />
                                        </div>
                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-sm'>No</p>
                                            <input type="checkbox"
                                                name='is_indirect_report_applicable_no'
                                                checked={!departmentInfo.is_indirect_report_applicable}
                                                onChange={(e) => handleChange('is_indirect_report_applicable', !e.target.checked)}
                                            />
                                        </div>

                                    </div>
                                    {departmentInfo.is_indirect_report_applicable &&
                                        <>
                                            <CustomSelect
                                                menuPlacement="top"
                                                name='indirect_report'
                                                placeholder="Search Direct Report To..."
                                                value={getManagerSelected(departmentInfo.indirect_report, managers)}
                                                onChange={(selectedOptions) => handleChange("indirect_report", selectedOptions, selectedOptions)}
                                                options={managers}
                                                isEdit={true}
                                                isMulti={true}
                                            />

                                            {errors.indirect_report && <span className="text-red-500 text-sm ">{errors.indirect_report}</span>}
                                        </>
                                    }
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">

                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2  lg:w-[45.5%]'>
                                    <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                        text-input text-base mb-1'>Department Head:</label>
                                    <Select
                                        menuPlacement="top"
                                        name="department_manager"
                                        value={HeadOfDepartmentOptions.find(
                                            (option) => option.value === departmentInfo?.department_manager
                                        )}
                                        onChange={(selectedOption) =>
                                            handleChange("department_manager", selectedOption.value)
                                        }
                                        options={HeadOfDepartmentOptions}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            control: (provided) => ({
                                                ...provided,
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                fontSize: "16px",
                                                fontWeight: state.isSelected ? "bold" : "normal",
                                                color: state.isSelected ? "#000" : "#777",
                                                padding: "8px 12px",
                                                backgroundColor: state.isSelected ? '#E0F3FB' : 'transparent'
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                            }),
                                            scrollbarWidth: (base) => ({
                                                ...base,
                                                borderRadius: "8px",
                                                backgroundColor: "#ccc",
                                            }),
                                            dropdownIndicator: (provided) => ({
                                                ...provided,
                                                color: "#555",
                                            }),
                                        }}
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
                                    {errors.joining_date && (
                                        <span className="text-red-500 text-sm ">
                                            {errors.joining_date}
                                        </span>
                                    )}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40">
                    <Button onClick={prevstep} text={'Previous'} />
                    {/* <Button onClick={handleNextStep} text={isLoading ? <div className='flex items-center gap-x-2'><span>Submit </span><CustomLoader /></div> : 'Submit'} /> */}
                    <Button
                        onClick={handleNextStep}
                        text={
                            isLoading ? (
                                <div className='flex items-center gap-x-2 p-2 '>
                                    <span>Submit </span>
                                    <CustomLoader />
                                </div>
                            ) : (
                                'Submit'
                            )
                        }
                    />

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