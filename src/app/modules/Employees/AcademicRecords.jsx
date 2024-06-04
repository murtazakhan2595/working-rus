import { useEffect } from "react"
import moment from "moment";
import React, { useState } from "react";
import Datepicker from "../Dashboard/Datepicker";
import Select from "react-select";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Button from "./Button";
import { WiCloudRefresh } from "react-icons/wi";

import { connect } from "react-redux";
import { saveEmployeeAcademicRecordData, getEmployeeAcademicRecordData, saveEmployeeCertificationData, getEmployeeCerficationData } from '../../hooks/employee';
import { validationAcademicRecordSchema } from '../../utils/FormSchema/employeeFormSchema'


const academicOptions = [
  { value: "Intermediate", label: "Intermediate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
];



const AcademicRecords = ({ errors, setErrors, prevstep, nextstep, userProfile, baseUrl, token }) => {

  // const [academicInfo, setAcademicInfo] = useState({});
  // const [academicRecords, setAcademicRecords] = useState([
  //   {
  //     education_level: '',
  //     program: '',
  //     institute_name: '',
  //     edu_start_date: '',
  //     edu_end_date: '',
  //     education_body: { file: '', name: '' }
  //   }
  // ]);

  // const [certificationSections, setCertificationSections] = useState([]);
  // useEffect(() => {
  //   getEmployeeAcademicRecordData(baseUrl, userProfile?.id, token).then(response => {
  //     setAcademicInfo(response);

  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

  // useEffect(() => {
  //   getEmployeeCerficationData(baseUrl, userProfile?.id, token).then(response => {
  //     setCertificationSections(response);

  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render


  // const [cerErrors, setCerErrors] = useState({});


  // const addCertificationSection = () => {
  //   setCertificationSections([...certificationSections, {}]);
  // };

  // // Handle file input change
  // // const handleFileChange = (e) => {
  // //   const selectedFile = e.target.files[0];
  // //   if (selectedFile) {
  // //     let fileData = {
  // //       name: selectedFile.name,
  // //     };
  // //     const reader = new FileReader();
  // //     reader.onload = (e) => {
  // //       setAcademicInfo({
  // //         ...academicInfo,
  // //         certificate: { name: fileData.name, file: e.target.result },
  // //       });
  // //     };
  // //     reader.readAsDataURL(selectedFile);
  // //     const certificateError = { ...errors, certificate: "" };
  // //     setErrors(certificateError);
  // //   }
  // // };


  // const handleDateChange = (index, name, date) => {
  //   const newRecords = [...academicRecords];
  //   newRecords[index][name] = moment(date).format('YYYY-MM-DD');
  //   setAcademicRecords(newRecords);
  // };

  // const handleFileChange = (index, e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const newRecords = [...academicRecords];
  //     newRecords[index].education_body = { file: reader.result, name: file.name };
  //     setAcademicRecords(newRecords);
  //   };
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };


  // const addRecord = () => {
  //   setAcademicRecords([
  //     ...academicRecords,
  //     {
  //       education_level: '',
  //       program: '',
  //       institute_name: '',
  //       edu_start_date: '',
  //       edu_end_date: '',
  //       education_body: { file: '', name: '' }
  //     }
  //   ]);
  //   console.log('New Record Added:', academicRecords);
  // };


  // const handleStartDate = (date) => {
  //   const formattedDate = moment(date).format("YYYY-MM-DD").toLowerCase();
  //   handleChange("edu_start_date", formattedDate);
  // };

  // const handleEndDate = (date) => {
  //   const formattedDate = moment(date).format("YYYY-MM-DD").toLowerCase();
  //   handleChange("edu_end_date", formattedDate);
  // };

  // const handleNextStep = () => {
  //   const fieldErrors = {};
  //   for (let i = 0; i < certificationSections.length; i++) {
  //     const certification = certificationSections[i];
  //     if (!certification.certification_name) {
  //       fieldErrors[`certification_name_${i}`] =
  //         "Certification Name is required.";
  //     }
  //     if (!certification.completion_date) {
  //       fieldErrors[`completion_date_${i}`] =
  //         "Completion Date.";
  //     }
  //     if (!certification.expiry_date) {
  //       fieldErrors[`expiry_date_${i}`] = "Expiry Date is required.";
  //     }
  //     if (!certification.certification_institute) {
  //       fieldErrors[`certification_institute_${i}`] =
  //         "Certification Body is required.";
  //     }

  //   }

  //   const { error } = validationAcademicRecordSchema.validate(
  //     {
  //       education_level: academicInfo.education_level,
  //       program: academicInfo.program,
  //       institute_name: academicInfo.institute_name,
  //       edu_start_date: academicInfo.edu_start_date,
  //       edu_end_date: academicInfo.edu_end_date,
  //     },
  //     { abortEarly: false }
  //   );

  //   const validationErrors = {};
  //   if (Object.keys(fieldErrors).length > 0 || error || !academicInfo.certificate?.hasOwnProperty("name")) {
  //     if (error) {
  //       error.details.forEach((detail) => {
  //         validationErrors[detail.path[0]] = detail.message;
  //       });
  //       setErrors(validationErrors);
  //     }
  //     if (Object.keys(fieldErrors).length > 0) {
  //       let newErrors = { ...fieldErrors };
  //       setCerErrors(newErrors);
  //     }
  //     return;
  //   }
  //   else {
  //     const academicDoc = {
  //       employee_id: userProfile.id,
  //       name: "acadmicDoc",
  //       description: "Acadmic Document",
  //       document: academicInfo.certificate,
  //     }
  //     academicInfo.employee_id = userProfile.id
  //     delete academicInfo.certificate
  //     saveEmployeeAcademicRecordData(baseUrl, userProfile?.id, token, academicInfo, academicDoc);
  //     saveEmployeeCertificationData(baseUrl, userProfile?.id, token, certificationSections);
  //     nextstep();
  //   }
  // };


  // // const handleChange = (name, value) => {
  // //   setAcademicInfo({ ...academicInfo, [name]: value });
  // //   setErrors({ ...errors, [name]: null });
  // // };

  // const handleChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const newRecords = [...academicRecords];
  //   newRecords[index][name] = value;
  //   setAcademicRecords(newRecords);
  // };

  // const clearCerError = (fieldName) => {
  //   if (cerErrors[fieldName]) {
  //     const updatedErrors = { ...cerErrors };
  //     delete updatedErrors[fieldName];
  //     setCerErrors(updatedErrors);
  //   }
  // };

  const [academicRecords, setAcademicRecords] = useState([
    {
      education_level: '',
      program: '',
      institute_name: '',
      edu_start_date: '',
      edu_end_date: '',
      education_body: { file: '', name: '' }
    }
  ]);

  const [certificationSections, setCertificationSections] = useState([]);

  // useEffect(() => {
  //   getEmployeeAcademicRecordData(baseUrl, userProfile?.id, token)
  //     .then(response => {
  //       setAcademicRecords(Array.isArray(response) && response.length > 0 ? response : [
  //         {
  //           education_level: '',
  //           program: '',
  //           institute_name: '',
  //           edu_start_date: '',
  //           edu_end_date: '',
  //           education_body: { file: '', name: '' }
  //         }
  //       ]);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [baseUrl, userProfile, token]);

  // useEffect(() => {
  //   getEmployeeCerficationData(baseUrl, userProfile?.id, token)
  //     .then(response => {
  //       setCertificationSections(Array.isArray(response) ? response : []);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [baseUrl, userProfile, token]);

  useEffect(() => {
    getEmployeeAcademicRecordData(baseUrl, userProfile?.id, token)
      .then(response => {
        console.log("Academic Records Response:", response); // Log response to verify
        setAcademicRecords(Array.isArray(response) && response.length > 0 ? response : [
          {
            education_level: '',
            program: '',
            institute_name: '',
            edu_start_date: '',
            edu_end_date: '',
            education_body: { file: '', name: '' }
          }
        ]);
      })
      .catch(error => {
        console.log(error);
      });
  }, [baseUrl, userProfile, token]);

  useEffect(() => {
    getEmployeeCerficationData(baseUrl, userProfile?.id, token)
      .then(response => {
        console.log("Certification Sections Response:", response); // Log response to verify
        setCertificationSections(Array.isArray(response) ? response : []);
      })
      .catch(error => {
        console.log(error);
      });
  }, [baseUrl, userProfile, token]);


  const [cerErrors, setCerErrors] = useState({});
  const [eduErrors, setEduErrors] = useState({});

  const addCertificationSection = () => {
    setCertificationSections([...certificationSections, {}]);
  };

  const handleDateChange = (index, name, date) => {
    const newRecords = [...academicRecords];
    newRecords[index][name] = moment(date).format('YYYY-MM-DD');
    setAcademicRecords(newRecords);
    clearEduError(`${name}_${index}`);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const newRecords = [...academicRecords];
      newRecords[index].education_body = { file: reader.result, name: file.name };
      setAcademicRecords(newRecords);
      clearEduError(`education_body_${index}`);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const addRecord = () => {
    setAcademicRecords([
      ...academicRecords,
      {
        education_level: '',
        program: '',
        institute_name: '',
        edu_start_date: '',
        edu_end_date: '',
        education_body: { file: '', name: '' } 
      }
    ]);
  };

  const handleNextStep = () => {
    const fieldErrors = {};
    for (let i = 0; i < certificationSections.length; i++) {
      const certification = certificationSections[i];
      if (!certification.certification_name) {
        fieldErrors[`certification_name_${i}`] = "Certification Name is required.";
      }
      if (!certification.completion_date) {
        fieldErrors[`completion_date_${i}`] = "Completion Date is required.";
      }
      if (!certification.expiry_date) {
        fieldErrors[`expiry_date_${i}`] = "Expiry Date is required.";
      }
      if (!certification.certification_institute) {
        fieldErrors[`certification_institute_${i}`] = "Certification Body is required.";
      }
    }

    const eduFieldErrors = {};
    const validAcademicRecords = [];

    for (const [index, record] of academicRecords.entries()) {
      const { error } = validationAcademicRecordSchema.validate(
        {
          education_level: record.education_level,
          program: record.program,
          institute_name: record.institute_name,
          edu_start_date: record.edu_start_date,
          edu_end_date: record.edu_end_date,
          education_body: record.education_body
        },
        { abortEarly: false }
      );

      if (error) {
        error.details.forEach((detail) => {
          eduFieldErrors[`${detail.path[0]}_${index}`] = detail.message;
        });
      } else if (!record.education_body.file) {
        eduFieldErrors[`education_body_${index}`] = "Education document is required.";
      } else {
        validAcademicRecords.push({ ...record, employee_id: userProfile.id });
      }
    }

    if (Object.keys(fieldErrors).length > 0 || Object.keys(eduFieldErrors).length > 0) {
      if (Object.keys(fieldErrors).length > 0) {
        setCerErrors(fieldErrors);
      }
      if (Object.keys(eduFieldErrors).length > 0) {
        setEduErrors(eduFieldErrors);
      }
      return;
    }

    saveEmployeeAcademicRecordData(baseUrl, userProfile.id, token, validAcademicRecords);
    saveEmployeeCertificationData(baseUrl, userProfile.id, token, certificationSections);
    nextstep();
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newRecords = [...academicRecords];
    newRecords[index][name] = value;
    setAcademicRecords(newRecords);
    clearEduError(`${name}_${index}`);
  };

  const clearCerError = (fieldName) => {
    if (cerErrors[fieldName]) {
      const updatedErrors = { ...cerErrors };
      delete updatedErrors[fieldName];
      setCerErrors(updatedErrors);
    }
  };

  const clearEduError = (fieldName) => {
    if (eduErrors[fieldName]) {
      const updatedErrors = { ...eduErrors };
      delete updatedErrors[fieldName];
      setEduErrors(updatedErrors);
    }
  };

  const removeRecord = (index) => {
    if (academicRecords.length > 1) {
      const newRecords = academicRecords.filter((_, i) => i !== index);
      setAcademicRecords(newRecords);
    }
  };

  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
          Academic Records:
        </h2>

        <div className="flex flex-col lg:gap-x-36">
          {academicRecords.map((record, index) => (
            <div className="order-2 md:order-1 md:w-[55%]" key={index}>
               <div className="flex items-center">
              <AiOutlineCloseCircle
                className="text-red-500 mr-1 text-lg mb-2 lg:mb-4 mt-2"
                onClick={() => removeRecord(index)}
              />
              <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
                Education Record {index + 1}:
              </h2>
            </div>

              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="education"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Education Level:
                    </label>
                    <Select
                      name="education"
                      value={academicOptions.find(
                        (option) => option.value === record.education_level
                      )}
                      options={academicOptions}
                      isSearchable={false}
                      className="focus:outline-none border-none"
                      onChange={(selectedOption) => {
                        handleChange(index, { target: { name: 'education_level', value: selectedOption.value } });
                      }}
                    />
                    {eduErrors[`education_level_${index}`] && <div className="text-sm text-red-500">{eduErrors[`education_level_${index}`]}</div>}

                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="program"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Program:
                    </label>
                    <input
                      type="text"
                      value={record.program}
                      name="program"
                      placeholder="Program Here"
                      className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                      onChange={(e) => handleChange(index, e)}
                    />
                    {eduErrors[`program_${index}`] && <div className="text-sm text-red-500">{eduErrors[`program_${index}`]}</div>}

                  </div>
                </div>
                <div className="flex flex-col mt-2 md:mt-5">
                  <label
                    htmlFor="institute_name"
                    className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                  >
                    Institute Name:
                  </label>
                  <input
                    type="text"
                    value={record.institute_name}
                    name="institute_name"
                    placeholder="Institute Name Here"
                    className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                    onChange={(e) => handleChange(index, e)}
                  />
                  {eduErrors[`institute_name_${index}`] && <div className="text-sm text-red-500">{eduErrors[`institute_name_${index}`]}</div>}

                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="startdate"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Start Date:
                    </label>
                    <Datepicker
                      name="edu_start_date"
                      day={record.edu_start_date ? record.edu_start_date.substr(8, 2) : null}
                      month={record.edu_start_date ? record.edu_start_date.substr(5, 2) : null}
                      year={record.edu_start_date ? record.edu_start_date.substr(0, 4) : null}
                      selected={moment(record.edu_start_date, "DD-MM-YYYY").toDate()}
                      onChange={(date) => handleDateChange(index, 'edu_start_date', date)}
                    />
                    {eduErrors[`edu_start_date_${index}`] && <div className="text-sm text-red-500">{eduErrors[`edu_start_date_${index}`]}</div>}

                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="edu_end_date"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      End Date:
                    </label>
                    <Datepicker
                      name="edu_end_date"
                      day={record.edu_end_date ? record.edu_end_date.substr(8, 2) : null}
                      month={record.edu_end_date ? record.edu_end_date.substr(5, 2) : null}
                      year={record.edu_end_date ? record.edu_end_date.substr(0, 4) : null}
                      selected={moment(record.edu_end_date, "DD-MM-YYYY").toDate()}
                      onChange={(date) => handleDateChange(index, 'edu_end_date', date)}
                    />
                    {eduErrors[`edu_end_date_${index}`] && <div className="text-sm text-red-500">{eduErrors[`edu_end_date_${index}`]}</div>}

                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-4">
                    <h2 className="text-input tracking-wide text-base mt-3 mb-3 lg:mb-0 lg:text-base">
                      Attach Certification:
                    </h2>
                    {record.education_body && record.education_body !== "" ? (
                      <div className="flex gap-1 items-center">
                        <div className="opacity-50">{record.education_body.name}</div>
                        <WiCloudRefresh
                          onClick={() => {
                            const newRecords = [...academicRecords];
                            newRecords[index].education_body = "";
                            setAcademicRecords(newRecords);
                          }}
                          className="text-blue-600 text-xl"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="cursor-pointer opacity-70 rounded-lg py-1 text-input"
                      >
                        <input
                          id={`file-upload-${index}`}
                          type="file"
                          name="education_body"
                          max-size="5242880"
                          accept=".pdf"
                          className="leading-5"
                          onChange={(e) => handleFileChange(index, e)}
                        />
                      </label>
                    )}
                    {eduErrors[`education_body_${index}`] && <div className="text-sm text-red-500">{eduErrors[`education_body_${index}`]}</div>}
                    <small className="text-gray-400">Upload a pdf no larger than 5 MB.</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addRecord}
          className="mt-4 mb-3 rounded-lg w-52 border block border-[#25A8E0] cursor-pointer text-[#555657] py-1"
        >
          <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>Add New Academic
        </button>

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
                    day={experience?.completion_date ? experience?.completion_date.substr(0, 2) : null}
                    month={experience?.completion_date ? experience?.completion_date.substr(3, 2) : null}
                    year={experience?.completion_date ? experience?.completion_date.substr(6, 4) : null}
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
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="certification_name"
                  className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                >
                  Certification Body:
                </label>
                <input
                  type="text"
                  name="certification_institute"
                  placeholder="Certification Body"
                  value={experience.certification_institute}
                  onChange={(e) => {
                    const updatedSections = [...certificationSections];
                    updatedSections[index].certification_institute = e.target.value;
                    setCertificationSections(updatedSections);
                    clearCerError(`certification_institute_${index}`);
                  }}
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                />
                {cerErrors[`certification_institute_${index}`] && (
                  <div className="text-red-500 text-sm">
                    {cerErrors[`certification_institute_${index}`]}
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-4">
                  <h2 className="text-input tracking-wide text-base mt-3 mb-1 lg:text-base">
                    Attach Certification:
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
                        max-size="5242880"
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
                    Upload a pdf no larger than 5 MB.
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertificationSection}
          className="mt-4 mb-3 rounded-lg w-52 border block border-[#25A8E0] cursor-pointer text-[#555657] py-1"
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

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(AcademicRecords);
