import {
  educationTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  workTypeOptions,
} from "../../../data/Data";
import { useEffect, useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import { useNavigate, useParams } from "react-router-dom";

const RecruitmentForm = ({ token, baseUrl }) => {
  const { id } = useParams();
  const initialData = {
    Job_Title: "",
    Job_Description: "",
    job_requirement: "",
    // Year_of_Experience: "",
    Work_type: null,
    Job_Type: null,
    Education: null,
    location: null,
    Employee_Type: null,
    min_salary: "",
    max_salary: "",
    Deadline: null,
  };
  const [formData, setFormData] = useState(initialData);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const handleChange = (name, value) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // get job data by id
  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const response = await axios.get(`${baseUrl}/recruitment/${id}`, {
          headers,
        });
        if (response.status === 200) {
          const jobData = response.data;
          setFormData({
            Job_Title: jobData.Job_Title,
            Job_Description: jobData.Job_Description,
            job_requirement: jobData.Job_Requirement, // Corrected property name
            Work_type: jobData.Work_type
              ? { label: jobData.Work_type, value: jobData.Work_type }
              : null,
            Job_Type: jobData.Job_Type
              ? { label: jobData.Job_Type, value: jobData.Job_Type }
              : null,
            Education: jobData.Education
              ? { label: jobData.Education, value: jobData.Education }
              : null,
            location: jobData.location
              ? { label: jobData.location, value: jobData.location }
              : null,
            Employee_Type: jobData.Employee_Type
              ? { label: jobData.Employee_Type, value: jobData.Employee_Type }
              : null,
            min_salary: jobData.min_salary,
            max_salary: jobData.max_salary,
            Deadline: jobData.Deadline,
          });
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    if (id) {
      fetchJobById();
    }
  }, [id]);

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
      Job_Title: formData.Job_Title,
      Job_Description: formData.Job_Description,
      Job_Requirement: formData.job_requirement,
      // Year_of_Experience: formData.Year_of_Experience ? formData.Year_of_Experience : null,
      Work_type: formData.Work_type ? formData.Work_type.value : null,
      Job_Type: formData.Job_Type ? formData.Job_Type.value : null,
      Education: formData.Education ? formData.Education.value : null,
      location: formData.location ? formData.location.value : null,
      Employee_Type: formData.Employee_Type
        ? formData.Employee_Type.value
        : null,
      min_salary: formData.min_salary,
      max_salary: formData.max_salary,
      Deadline: formData.Deadline,
    };

    console.log(data);

    try {
      if (id) {
        const response = await axios.patch(
          `${baseUrl}/recruitment/${id}`,
          data,
          {
            headers,
          }
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Job Updated Successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setFormData(initialData);
          navigate("/jobs");
        }
      } else {
        try {
          const response = await axios.post(`${baseUrl}/recruitment/`, data, {
            headers,
          });

          if (response.status === 200 || response.status === 201) {
            toast.success("Job Posted Successfully", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
            setFormData(initialData);
            navigate("/jobs");
          }
        } catch (error) {
          toast.error("Error submitting the form. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } finally {
          setIsButtonDisabled(false); // Re-enable the button
        }
      }
    } catch (error) {
      toast.error("Error submitting the form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
      <RecruitmentDataHeader title="Add New Post" />

      <form onSubmit={handleSubmit}>
        <div className="px-2 py-3 md:px-3 md:py-4 lg:px-10 lg:py-8 overflow-y-auto scroll max-h-[76vh] md:h-[100vh]">
          <div className="flex flex-col gap-y-6">
            {/* <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="tracking_id"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Tracking ID:
                </label>
              </div>
              <span className="text-[#63676c]">12345</span>
            </div> */}
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Job_Title"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Title:
                </label>
              </div>
              <input
                type="text"
                placeholder="Job Title Here"
                name="Job_Title"
                className="w-full md:w-[45%] lg:w-[40%] pl-2 bg-white rounded h-8 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                required
                value={formData.Job_Title}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Job_Description"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Description:
                </label>
              </div>
              <textarea
                name="Job_Description"
                id=""
                cols="38"
                rows="4"
                className="rounded md:w-[45%] lg:w-[40%] pl-2 bg-white text-sm
                placeholder-[#555657] placeholder-opacity-50"
                placeholder="Job Description Here"
                required
                value={formData.Job_Description}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              ></textarea>
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="job_requirement"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Job Requirement:
                </label>
              </div>
              <textarea
                name="job_requirement"
                id=""
                cols="38"
                rows="4"
                className="rounded md:w-[45%] lg:w-[40%] pl-2 bg-white text-sm
                placeholder-[#555657] placeholder-opacity-50"
                placeholder="Job Requirement Here"
                required
                value={formData.job_requirement}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              ></textarea>
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Work_type"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Work Type:
                </label>
              </div>
              <Select
                className="w-full md:w-[45%] lg:w-[40%]"
                name="Work_type"
                options={workTypeOptions}
                value={formData.Work_type}
                onChange={(selectedOption) =>
                  handleChange("Work_type", selectedOption)
                }
                required
              />
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[30%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Job_Type"
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

            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Education"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Education:
                </label>
              </div>
              <Select
                className="w-full md:w-[45%] lg:w-[40%]"
                name="Education"
                options={educationTypeOptions}
                value={formData.Education}
                onChange={(selectedOption) =>
                  handleChange("Education", selectedOption)
                }
                required
              />
            </div>

            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="location"
                  className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                >
                  Location:
                </label>
              </div>
              <Select
                className="w-full md:w-[45%] lg:w-[40%]"
                name="location"
                options={locationTypeOptions}
                value={formData.location}
                onChange={(selectedOption) =>
                  handleChange("location", selectedOption)
                }
                required
              />
            </div>

            <div className="w-full flex flex-col md:flex-row lg:flex-row">
              <div className="w-[50%] md:w-[20%] lg:w-[15%] mb-1 md:mb-0 lg:mb-0">
                <label
                  htmlFor="Employee_Type"
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
                  type="text"
                  name="min_salary"
                  placeholder="min"
                  className="w-[30%] lg:w-[40%] pl-2 bg-white rounded h-8 text-sm
      placeholder-[#555657] placeholder-opacity-50 text-black"
                  value={formData.min_salary.toLocaleString()}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />{" "}
                min -
                <input
                  type="text"
                  name="max_salary"
                  placeholder="max"
                  className="w-[30%] lg:w-[38%] pl-2 bg-white rounded h-8 text-sm
      placeholder-[#555657] placeholder-opacity-50 text-black"
                  value={formData.max_salary.toLocaleString()}
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
                name="Deadline"
                required
                onChange={(date) => {
                  let formattedDate = moment(date).format("YYYY-MM-DD");
                  handleChange("Deadline", formattedDate);
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
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialData);
                    navigate('/jobs')
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
