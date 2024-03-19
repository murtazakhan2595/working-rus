import React, { useEffect, useState } from 'react';
import Datepicker from '../Dashboard/Datepicker';
import Button from './Button';
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { visaOptions } from '../../../data/Data';
import moment from 'moment';
import axios from "axios";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import CustomLoader from '../../../common/CustomLoader';
import { BiEdit } from 'react-icons/bi';
import { WiCloudRefresh } from 'react-icons/wi';
import Joi from "joi";
import { RxCross2 } from 'react-icons/rx';


const UpdateVisaDetails = ({ prevstep,
  nextstep,
  token,
  errors,
  setErrors,
  userProfile,
  baseUrl, }) => {

  let [isEdit, setIsEdit] = useState(false);
  let [defaultData, setDefaultData] = useState({});
  const [documents, setDocuments] = useState({});
  const [visaDetailsFiles, setVisaDetailsFiles] = useState({})
  const [cancelBox, setCancelBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showVisa, setShowVisa] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const showId = true;

  const id = userProfile.id;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      setDefaultData(employeeResponse.data);

      // setDefaultData(employeeData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDocs = async () => {
    try {
      const responseArray = await Promise.all([
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"passport_copy"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"enter_permit"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"visa_page"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"medical"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_application"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_front"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_back"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"insurance_card"}`, { headers })
      ]);

      // Construct an object mapping document names to their responses
      const newDocuments = {
        passport_copy: responseArray[0].data[0],
        enter_permit: responseArray[1].data[0],
        visa_page: responseArray[2].data[0],
        medical: responseArray[3].data[0],
        id_application: responseArray[4].data[0],
        id_front: responseArray[5].data[0],
        id_back: responseArray[6].data[0],
        insurance_card: responseArray[7].data[0]
      };

      // Update state with the newDocuments object
      setDocuments(newDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };



  useEffect(() => {
    fetchData()
    fetchDocs()
  }, [])


  const handleEdit = (name, value) => {
    let modifiedValue = value;
    if (name === "visa_type") {
      modifiedValue = value.value;
    } else if (name === "place_of_issuance" || name === "Passport_Issuance_Country" || name === "country_of_visa_issuance") {
      modifiedValue = value.label
    }
    // Update defaultData state
    setDefaultData({ ...defaultData, [name]: modifiedValue });
    setIsEdit(true);
  };

  const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
  }));

  const handleDateChange = (date, name) => {
    const formattedDate = moment(date).format("YYYY-MM-DD"); // Format the date as "YYYY-MM-DD"
    handleEdit(name, formattedDate);
  };

  const handleFileChange = (name, files) => {
    Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve({ name: file.name, data: event.target.result });
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      })
    )
      .then((fileContents) => {
        const updatedFiles = { ...visaDetailsFiles };
        updatedFiles[name] = fileContents;
        // Set the updated files state
        setVisaDetailsFiles(updatedFiles);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  const updateDataOnServer = async () => {
    setIsLoading(true);
    try {
      // Make a copy of the updated data
      const updatedDataCopy = { ...defaultData };

      // Update regular fields
      const response = await axios.patch(`${baseUrl}/emp/${id}`, updatedDataCopy, { headers });

      // Update file fields
      // const updateAttachments = async (docName, fileData) => {
      //   if (documents[docName]?.id && fileData) {
      //     await axios.patch(`${baseUrl}/attachment/${documents[docName]?.id}`, {
      //       employee_id: id,
      //       name: docName,
      //       description: `${fileData.name} file`,
      //       document: {
      //         name: fileData.name,
      //         data: fileData.data,
      //       },
      //     }, { headers });
      //   }
      // };

      const updateAttachments = async (docName, fileData) => {
        setIsLoading(true);
        try {
          // If there is an existing document ID for the specified document name
          if (documents[docName]?.id) {
            // Update the existing attachment
            await axios.patch(`${baseUrl}/attachment/${documents[docName]?.id}`, {
              employee_id: id,
              name: docName,
              description: `${fileData.name} file`,
              document: {
                name: fileData.name,
                data: fileData.data,
              },
            }, { headers });
          } else {
            // Otherwise, post a new attachment
            await axios.post(`${baseUrl}/attachment/`, {
              employee_id: id,
              name: docName,
              description: `${fileData.name} file`,
              document: {
                name: fileData.name,
                data: fileData.data,
              },
            }, { headers });
          }
        } catch (error) {
          console.error(`Error updating/creating ${docName} attachment:`, error);
          // Handle errors here
        }

        setIsLoading(false);
      };

      await Promise.all([
        updateAttachments('medical', visaDetailsFiles.medical ? visaDetailsFiles.medical[0] : null),
        updateAttachments('id_application', visaDetailsFiles.id_application ? visaDetailsFiles.id_application[0] : null),
        updateAttachments('visa_page', visaDetailsFiles.visa_page ? visaDetailsFiles.visa_page[0] : null),
        updateAttachments('enter_permit', visaDetailsFiles.enter_permit ? visaDetailsFiles.enter_permit[0] : null),
        updateAttachments('id_back', visaDetailsFiles.id_back ? visaDetailsFiles.id_back[0] : null),
        updateAttachments('id_front', visaDetailsFiles.id_front ? visaDetailsFiles.id_front[0] : null),
        updateAttachments('passport_copy', visaDetailsFiles.passport_copy ? visaDetailsFiles.passport_copy[0] : null),
        updateAttachments('insurance_card', visaDetailsFiles.insurance_card ? visaDetailsFiles.insurance_card[0] : null)
      ]);

      // Notify user
      toast.success("Visa details updated successfully!", {
        position: "top-right",
        autoClose: 1000,
      });

      // Move to the next step
      nextstep();
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  // const handleSave = () => {
  //   updateDataOnServer();
  //   // setIsEdit(false);
  // };


  // enable edit on click

  const handleFieldClick = () => {
    setIsEdit(true);
  }


  // const handleNextStep = () => {
  //   nextstep();
  //   if (showPassport) {
  //     if (defaultData.passport_number && defaultData.Passport_Issuance_Country && defaultData.Passport_Issuance_Date && defaultData.Passport_Expiry_Date && visaDetailsFiles.passport_copy) {
  //       nextstep();
  //     } else {
  //       toast.error("Please fill in all required fields!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //       });
  //     }
  //   } else if (showVisa)
  //     if (defaultData.entry_permit_number && defaultData.country_of_visa_issuance && defaultData.uid_number && defaultData.visa_type && defaultData.visa_issuance_date && defaultData.visa_expiry_date && defaultData.visa_duration && defaultData.visa_country_entry_date && defaultData.visa_country_exit_date) {
  //       nextstep();
  //     } else {
  //       toast.error("Please fill in all required fields!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //       });
  //     }

  //   else if (showInsurance) {
  //     if (defaultData.dha_id && defaultData.card_number && defaultData.insurance_policy && defaultData.insurance_company && defaultData.insurance_active_date && defaultData.insurance_expiry_date) {
  //       nextstep();
  //     } else {
  //       toast.error("Please fill in all required fields!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //       });
  //     }
  //   }

  //   else if (showId) {
  //     if (defaultData.living_country_id_no && defaultData.place_of_issuance && defaultData.id_issuance_date && defaultData.id_expiry_date && documents.id_front && documents.id_back) {
  //       nextstep();
  //     } else {
  //       toast.error("Please fill all ID Details fields!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //       });
  //     }
  //   }

  //   else {
  //     nextstep();
  //   }

  // };

  const handleSave = () => {
    if (showPassport) {
      if (
        defaultData.passport_number &&
        defaultData.Passport_Issuance_Country &&
        defaultData.Passport_Issuance_Date &&
        defaultData.Passport_Expiry_Date &&
        documents.passport_copy
      ) {
        updateDataOnServer();
      } else {
        toast.error("Please fill all required passport fields!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } else if (showVisa) {
      if (
        defaultData.entry_permit_number &&
        defaultData.country_of_visa_issuance &&
        defaultData.uid_number &&
        defaultData.visa_type &&
        defaultData.visa_issuance_date &&
        defaultData.visa_expiry_date &&
        defaultData.visa_duration &&
        defaultData.visa_country_entry_date &&
        defaultData.visa_country_exit_date
      ) {
        updateDataOnServer();
      } else {
        toast.error("Please fill all required visa fields!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } else if (showInsurance) {
      if (
        defaultData.dha_id &&
        defaultData.card_number &&
        defaultData.insurance_policy &&
        defaultData.insurance_company &&
        defaultData.insurance_active_date &&
        defaultData.insurance_expiry_date &&
        documents.insurance_card
      ) {
        updateDataOnServer();
      } else {
        toast.error("Please fill all required insurance fields!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } else {
      updateDataOnServer();
    }
  };

  return (
    <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <div className="flex justify-between">
        <h2 className="tracking-wide mb-4 flex items-center gap-x-3">
          <p className='text-baseBlue lg:text-lg'>Passport Details</p>
          <label className='text-sm text-gray-500'>Applicable:</label>
          <div className='flex items-center gap-x-2'>
            <p className='text-sm'>Yes</p>
            <input type="checkbox" checked={showPassport} onChange={() => setShowPassport(!showPassport)} />
          </div>
          <div className='flex items-center gap-x-2'>
            <p className='text-sm'>No</p>
            <input type="checkbox" checked={!showPassport} onChange={() => setShowPassport(!showPassport)} />
          </div>
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
      {showPassport && <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Passport Number {showPassport && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name="passport_number"
            readOnly={!isEdit}
            value={defaultData.passport_number}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            placeholder="Passport Number" className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onClick={handleFieldClick}
          />
        </div>

        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[21%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Passport Issuance Country {showPassport && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="Passport_Issuance_Country"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.label === defaultData.Passport_Issuance_Country
              )}
              onChange={(selectedOption) => handleEdit("Passport_Issuance_Country", selectedOption)}
              onClick={handleFieldClick}
              isDisabled={!isEdit}
            />
          </div>
        </div>


        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[15%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Issuance Date {showPassport && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick} >
            <Datepicker
              day={
                defaultData.Passport_Issuance_Date
                  ? defaultData.Passport_Issuance_Date.substr(8, 2)
                  : null
              }
              month={
                defaultData.Passport_Issuance_Date
                  ? defaultData.Passport_Issuance_Date.substr(5, 2)
                  : null
              }
              year={
                defaultData.Passport_Issuance_Date
                  ? defaultData.Passport_Issuance_Date.substr(0, 4)
                  : null
              }
              name="Passport_Issuance_Date"
              className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.Passport_Issuance_Date
                  ? moment(defaultData.Passport_Issuance_Date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "Passport_Issuance_Date")}

            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[14.2%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Expiry Date {showPassport && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick} >

            <Datepicker
              day={
                defaultData.Passport_Expiry_Date
                  ? defaultData.Passport_Expiry_Date.substr(8, 2)
                  : null
              }
              month={
                defaultData.Passport_Expiry_Date
                  ? defaultData.Passport_Expiry_Date.substr(5, 2)
                  : null
              }
              year={
                defaultData.Passport_Expiry_Date
                  ? defaultData.Passport_Expiry_Date.substr(0, 4)
                  : null
              }
              name="Passport_Expiry_Date"
              className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.Passport_Expiry_Date
                  ? moment(defaultData.Passport_Expiry_Date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "Passport_Expiry_Date")}

            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Passport Copy {showPassport && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.passport_copy ? documents.passport_copy.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}

        </div>
      </div>}

      {/* Visa */}
      <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
        <p className='text-baseBlue tracking-wide lg:text-lg'>Visa Details</p>
        <label className='text-sm text-gray-500'>Applicable:</label>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>Yes</p>
          <input type="checkbox" checked={showVisa} onChange={() => setShowVisa(!showVisa)} />
        </div>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>No</p>
          <input type="checkbox" checked={!showVisa} onChange={() => setShowVisa(!showVisa)} />
        </div>

      </h2>
      {showVisa && <div className='flex w-[100%] flex-wrap gap-3'>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Entry Permit Number{showVisa && <span className="text-red-500 text-2xl">*</span>}

          </label>

          <input type="text" name="entry_permit_number"
            value={defaultData.entry_permit_number}
            placeholder="Entry Permit Number"
            className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />

        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Issuance Country {showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="country_of_visa_issuance"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.label === defaultData.country_of_visa_issuance
              )}
              onChange={(selectedOption) => handleEdit("country_of_visa_issuance", selectedOption)}
              isDisabled={!isEdit}
            />

          </div>

        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            UID Number{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name="uid_number"
            value={defaultData.uid_number}
            placeholder="UID Number"
            className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
        </div>

        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Type{showVisa && <span className="text-red-500 text-2xl">*</span>}

          </label>
          <div onClick={handleFieldClick}>
            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="visa_type"
              options={visaOptions}
              value={visaOptions.find(
                (option) => option.value === defaultData.visa_type
              )}
              onChange={(selectedOption) => handleEdit("visa_type", selectedOption)}
              isDisabled={!isEdit}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Issuance Date{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.visa_issuance_date
                  ? defaultData.visa_issuance_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.visa_issuance_date
                  ? defaultData.visa_issuance_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.visa_issuance_date
                  ? defaultData.visa_issuance_date.substr(0, 4)
                  : null
              }
              name="visa_issuance_date"
              className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.visa_issuance_date
                  ? moment(defaultData.visa_issuance_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "visa_issuance_date")}

            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Expiry Date{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.visa_expiry_date
                  ? defaultData.visa_expiry_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.visa_expiry_date
                  ? defaultData.visa_expiry_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.visa_expiry_date
                  ? defaultData.visa_expiry_date.substr(0, 4)
                  : null
              }
              name="visa_expiry_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.visa_expiry_date
                  ? moment(defaultData.visa_expiry_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "visa_expiry_date")}

            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Duration{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name="visa_duration"
            value={defaultData.visa_duration}
            placeholder="Visa Duration" className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            disabled={!isEdit}
            onClick={handleFieldClick}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Country Entry Date{showVisa && <span className="text-red-500 text-2xl">*</span>}

          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.visa_country_entry_date
                  ? defaultData.visa_country_entry_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.visa_country_entry_date
                  ? defaultData.visa_country_entry_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.visa_country_entry_date
                  ? defaultData.visa_country_entry_date.substr(0, 4)
                  : null
              }
              name="visa_country_entry_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.visa_country_entry_date
                  ? moment(defaultData.visa_country_entry_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "visa_country_entry_date")}

            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Country Exit Date{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.visa_country_exit_date
                  ? defaultData.visa_country_exit_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.visa_country_exit_date
                  ? defaultData.visa_country_exit_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.visa_country_exit_date
                  ? defaultData.visa_country_exit_date.substr(0, 4)
                  : null
              }
              name="visa_country_exit_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.visa_country_exit_date
                  ? moment(defaultData.visa_country_exit_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "visa_country_exit_date")}

            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Entry Permit{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.enter_permit ? documents.enter_permit.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>


        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Page {showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.visa_page ? documents.visa_page.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>



        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Medical Result{showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('medical', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.medical ? documents.medical.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Application {showVisa && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.id_application ? documents.id_application.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>
      </div>}

      {/* ID Details */}

      <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-2 lg:mt-7 lg:text-lg mt-2">
        ID Details
      </h2>
      <div className='flex w-[100%] flex-wrap items-center gap-3'>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Living Country ID No
          </label>
          <input type="text" name="living_country_id_no"
            value={defaultData.living_country_id_no}
            placeholder="Living Country ID Number"
            className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
          {errors.living_country_id_no && (
            <span className="text-red-500 text-sm ">
              {errors.living_country_id_no}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Place of Issuance
          </label>
          <div onClick={handleFieldClick}>

            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="place_of_issuance"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.label === defaultData.place_of_issuance
              )}
              onChange={(selectedOption) => handleEdit("place_of_issuance", selectedOption)}
              isDisabled={!isEdit}
            />
          </div>
          {errors.place_of_issuance && (
            <span className="text-red-500 text-sm ">
              {errors.place_of_issuance}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID issuance Date
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.id_issuance_date
                  ? defaultData.id_issuance_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.id_issuance_date
                  ? defaultData.id_issuance_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.id_issuance_date
                  ? defaultData.id_issuance_date.substr(0, 4)
                  : null
              }
              name="id_issuance_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.id_issuance_date
                  ? moment(defaultData.id_issuance_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "id_issuance_date")}
            />
          </div>

        </div>

        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Expiry Date
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.id_expiry_date
                  ? defaultData.id_expiry_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.id_expiry_date
                  ? defaultData.id_expiry_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.id_expiry_date
                  ? defaultData.id_expiry_date.substr(0, 4)
                  : null
              }
              name="id_expiry_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.id_expiry_date
                  ? moment(defaultData.id_expiry_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "id_expiry_date")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-mediumtext-input text-base mb-1"
          >
            ID Front
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('id_front', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.id_front ? documents.id_front.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}

        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Back
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('id_back', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.id_back ? documents.id_back.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-2 lg:mb-2 lg:mt-7 mt-2 flex items-center gap-x-3">
        <p className='text-baseBlue tracking-wide lg:text-lg'>Insurance Details</p>
        <label className='text-sm text-gray-500'>Applicable:</label>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>Yes</p>
          <input type="checkbox" checked={showInsurance} onChange={() => setShowInsurance(!showInsurance)} />
        </div>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>No</p>
          <input type="checkbox" checked={!showInsurance} onChange={() => setShowInsurance(!showInsurance)} />
        </div>
      </h2>


      {showInsurance && <div className='flex w-[100%] flex-wrap items-center gap-3'>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            DHA ID{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name="dha_id"
            value={defaultData.dha_id}
            placeholder="DHA ID"
            className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Card Number{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name="card_number"
            value={defaultData.card_number}
            placeholder="Card Number" className={`pl-2 bg-white rounded h-8 text-sm
           placeholder-[#555657] placeholder-opacity-50 w-[100%] 
           ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Insurance Policy{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name='insurance_policy'
            value={defaultData.insurance_policy}
            placeholder="Insurance Policy" className={`pl-2 bg-white rounded h-8 text-sm
           placeholder-[#555657] placeholder-opacity-50 w-[100%] 
           ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Insurance Company{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <input type="text" name='insurance_company'
            value={defaultData.insurance_company}
            placeholder="Insurance Company"
            className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            onChange={(e) => handleEdit(e.target.name, e.target.value)}
            onClick={handleFieldClick}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Insurance Active Date{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.insurance_active_date
                  ? defaultData.insurance_active_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.insurance_active_date
                  ? defaultData.insurance_active_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.insurance_active_date
                  ? defaultData.insurance_active_date.substr(0, 4)
                  : null
              }
              name="insurance_active_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.insurance_active_date
                  ? moment(defaultData.insurance_active_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "insurance_active_date")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Insurance Expiry Date{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          <div onClick={handleFieldClick}>
            <Datepicker
              day={
                defaultData.insurance_expiry_date
                  ? defaultData.insurance_expiry_date.substr(8, 2)
                  : null
              }
              month={
                defaultData.insurance_expiry_date
                  ? defaultData.insurance_expiry_date.substr(5, 2)
                  : null
              }
              year={
                defaultData.insurance_expiry_date
                  ? defaultData.insurance_expiry_date.substr(0, 4)
                  : null
              }
              name="insurance_expiry_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                defaultData.insurance_expiry_date
                  ? moment(defaultData.insurance_expiry_date, "YYYY-MM-DD").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "insurance_expiry_date")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
          >
            Insurance Card{showInsurance && <span className="text-red-500 text-2xl">*</span>}
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.insurance_card ? documents.insurance_card.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>
      </div>}

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
          null
        )}
        {isEdit ? (
          <button
            onClick={handleSave}
            className="bg-baseBlue rounded-lg text-white w-28 py-[3px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-x-2">
                Saving <CustomLoader />
              </div>
            ) : (
              "Save & Next"
            )}
          </button>
        ) : (
          <Button onClick={handleSave} text={"Next"} />
        )}
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
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(UpdateVisaDetails);