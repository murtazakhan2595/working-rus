import {useEffect} from "react"
import moment from "moment";
import React, { useState } from "react";
import Datepicker from "../Dashboard/Datepicker";
import Select from "react-select";
import Joi from "joi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Button from "./Button";
import { WiCloudRefresh } from "react-icons/wi";

const academicOptions = [
  { value: "Intermediate", label: "Intermediate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
];

const academicSchema = Joi.object({
  education_level: Joi.string().required().label("Education Level"),
  program: Joi.string().required().label("Program"),
  institute_name: Joi.string().required().label("Institute Name"),
  edu_start_date: Joi.string().required().label("Start Date"),
  edu_end_date: Joi.string().required().label("End Date"),
});

const AcademicRecords = ({ errors, setErrors, prevstep, nextstep }) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };
  let defaultData = getDataFromSessionStorage("academicInfo")
  let defaultCertifications = getDataFromSessionStorage("certifications")
  const intialAcadmicRecords = {
    education_level: defaultData?.education_level ? defaultData.education_level : "",
    program: defaultData?.program ? defaultData.program : "",
    institute_name: defaultData?.institute_name ? defaultData.institute_name : "",
    edu_start_date: defaultData?.edu_start_date ? defaultData.edu_start_date : "",
    edu_end_date: defaultData?.edu_end_date ? defaultData.edu_end_date : "",
    certificate: defaultData?.certificate ? defaultData.certificate : {},
  };
  const [academicInfo, setAcademicInfo] = useState(intialAcadmicRecords);
  const [certificationSections, setCertificationSections] = useState(
    defaultCertifications? defaultCertifications : [{}]);
    const [cerErrors, setCerErrors] = useState({});


  const addCertificationSection = () => {
    setCertificationSections([...certificationSections, {}]);
  };

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };
  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      let fileData = {
        name: selectedFile.name,
      };
      const reader = new FileReader();
      reader.onload = (e) => {
        setAcademicInfo({
          ...academicInfo,
          certificate: { name: fileData.name, file: e.target.result },
        });
      };
      reader.readAsDataURL(selectedFile);
      const certificateError = { ...errors, certificate: "" };
      setErrors(certificateError);
    }
  };

  const handleStartDate = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange("edu_start_date", formattedDate);
  };
  
  const handleEndDate = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange("edu_end_date", formattedDate);
  };

  useEffect(() => {
    setDataInSessionStorage('academicInfo',academicInfo)
  }, [academicInfo])

  const handleNextStep = () => {
    const fieldErrors = {};
    for (let i = 0; i < certificationSections.length; i++) {
      const certification = certificationSections[i];
      if (!certification.certification_name) {
        fieldErrors[`certification_name_${i}`] =
          "Certification Name is required.";
      }
      if (!certification.completion_date) {
        fieldErrors[`completion_date_${i}`] =
          "Completion Date Designation is required.";
      }
      if (!certification.expiry_date) {
        fieldErrors[`expiry_date_${i}`] = "Expiry Date is required.";
      }
      if (!certification.certification_body?.hasOwnProperty("name")) {
        fieldErrors[`certification_body_${i}`] =
          "Certification Body is required.";
      }
    }
    const { error } = academicSchema.validate(
      {
        education_level: academicInfo.education_level,
        program: academicInfo.program,
        institute_name: academicInfo.institute_name,
        edu_start_date: academicInfo.edu_start_date,
        edu_end_date: academicInfo.edu_end_date,
      },
      { abortEarly: false }
    );

    const validationErrors = {};
    if (Object.keys(fieldErrors).length > 0 || error || !academicInfo.certificate?.hasOwnProperty("name")) {
      if(!academicInfo.certificate?.hasOwnProperty("name")){
          setErrors({...errors , certificate : "Certification is required"});
        }
      if (error) {
        error.details.forEach((detail) => {
          validationErrors[detail.path[0]] = detail.message;
        });
        if (!academicInfo.certificate?.hasOwnProperty("name")) {
          validationErrors.certificate = "Certification is required";
        }
        setErrors(validationErrors);
      }
      if (Object.keys(fieldErrors).length > 0) {
        let newErrors = { ...fieldErrors };
        setCerErrors(newErrors);
      }
      return;
    }
    else {
      nextstep();
    }
  };

  const handleChange = (name, value) => {
    setAcademicInfo({ ...academicInfo, [name]: value });
    setErrors({ ...errors, [name]: null });
  };
  const clearCerError = (fieldName) => {
    if (cerErrors[fieldName]) {
      const updatedErrors = { ...cerErrors };
      delete updatedErrors[fieldName];
      setCerErrors(updatedErrors);
    }
  };
  useEffect(() => {
    setDataInSessionStorage('certifications',certificationSections)
  }, [certificationSections])
  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
          Academic Records:
        </h2>
        <div className="flex flex-col md:flex-row lg:gap-x-36">
          <div className="order-2 md:order-1 md:w-[55%]">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label
                    htmlFor="education"
                    className="font-sfpro tracking-wide 
                  font-medium text-input text-base mb-1"
                  >
                    Education Level:
                  </label>
                  <Select
                    name="education"
                    value={academicOptions.find(
                      (option) => option.value === academicInfo.education_level
                    )}
                    options={academicOptions}
                    isSearchable={false}
                    className="focus:outline-none border-none"
                    onChange={(selectedOption) => {
                      setAcademicInfo({
                        ...academicInfo,
                        education_level: selectedOption.value,
                      });
                      setErrors({ ...errors, education_level: null });
                    }}
                  />
                  {errors.education_level && (
                    <div className="text-red-500 text-sm">{errors.education_level}</div>
                  )}
                </div>
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label
                    htmlFor="program"
                    className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                  >
                    Program:
                  </label>
                  <input
                    type="text"
                    value={academicInfo.program}
                    name="program"
                    id=""
                    placeholder="Program Here"
                    className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                  {errors.program && (
                    <div className="text-red-500 text-sm">{errors.program}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-2 md:mt-5">
                <label
                  htmlFor="institute_name"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Institute Name:
                </label>
                <input
                  type="text"
                  value={academicInfo.institute_name}
                  name="institute_name"
                  id=""
                  placeholder="Institute Name Here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.institute_name && (
                  <div className="text-red-500 text-sm">{errors.institute_name}</div>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label
                    htmlFor="startdate"
                    className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                  >
                    Start Date:
                  </label>
                  <Datepicker
                    name="startdate"
                    day={academicInfo.edu_start_date ? academicInfo.edu_start_date.substr(0, 2) : null}
                    month={academicInfo.edu_start_date ? academicInfo.edu_start_date.substr(3, 2) : null}
                    year={academicInfo.edu_start_date ? academicInfo.edu_start_date.substr(6, 4) : null}
                    selected={moment(
                      academicInfo.edu_start_date,
                      "DD-MM-YYYY"
                    ).toDate()}
                    onChange={handleStartDate}
                  />
                  {errors.edu_start_date && (
                    <div className="text-red-500 text-sm">
                      {errors.edu_start_date}
                    </div>
                  )}
                </div>
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label
                    htmlFor="enddate"
                    className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                  >
                    End Date:
                  </label>
                  <Datepicker
                    name="enddate"
                    day={academicInfo.edu_end_date ? academicInfo.edu_end_date.substr(0, 2) : null}
                    month={academicInfo.edu_end_date ? academicInfo.edu_end_date.substr(3, 2) : null}
                    year={academicInfo.edu_end_date ? academicInfo.edu_end_date.substr(6, 4) : null}
                    selected={moment(
                      academicInfo.edu_end_date,
                      "DD-MM-YYYY"
                    ).toDate()}
                    onChange={handleEndDate}
                  />
                  {errors.edu_end_date && (
                    <div className="text-red-500 text-sm">{errors.edu_end_date}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-4">
                  <h2 className="text-input tracking-wide text-base mt-3 mb-3 lg:mb-0 lg:text-base">
                    Attach Certification:
                  </h2>
                  {academicInfo.certificate.hasOwnProperty("name") ? (
                    <div className="flex gap-1  items-center">
                      <div className="opacity-50">
                        {academicInfo.certificate.name}
                      </div>
                      <WiCloudRefresh
                        onClick={() => {
                          setAcademicInfo({ ...academicInfo, certificate: {} });
                          setDataInSessionStorage("academicInfo", academicInfo);
                        }}
                        className="text-blue-600 text-xl"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer opacity-70 
                    rounded-lg py-1 text-input"
                    >
                      <input
                        id="file-upload"
                        type="file"
                        name="file"
                        accept=".pdf"
                        max-size="104857600"
                        download="file"
                        className="leading-5"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  {errors.certificate && (
                    <div className="text-red-500 text-sm">
                      {errors.certificate}
                    </div>
                  )}
                  <small className="text-gray-400">
                    Upload a pdf no larger than 100 MB.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-baseBlue mt-5 tracking-wide mb-2 lg:mb-4 lg:text-lg ">
          Certifications:
        </h2>



        {certificationSections.map((experience, index) => (
            <div key={index}>
              <div className="flex items-center">
                  <AiOutlineCloseCircle
                  className="text-red-500 mr-1 text-lg mb-2 lg:mb-4 mt-2"
                    onClick={() => {
                      let copySections = [...certificationSections];
                      copySections.splice(index, 1);
                      setCertificationSections(copySections);
                    }}
                  />
                <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
                  Professional Certification {index + 1}:
                </h2>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="certification_name"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Certification Name:
                    </label>
                    <input
                      type="text"
                      name="certification_name"
                      placeholder="Certification Name"
                      value={experience.certification_name}
                      onChange={(e) => {
                        const updatedSections = [...certificationSections];
                        updatedSections[index].certification_name = e.target.value;
                        setCertificationSections(updatedSections);
                        clearCerError(`certification_name_${index}`);
                      }}
                      className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                    />
                    {cerErrors[`certification_name_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {cerErrors[`certification_name_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12 md:w-[55%]">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="exp_start_date"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Completion Date:
                    </label>
                    <Datepicker
                      day={experience?.completion_date  ? experience?.completion_date.substr(0, 2) : null}
                      month={experience?.completion_date  ? experience?.completion_date.substr(3, 2) : null}
                      year={experience?.completion_date  ? experience?.completion_date.substr(6, 4) : null}
                      name="completion_date"
                      selected={moment(
                        experience.completion_date,
                        "DD-MM-YYYY"
                      ).toDate()}
                      onChange={(date) => {
                        const formattedDate = moment(date)
                          .format("DD-MM-YYYY")
                          .toLowerCase();
                        const updatedSections = [...certificationSections];
                        updatedSections[index].completion_date = formattedDate;
                        setCertificationSections(updatedSections);
                        clearCerError(`completion_date_${index}`);
                      }}
                    />
                    {cerErrors[`completion_date_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {cerErrors[`completion_date_${index}`]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="exp_end_date"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Expiry Date:
                    </label>
                    <Datepicker
                      name="expiry_date"
                      day={experience?.expiry_date ? experience?.expiry_date.substr(0, 2) : null}
                      month={experience?.expiry_date ? experience?.expiry_date.substr(3, 2) : null}
                      year={experience?.expiry_date ? experience?.expiry_date.substr(6, 4) : null}
                      selected={moment(
                        experience.expiry_date,
                        "DD-MM-YYYY"
                      ).toDate()}
                      onChange={(date) => {
                        const formattedDate = moment(date)
                          .format("DD-MM-YYYY")
                          .toLowerCase();
                        const updatedSections = [...certificationSections];
                        updatedSections[index].expiry_date = formattedDate;
                        setCertificationSections(updatedSections);
                        clearCerError(`expiry_date_${index}`);
                      }}
                    />
                    {cerErrors[`expiry_date_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {cerErrors[`expiry_date_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-4">
                    <h2 className="text-input tracking-wide text-base mt-3 mb-1 lg:text-base">
                    Certification Body:
                    </h2>
                    {experience.certification_body ? (
                      <div className="flex gap-1  items-center">
                        <div className="opacity-50">{experience.certification_body.name}</div>
                        <WiCloudRefresh
                          onClick={() => {
                            const updatedSections = [...certificationSections];
                            updatedSections[index].certification_body = "";
                            setCertificationSections(updatedSections);
                          }}
                          className="text-blue-600 text-xl"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer opacity-70 rounded-lg text-input"
                      >
                        <input
                          id="file-upload"
                          type="file"
                          name="certification_body"
                          accept=".pdf"
                          max-size="104857600"
                          onChange={(e) => {
                            let file = e.target.files[0];
                            const updatedSections = [...certificationSections];
                            const fileData = { name: file.name };
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                let i = index;
                                updatedSections[i].certification_body = {
                                  name: fileData.name,
                                  file: e.target.result,
                                };
                                setCertificationSections(updatedSections);
                              };
                              reader.readAsDataURL(file);
                              setErrors(`certification_body_${index}`)
                            }
                          }}
                        />
                      </label>
                    )}
                    <br />
                    {cerErrors[`certification_body_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {cerErrors[`certification_body_${index}`]}
                      </div>
                    )}
                    <small className="text-gray-400">
                      Upload a pdf no larger than 100 MB.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}




        <button
            onClick={addCertificationSection}
            className="mt-4 mb-3 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1"
          >
            <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>Add New Certification
          </button>
        <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40 lg:mb-40">
          <Button onClick={prevstep} text={"Previous"} />
          <Button onClick={handleNextStep} text={"Next"} />
        </div>
      </div>
    </>
  );
};

export default AcademicRecords;
