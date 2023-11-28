import React, { useState, useEffect } from "react";
import moment from "moment";
import Datepicker from "../Dashboard/Datepicker";
import upload from "../../../assets/images/upload.png";
import Joi from "joi";
import { connect } from "react-redux";
import Button from "./Button";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";


const validationSchema = Joi.object({
  first_name: Joi.string().min(3).max(20).required().label("First Name"),
  last_name: Joi.string().min(3).max(20).required().label("Last Name"),
  father_name: Joi.string().min(3).max(20).required().label("Father Name"),
  mother_name: Joi.string().min(3).max(20).required().label("Mother Name"),
  mobile_no: Joi.string().required().label("Phone Number"),
  date_of_birth: Joi.string().required().label("DOB"),
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
    .max(20)
    .required()
    .label("First Name"),
  emergency_last_name: Joi.string()
    .min(3)
    .max(20)
    .required()
    .label("Last Name"),
  emergency_phone_no: Joi.string().required().label("Phone Number"),
  emergency_relation: Joi.string().required().label("emergency_relation"),
});

const PersonalInfo = ({
  nextstep,
  errors,
  setErrors,
  token,
  userProfile,
  baseUrl,
}) => {
  let [defaultData, setDefaultData] = useState({});
  let [isEdit, setIsEdit] = useState(false);
  let [cancelBox, setCancelBox] = useState(false);

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };

  const id = userProfile.id;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [imagePreview, setImagePreview] = useState("");
//   profile_picture
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
    const fileData = { name: selectedFile.name };
      const reader = new FileReader();
      reader.onload = (e) => {
        setDataInSessionStorage("UpdatedDP" ,{
            name: fileData.name,
            file: e.target.result,
          } )
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      const imageError = { image: "" };
      setErrors(imageError);
    }
  };

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      const employeeData = employeeResponse.data;
      setDefaultData(employeeData);
      setImagePreview(employeeData.profile_picture)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isEdit]);

  const handleEdit = (name, value) => {
    setDefaultData({ ...defaultData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handledate_of_birthChange = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleEdit("date_of_birth", formattedDate);
  };

  useEffect(() => {
    setDataInSessionStorage("UpdatedPersonalInfo", defaultData);
  }, [defaultData]);
  useEffect(() => {
    setDataInSessionStorage("UpdatedDP",imagePreview)
}, [imagePreview])
  const handleSave = async () => {
    let checkData = getDataFromSessionStorage("UpdatedPersonalInfo");
    const copyCheckData = {
      first_name: checkData.first_name,
      last_name: checkData.last_name,
      father_name: checkData.father_name,
      mother_name: checkData.mother_name,
      mobile_no: checkData.mobile_no,
      date_of_birth: checkData.date_of_birth,
      email: checkData.email,
      work_email: checkData.work_email,
      current_address: checkData.current_address,
      residential_address: checkData.residential_address,
      nic: checkData.nic,
      emergency_first_name: checkData.emergency_first_name,
      emergency_last_name: checkData.emergency_last_name,
      emergency_phone_no: checkData.emergency_phone_no,
      emergency_relation: checkData.emergency_relation,
    };
    const { error } = validationSchema.validate(copyCheckData, {
      abortEarly: false,
    });
    let updatedDP = getDataFromSessionStorage("UpdatedDP");
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    }
    else if (!updatedDP) {
        const imageError = { image: 'Please upload an image.' };
        setErrors(imageError);
    }
    else {
      setErrors({});
      let updatedData = getDataFromSessionStorage("UpdatedPersonalInfo");
      let updatedDP = getDataFromSessionStorage("UpdatedDP");
      if (updatedData.passport_number === "") {
        updatedData["passport_number"] = "000000000000000";
      }
      updatedData["profile_picture"] = updatedDP
      let response = await axios.patch(
        `${baseUrl}/emp/${userProfile.id}`,
        updatedData,
        { headers }
      );
      if (response.status === 200) {
        setIsEdit(!isEdit);
        sessionStorage.clear();
        toast.success("Personal Information Updated!", {
            position: "top-right",
            autoClose: 3000,
          });
        sessionStorage.clear()
        nextstep();
      }
    }
  };
  const handleNextStep = () => {
    sessionStorage.clear()
    nextstep();
  };

  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
          Personal Information:{" "}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.first_name}
                  name="first_name"
                  id=""
                  placeholder="First Name here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.last_name}
                  name="last_name"
                  id=""
                  placeholder="Last Name here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.father_name}
                  name="father_name"
                  id=""
                  placeholder="Father Name here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.mother_name}
                  name="mother_name"
                  id=""
                  placeholder="Mother Name here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
                {errors.mother_name && (
                  <span className="text-red-500 text-sm ">
                    {errors.mother_name}
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
                  <input
                    type="number"
                    disabled={isEdit ? false : true}
                    value={defaultData.mobile_no}
                    name="mobile_no"
                    id=""
                    placeholder="0000000000"
                    className={`${
                      isEdit ? "text-black" : "text-gray-500"
                    } pl-2 bg-white rounded-r h-8 w-full text-sm placeholder-[#55657] placeholder-opacity-50`}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                  />
                </div>
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
                  disabled={isEdit ? false : true}
                  day={
                    defaultData.date_of_birth
                      ? defaultData.date_of_birth.substr(0, 2)
                      : null
                  }
                  month={
                    defaultData.date_of_birth
                      ? defaultData.date_of_birth.substr(3, 2)
                      : null
                  }
                  year={
                    defaultData.date_of_birth
                      ? defaultData.date_of_birth.substr(6, 4)
                      : null
                  }
                  name="date_of_birth"
                  className="z-50"
                  selected={moment(
                    defaultData.date_of_birth,
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
                  disabled={isEdit ? false : true}
                  value={defaultData.email}
                  name="email"
                  placeholder="Email Here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.work_email}
                  name="work_email"
                  id=""
                  placeholder="Email Here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                disabled={isEdit ? false : true}
                value={defaultData.current_address}
                name="current_address"
                id=""
                placeholder="Current Address here"
                className={`${
                  isEdit ? "text-black" : "text-gray-500"
                } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                disabled={isEdit ? false : true}
                value={defaultData.residential_address}
                name="residential_address"
                id=""
                placeholder="Permanent Address here"
                className={`${
                  isEdit ? "text-black" : "text-gray-500"
                } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                  disabled={isEdit ? false : true}
                  value={defaultData.nic}
                  placeholder="NIC Here"
                  name="nic"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
                {errors.nic && (
                  <span className="text-red-500 text-sm ">{errors.nic}</span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="passport_number"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Passport Number:
                </label>
                <input
                  type="text"
                  disabled={isEdit ? false : true}
                  value={defaultData.passport_number}
                  data-inputmask="'mask': '99999-9999999-9'"
                  placeholder="Passport Number Here (optional)"
                  name="passport_number"
                  required=""
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
                {errors.passport_number && (
                  <span className="text-red-500 text-sm ">
                    {errors.passport_number}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 md:w-[35%]">
            {/*  */}
            {/* Image uploader */}
            <div className="flex flex-col relative md:ml-6 md:mt-5 lg:mt-5 ">
              <label
                htmlFor="file-upload"
                className="flex bg-[#EFEFEF] cursor-pointer text-center overflow-hidden font-bold w-[240px] h-[260px] rounded-3xl my-3"
              >
                <div className="w-full h-full flex justify-center items-center border-solid bg-[#EFEFEF] rounded-3xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full"
                    />
                  ) : (
                    <>
                      {" "}
                      <span className="text-lg">
                        <img
                          src={upload}
                          alt="icon here"
                          className="w-20 h-20 block m-auto"
                        />
                        <span>Upload your photo</span>
                      </span>
                    </>
                  )}
                </div>
                <input
                  disabled={isEdit ? false : true}
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
                disabled={isEdit ? false : true}
                value={defaultData.emergency_first_name}
                name="emergency_first_name"
                id=""
                placeholder="First Name Here"
                className={`${
                  isEdit ? "text-black" : "text-gray-500"
                } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                disabled={isEdit ? false : true}
                value={defaultData.emergency_last_name}
                name="emergency_last_name"
                id=""
                placeholder="Last Name Here"
                className={`${
                  isEdit ? "text-black" : "text-gray-500"
                } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
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
                <input
                  type="number"
                  disabled={isEdit ? false : true}
                  value={defaultData.emergency_phone_no}
                  name="emergency_phone_no"
                  id=""
                  placeholder="Phone Number here"
                  className={`${
                    isEdit ? "text-black" : "text-gray-500"
                  } pl-2 bg-white rounded-r h-8 w-full text-sm placeholder-[#555657] placeholder-opacity-50`}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>
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
                htmlFor="emergency_relation"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Relation:
              </label>
              <input
                type="text"
                disabled={isEdit ? false : true}
                value={defaultData.emergency_relation}
                name="emergency_relation"
                id=""
                placeholder="emergency_relation Here"
                className={`${
                  isEdit ? "text-black" : "text-gray-500"
                } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
              />
              {errors.emergency_relation && (
                <span className="text-red-500 text-sm ">
                  {errors.emergency_relation}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2 lg:mt-10 md:mt-0 mb-40">
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

export default connect(mapStateToProps)(PersonalInfo);
