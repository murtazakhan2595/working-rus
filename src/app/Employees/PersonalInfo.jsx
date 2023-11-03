import React, { useState } from "react";
import moment from "moment";
import Datepicker from "../modules/Dashboard/Datepicker";
import upload from "../../assets/images/upload.png";
import Joi from "joi";
import Button from "./Button";

const personalInfoSchema = Joi.object({
  firstname: Joi.string().required().label("First Name"),
  lastname: Joi.string().required().label("Last Name"),
  fathername: Joi.string().required().label("Father Name"),
  mothername: Joi.string().required().label("Mother Name"),
  phonenumber: Joi.string().required().label("Phone Number"),
  dateofbirth: Joi.string().required().label("DOB"),
  personalemail: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Personal Email"),
  workemail: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Work Email"),
  currentaddress: Joi.string().required().label("Current Address"),
  permanentaddress: Joi.string().required().label("Permanent Address"),
  nic: Joi.string().required().label("NIC"),
  passportnumber: Joi.string().label("Passport Number"),
  emergencyfname: Joi.string().required().label("First Name"),
  emergencylname: Joi.string().required().label("Last Name"),
  emergencypnumber: Joi.string().required().label("Phone Number"),
  relation: Joi.string().required().label("Relation"),
  image: Joi.object().required().label("Image"),
  cv: Joi.object().optional().label("CV"),
  experienceSections: Joi.array()
    .items(
      Joi.object({
        organization: Joi.string().required().label("Organization"),
        designation: Joi.string().required().label("Designation"),
        exstartdate: Joi.string().required().label("Start Date"),
        exenddate: Joi.string().required().label("End Date"),
        file: Joi.object().required().label("Experience Letter"),
      })
    )
    .optional()
    .label("Professional Experience"),
  academic: Joi.string().optional().label("Academic"),
  acdstartdate: Joi.string().optional().label("Start Date"),
  acdenddate: Joi.string().optional().label("End Date"),
  certification: Joi.string().optional().label("certification"),
  institute: Joi.string().optional().label("Institute"),
  program: Joi.string().optional().label("Program"),
});

const PersonalInfo = ({
  formData,
  nextstep,
  handleChange,
  errors,
  setErrors,
  onImageChange,
}) => {
  const {
    firstname,
    lastname,
    fathername,
    mothername,
    phonenumber,
    dateofbirth,
    personalemail,
    workemail,
    currentaddress,
    permanentaddress,
    nic,
    passportnumber,
    emergencyfname,
    emergencylname,
    emergencypnumber,
    relation,
    image,
  } = formData;

  const [imagePreview, setImagePreview] = useState(image);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      handleChange("image", selectedFile);
    }
  };

  const handleDateOfBirthChange = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange("dateofbirth", formattedDate);
  };

  const handleNextStep = () => {
    const { error } = personalInfoSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
    } else if (!imagePreview) {
      const imageError = { image: "Please upload an image." };
      setErrors(imageError);
    } else {
      nextstep();
      console.log("Proceeding to the next step...");
    }
  };

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
                  htmlFor="firstname"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  value={firstname}
                  name="firstname"
                  id=""
                  placeholder="First Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.firstname && (
                  <span className="text-red-500 text-sm ">
                    {errors.firstname}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:w-1/2">
                <label
                  htmlFor="lastname"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  value={lastname}
                  name="lastname"
                  id=""
                  placeholder="Last Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.lastname && (
                  <span className="text-red-500 text-sm ">
                    {errors.lastname}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="fathername"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Father Name:
                </label>
                <input
                  type="text"
                  value={fathername}
                  name="fathername"
                  id=""
                  placeholder="Father Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.fathername && (
                  <span className="text-red-500 text-sm ">
                    {errors.fathername}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="mothername"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Mother Name:
                </label>
                <input
                  type="text"
                  value={mothername}
                  name="mothername"
                  id=""
                  placeholder="Mother Name here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.mothername && (
                  <span className="text-red-500 text-sm ">
                    {errors.mothername}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="phonenumber"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={phonenumber}
                  name="phonenumber"
                  id=""
                  placeholder="Phone Number here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.phonenumber && (
                  <span className="text-red-500 text-sm ">
                    {errors.phonenumber}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="dateofbirth"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Date Of Birth:
                </label>
                <Datepicker
                  name="dateofbirth"
                  className="z-50"
                  selected={moment(dateofbirth, "DD-MM-YYYY").toDate()}
                  onChange={handleDateOfBirthChange}
                />
                {errors.dateofbirth && (
                  <span className="text-red-500 text-sm ">
                    {errors.dateofbirth}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="personalemail"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Personal Email:
                </label>
                <input
                  type="email"
                  value={personalemail}
                  name="personalemail"
                  placeholder="Email Here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.personalemail && (
                  <span className="text-red-500 text-sm ">
                    {errors.personalemail}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="workemail"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Work Email:
                </label>
                <input
                  type="email"
                  value={workemail}
                  name="workemail"
                  id=""
                  placeholder="Email Here"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.workemail && (
                  <span className="text-red-500 text-sm ">
                    {errors.workemail}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-2 md:mt-5">
              <label
                htmlFor="currentaddress"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Current Address:
              </label>
              <input
                type="text"
                value={currentaddress}
                name="currentaddress"
                id=""
                placeholder="Current Address here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.currentaddress && (
                <span className="text-red-500 text-sm ">
                  {errors.currentaddress}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2 md:mt-5">
              <label
                htmlFor="permanentaddress"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Permanent Address:
              </label>
              <input
                type="text"
                value={permanentaddress}
                name="permanentaddress"
                id=""
                placeholder="Permanent Address here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.permanentaddress && (
                <span className="text-red-500 text-sm ">
                  {errors.permanentaddress}
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
                  value={nic}
                  placeholder="NIC Here"
                  name="nic"
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.nic && (
                  <span className="text-red-500 text-sm ">{errors.nic}</span>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                <label
                  htmlFor="passportnumber"
                  className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                >
                  Passport Number:
                </label>
                <input
                  type="text"
                  value={passportnumber}
                  data-inputmask="'mask': '99999-9999999-9'"
                  placeholder="Passport Number Here"
                  name="passportnumber"
                  required=""
                  className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.passportnumber && (
                  <span className="text-red-500 text-sm ">
                    {errors.passportnumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 md:w-[35%]">
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
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  name="image"
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
                htmlFor="emergencyfname"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                First Name:
              </label>
              <input
                type="text"
                value={emergencyfname}
                name="emergencyfname"
                id=""
                placeholder="First Name Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergencyfname && (
                <span className="text-red-500 text-sm ">
                  {errors.emergencyfname}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2 md:w-1/2 lg:gap-x-12">
              <label
                htmlFor="emergencylname"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Last Name:
              </label>
              <input
                type="text"
                value={emergencylname}
                name="emergencylname"
                id=""
                placeholder="Last Name Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergencylname && (
                <span className="text-red-500 text-sm ">
                  {errors.emergencylname}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
            <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
              <label
                htmlFor="emergencypnumber"
                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
              >
                Phone Number:
              </label>
              <input
                type="tel"
                value={emergencypnumber}
                name="emergencypnumber"
                id=""
                placeholder="Phone Number here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.emergencypnumber && (
                <span className="text-red-500 text-sm ">
                  {errors.emergencypnumber}
                </span>
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
                value={relation}
                name="relation"
                id=""
                placeholder="Relation Here"
                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {errors.relation && (
                <span className="text-red-500 text-sm ">{errors.relation}</span>
              )}
            </div>
          </div>
        </div>
        {/* <button onClick={handleNextStep} className='bg-baseBlue rounded-lg text-white mb-40 px-8 py-[3px] mt-5 md:mt-10 cursor-not-allowed'>
                    Next
                </button> */}
        <div className="mt-6 lg:mt-10 mb-40">
          <Button onClick={handleNextStep} text={"Next"} />
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
