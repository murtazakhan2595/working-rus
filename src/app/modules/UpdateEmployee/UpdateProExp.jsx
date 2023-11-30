import React, { useState, useEffect } from "react";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import SubStepsIndicator from "./UpdateSubSteps";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { WiCloudRefresh } from "react-icons/wi";
import { toast, ToastContainer } from "react-toastify";
import Button from "./Button";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import axios from "axios";

const ProfessionalExp = ({
  errors,
  setErrors,
  substep,
  prevstep,
  nextstep,
  token,
  userProfile,
  baseUrl,
}) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };
  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };
  let defaultData = getDataFromSessionStorage("UpdatedProExp");
  const [experienceSections, setExperienceSections] = useState(
    defaultData ? defaultData : [{}]
  );
  const [deleteExp, setDeleteExp] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [cancelBox, setCancelBox] = useState(false);

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
    setErrors({});
    sessionStorage.clear();
    nextstep();
  };

  const handleSave = async () => {
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
      if (!experience.exp_end_date) {
        fieldErrors[`exp_end_date_${i}`] = "End Date is required.";
      }
      if (!experience.exp_letter?.hasOwnProperty("name")) {
        fieldErrors[`exp_letter_${i}`] = "Experience Letter is required.";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
    } else {
      setErrors({});
      let updatedData = getDataFromSessionStorage("UpdatedProExp");
      try {
        updatedData.map(async (exp) => {
          let experience = {
            employee_id: userProfile.id,
            exp_organization: exp.exp_organization,
            exp_designation: exp.exp_designation,
            exp_letter : exp.exp_letter,
            exp_start_date: moment(exp.exp_start_date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            exp_end_date: moment(exp.exp_end_date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
          };
          if (exp.hasOwnProperty("id")) {
            let res = await axios.patch(
              `${baseUrl}/experience/${exp.id}`,
              experience,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (res.status !== 200) {
              toast.error("Form submission failed. Please try again.", {
                position: "top-center",
                autoClose: 3000,
              });
              return;
            }
          } else {
            let res = await axios.post(`${baseUrl}/experience/`, experience, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
          }
        });
        deleteExp.map(async (delExp) => {
          let res = await axios.delete(`${baseUrl}/experience/${delExp}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        });
        setIsEdit(!isEdit);
        sessionStorage.clear();
        toast.success("Professional Experiences Updated!", {
          position: "top-right",
          autoClose: 3000,
        });
        nextstep();
      } catch (e) {
        toast.error("Form submission failed. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const id = userProfile.id;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const experiencesResponse = await axios.get(
        `${baseUrl}/experience/?search={"employee_id":${id}}`,
        { headers }
      );
      const experiencesData = experiencesResponse.data.results;

      const formattedExperiencesData = experiencesData.map((experience) => ({
        ...experience,
        exp_start_date: moment(experience.exp_start_date).format("DD-MM-YYYY"),
        exp_end_date: moment(experience.exp_end_date).format("DD-MM-YYYY"),
      }));

      setExperienceSections(formattedExperiencesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isEdit]);

  useEffect(() => {
    setDeleteExp(deleteExp);
  }, [deleteExp]);

  useEffect(() => {
    setDataInSessionStorage("UpdatedProExp", experienceSections);
  }, [experienceSections]);

  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <SubStepsIndicator substep={substep} />
        <div className="flex flex-col md:flex-row lg:gap-x-36">
          <div className="order-2 md:order-1 md:w-[60%]">
            {experienceSections.map((experience, index) => (
              <div key={index}>
                <div className="flex items-center">
                  {index !== 0 && isEdit && (
                    <AiOutlineCloseCircle
                      className="text-red-500 mr-1 text-xl mb-2 lg:mb-4 mt-2"
                      onClick={() => {
                        let copySections = [...experienceSections];
                        copySections.splice(index, 1);
                        if (experience.hasOwnProperty("id")) {
                          setDeleteExp([...deleteExp, experience.id]);
                        }
                        setExperienceSections(copySections);
                      }}
                    />
                  )}
                  <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
                    Professional Experience {index + 1}:
                  </h2>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                    <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                      <label
                        htmlFor="exp_organization"
                        className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                      >
                        Organization:
                      </label>
                      <input
                        type="text"
                        disabled={isEdit ? false : true}
                        name="exp_organization"
                        placeholder="Organization"
                        value={experience.exp_organization}
                        onChange={(e) => {
                          const updatedSections = [...experienceSections];
                          updatedSections[index].exp_organization =
                            e.target.value;
                          setExperienceSections(updatedSections);
                          clearError(`exp_organization_${index}`);
                        }}
                        className={`${
                          isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                      />
                      {errors[`exp_organization_${index}`] && (
                        <div className="text-red-500 text-sm">
                          {errors[`exp_organization_${index}`]}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                      <label
                        htmlFor="exp_designation"
                        className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                      >
                        Designation:
                      </label>
                      <input
                        type="text"
                        disabled={isEdit ? false : true}
                        name="exp_designation"
                        placeholder="Designation"
                        className={`${
                          isEdit ? "text-black" : "text-gray-500"
                        } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                        value={experience.exp_designation}
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
                        htmlFor="exp_start_date"
                        className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                      >
                        Start Date:
                      </label>
                      <Datepicker
                        disabled={isEdit ? false : true}
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
                        name="exp_start_date"
                        selected={moment(
                          experience.exp_start_date,
                          "DD-MM-YYYY"
                        ).toDate()}
                        onChange={(date) => {
                          const formattedDate = moment(date)
                            .format("DD-MM-YYYY")
                            .toLowerCase();
                          const updatedSections = [...experienceSections];
                          updatedSections[index].exp_start_date = formattedDate;
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
                    <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                      <label
                        htmlFor="exp_end_date"
                        className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                      >
                        End Date:
                      </label>
                      <Datepicker
                        name="exp_end_date"
                        disabled={isEdit ? false : true}
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
                        selected={moment(
                          experience.exp_end_date,
                          "DD-MM-YYYY"
                        ).toDate()}
                        onChange={(date) => {
                          const formattedDate = moment(date)
                            .format("DD-MM-YYYY")
                            .toLowerCase();
                          const updatedSections = [...experienceSections];
                          updatedSections[index].exp_end_date = formattedDate;
                          setExperienceSections(updatedSections);
                          clearError(`exp_end_date_${index}`);
                        }}
                      />
                      {errors[`exp_end_date_${index}`] && (
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
                      {experience.exp_letter ? (
                        <div className="flex   items-center">
                          <div
                            className={`${
                              isEdit ? "opacity-50" : "text-gray-500"
                            }`}
                          >
                            {experience.exp_letter.name}
                          </div>
                          <WiCloudRefresh
                            onClick={() => {
                              if(isEdit){
                                const updatedSections = [...experienceSections];
                                updatedSections[index].exp_letter = "";
                                setExperienceSections(updatedSections);
                              }
                            }}
                            className={`${isEdit ? "text-blue-600" : "text-gray-500"}text-xl`}
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
                            disabled={isEdit ? false : true}
                            name="exp_letter"
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
                                  updatedSections[i].exp_letter = {
                                    name: fileData.name,
                                    file: e.target.result,
                                  };
                                  setExperienceSections(updatedSections);
                                };
                                reader.readAsDataURL(file);
                                setErrors(`exp_letter_${index}`);
                              }
                            }}
                          />
                        </label>
                      )}
                      {errors[`exp_letter_${index}`] && (
                        <div className="text-red-500 text-sm">
                          {errors[`exp_letter_${index}`]}
                        </div>
                      )}
                      <small className="text-gray-400 my-3">
                        Upload a pdf no larger than 100 MB.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isEdit && (
              <button
                onClick={addExperienceSection}
                className="mt-4 mb-5 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1"
              >
                <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>
                Add New Experience
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-x-5 mb-40 mt-4 md:mt-0">
          {!isEdit && <Button onClick={prevstep} text={"Previous"} />}
          {isEdit ? (
            <button
              onClick={() => {
                setCancelBox(!cancelBox);
              }}
              className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEdit(!isEdit);
              }}
              className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            >
              Edit
            </button>
          )}
          {isEdit ? (
            <button
              onClick={handleSave}
              className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
            >
              Save & Next
            </button>
          ) : (
            <Button onClick={handleNextStep} text={"Next"} />
          )}
        </div>
      </div>
      {cancelBox && (
        <div className="fixed inset-0 z-50 flex  items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Discard Changes</h1>
              <div className="text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer">
                <RxCross2 onClick={() => setCancelBox(!cancelBox)} />
              </div>
            </div>
            <p className="text-gray-700 mt-2">
            If you have made changes, they will not be saved. Do you want to proceed?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-1 mr-2 text-white bg-blue-500 rounded"
                onClick={() => {
                  setCancelBox(!cancelBox);
                }}
              >
                Keep
              </button>
              <button
                className="px-4 py-1 mr-2 text-white bg-red-500 rounded"
                onClick={() => {
                  setIsEdit(!isEdit);
                  setCancelBox(!cancelBox);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
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

export default connect(mapStateToProps)(ProfessionalExp);
