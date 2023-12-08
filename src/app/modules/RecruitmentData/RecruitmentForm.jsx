import React, { useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import { employeeTypeOptions, jobTypeOptions } from "../../../data/Data";


const RecruitmentForm = ({ token, baseUrl }) => {
  const initialData = {
    job_title: "",
    job_description: "",
    Job_Type: null,
    Employee_Type: null,
    min_salary: "",
    max_salary: "",
    deadline: null,
  };
  const [formData, setFormData] = useState(initialData);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
 
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // Disable the button

    // Validation for salaries
    const minSalary = Number(formData.min_salary);
    const maxSalary = Number(formData.max_salary);

    if (maxSalary <= minSalary) {
      toast.error("Maximum salary must be greater than minimum salary", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsButtonDisabled(false); // Re-enable the button
      return;
    }

    const data = {
      Job_Title: formData.job_title,
      Job_Description: formData.job_description,
      Job_Type: formData.Job_Type ? formData.Job_Type.value : null,
      Employee_Type: formData.Employee_Type ? formData.Employee_Type.value : null,
      min_salary: formData.min_salary,
      max_salary: formData.max_salary,
      Deadline: formData.deadline,
    };

    try {
      const response = await axios.post(`${baseUrl}/recruitment/`, data, {
        headers,
      });

      if (response.status === 201) {
        toast.success("Job Posted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setFormData(initialData);
      }
    } catch (error) {
      toast.error("Error submitting the form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsButtonDisabled(false); // Re-enable the button
    }
  };
  

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
      <RecruitmentDataHeader title="Add New Post" />

      <form onSubmit={handleSubmit}>
        <div className="px-2 py-3 md:px-3 md:py-4 lg:px-10 lg:py-8 overflow-y-auto xScroll max-h-[76vh] md:h-[100vh]">
          <div className="flex flex-col gap-y-6">
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="job_title"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Title:
                </label>
              </div>
              <input
                type="text"
                placeholder="Job Title Here"
                name="job_title"
                className="w-full md:w-[45%] lg:w-[40%] pl-2 bg-white rounded h-8 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                required
                value={formData.job_title}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="job_description"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Description:
                </label>
              </div>
              <textarea
                name="job_description"
                id=""
                cols="38"
                rows="4"
                className="rounded md:w-[45%] lg:w-[40%] pl-2 bg-white text-sm
                placeholder-[#555657] placeholder-opacity-50"
                placeholder="Job Description Here"
                required
                value={formData.job_description}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              ></textarea>
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="employee_type"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Employee Type:
                </label>
              </div>
              <Select
                className="w-full md:w-[45%] lg:w-[40%]"
                name="Employee_Type"
                options={employeeTypeOptions}
                value={formData.Employee_Type}
                onChange={(selectedOption) =>
                  handleChange("Employee_Type", selectedOption)
                }
                required
              />
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="job_type"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Type:
                </label>
              </div>
              <Select
                className="w-full md:w-[45%] lg:w-[40%]"
                name="Job_Type"
                options={jobTypeOptions}
                value={formData.Job_Type}
                onChange={(selectedOption) =>
                  handleChange("Job_Type", selectedOption)
                }
                required
              />
            </div>          

            <div className="w-full flex">
              <div className="w-[40%] md:w-[20%] lg:w-[15%]">
                <label
                  htmlFor=""
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Salary Bracket:
                </label>
              </div>
              <div className="flex items-center gap-x-2 text-input">
                <input
                  type="number"
                  name="min_salary"
                  placeholder="min"
                  className="w-[30%] lg:w-[40%] pl-2 bg-white rounded h-8 text-sm
                  placeholder-[#555657] placeholder-opacity-50 text-black"
                  value={formData.min_salary}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />{" "}
                min -
                <input
                  type="number"
                  name="max_salary"
                  placeholder="max"
                  className="w-[30%] lg:w-[38%] pl-2 bg-white rounded h-8 text-sm
                  placeholder-[#555657] placeholder-opacity-50 text-black"
                  value={formData.max_salary}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />{" "}
                max
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-[28%] md:w-[20%] lg:w-[15%]">
                <label
                  htmlFor=""
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Deadline:
                </label>
              </div>
              <Datepicker
                className="z-50"
                name="deadline"
                required
                onChange={(date) => {
                  let formattedDate = moment(date).format("YYYY-MM-DD");
                  handleChange("deadline", formattedDate);
                }}
              />
            </div>
            <div className="w-full  flex">
              <div className="w-[0%] md:w-[20%] lg:w-[15%]">
                <label
                  htmlFor=""
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base"
                ></label>
              </div>
              <div className="flex justify-between items-center mb-16 md:mb-0 lg:mb-0 w-full md:w-[45%] lg:w-[40%]">
              <button
                  type="submit"
                  className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
                  disabled={isButtonDisabled}
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialData);
                  }}
                  className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

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

export default connect(mapStateToProps)(RecruitmentForm);
