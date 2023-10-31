import React, { useState } from "react";
import Button from "../../Employees/Button";
import EmpDataHeader from "./EmpDataHeader";
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";

const userRoles = [
  { value: "superadmin", label: "Super Admin" },
  { value: "hr", label: "HR" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
];

const EmpDataForm = () => {
  const initData = {
    fullname: "",
    email: "",
    password: "",
    userrole: null,
  };
  const [formData, setFormData] = useState(initData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [employeeID, setEmployeeID] = useState(0);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmployeeID((prevEmployeeID) => prevEmployeeID + 1);
    const updatedEmployeeID = employeeID + 1;

    setFormData((prevData) => {
      const updatedFormData = { ...prevData, employeeID: updatedEmployeeID };
      console.log(updatedFormData);
      return updatedFormData;
    });

    setShowSuccessModal(true);
    setFormData(initData);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
      <EmpDataHeader title="Add New User" />

      <form onSubmit={handleSubmit}>
        <div className="px-2 py-3 md:px-4 md:py-5 lg:px-10 lg:py-8 flex flex-col gap-y-4">
          <div className="flex items-center mt-2 md:w-1/2 lg:w-1/5">
            <label
              htmlFor="employeeID"
              className="w-28 font-sfpro tracking-wide whitespace-nowrap
                text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
            >
              Employee ID:
            </label>
            <input
              type="text"
              name="employeeID"
              value={employeeID}
              readOnly
              className="pl-2 w-full bg-white text-gray-400 rounded h-8 text-sm placeholder-[#555657] 
      placeholder-opacity-50"
            />
          </div>

          <div className="flex items-center mt-2 md:w-1/2 lg:w-2/5">
            <label
              htmlFor="fullname"
              className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
            >
              Full Name:
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              required
              placeholder="Full Name here"
              className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="flex items-center mt-2 md:w-1/2 lg:w-2/5">
            <label
              htmlFor="email"
              className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
            >
              Email Add:
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
          <div className="flex items-center mt-2 md:w-1/2 lg:w-2/5">
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
          <div className="flex items-center mt-2 md:w-1/2 lg:w-2/5">
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
          <div className="mt-4 md:mt-3 mb-40 md:w-[49%] lg:w-[40%] flex justify-end">
            <Button text={"Create"} />
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
    </div>
  );
};

export default EmpDataForm;
