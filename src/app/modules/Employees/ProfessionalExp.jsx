import React, { useState, useEffect } from "react";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import SubStepsIndicator from "./SubStepsIndicator";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { WiCloudRefresh } from "react-icons/wi";
import Button from "./Button";
import { connect } from "react-redux";
import { getEmployeeProfessionalExperianceData, saveEmployeeProfessionalExperianceData } from '../../hooks/employee';
import { EmployeeProfessionalExperiance } from '../../utils/Types/Employee'

const ProfessionalExp = ({
  errors,
  setErrors,
  substep,
  prevstep,
  nextstep,
  userProfile,
  baseUrl, 
  token,
}) => {
  const [experienceSections, setExperienceSections] = useState([EmployeeProfessionalExperiance]);

  useEffect(() => {
    getEmployeeProfessionalExperianceData(baseUrl, userProfile?.id, token).then(response => {
      setExperienceSections(response);

    }).catch(error => {
      console.log(error);
    });
  }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };

  let defaultData = getDataFromSessionStorage("proExp");
  

  const [disableEndDate, setDisableEndDate] = useState(false); // State for Till Date checkbox

  const addExperienceSection = () => {
    setExperienceSections([...experienceSections, {}]);
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[fieldName];
      setErrors(updatedErrors);
    }
  };

  const handleNextStep = () => {
    const fieldErrors = {};

    // Validate the experienceSections and store specific errors
    for (let i = 0; i < experienceSections.length; i++) {
      const experience = experienceSections[i];
      if (!experience.exp_organization) {
        fieldErrors[`exp_organization_${i}`] = "Organization is required.";
      }
      if (!experience.exp_designation) {
        fieldErrors[`exp_designation_${i}`] = "Designation is required.";
      }
      if (!experience.exp_start_date) {
        fieldErrors[`exp_start_date_${i}`] = "Start Date is required.";
      }
      if (!experience.disableEndDate && !experience.exp_end_date) { // Only validate end date if Till Date is not checked
        fieldErrors[`exp_end_date_${i}`] = "End Date is required.";
      }
      // if (!experience.file?.hasOwnProperty("name")) {
      //   fieldErrors[`file_${i}`] = "Experience Letter is required.";
      // }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
    } else {
      saveEmployeeProfessionalExperianceData(baseUrl, userProfile?.id, token, experienceSections);
      setErrors({});
      nextstep();
    }
  };

  return (
    <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <SubStepsIndicator substep={substep} />
      <div className="flex flex-col md:flex-row lg:gap-x-36">
        <div className="order-2 md:order-1 md:w-[60%]">
          {experienceSections.map((experience, index) => (
            <div key={index}>
              <div className="flex items-center">
                {index !== 0 && (
                  <AiOutlineCloseCircle
                    className="text-red-500 mr-1 text-xl mb-2 lg:mb-4 mt-2"
                    onClick={() => {
                      let copySections = [...experienceSections];
                      copySections.splice(index, 1);
                      setExperienceSections(copySections);
                    }}
                  />
                )}
                <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
                  Experience {index + 1}:
                </h2>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor={`exp_organization_${index}`}
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Organization:
                    </label>
                    <input
                      type="text"
                      name={`exp_organization_${index}`}
                      placeholder="Organization"
                      value={experience.exp_organization || ""}
                      onChange={(e) => {
                        const updatedSections = [...experienceSections];
                        updatedSections[index].exp_organization =
                          e.target.value;
                        setExperienceSections(updatedSections);
                        clearError(`exp_organization_${index}`);
                      }}
                      className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                    />
                    {errors[`exp_organization_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {errors[`exp_organization_${index}`]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor={`exp_designation_${index}`}
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Designation:
                    </label>
                    <input
                      type="text"
                      name={`exp_designation_${index}`}
                      placeholder="Designation"
                      className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                      value={experience.exp_designation || ""}
                      onChange={(e) => {
                        const updatedSections = [...experienceSections];
                        updatedSections[index].exp_designation =
                          e.target.value;
                        setExperienceSections(updatedSections);
                        clearError(`exp_designation_${index}`);
                      }}
                    />
                    {errors[`exp_designation_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {errors[`exp_designation_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor={`exp_start_date_${index}`}
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      Start Date:
                    </label>
                    <Datepicker
                      day={
                        experience?.exp_start_date
                          ? experience?.exp_start_date.substr(0, 2)
                          : null
                      }
                      month={
                        experience?.exp_start_date
                          ? experience?.exp_start_date.substr(3, 2)
                          : null
                      }
                      year={
                        experience?.exp_start_date
                          ? experience?.exp_start_date.substr(6, 4)
                          : null
                      }
                      name={`exp_start_date_${index}`}
                      selected={moment(
                        experience.exp_start_date,
                        "DD-MM-YYYY"
                      ).toDate()}
                      onChange={(date) => {
                        const formattedDate = moment(date)
                          .format("DD-MM-YYYY")
                          .toLowerCase();
                        const updatedSections = [...experienceSections];
                        updatedSections[index].exp_start_date =
                          formattedDate;
                        setExperienceSections(updatedSections);
                        clearError(`exp_start_date_${index}`);
                      }}
                    />
                    {errors[`exp_start_date_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {errors[`exp_start_date_${index}`]}
                      </div>
                    )}
                  </div>
                  {/* <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor={`exp_end_date_${index}`}
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      End Date:
                    </label>
                    <div className="flex items-center">
                      <Datepicker
                        name={`exp_end_date_${index}`}
                        day={
                          experience?.exp_end_date
                            ? experience?.exp_end_date.substr(0, 2)
                            : null
                        }
                        month={
                          experience?.exp_end_date
                            ? experience?.exp_end_date.substr(3, 2)
                            : null
                        }
                        year={
                          experience?.exp_end_date
                            ? experience?.exp_end_date.substr(6, 4)
                            : null
                        }
                        selected={
                          experience.exp_end_date
                            ? moment(
                                experience.exp_end_date,
                                "DD-MM-YYYY"
                              ).toDate()
                            : null
                        }
                        onChange={(date) => {
                          const formattedDate = moment(date)
                            .format("DD-MM-YYYY")
                            .toLowerCase();
                          const updatedSections = [...experienceSections];
                          updatedSections[index].exp_end_date =
                            disableEndDate ? null : formattedDate;
                          setExperienceSections(updatedSections);
                          clearError(`exp_end_date_${index}`);
                        }}
                        disabled={disableEndDate} // Disable the Datepicker if Till Date is checked
                      />
                      <input
                        type="checkbox"
                        checked={disableEndDate}
                        onChange={(e) => setDisableEndDate(e.target.checked)}
                        className="ml-2"
                      />
                      <label className="ml-1">Till Date</label>
                    </div>
                    {errors[`exp_end_date_${index}`] && !disableEndDate && (
                      <div className="text-red-500 text-sm">
                        {errors[`exp_end_date_${index}`]}
                      </div>
                    )}
                  </div> */}
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor={`exp_end_date_${index}`}
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      End Date:
                    </label>
                    <div className="flex items-center">
                      <Datepicker
                        name={`exp_end_date_${index}`}
                        day={experience.exp_end_date ? experience.exp_end_date.substr(0, 2) : null}
                        month={experience.exp_end_date ? experience.exp_end_date.substr(3, 2) : null}
                        year={experience.exp_end_date ? experience.exp_end_date.substr(6, 4) : null}
                        selected={experience.exp_end_date ? moment(experience.exp_end_date, "DD-MM-YYYY").toDate() : null}
                        onChange={(date) => {
                          const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
                          const updatedSections = [...experienceSections];
                          updatedSections[index].exp_end_date = formattedDate;
                          setExperienceSections(updatedSections);
                          clearError(`exp_end_date_${index}`);
                        }}
                        disabled={experience.disableEndDate} // Disable the Datepicker if Till Date is checked
                      />
                      <input
                        type="checkbox"
                        checked={experience.disableEndDate}
                        onChange={(e) => {
                          const updatedSections = [...experienceSections];
                          updatedSections[index].disableEndDate = e.target.checked;
                          if (e.target.checked) {
                            // updatedSections[index].exp_end_date = null; // Set end date to null if Till Date is checked
                            updatedSections[index].exp_end_date = e.target.checked ? null : experience.exp_end_date;
                          }
                          setExperienceSections(updatedSections);
                        }}
                        className="ml-2"
                      />
                      <label className="ml-1">Till Date</label>
                    </div>
                    {errors[`exp_end_date_${index}`] && !experience.disableEndDate && (
                      <div className="text-red-500 text-sm">
                        {errors[`exp_end_date_${index}`]}
                      </div>
                    )}
                  </div>


                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-4">
                    <h2 className="text-input tracking-wide text-base mt-3 mb-1 lg:text-base">
                      Experience Letter:
                    </h2>
                    {experience.file ? (
                      <div className="flex gap-1 items-center">
                        <div className="opacity-50">
                          {experience.file.name}
                        </div>
                        <WiCloudRefresh
                          onClick={() => {
                            const updatedSections = [...experienceSections];
                            updatedSections[index].file = "";
                            setExperienceSections(updatedSections);
                          }}
                          className="text-blue-600 text-xl"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-upload_${index}`}
                        className="cursor-pointer opacity-70 rounded-lg text-input"
                      >
                        <input
                          id={`file-upload_${index}`}
                          type="file"
                          name={`file_${index}`}
                          accept=".pdf"
                          max-size="104857600"
                          onChange={(e) => {
                            let file = e.target.files[0];
                            const updatedSections = [...experienceSections];
                            const fileData = { name: file.name };
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                let i = index;
                                updatedSections[i].file = {
                                  name: fileData.name,
                                  file: e.target.result,
                                };
                                setExperienceSections(updatedSections);
                              };
                              reader.readAsDataURL(file);
                              setErrors(`file_${index}`);
                            }
                          }}
                        />
                      </label>
                    )}
                    <br />
                    {errors[`file_${index}`] && (
                      <div className="text-red-500 text-sm">
                        {errors[`file_${index}`]}
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
            onClick={addExperienceSection}
            className="mt-4 mb-10 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1"
          >
            <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>Add
            New Experience
          </button>
        </div>
      </div>
      <div className="flex gap-x-20 mb-40 mt-6 md:mt-0">
        <Button onClick={prevstep} text={"Previous"} />
        <Button onClick={handleNextStep} text={"Next"} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ProfessionalExp);