import React, { useEffect, useState } from "react";
import Button from "../Employees/Button";
import EmpDataHeader from "./EmpDataHeader";
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const userRoles = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Manager" },
  { value: 3, label: "HR" },
  { value: 4, label: "Employee" },
];

const EditDataForm = ({ token, baseUrl }) => {
  const initData = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    userrole: null,
  };
  const [formData, setFormData] = useState(initData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [validationError, setValidationError] = useState("");
  const [empId, setempId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [email, setEmail] = useState("");
  const { id } = useParams(); // Get the ID from URL params

  // Fetch employee data based on ID

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const employeeData = response.data;
      // Populate form fields with employee data
      setFormData({
        employeeId: employeeData.id,
        username: employeeData.username,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        password: "", // Assuming you don't want to show password in edit mode
        userrole: userRoles.find((role) => role.value === employeeData.user_role),
      });
      setempId(employeeData.id)
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
   
    fetchEmployeeData();
  }, [id]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // if (name === "username") {
    //   validateInput(value);
    //   setEnteredUsername(value);
    // } else 
    if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if an API call is already in progress
    if (isApiCallInProgress) {
      return;
    }

    setIsApiCallInProgress(true);
    setIsLoading(true);

    const data = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      user_role: formData.userrole.value,
      password:formData.password,
    };

    try {
      const response = await axios.patch(`${baseUrl}/emp/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        setFormData(initData)
      }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsApiCallInProgress(false);
      setIsLoading(false);
    }
  };

//   const validateInput = (value) => {
//     const regex = /[\d!@#$%^&*()_+[\]{};:'"|<>,./?\\`~]/;

//     if (isUserNameInputFocused && !regex.test(value)) {
//       setValidationError(
//         "User Name must contain special characters and numbers."
//       );
//     } else {
//       setValidationError("");
//     }
//   };

//   const handleUserNameInputFocus = () => {
//     setIsUserNameInputFocused(true);
//   };

//   const handleUserNameInputBlur = () => {
//     setIsUserNameInputFocused(false);
//   };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
      <EmpDataHeader
        title="Update User"
        mainTitle="Employee Data"
        path="emp-dataform"
      />

      <form onSubmit={handleSubmit}>
        <div className="px-2 py-3 md:px-3 md:py-4 lg:px-10 lg:py-6 overflow-y-auto xScroll max-h-[76vh] md:h-[100vh]">
          <div className="flex flex-col md:flex-row lg:flex-row w-full gap-x-10 lg:gap-x-16 gap-y-2 md:gap-y-3 lg:gap-y-4">
            <div className="w-full flex flex-col gap-y-2 md:gap-y-3">
              <div className="flex items-center mt-2">
                <label
                  htmlFor="username"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  EmpolyeeID:
                </label>
                <div className="flex flex-col w-full">
                  {isLoading ? (
                    <div className="bg-gray-300 h-8 w-full animate-pulse rounded"></div>
                  ) : (
                    <input
                      type="text"
                      name="username"
                      readOnly
                      disabled
                      value={"TXB" + empId.toString().padStart(4, "0")}
                      className="pl-2 w-full bg-white rounded h-8 text-sm text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="username"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  User Name:
                </label>
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    required
                    placeholder="user@123"
                    className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    // onFocus={handleUserNameInputFocus}
                    // onBlur={handleUserNameInputBlur}
                  />
                  {/* <div className="text-red-500 text-xs">{validationError}</div> */}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="first_name"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  required
                  placeholder="First Name Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="last_name"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  required
                  placeholder="Last Name Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-2 md:gap-y-3">
              <div className="flex items-center mt-2">
                <label
                  htmlFor="email"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  Email:
                  <span className="text-[#F9F9F9]">Add</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  placeholder="Enter email Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="password"
                  className="font-sfpro tracking-wide whitespace-nowrap
                          text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter Password Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
          placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                />
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="userrole"
                  className="font-sfpro tracking-wide whitespace-nowrap
                          text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  User Role:
                </label>
                <Select
                  className="w-full"
                  name="userrole"
                  value={formData.userrole}
                  options={userRoles}
                  required
                  onChange={(selectedOption) =>
                    handleChange("userrole", selectedOption)
                  }
                />
              </div>
              <div className="mt-4 md:mt-3 mb-40 flex justify-end">
                <Button disabled={isLoading} text={"Update"} />
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Show success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white shadow-md rounded-3xl lg:px-14 lg:py-16 w-[82%] px-10 py-12 flex
           justify-center items-center absolute md:w-[40%] lg:w-[26%] lg:h-[24%]"
          >
            <p className="text-base text-center text-gray-400">
              User has been successfully updated 
              {/* and has been sent to {email} */}
            </p>
            <div
              className="absolute top-4 right-4 text-white bg-[#ECECEC] rounded-full p-[2px] cursor-pointer"
              onClick={closeModal}
            >
              <RxCross2 className="text-sm" />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(EditDataForm);
