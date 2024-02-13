import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";
import SubStepsIndicator from "./UpdateSubSteps";
import Button from "./Button";
import CustomLoader from "../../../common/CustomLoader";

const SubmitCV = ({
  errors,
  setErrors,
  prevstep,
  nextstep,
  substep,
  token,
  userProfile,
  baseUrl,
}) => {
  const [cv, setCv] = useState(null);
  const [cvName, setCvName] = useState("No Chosen File");
  const [isEdit, setIsEdit] = useState(false);
  const [haveCV, setHaveCV] = useState(false);
  const [cancelBox, setCancelBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const id = userProfile.id;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const cvResponse = await axios.get(
        `${baseUrl}/attachment/?search={"employee_id":${id},"name":"cv"}`,
        {
          headers,
        }
      );
      const cvRes = cvResponse.data[0];
      if (cvRes) {
        setHaveCV(cvRes);
      }
      setCvName(cvRes?.document?.name);
      setCv(cv);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const cvData = {
      name: file.name,
      type: file.type,
      size: file.size,
    };
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCv({ name: file.name, file: e.target.result });
        setCvName(cvData.name);
      };
      reader.readAsDataURL(file);
      setErrors({ cv: "" });

      if (file.size > maxSizeInBytes) {
        const validationErrors = { cv: "Upload a PDF no larger than 2 MB" };
        setErrors(validationErrors);
      }
    } else {
      const validationErrors = { cv: "Select Valid File" };
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("UpdatedCV", JSON.stringify(cv));
  }, [cv]);

  const handleSave = async () => {
    if (!cv) {
      const validationErrors = { cv: "CV is required" };
      setErrors(validationErrors);
    } else {
      setIsLoading(true); // Set loading state to true before save operation
      try {
        if (haveCV) {
          const cvResponse = await axios.patch(
            `${baseUrl}/attachment/${haveCV.id}`,
            {
              document: cv,
            },
            {
              headers,
            }
          );
          if (cvResponse.status === 200) {
            toast.success("CV Updated!", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
          const cvResponse = await axios.post(
            `${baseUrl}/attachment/`,
            {
              employee_id: id,
              name: "cv",
              description: "Curriculum Vitae",
              document: cv,
            },
            {
              headers,
            }
          );
          if (cvResponse.status === 201) {
            toast.success("CV Updated!", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
        nextstep();
      } catch (error) {
        toast.error("Could not update the cv, Please try again later!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsLoading(false); // Clear loading state after save operation
    }
  };

  const handleNextStep = () => {
    sessionStorage.clear();
    nextstep();
  };

  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <SubStepsIndicator substep={substep} />
        <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
          Submit Your CV:
        </h2>
        <div className="flex flex-col md:flex-row lg:gap-x-36">
          <div className="order-2 md:order-1 md:w-[65%]">
            <h2 className="text-input opacity-70 tracking-wide text-base mt-3 mb-3 lg:mb-4 lg:text-base">
              Attach Your CV:
            </h2>
            <label
              htmlFor="file-upload"
              className="cursor-pointer opacity-70 
            rounded-lg py-1 text-input"
            >
              <div
                className={`${isEdit ? "text-gray-700" : "text-gray-500"
                  } flex mb-2`}
              >
                <div className="bg-gray-200 border-gray-400 border py-1 px-3 rounded-l-md ">
                  {isEdit ? "Upload CV" : "CV"}{" "}
                </div>
                <div className="py-1 px-3 border-gray-200 border rounded-r-md">
                  {cvName}
                </div>
              </div>
              <input
                id="file-upload"
                disabled={isEdit ? false : true}
                type="file"
                name="cv"
                accept=".doc, .docx"
                max-size="2097152"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {errors.cv && (
              <small className="text-red-500 block">{errors.cv}</small>
            )}
            <small className="text-gray-400">
              Upload a doc or docx file no larger than 2 MB.
            </small>
          </div>
        </div>
        <div className="flex gap-x-5 mb-40 mt-5">
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
              {isLoading ? <div className="flex items-center justify-center gap-x-2">Saving <CustomLoader /></div> : 'Save & Next'}
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
              If you have made changes, they will not be saved. Do you want to
              proceed?
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

export default connect(mapStateToProps)(SubmitCV);
