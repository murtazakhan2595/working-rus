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
import { RxCross2 } from 'react-icons/rx';
import { downloadAttachment } from '../../../utils/fileUtils';
import { LuExternalLink } from "react-icons/lu";
import Tooltip from '@mui/material/Tooltip';
import { downloadFile, downloadFiles } from '../../../utils/downUtils';
import { BsDownload } from "react-icons/bs";
import { getEmployeeVisaDetailData, saveEmployeeVisaDetailData, getEmployeeVisaDetailsFiles } from '../../hooks/employee';
import { EmployeeVisaDetails } from '../../utils/Types/Employee'

const UpdateVisaDetails = ({ prevstep,
  nextstep,
  token,
  userProfile,
  baseUrl,
}) => {

  const [visaDetails, setVisaDetails] = useState(EmployeeVisaDetails);
  const [visaDetailsFiles, setVisaDetailsFiles] = useState({});
  let [isEdit, setIsEdit] = useState(false);
  const [cancelBox, setCancelBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = userProfile.id;

  useEffect(() => {
    getEmployeeVisaDetailData(baseUrl, id, token).then(response => {
      setVisaDetails(response);
    }).catch(error => {
      console.log(error);
    });
  }, [baseUrl, token]); // Empty dependency array ensures this effect runs only once after the initial render

  useEffect(() => {
    getEmployeeVisaDetailsFiles(baseUrl, id, token).then(response => {
      setVisaDetailsFiles(response);
    }).catch(error => {
      console.log(error);
    });
  }, [baseUrl, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const handleEdit = (name, value) => {
    let modifiedValue = value;
    if (name === "visa_type") {
      modifiedValue = value.value;
    } else if (name === "place_of_issuance" || name === "Passport_Issuance_Country" || name === "country_of_visa_issuance") {
      modifiedValue = value.label
    }
    // Update visaDetails state
    setVisaDetails({ ...visaDetails, [name]: modifiedValue });
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
        debugger
        const updatedFiles = { ...visaDetailsFiles };
        updatedFiles[name] = fileContents && fileContents.length > 0 ? fileContents[0]: { };
        setVisaDetailsFiles(updatedFiles);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  // enable edit on click

  const handleFieldClick = () => {
    setIsEdit(true);
  }



  const handleSave = () => {
    setIsLoading(true);
    if (visaDetails.is_passport_applicable) {
      // Check if fields are filled
      if (!visaDetails.passport_number || !visaDetails.Passport_Issuance_Country || !visaDetails.Passport_Issuance_Date || !visaDetails.Passport_Expiry_Date || !visaDetailsFiles.passport_copy) {
        toast.error("Please fill in all required fields!", {
          position: "top-right",
          autoClose: 1000,
        });
        return false;
      }
    } else if (visaDetails.is_visa_applicable) {
      if (!visaDetails.entry_permit_number || !visaDetails.country_of_visa_issuance || !visaDetails.uid_number || !visaDetails.visa_type || !visaDetails.visa_issuance_date || !visaDetails.visa_expiry_date || !visaDetails.visa_duration || !visaDetails.visa_country_entry_date || !visaDetailsFiles.enter_permit || !visaDetailsFiles.visa_page || !visaDetailsFiles.medical || !visaDetailsFiles.id_application) {
        toast.error("Please fill in all required fields!", {
          position: "top-right",
          autoClose: 1000,
        });
        return false;
      }
    }
    else if (visaDetails.is_insurance_applicable) {
      if (!visaDetails.dha_id || !visaDetails.card_number || !visaDetails.insurance_policy || !visaDetails.insurance_company || !visaDetails.insurance_active_date || !visaDetails.insurance_expiry_date || !visaDetailsFiles.insurance_card) {
        toast.error("Please fill in all required fields!", {
          position: "top-right",
          autoClose: 1000,
        });
        return false;
      }
    } else if (!visaDetails.living_country_id_no || !visaDetails.place_of_issuance || !visaDetails.id_issuance_date || !visaDetails.id_expiry_date || !visaDetailsFiles.id_front || !visaDetailsFiles.id_back) {
      toast.error("Please fill all ID Details fields!", {
        position: "top-right",
        autoClose: 1000,
      });

    } else {
      saveEmployeeVisaDetailData(baseUrl, userProfile?.id, token, visaDetails, visaDetailsFiles);
      nextstep();
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <div className="flex justify-between">
        <h2 className="tracking-wide mb-4 flex items-center gap-x-3">
          <p className='text-baseBlue lg:text-lg'>ID Details</p>
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

      <div className='flex w-[100%] flex-wrap items-center gap-3'>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Living Country ID No
          </label>
          <input type="text" name="living_country_id_no"
            value={visaDetails.living_country_id_no}
            placeholder="Living Country ID Number"
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
            Place of Issuance
          </label>
          <div onClick={handleFieldClick}>

            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="place_of_issuance"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.label === visaDetails.place_of_issuance
              )}
              onChange={(selectedOption) => handleEdit("place_of_issuance", selectedOption)}
              isDisabled={!isEdit}
            />
          </div>

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
                visaDetails.id_issuance_date
                  ? visaDetails.id_issuance_date.substr(8, 2)
                  : null
              }
              month={
                visaDetails.id_issuance_date
                  ? visaDetails.id_issuance_date.substr(5, 2)
                  : null
              }
              year={
                visaDetails.id_issuance_date
                  ? visaDetails.id_issuance_date.substr(0, 4)
                  : null
              }
              name="id_issuance_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                visaDetails.id_issuance_date
                  ? moment(visaDetails.id_issuance_date, "YYYY-MM-DD").toDate()
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
                visaDetails.id_expiry_date
                  ? visaDetails.id_expiry_date.substr(8, 2)
                  : null
              }
              month={
                visaDetails.id_expiry_date
                  ? visaDetails.id_expiry_date.substr(5, 2)
                  : null
              }
              year={
                visaDetails.id_expiry_date
                  ? visaDetails.id_expiry_date.substr(0, 4)
                  : null
              }
              name="id_expiry_date"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              selected={
                visaDetails.id_expiry_date
                  ? moment(visaDetails.id_expiry_date, "YYYY-MM-DD").toDate()
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
              <Tooltip
                title="View Doc"
              >
                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.id_front.document.data,
                      visaDetailsFiles.id_front.document.name
                    )
                  }
                >
                  {visaDetailsFiles.id_front ? <LuExternalLink /> : "Not available"}
                </button>
              </Tooltip>
              <Tooltip
                title="Download Doc"
              >
                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadFiles(
                      visaDetailsFiles.id_front.document.data,
                      visaDetailsFiles.id_front.document.name
                    )
                  }
                >
                  {visaDetailsFiles.id_front ? <BsDownload /> : "Not available"}
                </button>
              </Tooltip>
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
              {/* <button
                className="text-blue-600 underline"
                onClick={() =>
                  downloadAttachment(
                    visaDetailsFiles.id_back.document.data,
                    visaDetailsFiles.id_back.document.name
                  )
                }
              >
                {visaDetailsFiles.id_back ? visaDetailsFiles.id_back.document.name : "Not available"}
              </button> */}
              <Tooltip
                title="View Doc"
              >

                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.id_back.document.data,
                      visaDetailsFiles.id_back.document.name
                    )
                  }
                >
                  {visaDetailsFiles.id_back ? <LuExternalLink /> : "Not available"}
                </button>
              </Tooltip>
              <Tooltip
                title="Download Doc"
              >

                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadFiles(
                      visaDetailsFiles.id_back.document.data,
                      visaDetailsFiles.id_back.document.name
                    )
                  }
                >
                  {visaDetailsFiles.id_back ? <BsDownload /> : "Not available"}
                </button>
              </Tooltip>
              <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <h2 className="tracking-wide mb-4 flex items-center gap-x-3 mt-4">
          <p className='text-baseBlue lg:text-lg'>Passport Details</p>
          <label className='text-sm text-gray-500'>Applicable:</label>
          <div className='flex items-center gap-x-2'>
            <p className='text-sm'>Yes</p>
            <input type="checkbox"
              checked={visaDetails.is_passport_applicable}
              name="is_passport_applicable_yes"
              onChange={(e) => handleEdit('is_passport_applicable', e.target.checked)}
            />
          </div>
          <div className='flex items-center gap-x-2'>
            <p className='text-sm'>No</p>
            <input type="checkbox"
              checked={!visaDetails.is_passport_applicable}
              name="is_passport_applicable_no"
              onChange={(e) => handleEdit('is_passport_applicable', !e.target.checked)}
            />
          </div>

        </h2>
      </div>
      {
        visaDetails.is_passport_applicable && <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Passport Number {visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name="passport_number"
              readOnly={!isEdit}
              value={visaDetails.passport_number}
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
              Passport Issuance Country {visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Select
                className={`${isEdit ? "text-black" : "text-gray-500"}`}
                name="Passport_Issuance_Country"
                options={countryOptions}
                value={countryOptions.find(
                  (option) => option.label === visaDetails.Passport_Issuance_Country
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
              Issuance Date {visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick} >
              <Datepicker
                day={
                  visaDetails.Passport_Issuance_Date
                    ? visaDetails.Passport_Issuance_Date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.Passport_Issuance_Date
                    ? visaDetails.Passport_Issuance_Date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.Passport_Issuance_Date
                    ? visaDetails.Passport_Issuance_Date.substr(0, 4)
                    : null
                }
                name="Passport_Issuance_Date"
                className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.Passport_Issuance_Date
                    ? moment(visaDetails.Passport_Issuance_Date, "YYYY-MM-DD").toDate()
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
              Expiry Date {visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick} >

              <Datepicker
                day={
                  visaDetails.Passport_Expiry_Date
                    ? visaDetails.Passport_Expiry_Date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.Passport_Expiry_Date
                    ? visaDetails.Passport_Expiry_Date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.Passport_Expiry_Date
                    ? visaDetails.Passport_Expiry_Date.substr(0, 4)
                    : null
                }
                name="Passport_Expiry_Date"
                className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.Passport_Expiry_Date
                    ? moment(visaDetails.Passport_Expiry_Date, "YYYY-MM-DD").toDate()
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
              Passport Copy {visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* 
                <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.passport_copy.document.data,
                      visaDetailsFiles.passport_copy.document.name
                    )
                  }
                >
                  {visaDetailsFiles.passport_copy ? visaDetailsFiles.passport_copy.document.name : "Not available"}

                </button> */}
                <Tooltip
                  title="View Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.passport_copy.document.data,
                        visaDetailsFiles.passport_copy.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.passport_copy ? <LuExternalLink /> : "Not available"}

                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.passport_copy.document.data,
                        visaDetailsFiles.passport_copy.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.passport_copy ? <BsDownload /> : "Not available"}

                  </button>
                </Tooltip>
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}

          </div>
        </div>
      }

      {/* Visa */}
      <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
        <p className='text-baseBlue tracking-wide lg:text-lg'>Visa Details</p>
        <label className='text-sm text-gray-500'>Applicable:</label>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>Yes</p>
          <input type="checkbox"
            name='is_visa_applicable_yes'
            checked={visaDetails.is_visa_applicable}
            onChange={(e) => handleEdit('is_visa_applicable', e.target.checked)}
          />
        </div>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>No</p>
          <input type="checkbox"
            name='is_visa_applicable_no'
            checked={!visaDetails.is_visa_applicable}
            onChange={(e) => handleEdit('is_visa_applicable', !e.target.checked)}
          />
        </div>


      </h2>
      {
        visaDetails.is_visa_applicable && <div className='flex w-[100%] flex-wrap gap-3'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Entry Permit Number{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}

            </label>

            <input type="text" name="entry_permit_number"
              value={visaDetails.entry_permit_number}
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
              Visa Issuance Country {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Select
                className={`${isEdit ? "text-black" : "text-gray-500"}`}
                name="country_of_visa_issuance"
                options={countryOptions}
                value={countryOptions.find(
                  (option) => option.label === visaDetails.country_of_visa_issuance
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
              UID Number{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name="uid_number"
              value={visaDetails.uid_number}
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
              Visa Type{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}

            </label>
            <div onClick={handleFieldClick}>
              <Select
                className={`${isEdit ? "text-black" : "text-gray-500"}`}
                name="visa_type"
                options={visaOptions}
                value={visaOptions.find(
                  (option) => option.value === visaDetails.visa_type
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
              Visa Issuance Date{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.visa_issuance_date
                    ? visaDetails.visa_issuance_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.visa_issuance_date
                    ? visaDetails.visa_issuance_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.visa_issuance_date
                    ? visaDetails.visa_issuance_date.substr(0, 4)
                    : null
                }
                name="visa_issuance_date"
                className={`pl-2 bg-white rounded h-8 text-sm
             placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.visa_issuance_date
                    ? moment(visaDetails.visa_issuance_date, "YYYY-MM-DD").toDate()
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
              Visa Expiry Date{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.visa_expiry_date
                    ? visaDetails.visa_expiry_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.visa_expiry_date
                    ? visaDetails.visa_expiry_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.visa_expiry_date
                    ? visaDetails.visa_expiry_date.substr(0, 4)
                    : null
                }
                name="visa_expiry_date"
                className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.visa_expiry_date
                    ? moment(visaDetails.visa_expiry_date, "YYYY-MM-DD").toDate()
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
              Visa Duration{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name="visa_duration"
              value={visaDetails.visa_duration}
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
              Visa Country Entry Date{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}

            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.visa_country_entry_date
                    ? visaDetails.visa_country_entry_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.visa_country_entry_date
                    ? visaDetails.visa_country_entry_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.visa_country_entry_date
                    ? visaDetails.visa_country_entry_date.substr(0, 4)
                    : null
                }
                name="visa_country_entry_date"
                className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.visa_country_entry_date
                    ? moment(visaDetails.visa_country_entry_date, "YYYY-MM-DD").toDate()
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
              Visa Country Exit Date

            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.visa_country_exit_date
                    ? visaDetails.visa_country_exit_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.visa_country_exit_date
                    ? visaDetails.visa_country_exit_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.visa_country_exit_date
                    ? visaDetails.visa_country_exit_date.substr(0, 4)
                    : null
                }
                name="visa_country_exit_date"
                className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.visa_country_exit_date
                    ? moment(visaDetails.visa_country_exit_date, "YYYY-MM-DD").toDate()
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
              Entry Permit{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <Tooltip
                  title="View Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.enter_permit.document.data,
                        visaDetailsFiles.enter_permit.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.enter_permit ? <LuExternalLink /> : "Not available"}
                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.enter_permit.document.data,
                        visaDetailsFiles.enter_permit.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.enter_permit ? <BsDownload /> : "Not available"}
                  </button>
                </Tooltip>
                {/* <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.enter_permit.document.data,
                      visaDetailsFiles.enter_permit.document.name
                    )
                  }
                >
                  {visaDetailsFiles.enter_permit ? visaDetailsFiles.enter_permit.document.name : "Not available"}
                </button> */}
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}
          </div>


          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Page {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.visa_page.document.data,
                      visaDetailsFiles.visa_page.document.name
                    )
                  }
                >
                  {visaDetailsFiles.visa_page ? visaDetailsFiles.visa_page.document.name : "Not available"}
                </button> */}
                <Tooltip
                  title="View Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.visa_page.document.data,
                        visaDetailsFiles.visa_page.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.visa_page ? <LuExternalLink /> : "Not available"}
                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.visa_page.document.data,
                        visaDetailsFiles.visa_page.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.visa_page ? <BsDownload /> : "Not available"}
                  </button>
                </Tooltip>
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Medical Result{visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('medical', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.medical.document.data,
                      visaDetailsFiles.medical.document.name
                    )
                  }
                >
                  {visaDetailsFiles.medical ? visaDetailsFiles.medical.document.name : "Not available"}
                </button> */}
                <Tooltip
                  title="View Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.medical.document.data,
                        visaDetailsFiles.medical.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.medical ? <LuExternalLink /> : "Not available"}
                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.medical.document.data,
                        visaDetailsFiles.medical.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.medical ? <BsDownload /> : "Not available"}
                  </button>
                </Tooltip>
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              ID Application {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.id_application.document.data,
                      visaDetailsFiles.id_application.document.name
                    )
                  }
                >
                  {visaDetailsFiles.id_application ? visaDetailsFiles.id_application.document.name : "Not available"}
                </button> */}
                <Tooltip
                  title="View Doc"
                >
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.id_application.document.data,
                        visaDetailsFiles.id_application.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.id_application ? <LuExternalLink /> : "Not available"}
                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.id_application.document.data,
                        visaDetailsFiles.id_application.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.id_application ? <BsDownload /> : "Not available"}
                  </button>
                </Tooltip>
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}
          </div>
        </div>
      }

      {/* Insurance */}
      <h2 className="mb-2 lg:mb-2 lg:mt-7 mt-2 flex items-center gap-x-3">
        <p className='text-baseBlue tracking-wide lg:text-lg'>Insurance Details</p>
        <label className='text-sm text-gray-500'>Applicable:</label>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>Yes</p>
          <input type="checkbox"
            checked={visaDetails.is_insurance_applicable}
            name='is_insurance_applicable_yes'
            onChange={(e) => handleEdit('is_insurance_applicable', e.target.checked)}
          />
        </div>
        <div className='flex items-center gap-x-2'>
          <p className='text-sm'>No</p>
          <input type="checkbox"
            checked={!visaDetails.is_insurance_applicable}
            name='is_insurance_applicable_no'
            onChange={(e) => handleEdit('is_insurance_applicable', !e.target.checked)}
          />
        </div>

      </h2>


      {
        visaDetails.is_insurance_applicable && <div className='flex w-[100%] flex-wrap items-center gap-3'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              DHA ID{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name="dha_id"
              value={visaDetails.dha_id}
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
              Card Number{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name="card_number"
              value={visaDetails.card_number}
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
              Insurance Policy{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name='insurance_policy'
              value={visaDetails.insurance_policy}
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
              Insurance Company{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <input type="text" name='insurance_company'
              value={visaDetails.insurance_company}
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
              Insurance Active Date{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.insurance_active_date
                    ? visaDetails.insurance_active_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.insurance_active_date
                    ? visaDetails.insurance_active_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.insurance_active_date
                    ? visaDetails.insurance_active_date.substr(0, 4)
                    : null
                }
                name="insurance_active_date"
                className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.insurance_active_date
                    ? moment(visaDetails.insurance_active_date, "YYYY-MM-DD").toDate()
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
              Insurance Expiry Date{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            <div onClick={handleFieldClick}>
              <Datepicker
                day={
                  visaDetails.insurance_expiry_date
                    ? visaDetails.insurance_expiry_date.substr(8, 2)
                    : null
                }
                month={
                  visaDetails.insurance_expiry_date
                    ? visaDetails.insurance_expiry_date.substr(5, 2)
                    : null
                }
                year={
                  visaDetails.insurance_expiry_date
                    ? visaDetails.insurance_expiry_date.substr(0, 4)
                    : null
                }
                name="insurance_expiry_date"
                className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
                selected={
                  visaDetails.insurance_expiry_date
                    ? moment(visaDetails.insurance_expiry_date, "YYYY-MM-DD").toDate()
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
              Insurance Card{visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* <button
                  className="text-blue-600 underline"
                  onClick={() =>
                    downloadAttachment(
                      visaDetailsFiles.insurance_card.document.data,
                      visaDetailsFiles.insurance_card.document.name
                    )
                  }
                >
                  {visaDetailsFiles.insurance_card ? <LuExternalLink /> : "Not available"}
                </button> */}
                <Tooltip
                  title="View Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadAttachment(
                        visaDetailsFiles.insurance_card.document.data,
                        visaDetailsFiles.insurance_card.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.insurance_card ? <LuExternalLink /> : "Not available"}
                  </button>
                </Tooltip>
                <Tooltip
                  title="Download Doc"
                >

                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      downloadFiles(
                        visaDetailsFiles.insurance_card.document.data,
                        visaDetailsFiles.insurance_card.document.name
                      )
                    }
                  >
                    {visaDetailsFiles.insurance_card ? <BsDownload /> : "Not available"}
                  </button>
                </Tooltip>
                <WiCloudRefresh className="text-blue-600 text-xl" onClick={handleFieldClick} />
              </div>
            )}
          </div>
        </div>
      }

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
      {
        cancelBox && (
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
        )
      }
    </div >
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