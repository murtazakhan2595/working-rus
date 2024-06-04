import calender from "../../../assets/images/calendar.png";
import time from "../../../assets/images/time.png";
import pin from "../../../assets/images/pin.png";
import money from "../../../assets/images/money.png";
import suitcase from "../../../assets/images/suitcase.png";
import magistrate from "../../../assets/images/magistrate.png";
import employee from "../../../assets/images/employee.png";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const JobApplicationForm = ({ token, baseUrl }) => {
  const { id } = useParams();
  const defaultFormFields = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    Year_of_Experience: null,
    location: "",
    cv: null,
    application_status: "selected",
    job_id: id,
  };
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formFields, setFormFields] = useState(defaultFormFields);

  const { first_name, last_name, phone_number, email, Year_of_Experience, location, cv } =
    formFields;

  const MAX_FILE_SIZE_MB = 5; // Set the maximum file size limit

  const handleChange = async (event) => {
    const { name, value, files } = event.target;
    setFormFields({
      ...formFields,
    });

    if (name === "cv" && files.length > 0) {
      const selectedFile = files[0];
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize > MAX_FILE_SIZE_MB) {
        toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Clear the file input using the ref
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Convert file to base64
      const base64File = await convertFileToBase64(selectedFile);

      // Update the form state
      setFormFields({ ...formFields, [name]: base64File });
    } else {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      first_name: formFields.first_name,
      last_name: formFields.last_name,
      phone_number: formFields.phone_number,
      email: formFields.email,
      Year_of_Experience: formFields.Year_of_Experience,
      location: formFields.location,
      cv: formFields.cv,
      application_status: defaultFormFields.application_status,
      job_id: defaultFormFields.job_id,
    };

    try {
      const response = await axios.post(`${baseUrl}/candidate/`, data);

      if (response.status === 201) {
        toast.success("Job Applied Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setFormFields({ ...defaultFormFields, cv: null });
        // Clear the file input using the ref
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      toast.error("Error submitting the form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/recruitment/${id}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <>
      <div>
        {/* Job details */}
        <div className="border border-gray-400 px-4 xl:px-8">
          <p className="pt-4 pb-2 text-input font-sfpro text-sm md:text-base">
            Job ID: {jobDetails?.id}
          </p>
          <h1 className="text-black text-2xl font-black">
            {jobDetails?.Job_Title}
          </h1>

          <div
            className={`mt-3 md:mt-4 flex flex-col justify-between xl:items-center xl:flex-row xl:justify-between pb-2 xl:pb-4`}
          >
            <div className="flex flex-wrap gap-x-[34px] md:flex-row md:flex-wrap gap-y-2 xl:gap-x-8">
              {/* <div className="flex flex-wrap gap-x-[33px] gap-y-2 xl:gap-x-8"> */}
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={calender} alt="calender" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Open: {formatDate(jobDetails?.created_at)}</p>
                    <p>Deadline: {formatDate(jobDetails?.Deadline)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={time} alt="time" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Work_type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto ml-[50px] md:ml-0">
                <div className="text-[28px]">
                  <img src={pin} alt="pin" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <address>{jobDetails?.location}</address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={money} alt="money" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>
                      {Number(jobDetails?.min_salary).toLocaleString()} - {Number(jobDetails?.max_salary).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={suitcase} alt="suitcase" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Job_Type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={magistrate} alt="magistrate" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Education}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto ml-[25px] md:ml-0">
                <div className="text-[28px]">
                  <img src={employee} alt="employee" className="w-7" />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Employee_Type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* job description */}
        {loading ? (
          <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : (
          <div
            className={`bg-[#F9F9F9] xl:px-8 ${loading ? "filter blur-sm" : ""
              }`}
          >
            <form onSubmit={handleSubmit}>
              <div
                className="px-4 py-3 md:px-3 md:py-4 lg:px-10 lg:py-8 overflow-y-auto md:overflow-hidden xScroll max-h-[76vh]
            md:max-h-[64vh] md:h-[64vh] lg:max-h-[76vh] lg:h-[76vh]"
              >
                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col gap-x-10 md:flex-row">
                    <div className="md:w-[100%]">
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2">
                          <label
                            htmlFor="first_name"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            First Name:
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="First Name Here"
                          name="first_name"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2 lg:mt-2">
                          <label
                            htmlFor="last_name"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Last Name:
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Last Name Here"
                          name="last_name"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={last_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2 lg:mt-2">
                          <label
                            htmlFor="phone_number"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Phone Number:
                          </label>
                        </div>
                        <input
                          type="phone"
                          placeholder="Phone number Here"
                          name="phone_number"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={phone_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2">
                          <label
                            htmlFor="email"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Experience (in years):
                          </label>
                        </div>
                        <input
                          type="number"
                          placeholder="Experience"
                          name="Year_of_Experience"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2  bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={Year_of_Experience}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:w-[100%]">
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2">
                          <label
                            htmlFor="email"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Email:
                          </label>
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address Here"
                          name="email"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2  bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2 lg:mt-2">
                          <label
                            htmlFor="location"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Location:
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Select Area"
                          name="location"
                          className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                          required
                          value={location}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="py-1 md:py-2 lg:mt-2">
                          <label
                            htmlFor="cv"
                            className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                          >
                            Attach Your CV:
                          </label>
                        </div>
                        <input
                          type="file"
                          placeholder="Select File"
                          name="cv"
                          className="w-full md:w-[100%] lg:w-[90%]"
                          required
                          accept=".pdf"
                          onChange={handleChange}
                          ref={fileInputRef}
                          maxSize={5 * 1024 * 1024}
                        />
                        <span className="text-[#555657] text-sm">
                          Upload a pdf and no larger than 5 MB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-28 md:pb-0 lg:mt-4 w-[100%] md:w-[47%] lg:w-[45%]">
                    <Link
                      to={`/job-description/${id}`}
                      className="flex items-center gap-x-2 text-blue-600"
                    >
                      <button className="bg-baseBlue text-white px-6 py-1 lg:[px-8] rounded-md font-sfpro md:mt-6 xl:mt-0">
                        Back
                      </button>
                    </Link>

                    <button className="bg-baseBlue text-white px-6 py-1 lg:[px-8] rounded-md font-sfpro md:mt-6 xl:mt-0">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobApplicationForm);
