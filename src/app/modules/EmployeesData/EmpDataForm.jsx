import React, { useEffect, useState } from "react";
import Button from "../../Employees/Button";
import EmpDataHeader from "./EmpDataHeader";
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const userRoles = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "HR" },
  { value: 3, label: "Manager" },
  { value: 4, label: "Employee" },
];

const EmpDataForm = ({ token, baseUrl }) => {
  const initData = {
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    userrole: null,
  };
  const [formData, setFormData] = useState(initData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isUserNameInputFocused, setIsUserNameInputFocused] = useState(false);
  const [empId, setempId] = useState(0);
  const [refreshComponent, setRefreshComponent] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "username") {
      validateInput(value);
    }
  };

  const validateInput = (value) => {
    const regex = /[\d!@#$%^&*()_+[\]{};:'"|<>,./?\\`~]/;

    if (isUserNameInputFocused && !regex.test(value)) {
      setValidationError(
        "User Name must contain special characters and numbers."
      );
    } else {
      setValidationError("");
    }
  };

  const handleUserNameInputFocus = () => {
    setIsUserNameInputFocused(true);
  };

  const handleUserNameInputBlur = () => {
    setIsUserNameInputFocused(false);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: formData.username,
      first_name: formData.firstname,
      last_name: formData.lastname,
      email: formData.email,
      password: formData.password,
      user_role: formData.userrole.value,
    };
    try {
      const response = await axios.post(`${baseUrl}/emp/add`, data, {
        headers,
      });
      if (response.status === 201) {
        setShowSuccessModal(true);
        setRefreshComponent(!refreshComponent);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data.username[0] ===
          "A user with that username already exists."
      ) {
        toast.error("A user with that username already exists.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("API Error:", error);
        toast.error("Error submitting the form. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }

    setFormData(initData);
  };

  useEffect(() => {
    const fetchLastItemFromLastPage = async () => {
      try {
        // Step 1: Get the total number of pages and items per page
        const initialResponse = await axios.get(`${baseUrl}/emp/`, {
          headers,
        });
        const totalItems = initialResponse.data.count;
        const itemsPerPage = initialResponse.data.results.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Step 2: Determine the last page number
        const lastPage = totalPages;

        // Step 3: Make a request to the last page
        const lastPageResponse = await axios.get(
          `${baseUrl}/emp/?page=${lastPage}`,
          {
            headers,
          }
        );

        const lastPageData = lastPageResponse.data.results;

        // Step 4: Get the last item from the last page
        const lastItem = lastPageData[lastPageData.length - 1];

        console.log("Last Item from Last Page:", lastItem.id + 1);
        setempId(lastItem.id + 1);
      } catch (error) {
        console.error(
          "Error fetching the last item from the last page:",
          error
        );
      }
    };
    fetchLastItemFromLastPage();
  }, [refreshComponent, baseUrl, token]);

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
      <EmpDataHeader title="Add New User" />

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
                  <input
                    type="text"
                    name="username"
                    readOnly
                    disabled
                    value={"TXB" + empId.toString().padStart(4, "0")}
                    className="pl-2 w-full bg-white rounded h-8 text-sm text-gray-600"
                  />
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
                    onFocus={handleUserNameInputFocus}
                    onBlur={handleUserNameInputBlur}
                  />
                  <div className="text-red-500 text-xs">{validationError}</div>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="firstname"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  required
                  placeholder="First Name Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              <div className="flex items-center mt-2">
                <label
                  htmlFor="lastname"
                  className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
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
                  required
                  placeholder="Enter Password Here"
                  className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
          placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                <Button text={"Create"} />
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
              User has been successfully registered and has been sent to
              @Username
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

export default connect(mapStateToProps)(EmpDataForm);
