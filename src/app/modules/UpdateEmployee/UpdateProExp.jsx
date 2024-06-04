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
import CustomLoader from "../../../components/CustomLoader";
import { BiEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { downloadAttachment } from "../../../utils/fileUtils";
import { LuExternalLink } from "react-icons/lu";
import { Tooltip } from "@mui/material";
import { downloadFiles } from "../../../utils/downUtils";
import { BsDownload } from "react-icons/bs";

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
  const [loading, setLoading] = useState(false);
  const [disableEndDate, setDisableEndDate] = useState(false);

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
    setLoading(true);

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
      if (!disableEndDate && !experience.exp_end_date) {
        fieldErrors[`exp_end_date_${i}`] = "End Date is required.";
      }
      // if (!experience.exp_letter?.hasOwnProperty("name")) {
      //   fieldErrors[`exp_letter_${i}`] = "Experience Letter is required.";
      // }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false);
    } else {
      setErrors({});
      let updatedData = getDataFromSessionStorage("UpdatedProExp");
      try {
        updatedData.map(async (exp) => {
          let experience = {
            // employee_id: userProfile.id,
            employee_id: id,
            exp_organization: exp.exp_organization,
            exp_designation: exp.exp_designation,
            exp_letter: exp.exp_letter,
            exp_start_date: moment(exp.exp_start_date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            // exp_end_date: moment(exp.exp_end_date, "DD-MM-YYYY").format(
            //   "YYYY-MM-DD"
            // ),
            exp_end_date: disableEndDate ? null : moment(exp.exp_end_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
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
              setLoading(false);
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
      } finally {
        setLoading(false);
      }
    }
  };


  // const id = userProfile.id;

  const { id } = useParams();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleEditClick = () => {
    setIsEdit(true);
  };




  const fetchData = async () => {
    try {
      const experiencesResponse = await axios.get(
        `${baseUrl}/experience/?search={"employee_id":${id}}`,
        { headers }
      );
      const experiencesData = experiencesResponse.data;

      // Check if any experience has null exp_end_date
      const hasNullEndDate = experiencesData.some(
        (experience) => experience.exp_end_date === null
      );

      const formattedExperiencesData = experiencesData.map((experience) => ({
        ...experience,
        exp_start_date: moment(experience.exp_start_date).format("DD-MM-YYYY"),
        exp_end_date: moment(experience.exp_end_date).format("DD-MM-YYYY"),
      }));

      setExperienceSections(formattedExperiencesData);
      setDisableEndDate(hasNullEndDate); // Set disableEndDate state based on null exp_end_date
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
        <div className="flex items-center justify-between">
          <SubStepsIndicator substep={substep} />
          <div className="flex gap-2">
            {isEdit ? (
              null
            ) : (
              <button
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
                className="bg-baseBlue rounded-full text-white p-3"
              >
                <BiEdit className="text-xl" />
              </button>
            )}
          </div>
        </div>

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
                  <div className="flex justify-between w-full">
                    <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
                      Professional Experience {index + 1}:
                    </h2>

                  </div>


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
                        // disabled={isEdit ? false : true}
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
                        onClick={handleEditClick}
                        className={`${isEdit ? "text-black" : "text-gray-500"
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
                        // disabled={isEdit ? false : true}
                        name="exp_designation"
                        placeholder="Designation"
                        className={`${isEdit ? "text-black" : "text-gray-500"
                          } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                        value={experience.exp_designation}
                        onClick={handleEditClick}
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
                      <div onClick={handleEditClick} >
                        <Datepicker
                          // disabled={isEdit ? false : true}
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
                      </div>
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
                      <div onClick={handleEditClick} className="flex items-center gap-x-2" >
                        <Datepicker
                          disabled={disableEndDate}
                          name="exp_end_date"
                          day={
                            experience?.exp_end_date && !disableEndDate
                              ? experience?.exp_end_date.substr(0, 2)
                              : null
                          }
                          month={
                            experience?.exp_end_date && !disableEndDate
                              ? experience?.exp_end_date.substr(3, 2)
                              : null
                          }
                          year={
                            experience?.exp_end_date && !disableEndDate
                              ? experience?.exp_end_date.substr(6, 4)
                              : null
                          }
                          selected={
                            disableEndDate
                              ? new Date() // Set current date if end date is disabled
                              : moment(experience.exp_end_date, "DD-MM-YYYY").toDate()
                          }
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

                        <input
                          type="checkbox"
                          checked={disableEndDate}
                          onChange={(e) => {
                            setDisableEndDate(e.target.checked);
                            // Update exp_end_date based on checkbox status
                            const updatedSections = [...experienceSections];
                            updatedSections[index].exp_end_date = e.target.checked ? null : experience.exp_end_date;
                            setExperienceSections(updatedSections);
                            clearError(`exp_end_date_${index}`);
                          }}
                          className="ml-3"
                        />
                        <label>Till to Date</label>

                      </div>
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
                      <div>
                        {experience.exp_letter ? (
                          <div className="flex gap-x-2 items-center">
                            <div
                              className={`flex items-center gap-x-2 ${isEdit ? "opacity-50" : "text-gray-500"
                                }`}
                            >
                              <p className="text-blue-600">
                                {experience.exp_letter.name ? experience.exp_letter.name : "Not available"}
                              </p>
                              <Tooltip title="View Doc">
                                <button
                                  className="text-blue-600"
                                  onClick={() =>
                                    downloadAttachment(
                                      experience.exp_letter.file,
                                      experience.exp_letter.name
                                    )
                                  }
                                >
                                  {experience.exp_letter.name ? <LuExternalLink /> : "Not available"}
                                </button>
                              </Tooltip>
                              <Tooltip title="Download Doc">
                                <button
                                  className="text-blue-600"
                                  onClick={() =>
                                    downloadFiles(
                                      experience.exp_letter.file,
                                      experience.exp_letter.name
                                    )
                                  }
                                >
                                  {experience.exp_letter.name ? <BsDownload /> : "Not available"}
                                </button>
                              </Tooltip>
                            </div>
                            <div onClick={handleEditClick}>
                              <WiCloudRefresh
                                onClick={() => {
                                  if (isEdit) {
                                    const updatedSections = [...experienceSections];
                                    updatedSections[index].exp_letter = "";
                                    setExperienceSections(updatedSections);
                                  }
                                }}
                                className={`${isEdit ? "text-blue-600" : "text-gray-500"}text-xl`}
                              />
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer opacity-70 rounded-lg text-input"
                          >
                            <input
                              id="file-upload"
                              type="file"
                              // disabled={isEdit ? false : true}
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
                      </div>
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
            {/* {isEdit && ( */}
            <button
              onClick={addExperienceSection}
              className="mt-4 mb-5 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1"
            >
              <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>
              Add New Experience
            </button>
            {/* )} */}
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
            // <button
            //   onClick={() => {
            //     setIsEdit(!isEdit);
            //   }}
            //   className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
            // >
            //   Edit
            // </button>
            null
          )}
          {isEdit ? (
            <button
              onClick={handleSave}
              className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
            >
              {loading ? <div className="flex items-center justify-center gap-x-2">Saving <CustomLoader /></div> : 'Save & Next'}
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
