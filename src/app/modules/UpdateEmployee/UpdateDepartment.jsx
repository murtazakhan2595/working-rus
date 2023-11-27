import Joi from 'joi';
import Button from './Button';
import {useState , useEffect} from 'react'
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";



const departmentSchema = Joi.object({
    department_name: Joi.string().required().label('Department Name'),
    department_position: Joi.string().required().label('Position'),
    direct_report: Joi.string().required().label('Direct Report'),
    indirect_report: Joi.string().required().label('Indirect Report'),
    department_manager: Joi.string().required().label('Department Manager'),
});

const Department = ({ errors, setErrors, prevstep ,  token,
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
    

      const id = userProfile.id;

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
          if (employeeData){
              let bankObj ={
                department_name: employeeData.department_name,
                department_position: employeeData.department_position,
                direct_report: employeeData.direct_report,
                indirect_report: employeeData.indirect_report,
                department_manager: employeeData.department_manager
                }
                setDefaultData(bankObj);
            }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [isEdit]);
      useEffect(() => {
        setDataInSessionStorage('UpdatedDepartmentInfo',defaultData)
      }, [defaultData])

    const handleSave = async ()  => {
        const { error } = departmentSchema.validate(
            {
                department_name: defaultData.department_name,
                department_position: defaultData.department_position,
                direct_report: defaultData.direct_report,
                indirect_report: defaultData.indirect_report,
                department_manager: defaultData.department_manager,
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
            setErrors({})
            let UpdatedDepartmentInfo = getDataFromSessionStorage("UpdatedDepartmentInfo");
            let response = await axios.patch(
              `${baseUrl}/emp/${userProfile.id}`,
              UpdatedDepartmentInfo,
              { headers }
            );
            if (response.status === 200) {
              setIsEdit(!isEdit);
              sessionStorage.clear();
              toast.success("Department Information Updated!", {
                  position: "top-right",
                  autoClose: 3000,
                });
                sessionStorage.clear()
            }
        }
    };
    const setDataInSessionStorage = (key, data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
      };

      const handleEdit = (name, value) => {
        setDefaultData({ ...defaultData, [name]: value });
        setErrors({ ...errors, [name]: null });
      };    return (
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
                                    <input type="text" disabled={isEdit ? false : true} value={defaultData.department_name} name="department_name" id="" placeholder='Department Name Here'
                                        className={`${
                                            isEdit ? "text-black" : "text-gray-500"
                                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                                        onChange={(e) => handleEdit(e.target.name, e.target.value)}
                                    />
                                    {errors.department_name && <span className="text-red-500 text-sm ">{errors.department_name}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="department_position" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Position:</label>
                                    <input type="text" disabled={isEdit ? false : true} value={defaultData.department_position} name="department_position" id="" placeholder='Position Here'
                                        className={`${
                                            isEdit ? "text-black" : "text-gray-500"
                                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                                        onChange={(e) => handleEdit(e.target.name, e.target.value)}
                                    />
                                    {errors.department_position && <span className="text-red-500 text-sm ">{errors.department_position}</span>}

                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="direct_report" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Direct Report:</label>
                                    <input type="text" disabled={isEdit ? false : true} value={defaultData.direct_report} name="direct_report" id="" placeholder='Direct Report Here'
                                        className={`${
                                            isEdit ? "text-black" : "text-gray-500"
                                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                                        onChange={(e) => handleEdit(e.target.name, e.target.value)}
                                    />
                                    {errors.direct_report && <span className="text-red-500 text-sm ">{errors.direct_report}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="indirect_report" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Indirect Report:</label>
                                    <input type="text" disabled={isEdit ? false : true} value={defaultData.indirect_report} name="indirect_report" id="" placeholder='Indirect Report Here'
                                        className={`${
                                            isEdit ? "text-black" : "text-gray-500"
                                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                                        onChange={(e) => handleEdit(e.target.name, e.target.value)}
                                    />
                                    {errors.indirect_report && <span className="text-red-500 text-sm ">{errors.indirect_report}</span>}
                                </div>

                            </div>

                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2 lg:w-[45.5%]'>
                                    <label htmlFor="department_manager" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Manager:</label>
                                    <input type="text" disabled={isEdit ? false : true} value={defaultData.department_manager} name="department_manager" id="" placeholder='Department Manager Here'
                                        className={`${
                                            isEdit ? "text-black" : "text-gray-500"
                                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                                        onChange={(e) => handleEdit(e.target.name, e.target.value)}
                                    />
                                    {errors.department_manager && <span className="text-red-500 text-sm ">{errors.department_manager}</span>}
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
            <button
              onClick={() => {
                setIsEdit(!isEdit);
              }}
              className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            >
              Edit
            </button>
          )}
          {isEdit && (
            <button
              onClick={handleSave}
              className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
            >
              Save
            </button>
          )}
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
      )}
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
  