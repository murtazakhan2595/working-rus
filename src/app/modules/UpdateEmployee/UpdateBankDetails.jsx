import Joi from "joi";
import Button from "./Button";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const bankSchema = Joi.object({
  bank_name: Joi.string().min(5).max(50).required().label("Bank Name"),
  account_title: Joi.string().min(5).required().label("Account Title"),
  account_number: Joi.string().min(10).required().label("Account Number"),
  branch_address: Joi.string().min(10).required().label("Branch Address"),
  branch_code: Joi.string().min(3).required().label("Branch Code"),
});

const BankDetails = ({
  errors,
  setErrors,
  prevstep,
  nextstep,
  token,
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
    
  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };

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
              account_iban:employeeData.account_iban, 
              account_number: employeeData.account_number,
              account_title: employeeData.account_title,
              bank_name: employeeData.bank_name,
              branch_address: employeeData.branch_address,
              branch_code: employeeData.branch_code,
              swift_code: employeeData.swift_code
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

  const handleEdit = (name, value) => {
    setDefaultData({ ...defaultData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  useEffect(() => {
    setDataInSessionStorage("UpdatedBankInfo", defaultData);
  }, [defaultData]);


  const handleSave = async () => {
    const { error } = bankSchema.validate(
      {
        bank_name: defaultData.bank_name,
        account_title: defaultData.account_title,
        account_number: defaultData.account_number,
        branch_address: defaultData.branch_address,
        branch_code: defaultData.branch_code,
      },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      if (defaultData.account_iban) {
        if (defaultData.account_iban.length < 10)
          validationErrors.account_iban =
            "IBAN number must be at least 10 characters";
      }
      setErrors(validationErrors);
      console.log(validationErrors);
    } else {
        setErrors({});
        let UpdatedBankInfo = getDataFromSessionStorage("UpdatedBankInfo");
        let response = await axios.patch(
          `${baseUrl}/emp/${userProfile.id}`,
          UpdatedBankInfo,
          { headers }
        );
        if (response.status === 200) {
          setIsEdit(!isEdit);
          sessionStorage.clear();
          toast.success("Bank Detials Updated!", {
              position: "top-right",
              autoClose: 3000,
            });
        }


      nextstep();
    }
  };

  const handleNextStep = () => {
      nextstep();
  };

  return (
    <>
      <div>
        <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
          <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
            Bank Details:
          </h2>
          <div className="flex flex-col md:flex-row lg:gap-x-36">
            <div className="order-2 md:order-1 md:w-[50%]">
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="bank"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      Bank Name:
                    </label>
                    <input
                      type="text"
                      disabled={isEdit ? false : true}
                      value={defaultData.bank_name}
                      name="bank_name"
                      id=""
                      placeholder="Bank Name Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.bank_name && (
                      <div className="text-red-500 text-sm">
                        {errors.bank_name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="account_title"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      Account Title:
                    </label>
                    <input
                      type="text"
                      disabled={isEdit ? false : true}
                      value={defaultData.account_title}
                      name="account_title"
                      id=""
                      placeholder="Account Title Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.account_title && (
                      <div className="text-red-500 text-sm">
                        {errors.account_title}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="account_number"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      Account Number:
                    </label>
                    <input
                      type="number"
                      value={defaultData.account_number}
                      name="account_number"
                      id=""
                      placeholder="Account Number Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.account_number && (
                      <div className="text-red-500 text-sm">
                        {errors.account_number}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="account_iban"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      IBAN Number:
                    </label>
                    <input
                      type="text"
                      disabled={isEdit ? false : true}
                      value={defaultData.account_iban}
                      name="account_iban"
                      id=""
                      placeholder="IBAN Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      }  pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.account_iban && (
                      <div className="text-red-500 text-sm">
                        {errors.account_iban}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-2 md:mt-5">
                  <label
                    htmlFor="branch_address"
                    className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                  >
                    Branch Address:
                  </label>
                  <input
                    type="text"
                    disabled={isEdit ? false : true}
                    value={defaultData.branch_address}
                    name="branch_address"
                    id=""
                    placeholder="Branch Address Here"
                    className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                  />
                  {errors.branch_address && (
                    <div className="text-red-500 text-sm">
                      {errors.branch_address}
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col  mt-2 md:mt-5 w-1/2 lg:w-1/3">
                    <label
                      htmlFor="branch_code"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      Branch Code:
                    </label>
                    <input
                      type="number"
                      value={defaultData.branch_code}
                      name="branch_code"
                      id=""
                      placeholder="Branch Code Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.branch_code && (
                      <div className="text-red-500 text-sm">
                        {errors.branch_code}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 w-1/2 lg:w-1/3">
                    <label
                      htmlFor="swift_code"
                      className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                      Swift Code:
                    </label>
                    <input
                      type="number"
                      value={defaultData.swift_code}
                      name="swift_code"
                      id=""
                      placeholder="Swift Code Here"
                      className={`${
                        isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                    />
                    {errors.swift_code && (
                      <div className="text-red-500 text-sm">
                        {errors.swift_code}
                      </div>
                    )}
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
          {isEdit ? (
            <button
              onClick={handleSave}
              className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
            >
              Save & Next
            </button>
          ) : (
            <Button onClick={handleNextStep} text={"Next"} />
          )}
          </div>
        </div>
      </div>
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
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(BankDetails);
