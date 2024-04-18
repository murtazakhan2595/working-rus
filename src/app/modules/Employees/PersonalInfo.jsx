import React, { useState, useEffect } from "react";
import moment from "moment";
import Datepicker from "../Dashboard/Datepicker";
import upload from "../../../assets/images/upload.png";
import Joi from "joi";
import Button from "./Button";
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { countryCodes } from "../../../data/CountryCode";

const validationSchema = Joi.object({
  first_name: Joi.string().min(3).max(40).required().label("First Name"),
  last_name: Joi.string().min(3).max(40).required().label("Last Name"),
  father_name: Joi.string().min(3).max(40).required().label("Father Name"),
  mother_name: Joi.string().min(3).max(40).required().label("Mother Name"),
  country_code: Joi.string().max(6).required().label("Country Code"),
  mobile_no: Joi.string().required().label("Phone Number"),
  date_of_birth: Joi.string().required().label("DOB"),
  marital_status: Joi.string().min(3).max(20).required().label("Marital Status"),
  nationality: Joi.string().min(3).max(20).required().label("Nationality"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Personal Email"),
  work_email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Work Email"),
  current_address: Joi.string().required().label("Current Address"),
  residential_address: Joi.string().required().label("Permanent Address"),
  nic: Joi.string().required().label("NIC"),
  emergency_first_name: Joi.string()
    .min(3)
    .max(40)
    .required()
    .label("First Name"),
  emergency_last_name: Joi.string()
    .min(3)
    .max(40)
    .required()
    .label("Last Name"),
  emergency_country_code: Joi.string()
    .pattern(/^\+\d{1,4}$/) // Assuming country codes start with '+' followed by 1 to 4 digits
    .required()
    .label("Country Code")
    .messages({
      "string.empty": `Country Code is required`,
      "string.pattern.base": `Country Code must be a valid country code`,
    }),
  emergency_phone_no: Joi.string()
    .pattern(/^\d{8,15}$/) // Assuming phone numbers are between 10 and 15 digits long
    .required()
    .label("Emergency Phone Number")
    .messages({
      "string.empty": `Emergency Phone Number is required`,
      "string.pattern.base": `Emergency Phone Number must be a valid phone number`,
    }),
  emergency_relation: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label("Relation")
    .messages({
      "string.empty": `Emergency Relation is required`,
      "string.pattern.base": `Emergency Relation must only contain letters and spaces`,
    }),
});

const PersonalInfo = ({ nextstep, errors, setErrors,setPersonalInfoProps,setProfilePhotoProps }) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };
  let storedData = getDataFromSessionStorage("personalInfo");
  let [personalInfo, setPersonalInfo] = useState({
    first_name: storedData?.first_name ? storedData.first_name : "",
    last_name: storedData?.last_name ? storedData.last_name : "",
    father_name: storedData?.father_name ? storedData.father_name : "",
    mother_name: storedData?.mother_name ? storedData.mother_name : "",
    country_code: storedData?.country_code ? storedData.country_code : "",
    mobile_no: storedData?.mobile_no ? storedData.mobile_no : "",
    date_of_birth: storedData?.date_of_birth ? storedData.date_of_birth : "",
    marital_status: storedData?.marital_status ? storedData.marital_status : "",
    nationality: storedData?.nationality ? storedData.nationality : "",
    email: storedData?.email ? storedData.email : "",
    work_email: storedData?.work_email ? storedData.work_email : "",
    current_address: storedData?.current_address
      ? storedData.current_address
      : "",
    residential_address: storedData?.residential_address
      ? storedData.residential_address
      : "",
    nic: storedData?.nic ? storedData.nic : "",
    emergency_first_name: storedData?.emergency_first_name
      ? storedData.emergency_first_name
      : "",
    emergency_last_name: storedData?.emergency_last_name
      ? storedData.emergency_last_name
      : "",
    emergency_country_code: storedData?.emergency_country_code
      ? storedData.emergency_country_code
      : "",
    emergency_phone_no: storedData?.emergency_phone_no
      ? storedData.emergency_phone_no
      : "",
    emergency_relation: storedData?.emergency_relation ? storedData.emergency_relation : "",
  });

  const handleChange = (name, value) => {
    setPersonalInfo({ ...personalInfo, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const [imagePreview, setImagePreview] = useState(
    getDataFromSessionStorage("profilePhoto")
  );

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size
      const maxSize = 1024 * 1024; // 1 MB in bytes
      if (selectedFile.size > maxSize) {
        // File size exceeds 1 MB, handle error
        const imageError = { image: "Please upload a file smaller than 1 MB." };
        setErrors(imageError);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview({
          name: selectedFile.name,
          file: e.target.result,
        });
      };
      reader.readAsDataURL(selectedFile);
      const imageError = { image: "" };
      setErrors(imageError);
    }
  };


  // useEffect(() => {
  //   setDataInSessionStorage("personalInfo", personalInfo);
  // }, [personalInfo]);
  // useEffect(() => {
  //   setDataInSessionStorage("profilePhoto", imagePreview);
  // }, [imagePreview]);

  const handledate_of_birthChange = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange("date_of_birth", formattedDate);
  };

  const handleNextStep = () => {
    let checkData = getDataFromSessionStorage("personalInfo");
    const copyCheckData = { ...checkData };
    const removePassportValidity = "passport_number";
    delete copyCheckData[removePassportValidity];
    const { error } = validationSchema.validate(copyCheckData, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    } else if (!imagePreview) {
      const imageError = { image: "Please upload an image." };
      setErrors(imageError);
    } else {
      setPersonalInfoProps(personalInfo);
      setProfilePhotoProps(imagePreview)
      setErrors({});
      nextstep();
    }
  };


  // Get country options for Select component
  const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
  }));


  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
          Personal Information:
        </h2>
        <div className="flex flex-col md:flex-row lg:gap-x-36">
          <div className="order-2 md:order-1 md:w-[65%]">
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:w-1/2">
                <label
                  htmlFor="first_name"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  value={personalInfo.first_name}
                  name="first_name"

                  placeholder="First Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm ">
                    {errors.first_name}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:w-1/2">
                <label
                  htmlFor="last_name"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  value={personalInfo.last_name}
                  name="last_name"

                  placeholder="Last Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm ">
                    {errors.last_name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="father_name"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Father Name:
                </label>
                <input
                  type="text"
                  value={personalInfo.father_name}
                  name="father_name"

                  placeholder="Father Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.father_name && (
                  <span className="text-red-500 text-sm ">
                    {errors.father_name}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="mother_name"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Mother Name:
                </label>
                <input
                  type="text"
                  value={personalInfo.mother_name}
                  name="mother_name"

                  placeholder="Mother Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.mother_name && (
                  <span className="text-red-500 text-sm ">
                    {errors.mother_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:w-1/2">
                <label
                  htmlFor="marital_status"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Marital Status:
                </label>
                <input
                  type="text"
                  value={personalInfo.marital_status}
                  name="marital_status"
                  placeholder="Marital Status"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.marital_status && (
                  <span className="text-red-500 text-sm ">
                    {errors.marital_status}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:w-1/2">
                <label
                  htmlFor="nationality"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Nationality:
                </label>
                <Select
                  menuPlacement="top"
                  name="nationality"
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.label === personalInfo.nationality
                  )}
                  onChange={(selectedOption) =>
                    handleChange("nationality", selectedOption.label)
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: '30px',
                      height: '30x',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      scrollbarWidth: 'roundScroll', // For Firefox
                      scrollbarColor: '#888 #f4f4f4', // For Chrome, Edge, and Safari
                    }),
                  }}
                />


                {errors.nationality && (
                  <span className="text-red-500 text-sm ">
                    {errors.nationality}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2 ">
                <label
                  htmlFor="mobile_no"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Phone Number:
                </label>
                <div className="flex gap-1">
                  <Select
                    options={countryCodes.map((country) => ({
                      label: `${country.dial_code} ${country.name}`,
                      value: country.dial_code
                    }))}
                    value={countryCodes.find(option => option.dial_code === personalInfo.country_code) ?
                      {
                        label: `${countryCodes.find(option => option.dial_code === personalInfo.country_code).dial_code} 
    ${countryCodes.find(option => option.dial_code === personalInfo.country_code).name}`,
                        value: personalInfo.country_code
                      } : null}
                    onChange={(selectedOption) => handleChange("country_code", selectedOption.value)}
                    placeholder="Select"
                    isSearchable
                    classNamePrefix="roundScroll"
                    menuPlacement="top"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: '180px',
                        fontSize: '15px',
                        height: '20px',
                      }),
                      input: (provided) => ({
                        ...provided,
                        margin: 0, // Remove input margin
                      }),
                      option: (provided) => ({
                        ...provided,
                        fontSize: '15px',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: '100%', // Set menu width to 100%
                      }),
                    }}
                  />
                  <input
                    type="number"
                    value={personalInfo.mobile_no}
                    name="mobile_no"

                    placeholder="0000000000"
                    className="pl-2 bg-white rounded-r h-8 w-[87%] text-sm placeholder-[#555657] placeholder-opacity-50"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                {errors.country_code && (
                  <>
                    {" "}
                    <span className="text-red-500 text-sm ">
                      {errors.country_code}
                    </span>
                  </>
                )}

                {errors.mobile_no && (
                  <>
                    {" "}
                    <span className="text-red-500 text-sm ">
                      {errors.mobile_no}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="date_of_birth"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Date Of Birth:
                </label>
                <Datepicker
                  day={
                    personalInfo.date_of_birth
                      ? personalInfo.date_of_birth.substr(0, 2)
                      : null
                  }
                  month={
                    personalInfo.date_of_birth
                      ? personalInfo.date_of_birth.substr(3, 2)
                      : null
                  }
                  year={
                    personalInfo.date_of_birth
                      ? personalInfo.date_of_birth.substr(6, 4)
                      : null
                  }
                  name="date_of_birth"
                  className="z-50"
                  selected={moment(
                    personalInfo.date_of_birth,
                    "DD-MM-YYYY"
                  ).toDate()}
                  onChange={handledate_of_birthChange}
                />
                {errors.date_of_birth && (
                  <span className="text-red-500 text-sm ">
                    {errors.date_of_birth}
                  </span>
                )}
              </div>
            </div>



            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="email"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Personal Email:
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  name="email"
                  placeholder="Email Here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm ">{errors.email}</span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="work_email"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Work Email:
                </label>
                <input
                  type="email"
                  value={personalInfo.work_email}
                  name="work_email"

                  placeholder="Email Here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.work_email && (
                  <span className="text-red-500 text-sm ">
                    {errors.work_email}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-2 md:mt-5">
              <label
                htmlFor="current_address"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Current Address:
              </label>
              <input
                type="text"
                value={personalInfo.current_address}
                name="current_address"

                placeholder="Current Address here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.current_address && (
                <span className="text-red-500 text-sm ">
                  {errors.current_address}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2 md:mt-5">
              <label
                htmlFor="residential_address"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Permanent Address:
              </label>
              <input
                type="text"
                value={personalInfo.residential_address}
                name="residential_address"

                placeholder="Permanent Address here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.residential_address && (
                <span className="text-red-500 text-sm ">
                  {errors.residential_address}
                </span>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="nic"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  NIC:
                </label>
                <input
                  type="number"
                  value={personalInfo.nic}
                  placeholder="NIC Here"
                  name="nic"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.nic && (
                  <span className="text-red-500 text-sm ">{errors.nic}</span>
                )}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 md:w-[35%]">
            {/*  */}
            {/* Image uploader */}
            <div className="flex flex-col relative md:ml-6 md:mt-5 lg:mt-5">
              <label
                htmlFor="file-upload"
                className="flex bg-[#EFEFEF] cursor-pointer text-center overflow-hidden font-bold w-[240px] h-[260px] rounded-3xl my-3"
              >
                <div className="w-full h-full flex flex-col justify-center items-center border-solid bg-[#EFEFEF] rounded-3xl relative">
                  <div className="relative w-32 h-32 border-2 border-gray-400 rounded-full overflow-hidden">
                    {imagePreview?.file ? (
                      <img
                        src={imagePreview.file}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={upload}
                        alt="Default"
                        className="w-[100px] block mx-auto mt-2"
                      />
                    )}
                  </div>
                  <span className="text-lg mt-3">
                    {imagePreview?.file ? "Change" : "Upload"} your photo
                  </span>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>
          </div>
        </div>
        <h2 className="text-baseBlue tracking-wide mb-2 mt-2 lg:text-lg lg:mt-6">
          Emergency Contact Information:
        </h2>
        <div className="md:w-[65%] lg:w-[56%]">
          <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
            <div className="flex flex-col mt-2 md:w-1/2">
              <label
                htmlFor="emergency_first_name"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                First Name:
              </label>
              <input
                type="text"
                value={personalInfo.emergency_first_name}
                name="emergency_first_name"

                placeholder="First Name Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergency_first_name && (
                <span className="text-red-500 text-sm ">
                  {errors.emergency_first_name}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2 md:w-1/2 lg:gap-x-12">
              <label
                htmlFor="emergency_last_name"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Last Name:
              </label>
              <input
                type="text"
                value={personalInfo.emergency_last_name}
                name="emergency_last_name"

                placeholder="Last Name Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergency_last_name && (
                <span className="text-red-500 text-sm ">
                  {errors.emergency_last_name}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
            <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
              <label
                htmlFor="emergency_phone_no"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Phone Number:
              </label>
              <div className="flex gap-1">
                <Select
                  options={countryCodes.map((country) => ({
                    label: `${country.dial_code} ${country.name}`,
                    value: country.dial_code
                  }))}
                  // value={countryCodes.find((country) => country.dial_code === personalInfo.dial_code)}
                  value={countryCodes.find(option => option.dial_code === personalInfo.emergency_country_code) ?
                    {
                      label: `${countryCodes.find(option => option.dial_code === personalInfo.emergency_country_code).dial_code} 
  ${countryCodes.find(option => option.dial_code === personalInfo.emergency_country_code).name}`,
                      value: personalInfo.emergency_country_code
                    } : null}
                  onChange={(selectedOption) => handleChange("emergency_country_code", selectedOption.value)}
                  placeholder="Select"
                  isSearchable
                  classNamePrefix="roundScroll"
                  menuPlacement="top"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: '180px',
                      fontSize: '15px',
                      height: '20px',
                    }),
                    option: (provided) => ({
                      ...provided,
                      fontSize: '15px',
                    }),
                    input: (provided) => ({
                      ...provided,
                      margin: 0, // Remove input margin
                    }),
                    menu: (provided) => ({
                      ...provided,
                      width: '100%', // Set menu width to 100%
                    }),
                  }}
                />
                <input
                  type="number"
                  value={personalInfo.emergency_phone_no}
                  name="emergency_phone_no"
                  placeholder="Phone Number here"
                  className="pl-2 bg-white rounded-r h-8 w-[87%] text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              {errors.emergency_country_code && (
                <>
                  <span className="text-red-500 text-sm ">
                    {errors.emergency_country_code}
                  </span>
                </>
              )}
              {errors.emergency_phone_no && (
                <>
                  <span className="text-red-500 text-sm ">
                    {errors.emergency_phone_no}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
              <label
                htmlFor="relation"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Relation:
              </label>
              <input
                type="text"
                value={personalInfo.emergency_relation}
                name="emergency_relation"

                placeholder="Relation Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergency_relation && (
                <span className="text-red-500 text-sm ">{errors.emergency_relation}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 lg:mt-10 md:mt-0 mb-40">
          <Button onClick={handleNextStep} text={"Next"} />
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
