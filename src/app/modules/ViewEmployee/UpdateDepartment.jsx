import Joi from 'joi';
import Button from './Button';
import { useState, useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import CustomLoader from '../../../common/CustomLoader';
import { BiEdit } from 'react-icons/bi';
import moment from 'moment';
import Datepicker from "../Dashboard/Datepicker";
import Select from "react-select";
import CustomSelect from './customSelect';
import { HeadOfDepartment } from '../../../data/Data';

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
  indirect_report: Joi.string().required(),
  department_manager: Joi.string().required()
});

const Department = ({ errors, setErrors, prevstep, token,
  userProfile,
  baseUrl,
}) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };
  let [isEdit, setIsEdit] = useState(false);
  let [cancelBox, setCancelBox] = useState(false);
  let [defaultData, setDefaultData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate()

  const id = userProfile.id;
  // const { id } = useParams();


  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      const employeeData = employeeResponse.data;
      if (employeeData) {
        const departmentObj = {
          department_name: employeeData.department_name,
          department_position: employeeData.department_position,
          direct_report: employeeData.direct_report,
          indirect_report: employeeData.indirect_report,
          is_indirect_report_applicable: employeeData.is_indirect_report_applicable,
          department_manager: employeeData.department_manager,
          joining_date: employeeData.joining_date,
          employee_type: employeeData.employee_type,
          employee_status: employeeData.employee_status
        };
        setDefaultData(departmentObj);

        // Fetch managers
        const response = await axios.get(`${baseUrl}/emp/`, { headers });

        if (response.status === 200) {
          setManagers(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [isEdit]);

  useEffect(() => {
    setDataInSessionStorage('UpdatedDepartmentInfo', defaultData)
  }, [defaultData])

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = departmentSchema.validate(
      {
        department_name: defaultData.department_name,
        department_position: defaultData.department_position,
        direct_report: defaultData.direct_report,
        indirect_report: defaultData.indirect_report,
        department_manager: defaultData.department_manager,
        // joining_date: defaultData.joining_date,
      },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      setIsLoading(false);
    } else {
      try {
        setErrors({});
        let UpdatedDepartmentInfo = getDataFromSessionStorage('UpdatedDepartmentInfo');
        let response = await axios.patch(`${baseUrl}/emp/${id}`, UpdatedDepartmentInfo, { headers });
        if (response.status === 200) {
          setIsEdit(!isEdit);
          toast.success('Department Information Updated!', {
            position: 'top-right',
            autoClose: 3000,
          });
          sessionStorage.clear(); // Remove the redundant sessionStorage.clear() here
        }
      } catch (error) {
        console.error('Error saving data:', error);
        toast.error('Failed to update department information. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false); // Set isLoading to false regardless of success or failure
      }
    }
  };

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };

  // const handleEdit = (name, value) => {
  //   setDefaultData({ ...defaultData, [name]: value });
  //   setErrors({ ...errors, [name]: null });
  // };

  const handleEdit = (name, value, values) => {
    // Check if the name is 'employee_type' or 'employee_status'
    if (name === 'employee_type' || name === 'employee_status') {
      setDefaultData({ ...defaultData, [name]: value.value });
    } else if (name === "indirect_report" || name === "direct_report") {
      const updatedValues = values || []; // In case 'values' is null
      const uniqueValues = [...new Set(updatedValues.map(option => option.label))]; // Extract labels
      setDefaultData({
        ...defaultData,
        [name]: uniqueValues.join(', '), // Convert array to string
      });
    } else {
      setDefaultData({ ...defaultData, [name]: value });
    }
    // Clear errors for the updated field
    setErrors({ ...errors, [name]: null });
  };



  const handleJoiningDate = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleEdit("joining_date", formattedDate);
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
        <div className="flex justify-between">
          <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
            Department Information:
          </h2>
          <div className="flex gap-2">
            {isEdit ? (
              null
            ) : (
              <button
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
                className="bg-baseBlue rounded-full text-white p-3"
              >
                <BiEdit className="text-xl" />
              </button>
            )}
          </div>
        </div>
        <div className='flex flex-col md:flex-row lg:gap-x-36'>
          <div className='order-2 md:order-1 md:w-[55%]'>
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="department_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Name:</label>
                  <input type="text" readOnly={!isEdit} value={defaultData.department_name} name="department_name" id="" placeholder='Department Name Here'
                    className={`${isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                    onClick={() => setIsEdit(true)}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                  />
                  {errors.department_name && <span className="text-red-500 text-sm ">{errors.department_name}</span>}
                </div>
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="department_position" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Position:</label>
                  <input type="text" readOnly={!isEdit} value={defaultData.department_position} name="department_position" id="" placeholder='Position Here'
                    className={`${isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                    onClick={() => setIsEdit(true)}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                    onClick={() => setIsEdit(true)}
                  >
                    <Select
                      menuPlacement="top"
                      name="employee_type"
                      isDisabled={isEdit ? false : true}
                      value={jobRoles.find(option => option.label === defaultData.employee_type)}
                      options={jobRoles}
                      isSearchable={false}
                      className="focus:outline-none border-none"
                      onChange={selectedOption => handleEdit("employee_type", selectedOption)}
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
                    <div onClick={() => setIsEdit(true)}>
                      <Select
                        menuPlacement="top"
                        isDisabled={isEdit ? false : true}
                        name="employee_status"
                        value={employeeStatus.find(option => option.label === defaultData.employee_status)}
                        onChange={(selectedOption) => handleEdit("employee_status", selectedOption)}
                        options={employeeStatus}
                        isSearchable={false}
                        className="focus:outline-none border-none"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label htmlFor="direct_report" className='font-sfpro tracking-wide font-medium
    text-input text-base mb-1'>Direct Report:</label>
                  <div onClick={() => setIsEdit(true)}>
                    <CustomSelect
                      menuPlacement="top"
                      name='direct_report'
                      placeholder="Search Direct Report To..."
                      value={managers.find(manager => manager.label === defaultData.direct_report)}
                      onChange={(selectedOption) => handleEdit("direct_report", selectedOption, selectedOption)}
                      options={managers
                        ?.filter(manager => manager.username)
                        .map((manager) => ({
                          value: manager.id,
                          label: manager.username,
                        }))}
                      isEdit={isEdit} // Pass the isEdit prop
                      isMulti={true}
                    />
                  </div>
                  {errors.direct_report && <span className="text-red-500 text-sm ">{errors.direct_report}</span>}
                </div>



                <div className='  mt-2 md:mt-5 md:w-1/2'>
                  <div className='flex gap-x-3'>

                    <label htmlFor="indirect_report" className='font-sfpro tracking-wide font-medium text-input text-base mb-1'>
                      Indirect Report:
                    </label>

                    <div className='flex items-center gap-x-2'>
                      <p className='text-sm'>Yes</p>
                      <input type="checkbox"
                        checked={defaultData.is_indirect_report_applicable}
                        name="is_indirect_report_applicable_yes"
                        onChange={(e) => handleEdit('is_indirect_report_applicable', e.target.checked)}
                      />
                    </div>
                    <div className='flex items-center gap-x-2'>
                      <p className='text-sm'>No</p>
                      <input type="checkbox"
                        checked={!defaultData.is_indirect_report_applicable}
                        name="is_indirect_report_applicable_no"
                        onChange={(e) => handleEdit('is_indirect_report_applicable', !e.target.checked)}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 items-center'>
                    <div className='w-full'>

                      {defaultData.is_indirect_report_applicable && (
                        <>
                          <div onClick={() => setIsEdit(true)}>

                            <CustomSelect
                              menuPlacement="top"
                              name='indirect_report'
                              placeholder="Search Indirect Report To..."
                              value={managers
                                .filter(manager => manager.username === defaultData.indirect_report)
                                .map(manager => ({ value: manager.id, label: manager.username }))}
                              onChange={(selectedOption) => handleEdit("indirect_report", selectedOption, selectedOption)}
                              options={managers
                                ?.filter(manager => manager.username)
                                .map((manager) => ({
                                  value: manager.id,
                                  label: manager.username,
                                }))}
                              isEdit={isEdit}
                              isMulti={true}
                            />
                          </div>
                          {errors.indirect_report && <span className="text-red-500 text-sm ">{errors.indirect_report}</span>}
                        </>
                      )}
                    </div>

                  </div>
                </div>


              </div>


              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2  lg:w-[45.5%]'>
                  <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                        text-input text-base mb-1'>Department Head:</label>
                  <div onClick={() => setIsEdit(true)}>
                    <Select
                      isDisabled={isEdit ? false : true}
                      menuPlacement="top"
                      name="department_manager"
                      value={HeadOfDepartmentOptions.find(
                        (option) => option.value === defaultData.department_manager
                      )}
                      onChange={(selectedOption) =>
                        handleEdit("department_manager", selectedOption.value)
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
                    disabled={isEdit ? false : true}
                    // readOnly={!isEdit}
                    day={
                      defaultData.joining_date
                        ? defaultData.joining_date.substr(0, 2)
                        : null
                    }
                    month={
                      defaultData.joining_date
                        ? defaultData.joining_date.substr(3, 2)
                        : null
                    }
                    year={
                      defaultData.joining_date
                        ? defaultData.joining_date.substr(6, 4)
                        : null
                    }
                    name="joining_date"
                    className="z-50"
                    selected={moment(
                      defaultData.joining_date,
                      "DD-MM-YYYY"
                    ).toDate()}
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
        <div className="flex gap-x-5 mb-40 mt-4 ">
          {!isEdit && <Button onClick={prevstep} text={"Previous"} />}
          {isEdit ? (
            <button
              onClick={() => {
                setCancelBox(!cancelBox);
              }}
              className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            >
              Cancel
            </button>
          ) : (
            // <button
            //   onClick={() => {
            //     setIsEdit(!isEdit);
            //   }}
            //   className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            // >
            //   Edit
            // </button>
            null
          )}
          {isEdit ? (
            <button
              onClick={handleSave}
              className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
            >
              {isLoading ? <div className="flex items-center justify-center gap-x-2">Saving <CustomLoader /></div> : 'Save'}
            </button>
          ) : <button
            onClick={() => { navigate("/") }}
            className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
          >
            Back to Home
          </button>}
        </div>
      </div >
      {cancelBox && (
        <div className="fixed inset-0 z-50 flex  items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Discard Changes</h1>
              <div className="text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer">
                <RxCross2 onClick={() => setCancelBox(!cancelBox)} />
              </div>
            </div>
            <p className="text-gray-700 mt-2">
              If you have made changes, they will not be saved. Do you want to
              proceed?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-1 mr-2 text-white bg-blue-500 rounded"
                onClick={() => {
                  setCancelBox(!cancelBox);
                }}
              >
                Keep
              </button>
              <button
                className="px-4 py-1 mr-2 text-white bg-red-500 rounded"
                onClick={() => {
                  setIsEdit(!isEdit);
                  setCancelBox(!cancelBox);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )
      }
      <ToastContainer />
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