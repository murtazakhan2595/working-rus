// import { useEffect } from "react";
// import moment from "moment";
// import React, { useState } from "react";
// import Datepicker from "../Dashboard/Datepicker";
// import Select from "react-select";
// import Joi from "joi";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Button from "./Button";
// import { WiCloudRefresh } from "react-icons/wi";
// import { RxCross2 } from "react-icons/rx";
// import { connect } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import CustomLoader from "../../../common/CustomLoader";
// import { BiEdit } from "react-icons/bi";
// import { useParams } from "react-router-dom";
// import { downloadAttachment } from "../../../utils/fileUtils";
// import { Tooltip } from "@mui/material";
// import { LuExternalLink } from "react-icons/lu";
// import { downloadFiles } from "../../../utils/downUtils";
// import { BsDownload } from "react-icons/bs";

// import { saveEmployeeAcademicRecordData, getEmployeeAcademicRecordData, deleteEmployeeAcademicRecordData, saveEmployeeCertificationData, getEmployeeCerficationData } from '../../hooks/employee';
// import { EmployeeAcademicRecord, EmployeeCertifiation } from '../../utils/Types/Employee'
// import { validationAcademicRecordSchema } from '../../utils/FormSchema/employeeFormSchema'


// const academicOptions = [
//   { value: "Intermediate", label: "Intermediate" },
//   { value: "Bachelor", label: "Bachelor" },
//   { value: "Master", label: "Master" },
// ];


// const AcademicRecords = ({
//   errors,
//   setErrors,
//   prevstep,
//   nextstep,
//   token,
//   userProfile,
//   baseUrl,
// }) => {

//   // const [deleteExp, setDeleteExp] = useState([]);
//   // const [isEdit, setIsEdit] = useState(false);
//   // const [cancelBox, setCancelBox] = useState(false);
//   // const [isLoading, setIsLoading] = useState(false);
//   // const [cerErrors, setCerErrors] = useState({});
//   // const [academicInfo, setAcademicInfo] = useState({});
//   // const [certificationSections, setCertificationSections] = useState([]);

//   // useEffect(() => {
//   //   getEmployeeAcademicRecordData(baseUrl, userProfile?.id, token).then(response => {
//   //     setAcademicInfo(response);

//   //   }).catch(error => {
//   //     console.log(error);
//   //   });
//   // }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

//   // useEffect(() => {
//   //   getEmployeeCerficationData(baseUrl, userProfile?.id, token).then(response => {
//   //     setCertificationSections(response);

//   //   }).catch(error => {
//   //     console.log(error);
//   //   });
//   // }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

//   const [deleteExp, setDeleteExp] = useState([]);
//   const [isEdit, setIsEdit] = useState(false);
//   const [cancelBox, setCancelBox] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [cerErrors, setCerErrors] = useState({});
//   const [academicInfo, setAcademicInfo] = useState([]);
//   const [certificationSections, setCertificationSections] = useState([]);

//   useEffect(() => {
//     getEmployeeAcademicRecordData(baseUrl, userProfile?.id, token)
//       .then((response) => {
//         setAcademicInfo(response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [baseUrl, userProfile, token]);

//   useEffect(() => {
//     getEmployeeCerficationData(baseUrl, userProfile?.id, token)
//       .then((response) => {
//         setCertificationSections(response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [baseUrl, userProfile, token]);

//   const addCertificationSection = () => {
//     setCertificationSections([...certificationSections, {}]);
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       let fileData = {
//         name: selectedFile.name,
//       };
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setAcademicInfo({
//           ...academicInfo,
//           certificate: { ...academicInfo.certificate, document: { name: fileData.name, file: e.target.result } },
//         });
//       };
//       reader.readAsDataURL(selectedFile);
//       const certificateError = { ...errors, certificate: "" };
//       setErrors(certificateError);
//       // }
//     }
//   };

//   const handleStartDate = (date) => {
//     const formattedDate = moment(date).format("YYYY-MM-DD").toLowerCase();
//     handleChange("edu_start_date", formattedDate);
//   };

//   const handleEndDate = (date) => {
//     const formattedDate = moment(date).format("YYYY-MM-DD").toLowerCase();
//     handleChange("edu_end_date", formattedDate);
//   };

//   const handleSave = async () => {
//     const fieldErrors = {};
//     for (let i = 0; i < certificationSections.length; i++) {
//       const certification = certificationSections[i];
//       if (!certification.certification_name) {
//         fieldErrors[`certification_name_${i}`] =
//           "Certification Name is required.";
//       }
//       if (!certification.completion_date) {
//         fieldErrors[`completion_date_${i}`] =
//           "Completion Date Designation is required.";
//       }
//       if (!certification.expiry_date) {
//         fieldErrors[`expiry_date_${i}`] = "Expiry Date is required.";
//       }
//       if (!certification.certification_institute) {
//         fieldErrors[`certification_institute_${i}`] =
//           "Certification Body is required.";
//       }
//     }
//     const { error } = validationAcademicRecordSchema.validate(
//       {
//         education_level: academicInfo.education_level,
//         program: academicInfo.program,
//         institute_name: academicInfo.institute_name,
//         edu_start_date: academicInfo.edu_start_date,
//         edu_end_date: academicInfo.edu_end_date,
//       },
//       { abortEarly: false }
//     );

//     const validationErrors = {};
//     if (Object.keys(fieldErrors).length > 0 || error || !academicInfo.certificate?.hasOwnProperty("name")) {
//       if (!academicInfo.certificate?.hasOwnProperty("name")) {
//         setErrors({ ...errors, certificate: "Certification is required" });
//       }
//       if (error) {
//         error.details.forEach((detail) => {
//           validationErrors[detail.path[0]] = detail.message;
//         });
//         if (!academicInfo.certificate?.hasOwnProperty("name")) {
//           validationErrors.certificate = "Certification is required";
//         }
//         setErrors(validationErrors);
//       }
//       if (Object.keys(fieldErrors).length > 0) {
//         let newErrors = { ...fieldErrors };
//         setCerErrors(newErrors);
//       }
//       return;
//     } else {
//       setIsLoading(true);
//       try {

//         const academicDoc = {
//           employee_id: userProfile.id,
//           name: "acadmicDoc",
//           description: "Acadmic Document",
//           document: academicInfo.certificate,
//         }
//         academicInfo.employee_id = userProfile.id
//         delete academicInfo.certificate
//         saveEmployeeAcademicRecordData(baseUrl, userProfile?.id, token, academicInfo, academicDoc);
//         saveEmployeeCertificationData(baseUrl, userProfile?.id, token, certificationSections);
//         deleteEmployeeAcademicRecordData(baseUrl, userProfile?.id, token, deleteExp);
//       }
//       catch (error) {
//         toast.error("Form submission failed. Please try again.", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//       } finally {
//         setIsLoading(false); // Reset loading state regardless of success or failure
//       }

//       setIsEdit(!isEdit);
//       toast.success("Academic Records Updated!", {
//         position: "top-right",
//         autoClose: 3000,
//       });

//       nextstep();
//     }
//   };




//   const handleNextStep = () => {
//     nextstep();
//   };

//   const handleChange = (name, value) => {
//     setAcademicInfo({ ...academicInfo, [name]: value });
//     setErrors({ ...errors, [name]: null });
//   };
//   const clearCerError = (fieldName) => {
//     if (cerErrors[fieldName]) {
//       const updatedErrors = { ...cerErrors };
//       delete updatedErrors[fieldName];
//       setCerErrors(updatedErrors);
//     }
//   };

//   const handleEditClick = () => {
//     setIsEdit(true);
//   };

//   const addAcademicRecord = () => {
//     setAcademicInfo([
//       ...academicInfo,
//       {
//         education_level: "",
//         program: "",
//         institute_name: "",
//         edu_start_date: "",
//         edu_end_date: "",
//         certificate: {},
//       },
//     ]);
//   };



//   return (
//     <>
//       <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
//         <div className="flex justify-between">
//           <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
//             Academic Records:
//           </h2>
//           <div className="flex gap-2">
//             {isEdit ? (
//               null
//             ) : (
//               <button
//                 onClick={() => {
//                   setIsEdit(!isEdit);
//                 }}
//                 className="bg-baseBlue rounded-full text-white p-3"
//               >
//                 <BiEdit className="text-xl" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row lg:gap-x-36">
//           <div className="order-2 md:order-1 md:w-[55%]">
//             <div className="flex flex-col">
//               {academicInfo.map((record, index) => (
//                 <div key={index}>
//                   <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
//                     <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                       <label
//                         htmlFor={`education_${index}`}
//                         className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                       >
//                         Education Level:
//                       </label>
//                       <div onClick={handleEditClick}>
//                         <Select
//                           name={`education_${index}`}
//                           value={academicOptions.find(
//                             (option) => option.value === record.education_level
//                           )}
//                           options={academicOptions}
//                           isSearchable={false}
//                           className="focus:outline-none border-none"
//                           onChange={(selectedOption) => {
//                             handleChange("education_level", selectedOption.value, index);
//                           }}
//                         />
//                       </div>
//                       {errors[`education_level_${index}`] && (
//                         <div className="text-red-500 text-sm">
//                           {errors[`education_level_${index}`]}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                       <label
//                         htmlFor={`program_${index}`}
//                         className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                       >
//                         Program:
//                       </label>
//                       <input
//                         type="text"
//                         value={record.program}
//                         name={`program_${index}`}
//                         placeholder="Program Here"
//                         className={`${isEdit ? "text-black" : "text-gray-500"
//                           } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
//                         onChange={(e) => handleChange("program", e.target.value, index)}
//                         onClick={handleEditClick}
//                       />
//                       {errors[`program_${index}`] && (
//                         <div className="text-red-500 text-sm">
//                           {errors[`program_${index}`]}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex flex-col mt-2 md:mt-5">
//                     <label
//                       htmlFor={`institute_name_${index}`}
//                       className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                     >
//                       Institute Name:
//                     </label>
//                     <input
//                       type="text"
//                       value={record.institute_name}
//                       name={`institute_name_${index}`}
//                       placeholder="Institute Name Here"
//                       className={`${isEdit ? "text-black" : "text-gray-500"
//                         } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
//                       onChange={(e) => handleChange("institute_name", e.target.value, index)}
//                       onClick={handleEditClick}
//                     />
//                     {errors[`institute_name_${index}`] && (
//                       <div className="text-red-500 text-sm">
//                         {errors[`institute_name_${index}`]}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
//                     <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                       <label
//                         htmlFor={`startdate_${index}`}
//                         className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                       >
//                         Start Date:
//                       </label>
//                       <div onClick={handleEditClick}>
//                         <Datepicker
//                           name={`startdate_${index}`}
//                           day={moment(record.edu_start_date).format("DD")}
//                           month={moment(record.edu_start_date).format("MM")}
//                           year={moment(record.edu_start_date).format("YYYY")}
//                           selected={moment(record.edu_start_date).toDate()}
//                           onChange={(date) => handleStartDate(date, index)}
//                         />
//                       </div>
//                       {errors[`edu_start_date_${index}`] && (
//                         <div className="text-red-500 text-sm">
//                           {errors[`edu_start_date_${index}`]}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                       <label
//                         htmlFor={`enddate_${index}`}
//                         className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                       >
//                         End Date:
//                       </label>
//                       <div onClick={handleEditClick}>
//                         <Datepicker
//                           name={`enddate_${index}`}
//                           day={moment(record.edu_end_date).format("DD")}
//                           month={moment(record.edu_end_date).format("MM")}
//                           year={moment(record.edu_end_date).format("YYYY")}
//                           selected={moment(record.edu_end_date).toDate()}
//                           onChange={(date) => handleEndDate(date, index)}
//                         />
//                       </div>
//                       {errors[`edu_end_date_${index}`] && (
//                         <div className="text-red-500 text-sm">
//                           {errors[`edu_end_date_${index}`]}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
//                     <div className="flex flex-col mt-2 md:mt-4">
//                       <h2 className="text-input tracking-wide text-base mt-3 mb-3 lg:mb-0 lg:text-base">
//                         Attach Certification:
//                       </h2>
//                       <div>
//                         {record.certificate?.name ? (
//                           <div className="flex gap-x-3 items-center">
//                             <Tooltip title="View Doc">
//                               <button
//                                 className="text-blue-600 underline"
//                                 onClick={() =>
//                                   downloadAttachment(record.certificate?.file, record.certificate?.name)
//                                 }
//                               >
//                                 <LuExternalLink />
//                               </button>
//                             </Tooltip>
//                             <Tooltip title="Download Doc">
//                               <button
//                                 className="text-blue-600 underline"
//                                 onClick={() =>
//                                   downloadFiles(record.certificate?.file, record.certificate?.name)
//                                 }
//                               >
//                                 <BsDownload />
//                               </button>
//                             </Tooltip>
//                             <div onClick={handleEditClick}>
//                               <WiCloudRefresh
//                                 onClick={() => {
//                                   if (isEdit) {
//                                     setAcademicInfo((prev) =>
//                                       prev.map((item, idx) =>
//                                         idx === index
//                                           ? { ...item, certificate: {} }
//                                           : item
//                                       )
//                                     );
//                                   }
//                                 }}
//                                 className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`}
//                               />
//                             </div>
//                           </div>
//                         ) : (
//                           <label
//                             htmlFor={`file-upload_${index}`}
//                             className="cursor-pointer opacity-70 rounded-lg py-1 text-input"
//                           >
//                             <input
//                               disabled={!isEdit}
//                               id={`file-upload_${index}`}
//                               type="file"
//                               name={`file_${index}`}
//                               accept=".pdf"
//                               className="leading-5"
//                               onChange={(e) => handleFileChange(e, index)}
//                             />
//                           </label>
//                         )}
//                       </div>
//                       {errors[`certificate_${index}`] && (
//                         <div className="text-red-500 text-sm">
//                           {errors[`certificate_${index}`]}
//                         </div>
//                       )}
//                       <small className="text-gray-400">
//                         Upload a pdf no larger than 5 MB.
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button onClick={addAcademicRecord} className="mt-5 bg-blue-500 text-white py-2 px-4 rounded">
//                 Add New Academic Record
//               </button>
//               <Button
//                 onClick={handleSave}
//                 isLoading={isLoading}
//                 title="Save Academic Records"
//                 className="mt-5"
//               />
//             </div>
//           </div>
//         </div>

//         <h2 className="text-baseBlue mt-5 tracking-wide mb-2 lg:mb-4 lg:text-lg ">
//           Certifications:
//         </h2>

//         {certificationSections.map((certification, index) => (
//           <div key={index}>
//             <div className="flex items-center">
//               {isEdit &&
//                 <AiOutlineCloseCircle
//                   className="text-red-500 mr-1 text-lg mb-2 lg:mb-4 mt-2"
//                   onClick={() => {
//                     let copySections = [...certificationSections];
//                     copySections.splice(index, 1);
//                     if (certification.hasOwnProperty("id")) {
//                       setDeleteExp([...deleteExp, certification.id]);
//                     }
//                     setCertificationSections(copySections);
//                   }}
//                 />
//               }
//               <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
//                 Professional Certification {index + 1}:
//               </h2>
//             </div>

//             <div className="flex flex-col">
//               <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
//                 <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                   <label
//                     htmlFor="certification_name"
//                     className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                   >
//                     Certification Name:
//                   </label>
//                   <input
//                     // disabled={isEdit ? false : true}
//                     type="text"
//                     name="certification_name"
//                     placeholder="Certification Name"
//                     value={certification.certification_name}
//                     onChange={(e) => {
//                       const updatedSections = [...certificationSections];
//                       updatedSections[index].certification_name =
//                         e.target.value;
//                       setCertificationSections(updatedSections);
//                       clearCerError(`certification_name_${index}`);
//                     }}
//                     onClick={handleEditClick}
//                     className={`${isEdit ? "text-black" : "text-gray-500"
//                       } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
//                   />
//                   {cerErrors[`certification_name_${index}`] && (
//                     <div className="text-red-500 text-sm">
//                       {cerErrors[`certification_name_${index}`]}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12 md:w-[55%]">
//                 <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                   <label
//                     htmlFor="exp_start_date"
//                     className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                   >
//                     Completion Date:
//                   </label>
//                   <div onClick={handleEditClick}>
//                     <Datepicker
//                       // disabled={isEdit ? false : true}
//                       day={
//                         certification?.completion_date
//                           ? certification?.completion_date.substr(0, 2)
//                           : null
//                       }
//                       month={
//                         certification?.completion_date
//                           ? certification?.completion_date.substr(3, 2)
//                           : null
//                       }
//                       year={
//                         certification?.completion_date
//                           ? certification?.completion_date.substr(6, 4)
//                           : null
//                       }
//                       name="completion_date"
//                       selected={moment(
//                         certification.completion_date,
//                         "DD-MM-YYYY"
//                       ).toDate()}
//                       onChange={(date) => {
//                         const formattedDate = moment(date)
//                           .format("DD-MM-YYYY")
//                           .toLowerCase();
//                         const updatedSections = [...certificationSections];
//                         updatedSections[index].completion_date = formattedDate;
//                         setCertificationSections(updatedSections);
//                         clearCerError(`completion_date_${index}`);
//                       }}
//                     />
//                   </div>
//                   {cerErrors[`completion_date_${index}`] && (
//                     <div className="text-red-500 text-sm">
//                       {cerErrors[`completion_date_${index}`]}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                   <label
//                     htmlFor="exp_end_date"
//                     className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                   >
//                     Expiry Date:
//                   </label>
//                   <div onClick={handleEditClick}>
//                     <Datepicker
//                       // disabled={isEdit ? false : true}
//                       name="expiry_date"
//                       day={
//                         certification?.expiry_date
//                           ? certification?.expiry_date.substr(0, 2)
//                           : null
//                       }
//                       month={
//                         certification?.expiry_date
//                           ? certification?.expiry_date.substr(3, 2)
//                           : null
//                       }
//                       year={
//                         certification?.expiry_date
//                           ? certification?.expiry_date.substr(6, 4)
//                           : null
//                       }
//                       selected={moment(
//                         certification.expiry_date,
//                         "DD-MM-YYYY"
//                       ).toDate()}
//                       onChange={(date) => {
//                         const formattedDate = moment(date)
//                           .format("DD-MM-YYYY")
//                           .toLowerCase();
//                         const updatedSections = [...certificationSections];
//                         updatedSections[index].expiry_date = formattedDate;
//                         setCertificationSections(updatedSections);
//                         clearCerError(`expiry_date_${index}`);
//                       }}
//                     />
//                   </div>
//                   {cerErrors[`expiry_date_${index}`] && (
//                     <div className="text-red-500 text-sm">
//                       {cerErrors[`expiry_date_${index}`]}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
//                 <label
//                   htmlFor="certification_institute"
//                   className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
//                 >
//                   Certification Body:
//                 </label>
//                 <input
//                   // disabled={isEdit ? false : true}
//                   type="text"
//                   name="certification_institute"
//                   placeholder="Certification Body"
//                   value={certification.certification_institute}
//                   onChange={(e) => {
//                     const updatedSections = [...certificationSections];
//                     updatedSections[index].certification_institute =
//                       e.target.value;
//                     setCertificationSections(updatedSections);
//                     clearCerError(`certification_institute_${index}`);
//                   }}
//                   onClick={handleEditClick}
//                   className={`${isEdit ? "text-black" : "text-gray-500"
//                     } pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50`}
//                 />
//                 {cerErrors[`certification_institute_${index}`] && (
//                   <div className="text-red-500 text-sm">
//                     {cerErrors[`certification_institute_${index}`]}
//                   </div>
//                 )}
//               </div>
//               <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
//                 <div className="flex flex-col mt-2 md:mt-4">
//                   <h2 className="text-input tracking-wide text-base mt-3 mb-1 lg:text-base">
//                     Attach Certification:
//                   </h2>
//                   <div>
//                     {certification.certification_body ? (
//                       <div className="flex gap-x-3 items-center">
//                         {/* <button
//                           className="text-blue-600 underline"
//                           onClick={() =>
//                             downloadAttachment(
//                               certification?.certification_body?.file,
//                               certification?.certification_body?.name
//                             )
//                           }
//                         >
//                           {certification?.certification_body?.name ? certification?.certification_body?.name : "Not available"}
//                         </button> */}
//                         <Tooltip title="View Doc" >
//                           <button
//                             className="text-blue-600 underline"
//                             onClick={() =>
//                               downloadAttachment(
//                                 certification?.certification_body?.file,
//                                 certification?.certification_body?.name
//                               )
//                             }
//                           >
//                             {certification?.certification_body?.name ? <LuExternalLink /> : "Not available"}
//                           </button>
//                         </Tooltip>
//                         <Tooltip title="Download Doc" >
//                           <button
//                             className="text-blue-600 underline"
//                             onClick={() =>
//                               downloadFiles(
//                                 certification?.certification_body?.file,
//                                 certification?.certification_body?.name
//                               )
//                             }
//                           >
//                             {certification?.certification_body?.name ? <BsDownload /> : "Not available"}
//                           </button>
//                         </Tooltip>

//                         <div onClick={handleEditClick}>
//                           <WiCloudRefresh
//                             onClick={() => {
//                               if (isEdit) {
//                                 const updatedSections = [...certificationSections];
//                                 updatedSections[index].certification_body = "";
//                                 setCertificationSections(updatedSections);
//                               }
//                             }}
//                             className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`}
//                           />
//                         </div>
//                       </div>
//                     ) : (
//                       <label
//                         htmlFor="file-upload"
//                         className="cursor-pointer opacity-70 rounded-lg text-input"
//                       >
//                         <input
//                           disabled={isEdit ? false : true}
//                           id="file-upload"
//                           type="file"
//                           name="certification_body"
//                           accept=".pdf"
//                           max-size="104857600"
//                           onChange={(e) => {
//                             let file = e.target.files[0];
//                             const updatedSections = [...certificationSections];
//                             const fileData = { name: file.name };
//                             if (file) {
//                               const reader = new FileReader();
//                               reader.onload = (e) => {
//                                 let i = index;
//                                 updatedSections[i].certification_body = {
//                                   name: fileData.name,
//                                   file: e.target.result,
//                                 };
//                                 setCertificationSections(updatedSections);
//                               };
//                               reader.readAsDataURL(file);
//                               clearCerError(`certification_body_${index}`);
//                             }
//                           }}
//                         />
//                       </label>
//                     )}
//                   </div>
//                   {cerErrors[`certification_body_${index}`] && (
//                     <div className="text-red-500 block text-sm">
//                       {cerErrors[`certification_body_${index}`]}
//                     </div>
//                   )}
//                   <small className="text-gray-400 inline-block my-4">
//                     Upload a pdf and no larger than 5 MB.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {(certificationSections.length === 0 && !isEdit) && <div className="mb-1 text-gray-500 block">0 Certifications</div>}
//         {/* {isEdit && */}
//         <button
//           onClick={addCertificationSection}
//           className="mt-1 mb-3 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1"
//         >
//           <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>Add
//           New Certification
//         </button>
//         {/* } */}
//         <div className="flex gap-x-5 mb-40 mt-5 md:mt-0">
//           {!isEdit && <Button onClick={prevstep} text={"Previous"} />}
//           {isEdit ? (
//             <button
//               onClick={() => {
//                 setCancelBox(!cancelBox);
//               }}
//               className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
//             >
//               Cancel
//             </button>
//           ) : (
//             // <button
//             //   onClick={() => {
//             //     setIsEdit(!isEdit);
//             //   }}
//             //   className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
//             // >
//             //   Edit
//             // </button>
//             null
//           )}
//           {isEdit ? (
//             <button
//               onClick={handleSave}
//               className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
//             >
//               {isLoading ? <div className="flex items-center justify-center gap-x-2">Saving <CustomLoader /></div> : 'Save & Next'}
//             </button>
//           ) : (
//             <Button onClick={handleNextStep} text={"Next"} />
//           )}
//         </div>
//       </div>
// {cancelBox && (
//   <div className="fixed inset-0 z-50 flex  items-center justify-center bg-gray-800 bg-opacity-50">
//     <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Discard Changes</h1>
//         <div className="text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer">
//           <RxCross2 onClick={() => setCancelBox(!cancelBox)} />
//         </div>
//       </div>
//       <p className="text-gray-700 mt-2">
//         If you have made changes, they will not be saved. Do you want to proceed?
//       </p>
//       <div className="mt-4 flex justify-end">
//         <button
//           className="px-4 py-1 mr-2 text-white bg-blue-500 rounded"
//           onClick={() => {
//             setCancelBox(!cancelBox);
//           }}
//         >
//           Keep
//         </button>
//         <button
//           className="px-4 py-1 mr-2 text-white bg-red-500 rounded"
//           onClick={() => {
//             setIsEdit(!isEdit);
//             setErrors({})
//             setCancelBox(!cancelBox);
//           }}
//         >
//           Discard
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       <ToastContainer />
//     </>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     userProfile: state.user.userProfile,
//     token: state.user.token,
//     baseUrl: state.user.baseUrl,
//   };
// };

// export default connect(mapStateToProps)(AcademicRecords);


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
import CustomLoader from "../../../components/CustomLoader";
import { RxCross2 } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
import { downloadAttachment } from "../../../utils/fileUtils";
import { downloadFiles } from "../../../utils/downUtils";
import { Tooltip } from "@mui/material";
import { LuExternalLink } from "react-icons/lu";
import { BsDownload } from "react-icons/bs";


const academicOptions = [
  { value: "Intermediate", label: "Intermediate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
];



const AcademicRecords = ({ errors, setErrors, prevstep, nextstep, userProfile, baseUrl, token }) => {


  const [academicRecords, setAcademicRecords] = useState([]);

  const [certificationSections, setCertificationSections] = useState([]);
  const [cancelBox, setCancelBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);


  const handleEditClick = () => {
    setIsEdit(true);
  };

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

  const handleSave = () => {
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

  const handleNextStep = () => {
    nextstep();
  };


  return (
    <>
      <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
        <div className="flex justify-between">
          <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
            Academic Records:
          </h2>
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
                    <div onClick={handleEditClick}>
                      <Select
                        name="education"
                        value={academicOptions.find(
                          (option) => option.value === record.education_level
                        )}
                        options={academicOptions}
                        isSearchable={false}
                        className={`focus:outline-none border-none`}
                        onChange={(selectedOption) => {
                          handleChange(index, { target: { name: 'education_level', value: selectedOption.value } });
                        }}
                      />
                    </div>
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
                      onClick={handleEditClick}
                      type="text"
                      value={record.program}
                      name="program"
                      placeholder="Program Here"
                      className={`pl-2 rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 ${isEdit ? "text-black" : "text-gray-500"}`}
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
                    onClick={handleEditClick}
                    type="text"
                    value={record.institute_name}
                    name="institute_name"
                    placeholder="Institute Name Here"
                    className={`pl-2 rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 ${isEdit ? "text-black" : "text-gray-500"}`}
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
                    <div onClick={handleEditClick}>
                      <Datepicker
                        name="edu_start_date"
                        day={record.edu_start_date ? record.edu_start_date.substr(8, 2) : null}
                        month={record.edu_start_date ? record.edu_start_date.substr(5, 2) : null}
                        year={record.edu_start_date ? record.edu_start_date.substr(0, 4) : null}
                        selected={moment(record.edu_start_date, "DD-MM-YYYY").toDate()}
                        onChange={(date) => handleDateChange(index, 'edu_start_date', date)}
                      />
                    </div>
                    {eduErrors[`edu_start_date_${index}`] && <div className="text-sm text-red-500">{eduErrors[`edu_start_date_${index}`]}</div>}

                  </div>
                  <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                    <label
                      htmlFor="edu_end_date"
                      className="font-sfpro tracking-wide font-medium text-input text-base mb-1"
                    >
                      End Date:
                    </label>
                    <div onClick={handleEditClick}>
                      <Datepicker
                        name="edu_end_date"
                        day={record.edu_end_date ? record.edu_end_date.substr(8, 2) : null}
                        month={record.edu_end_date ? record.edu_end_date.substr(5, 2) : null}
                        year={record.edu_end_date ? record.edu_end_date.substr(0, 4) : null}
                        selected={moment(record.edu_end_date, "DD-MM-YYYY").toDate()}
                        onChange={(date) => handleDateChange(index, 'edu_end_date', date)}
                      />
                    </div>
                    {eduErrors[`edu_end_date_${index}`] && <div className="text-sm text-red-500">{eduErrors[`edu_end_date_${index}`]}</div>}

                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className="flex flex-col mt-2 md:mt-4">
                    <h2 className="text-input tracking-wide text-base mt-3 mb-3 lg:mb-0 lg:text-base">
                      Attach Certification:
                    </h2>
                    {record.education_body ? (
                      <div className="flex gap-x-2 items-center">
                        <div
                          className={`flex items-center gap-x-3 text-base ${isEdit ? "opacity-50" : "text-gray-500"
                            }`}
                        >

                          <Tooltip
                            title="View Doc"
                          >

                            <button
                              className="text-blue-600 underline"
                              onClick={() =>
                                downloadAttachment(
                                  record.education_body.file,
                                  record.education_body.name
                                )
                              }
                            >
                              {record.education_body.name ? <LuExternalLink /> : "Not available"}
                            </button>
                          </Tooltip>
                          <Tooltip
                            title="Download Doc"
                          >

                            <button
                              className="text-blue-600 underline"
                              onClick={() =>
                                downloadFiles(
                                  record.education_body.file,
                                  record.education_body.name
                                )
                              }
                            >
                              {record.education_body.name ? <BsDownload /> : "Not available"}
                            </button>
                          </Tooltip>
                        </div>
                        <div onClick={handleEditClick}>
                          <WiCloudRefresh
                            onClick={() => {
                              if (isEdit) {
                                const newRecords = [...academicRecords];
                                newRecords[index].education_body = "";
                                setAcademicRecords(newRecords);
                              }
                            }}
                            className="text-blue-600 text-xl"
                          />
                        </div>
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
                    onClick={handleEditClick}
                    value={experience.certification_name}
                    onChange={(e) => {
                      const updatedSections = [...certificationSections];
                      updatedSections[index].certification_name = e.target.value;
                      setCertificationSections(updatedSections);
                      clearCerError(`certification_name_${index}`);
                    }}
                    className={`pl-2 rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 ${isEdit ? "text-black" : "text-gray-500"}`}
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
                  <div onClick={handleEditClick}>
                    <Datepicker
                      day={experience?.completion_date ? experience?.completion_date.substr(8, 2) : null}
                      month={experience?.completion_date ? experience?.completion_date.substr(5, 2) : null}
                      year={experience?.completion_date ? experience?.completion_date.substr(0, 4) : null}
                      name="completion_date"
                      selected={moment(
                        experience.completion_date,
                        "YYYY-MM-DD"
                      ).toDate()}
                      onChange={(date) => {
                        const formattedDate = moment(date)
                          .format("YYYY-MM-DD")
                          .toLowerCase();
                        const updatedSections = [...certificationSections];
                        updatedSections[index].completion_date = formattedDate;
                        setCertificationSections(updatedSections);
                        clearCerError(`completion_date_${index}`);
                      }}
                    />
                  </div>
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
                  <div onClick={handleEditClick}>
                    <Datepicker
                      name="expiry_date"
                      day={experience?.expiry_date ? experience?.expiry_date.substr(8, 2) : null}
                      month={experience?.expiry_date ? experience?.expiry_date.substr(5, 2) : null}
                      year={experience?.expiry_date ? experience?.expiry_date.substr(0, 4) : null}
                      selected={moment(
                        experience.expiry_date,
                        "YYYY-MM-DD"
                      ).toDate()}
                      onChange={(date) => {
                        const formattedDate = moment(date)
                          .format("YYYY-MM-DD")
                          .toLowerCase();
                        const updatedSections = [...certificationSections];
                        updatedSections[index].expiry_date = formattedDate;
                        setCertificationSections(updatedSections);
                        clearCerError(`expiry_date_${index}`);
                      }}
                    />
                  </div>
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
                  onClick={handleEditClick}
                  value={experience.certification_institute}
                  onChange={(e) => {
                    const updatedSections = [...certificationSections];
                    updatedSections[index].certification_institute = e.target.value;
                    setCertificationSections(updatedSections);
                    clearCerError(`certification_institute_${index}`);
                  }}
                  className={`pl-2 rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 ${isEdit ? "text-black" : "text-gray-500"}`}
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
                    <div className="flex gap-x-2 items-center">
                      <div
                        className={`flex items-center gap-x-3 text-base ${isEdit ? "opacity-50" : "text-gray-500"
                          }`}
                      >

                        <Tooltip
                          title="View Doc"
                        >

                          <button
                            className="text-blue-600 underline"
                            onClick={() =>
                              downloadAttachment(
                                experience.certification_body.file,
                                experience.certification_body.name
                              )
                            }
                          >
                            {experience.certification_body.name ? <LuExternalLink /> : "Not available"}
                          </button>
                        </Tooltip>
                        <Tooltip
                          title="Download Doc"
                        >

                          <button
                            className="text-blue-600 underline"
                            onClick={() =>
                              downloadFiles(
                                experience.certification_body.file,
                                experience.certification_body.name
                              )
                            }
                          >
                            {experience.certification_body.name ? <BsDownload /> : "Not available"}
                          </button>
                        </Tooltip>
                      </div>
                      <div onClick={handleEditClick}>
                        <WiCloudRefresh
                          onClick={() => {
                            if (isEdit) {
                              const updatedSections = [...certificationSections];
                              updatedSections[index].certification_body = "";
                              setCertificationSections(updatedSections);
                            }
                          }}
                          className="text-blue-600 text-xl"
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

        <div className="flex gap-x-5 mb-40 mt-5 md:mt-0">
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
                  setErrors({})
                  setCancelBox(!cancelBox);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
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