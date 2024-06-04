import Joi from "joi";
import Button from "./Button";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CustomLoader from "../../../components/CustomLoader";
import { BiEdit } from "react-icons/bi";
import { getEmployeeBankDetailsData, saveEmployeeBankDetailsData } from '../../hooks/employee';
import { EmployeeBankDetails } from '../../utils/Types/Employee';
import { validationBankDetailsFormSchema } from '../../utils/FormSchema/employeeFormSchema';
import { useParams } from "react-router-dom";

// const bankSchema = Joi.object({
//   bank_name: Joi.string()
//     .regex(/^[a-zA-Z\s]+$/)
//     .required()
//     .label("Bank Name")
//     .messages({
//       "string.empty": `Bank Name is required`,
//       "string.pattern.base": `Bank Name must contain only letters and spaces`,
//     }),
//   account_title: Joi.string()
//     .regex(/^[a-zA-Z\s]+$/)
//     .required()
//     .label("Account Title")
//     .messages({
//       "string.empty": `Account Title is required`,
//       "string.pattern.base": `Account Title must contain only letters and spaces`,
//     }),
//   account_number: Joi.string()
//     .regex(/^\d+$/) // Only numbers allowed
//     .min(10) // Minimum length 10 digits
//     .required()
//     .label("Account Number")
//     .messages({
//       "string.empty": `Account Number is required`,
//       "string.pattern.base": `Account Number must contain only numbers`,
//       "string.min": `Account Number must be at least 10 digits long`,
//     }),
//   account_iban: Joi.string()
//     .alphanum() // Allow alphanumeric characters
//     .min(10) // Assuming a minimum length for IBAN
//     .required()
//     .label("IBAN")
//     .messages({
//       "string.empty": `IBAN is required`,
//       "string.alphanum": `IBAN must contain only letters and numbers`,
//     }),
//   branch_address: Joi.string()
//     // .min(10) // Minimum length 10 characters
//     .required()
//     .label("Branch Address")
//     .messages({
//       "string.empty": `Branch Address is required`,
//       "string.min": `Branch Address must be at least 10 characters long`,
//     }),
//   branch_code: Joi.string()
//     .regex(/^\d+$/) // Only numbers allowed
//     .min(3) // Minimum length 3 digits
//     .required()
//     .label("Branch Code")
//     .messages({
//       "string.empty": `Branch Code is required`,
//       "string.pattern.base": `Branch Code must contain only numbers`,
//       "string.min": `Branch Code must be at least 3 digits long`,
//     }),
//   swift_code: Joi.string()
//     .alphanum() // Allow alphanumeric characters
//     .min(4) // Assuming a minimum length for Swift code
//     .required()
//     .label("Swift Code")
//     .messages({
//       "string.empty": `Swift Code is required`,
//       "string.alphanum": `Swift Code must contain only letters and numbers`,
//     }),
// });


const BankDetails = ({
  errors,
  setErrors,
  prevstep,
  nextstep,
  token,
  userProfile,
  baseUrl,
}) => {
 
  let [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [cancelBox, setCancelBox] = useState(false);
  const [bankInfo, setBankInfo] = useState({})

  useEffect(() => {
    getEmployeeBankDetailsData(baseUrl, userProfile?.id, token).then(response => {
      setBankInfo(response);
    }).catch(error => {
      console.log(error);
    });
  }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const handleEdit = (name, value) => {
    setBankInfo({ ...bankInfo, [name]: value });
    setErrors({ ...errors, [name]: null });
    setIsEdit(true); // Set isEdit to true when any field is clicked
  };

  const handleSave = async () => {
    // Validate input data using the validationBankDetailsFormSchema
    const { error } = validationBankDetailsFormSchema.validate(
      {
        bank_name: bankInfo.bank_name,
        account_title: bankInfo.account_title,
        account_number: bankInfo.account_number,
        branch_address: bankInfo.branch_address,
        branch_code: bankInfo.branch_code,
        swift_code: bankInfo.swift_code,
      },
      { abortEarly: false }
    );
    if (error) {
      // If validation fails, set errors state accordingly
      const validationErrors = {};
      error.details.forEach((errorDetail) => {
        validationErrors[errorDetail.path[0]] = errorDetail.message;
      });
      if (bankInfo.account_iban) {
        if (bankInfo.account_iban.length < 10)
          validationErrors.account_iban = "IBAN number must be at least 10 characters";
      }
      setErrors(validationErrors);
      return; // Exit the function without saving if there are validation errors
    }
    setIsLoading(true);
    try {
      // Save data to the server
      if (bankInfo && !bankInfo?.account_iban) {
        delete bankInfo.account_iban;
      }
      if (bankInfo && !bankInfo?.swift_code) {
        delete bankInfo.swift_code;
      }
      saveEmployeeBankDetailsData(baseUrl, userProfile?.id, token, bankInfo);
      toast.success("Bank Details Updated!", {
        position: "top-right",
        autoClose: 3000,
      });
      nextstep();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Form submission failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false); // Set isLoading to false regardless of success or failure
    }
  };

  const handleNextStep = () => {
    nextstep();
  };

  return (
    <>
      <div>
        <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
          <div className="flex justify-between">
            <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
              Bank Details:

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
                      readOnly={!isEdit} // Use readOnly instead of disabled
                      value={bankInfo.bank_name}
                      name="bank_name"
                      placeholder="Bank Name Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                      readOnly={!isEdit} // Use readOnly instead of disabled
                      value={bankInfo.account_title}
                      name="account_title"

                      placeholder="Account Title Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                      readOnly={!isEdit} // Use readOnly instead of disabled
                      value={bankInfo.account_number}
                      name="account_number"

                      placeholder="Account Number Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                      readOnly={!isEdit} // Use readOnly instead of disabled
                      value={bankInfo.account_iban}
                      name="account_iban"

                      placeholder="IBAN Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        }  pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                    readOnly={!isEdit} // Use readOnly instead of disabled
                    value={bankInfo.branch_address}
                    name="branch_address"

                    placeholder="Branch Address Here"
                    className={`${isEdit ? "text-black" : "text-gray-500"
                      } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                    onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                      readOnly={!isEdit} // Use readOnly instead of disabled
                      value={bankInfo.branch_code}
                      name="branch_code"

                      placeholder="Branch Code Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                      type="text"
                      readOnly={!isEdit}
                      value={bankInfo.swift_code}
                      name="swift_code"

                      placeholder="Swift Code Here"
                      className={`${isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
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
                {isLoading ? <div className="flex items-center justify-center gap-x-2">Saving <CustomLoader /></div> : 'Save & Next'}
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
