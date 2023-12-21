import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { PiSuitcaseThin } from "react-icons/pi";
import { FcGraduationCap } from "react-icons/fc";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useState } from "react";

const JobApplicationForm = () => {
  const defaultFormFields = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    location: "",
    cv: null,
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { firstName, lastName, phoneNumber, email, location, cv } = formFields;

  const handleChange = async (event) => {
    const { name, value, files } = event.target;

    if (name === 'cv' && files.length > 0) {
      const selectedFile = files[0];
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize > 5) {
        alert('File size exceeds 5MB limit');
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

  // Function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  // Submission

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formFields);
  };


  return (
    <>
      <div>
        <div className="border border-gray-400 px-4 xl:px-8">
          <p className="pt-4 pb-2 text-input font-sfpro text-sm md:text-base">
            Job ID: 12345
          </p>
          <h1 className="text-black text-2xl font-black">Software Engineer</h1>

          {/* job details */}
          <div
            className={`mt-3 md:mt-4 flex flex-col justify-between xl:items-center xl:flex-row xl:justify-between pb-2 xl:pb-4`}
          >
            <div className="flex flex-wrap gap-x-[34px] md:flex-row md:flex-wrap gap-y-2 xl:gap-x-8">
              {/* <div className="flex flex-wrap gap-x-[33px] gap-y-2 xl:gap-x-8"> */}
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <MdOutlineCalendarMonth />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Open: 14/12/2023</p>
                    <p>Deadline: 14/12/2023</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <IoMdClock />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Full Time</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto ml-[50px] md:ml-0">
                <div className="text-[28px]">
                  <IoLocationOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <address>Pakistan</address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <LiaMoneyBillWaveSolid />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>50,000 - 80,000</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <PiSuitcaseThin />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Remote</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <FcGraduationCap />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Bachelors CS</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto ml-[25px] md:ml-0">
                <div className="text-[28px]">
                  <IoPersonCircleOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Fresher</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* job description */}
        <div className="bg-[#F9F9F9] xl:px-8">
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
                          htmlFor="firstName"
                          className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                        >
                          First Name:
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="First Name Here"
                        name="firstName"
                        className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                        required
                        value={firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <div className="py-1 md:py-2 lg:mt-2">
                        <label
                          htmlFor="lastName"
                          className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                        >
                          Last Name:
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Last Name Here"
                        name="lastName"
                        className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                        required
                        value={lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <div className="py-1 md:py-2 lg:mt-2">
                        <label
                          htmlFor="phoneNumber"
                          className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                        >
                          Phone Number:
                        </label>
                      </div>
                      <input
                        type="phone"
                        placeholder="Phone number Here"
                        name="phoneNumber"
                        className="w-full md:w-[100%] lg:w-[90%] pl-2 bg-white rounded h-9 text-sm
                 placeholder-[#555657] placeholder-opacity-50"
                        required
                        value={phoneNumber}
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
                      />
                      <span className="text-[#555657] text-sm">
                        Upload a pdf and no larger than 5 MB
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-28 md:pb-0 lg:mt-4 w-[100%] md:w-[47%] lg:w-[45%]">
                  <button className="bg-baseBlue text-white px-6 py-1 lg:[px-8] rounded-md font-sfpro md:mt-6 xl:mt-0">
                    Back
                  </button>

                  <button className="bg-baseBlue text-white px-6 py-1 lg:[px-8] rounded-md font-sfpro md:mt-6 xl:mt-0">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobApplicationForm;
