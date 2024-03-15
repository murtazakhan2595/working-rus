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

const VisaDetails = ({ prevstep,
  nextstep,
  token,
  errors,
  setErrors,
  userProfile,
  baseUrl, }) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };

  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };
  let storedData = getDataFromSessionStorage("visaDetails");
  const storedVisaDetailsFiles = getDataFromSessionStorage("visaDetailsFiles");

  let [defaultData, setDefaultData] = useState({});
  const [visaDetailsFiles, setVisaDetailsFiles] = useState(storedVisaDetailsFiles || {});
  let [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState({
    passportCopyDoc: null,
    entryPermitDoc: null,
    visaPageDoc: null,
    medicalDoc: null,
    idAppDoc: null,
    idFront: null,
    idBack: null,
    insuranceCard: null,
  });

  const visaDetailsSchema = Joi.object({
    passport_number: Joi.required().label('Passport Number'),
    Passport_Issuance_Country: Joi.required().label('Issuance Country'),
    Passport_Issuance_Date: Joi.date().required().label('Passport Issuance Date'),
    Passport_Expiry_Date: Joi.date().required().label('Passport Expiry Date'),

    // visa
    entry_permit_number: Joi.string().required().label('Entry Permit Number'),
    country_of_visa_issuance: Joi.string().required().label('Visa Issuance Country'),
    uid_number: Joi.string().required().label('UID Number'),
    visa_type: Joi.string().required().label('Visa Type'),
    visa_issuance_date: Joi.date().iso().required().label('Visa Issuance Date'),
    visa_expiry_date: Joi.date().iso().required().label('Visa Expiry Date'),
    visa_duration: Joi.string().required().label('Visa Duration'),
    visa_country_entry_date: Joi.date().iso().required().label('Visa Country Entry Date'),
    visa_country_exit_date: Joi.date().iso().required().label('Visa Country Exit Date'),
    enter_permit: Joi.any().label('Entry Permit'),
    visa_page: Joi.any().label('Visa Page'),
    medical: Joi.any().label('Medical Result'),
    id_application: Joi.any().label('ID Application'),

    living_country_id_no: Joi.required().label('Living Country ID Number'),
    place_of_issuance: Joi.required().label('Place of Issuance'),
    id_issuance_date: Joi.date().required().label('ID Issuance Date'),
    id_expiry_date: Joi.date().required().label('ID Expiry Date'),
    id_front: Joi.string().trim().allow('').label('ID Front'),
    id_back: Joi.string().trim().allow('').label('ID Back'),
    // id 
    dha_id: Joi.required().label('DHA ID'),
    card_number: Joi.required().label('Card Number'),
    insurance_policy: Joi.required().label('Insurance Policy'),
    insurance_company: Joi.required().label('Insurance Company'),
    insurance_active_date: Joi.date().required().label('Insurance Active Date'),
    insurance_expiry_date: Joi.required().label('Insurance Expiry Date'),
  });


  const [showVisa, setShowVisa] = useState(true);
  const [showInsurance, setShowInsurance] = useState(true);
  const [showPassport, setShowPassport] = useState(true);
  const [cancelBox, setCancelBox] = useState(false);
  const id = userProfile.id;



  const toggleShowPassport = () => {
    setShowPassport(!showPassport)
  }

  const toggleShowVisa = () => {
    setShowVisa(!showVisa)
  }

  const toggleShowInsurance = () => {
    setShowInsurance(!showInsurance)
  }


  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      const employeeData = employeeResponse.data;
      setDefaultData({
        passport_number: employeeData.passport_number,
        Passport_Issuance_Country: employeeData.Passport_Issuance_Country,
        Passport_Issuance_Date: employeeData.Passport_Issuance_Date,
        Passport_Expiry_Date: employeeData.Passport_Expiry_Date,
        entry_permit_number: employeeData.entry_permit_number,
        country_of_visa_issuance: employeeData.country_of_visa_issuance,
        visa_duration: employeeData.visa_duration,
        uid_number: employeeData.uid_number,
        living_country_id_no: employeeData.living_country_id_no,
        dha_id: employeeData.dha_id,
        card_number: employeeData.card_number,
        insurance_policy: employeeData.insurance_policy,
        insurance_company: employeeData.insurance_company,
        visa_expiry_date: employeeData.visa_expiry_date,
        visa_issuance_date: employeeData.visa_issuance_date,
        visa_country_entry_date: employeeData.visa_country_entry_date,
        visa_country_exit_date: employeeData.visa_country_exit_date,
        id_issuance_date: employeeData.id_issuance_date,
        id_expiry_date: employeeData.id_expiry_date,
        insurance_active_date: employeeData.insurance_active_date,
        insurance_expiry_date: employeeData.insurance_expiry_date,
        visa_type: employeeData.visa_type,
        place_of_issuance: employeeData.place_of_issuance,
      });

      // setDefaultData(employeeData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDocs = async () => {
    try {
      const passportCopyResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"passport_copy"}`, { headers });
      const entryPermitResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"enter_permit"}`, { headers });
      const visaDocResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"visa_page"}`, { headers });
      const medicalResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"medical"}`, { headers });
      const IdAppResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_application"}`, { headers });
      const IdFrontResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_front"}`, { headers });
      const IdBackResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_back"}`, { headers });
      const InsuranceCardResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id}, "name":"insurance_card"}`, { headers });

      // Update state with fetched documents
      setDocuments({
        passportCopyDoc: passportCopyResponse.data[0],
        entryPermitDoc: entryPermitResponse.data[0],
        visaPageDoc: visaDocResponse.data[0],
        medicalDoc: medicalResponse.data[0],
        idAppDoc: IdAppResponse.data[0],
        idFront: IdFrontResponse.data[0],
        idBack: IdBackResponse.data[0],
        insuranceCard: InsuranceCardResponse.data[0],
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };


  useEffect(() => {
    fetchData();
    fetchDocs()
  }, []);


  // Handle change for date inputs
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
        setVisaDetailsFiles({ ...visaDetailsFiles, [name]: fileContents });
      })
      .catch((error) => console.error("Error reading files:", error));
  };


  useEffect(() => {
    // Save visa files to session storage
    setDataInSessionStorage("visaDetailsFiles", visaDetailsFiles);
  }, [visaDetailsFiles]);

  // Function to handle next step
  const handleNextStep = () => {
    nextstep();
  };

  // Get country options for Select component
  const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
  }));



  // handleEdit
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

    // Clear error for the field when it's filled
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };


  const updateDataOnServer = async () => {
    try {
      // Make a copy of the updated data
      const updatedDataCopy = { ...defaultData };

      // Patch the updated data to the API
      const { error } = visaDetailsSchema.validate(updatedDataCopy, {
        abortEarly: false,
      })
      if (error) {
        const validationErrors = {};
        error.details.forEach(detail => {
          validationErrors[detail.path[0]] = detail.message;
        })
        setErrors(validationErrors);

      }
      const response = await axios.patch(`${baseUrl}/emp/${id}`, updatedDataCopy, { headers });
      if (response.status === 200 || response.status === 204) {

        const medicalRes = await axios.patch(`${baseUrl}/attachment/${documents.medicalDoc.id}`, {
          "employee_id": id,
          "name": "medical",
          "description": `${visaDetailsFiles.medical[0]?.name} file`,
          document: {
            name: visaDetailsFiles.medical[0]?.name,
            data: visaDetailsFiles.medical[0]?.data,
          },
        }, { headers });

        const idAppRes = await axios.patch(`${baseUrl}/attachment/${documents.idAppDoc?.id}`, {
          "employee_id": id,
          "name": "id_application",
          "description": `${visaDetailsFiles.id_application[0]?.name} file`,
          document: {
            name: visaDetailsFiles.id_application[0]?.name,
            data: visaDetailsFiles.id_application[0]?.data,
          },
        }, { headers });

        const visaRes = await axios.patch(`${baseUrl}/attachment/${documents.visaPageDoc?.id}`, {
          "employee_id": id,
          "name": "visa_page",
          "description": `${visaDetailsFiles.visa_page[0]?.name} file`,
          document: {
            name: visaDetailsFiles.visa_page[0]?.name,
            data: visaDetailsFiles.visa_page[0]?.data,
          },
        }, { headers });

        const entryPermitResponse = await axios.patch(`${baseUrl}/attachment/${documents.entryPermitDoc?.id}`, {
          "employee_id": id,
          "name": "enter_permit",
          "description": `${visaDetailsFiles.enter_permit[0]?.name} file`,
          document: {
            name: visaDetailsFiles.enter_permit[0]?.name,
            data: visaDetailsFiles.enter_permit[0]?.data,
          },
        }, { headers });

        const idBackRes = await axios.patch(`${baseUrl}/attachment/${documents.idBack?.id}`, {
          "employee_id": id,
          "name": "id_back",
          "description": `${visaDetailsFiles.id_back[0]?.name} file`,
          document: {
            name: visaDetailsFiles.id_back[0]?.name,
            data: visaDetailsFiles.id_back[0]?.data,
          },
        }, { headers });

        const idFrontRes = await axios.patch(`${baseUrl}/attachment/${documents.idFront?.id}`, {
          "employee_id": id,
          "name": "id_front",
          "description": `${visaDetailsFiles.id_front[0]?.name} file`,
          document: {
            name: visaDetailsFiles.id_front[0]?.name,
            data: visaDetailsFiles.id_front[0]?.data,
          },
        }, { headers });

      }

      const passportRes = await axios.patch(`${baseUrl}/attachment/${documents.passportCopyDoc?.id}`, {
        "employee_id": id,
        "name": "passport_copy",
        "description": `${visaDetailsFiles.passport_copy[0]?.name} file`,
        document: {
          name: visaDetailsFiles.passport_copy[0]?.name,
          data: visaDetailsFiles.passport_copy[0]?.data,
        },
      }, { headers });

      const insuranceRes = await axios.patch(`${baseUrl}/attachment/${documents.insuranceCard?.id}`, {
        "employee_id": id,
        "name": "insurance_card",
        "description": `${visaDetailsFiles.insurance_card[0]?.name} file`,
        document: {
          name: visaDetailsFiles.insurance_card[0]?.name,
          data: visaDetailsFiles.insurance_card[0]?.data,
        },
      }, { headers });

      sessionStorage.clear();


      // If the update is successful, clear session storage

      // Notify user
      toast.success("Visa details updated successfully!", {
        position: "top-right",
        autoClose: 1000,
      });
      // Move to the next step
      nextstep();
      sessionStorage.clear();

    } catch (error) {
      console.error("Error updating data:", error);
      // Handle errors here
    }
  };


  const handleSave = () => {
    updateDataOnServer();
    setIsEdit(false);
  };

  // Function to handle removing a document
  const removeDocument = (documentName) => {
    setDocuments({ ...documents, [documentName]: null });
  };


  return (
    <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <div className="flex justify-between">
        <h2 className="tracking-wide mb-4 flex items-center gap-x-3">
          <p className='text-baseBlue lg:text-lg'>Passport Details</p>
          <input type="checkbox" checked={showPassport} onChange={toggleShowPassport} />
          <label className='text-sm text-gray-500'>Not Applicable</label>
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
      {showPassport &&
        <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Passport Number:
            </label>
            <input type="text" name="passport_number"
              readOnly={!isEdit}
              value={defaultData.passport_number}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
              placeholder="Passport Number" className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
            />
            {errors.passport_number && (
              <span className="text-red-500 text-sm ">
                {errors.passport_number}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Passport Issuance:
            </label>
            <Select
              className={`${isEdit ? "text-black" : "text-gray-500"}`}
              name="Passport_Issuance_Country"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.label === defaultData.Passport_Issuance_Country
              )}
              onChange={(selectedOption) => handleEdit("Passport_Issuance_Country", selectedOption)}
              isDisabled={!isEdit}
            />
            {errors.passport_number && (
              <span className="text-red-500 text-sm ">
                {errors.passport_number}
              </span>
            )}
          </div>


          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[15%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Issuance Date:
            </label>
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
            {errors.Passport_Issuance_Date && (
              <span className="text-red-500 text-sm ">
                {errors.Passport_Issuance_Date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[14.2%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Expiry Date:
            </label>
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
            {errors.Passport_Expiry_Date && (
              <span className="text-red-500 text-sm ">
                {errors.Passport_Expiry_Date}
              </span>
            )}

          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Passport Copy:
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
                {/* {documents.passportCopyDoc ? documents.passportCopyDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.passportCopyDoc ? documents.passportCopyDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
              </div>
            )}
            {/* <div className="flex items-center gap-x-2">
              {documents.passportCopyDoc ? documents.passportCopyDoc.document.name : "Not available"}
              <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
            </div>
            <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} /> */}
          </div>
        </div>
      }


      <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
        <p className='text-baseBlue tracking-wide lg:text-lg'>Visa Details</p>
        <input type="checkbox" checked={showVisa} onChange={toggleShowVisa} />
        <label className='text-sm text-gray-500'>Not Applicable</label>
      </h2>

      {showVisa &&
        <div className='flex w-[100%] flex-wrap gap-3'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Entry Permit Number
            </label>

            <input type="text" name="entry_permit_number"
              value={defaultData.entry_permit_number}
              placeholder="Entry Permit Number"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.entry_permit_number && (
              <span className="text-red-500 text-sm ">
                {errors.entry_permit_number}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Issuance Country
            </label>
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
            {errors.country_of_visa_issuance && (
              <span className="text-red-500 text-sm ">
                {errors.country_of_visa_issuance}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              UID Number
            </label>
            <input type="text" name="uid_number"
              value={defaultData.uid_number}
              placeholder="UID Number"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.uid_number && (
              <span className="text-red-500 text-sm ">
                {errors.uid_number}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Type
            </label>
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
            {errors.visa_type && (
              <span className="text-red-500 text-sm ">
                {errors.visa_type}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Issuance Date
            </label>
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
            {errors.visa_issuance_date && (
              <span className="text-red-500 text-sm ">
                {errors.visa_issuance_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Expiry Date
            </label>
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
            {errors.visa_expiry_date && (
              <span className="text-red-500 text-sm ">
                {errors.visa_expiry_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Duration
            </label>
            <input type="text" name="visa_duration"
              value={defaultData.visa_duration}
              placeholder="Visa Duration" className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
             placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.visa_duration && (
              <span className="text-red-500 text-sm ">
                {errors.visa_duration}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Country Entry Date
            </label>
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
            {errors.visa_country_entry_date && (
              <span className="text-red-500 text-sm ">
                {errors.visa_country_entry_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Country Exit Date
            </label>
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
            {errors.visa_country_exit_date && (
              <span className="text-red-500 text-sm ">
                {errors.visa_country_exit_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Entry Permit:
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)} />
                {/* {documents.entryPermitDoc ? documents.entryPermitDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.entryPermitDoc ? documents.entryPermitDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
              </div>
            )}
          </div>


          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Visa Page
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
                {/* {documents.visaPageDoc ? documents.visaPageDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.visaPageDoc ? documents.visaPageDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
              </div>
            )}
          </div>



          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              Medical Result
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('medical', e.target.files)} />
                {/* {documents.medicalDoc ? documents.medicalDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.medicalDoc ? documents.medicalDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
            >
              ID Application
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
                {/* {documents.idAppDoc ? documents.idAppDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.idAppDoc ? documents.idAppDoc.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
              </div>
            )}
          </div>
        </div>}


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
          <Select
            className={`${isEdit ? "text-black" : "text-gray-500"}`}
            name="place_of_issuance"
            options={countryOptions}
            value={countryOptions.find(
              (option) => option.label === defaultData.place_of_issuance
            )}
            onChange={(selectedOption) => handleEdit("place_of_issuance", selectedOption)}
            isDisabled={!isEdit}
            onBlur={() => console.log('Value:', defaultData.place_of_issuance)}
          />
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
          {errors.id_issuance_date && (
            <span className="text-red-500 text-sm ">
              {errors.id_issuance_date}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Expiry Date
          </label>
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
          {errors.id_expiry_date && (
            <span className="text-red-500 text-sm ">
              {errors.id_expiry_date}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Front
          </label>
          {isEdit ? (
            <div className="flex items-center gap-x-2">
              <input type="file" onChange={(e) => handleFileChange('id_front', e.target.files)} />
              {/* {documents.idFront ? documents.idFront.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" /> */}
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.idFront ? documents.idFront.document.name : "Not available"}
              <WiCloudRefresh className="text-gray-500 text-xl" />
            </div>
          )}
          {errors.id_front && (
            <span className="text-red-500 text-sm ">
              {errors.id_front}
            </span>
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
              {/* {documents.idBack ? documents.idBack.document.name : "Not available"}
              <WiCloudRefresh className="text-blue-600 text-xl" /> */}
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              {documents.idBack ? documents.idBack.document.name : "Not available"}
              <WiCloudRefresh className="text-gray-500 text-xl" />
            </div>
          )}
          {errors.id_back && (
            <span className="text-red-500 text-sm ">
              {errors.id_back}
            </span>
          )}
        </div>
      </div>

      <h2 className="flex items-center gap-x-3 mb-2 lg:mb-2 lg:mt-7 mt-2">
        <p className="text-baseBlue tracking-wide lg:text-lg ">Insurance Details</p>
        <input type="checkbox" checked={showInsurance} onChange={toggleShowInsurance} />
        <label className='text-sm text-gray-500'>Not Applicable</label>
      </h2>
      {showInsurance &&
        <div className='flex w-[100%] flex-wrap items-center gap-3'>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              DHA ID
            </label>
            <input type="text" name="dha_id"
              value={defaultData.dha_id}
              placeholder="DHA ID"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.dha_id && (
              <span className="text-red-500 text-sm ">
                {errors.dha_id}
              </span>
            )}

          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Card Number
            </label>
            <input type="text" name="card_number"
              value={defaultData.card_number}
              placeholder="Card Number" className={`pl-2 bg-white rounded h-8 text-sm
           placeholder-[#555657] placeholder-opacity-50 w-[100%] 
           ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.card_number && (
              <span className="text-red-500 text-sm ">
                {errors.card_number}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Insurance Policy
            </label>
            <input type="text" name='insurance_policy'
              value={defaultData.insurance_policy}
              placeholder="Insurance Policy" className={`pl-2 bg-white rounded h-8 text-sm
           placeholder-[#555657] placeholder-opacity-50 w-[100%] 
           ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.insurance_policy && (
              <span className="text-red-500 text-sm ">
                {errors.insurance_policy}
              </span>
            )}

          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Insurance Company
            </label>
            <input type="text" name='insurance_company'
              value={defaultData.insurance_company}
              placeholder="Insurance Company"
              className={`pl-2 bg-white rounded h-8 text-sm placeholder-[#555657]
           placeholder-opacity-50 w-[100%] ${isEdit ? "text-black" : "text-gray-500"}`}
              onChange={(e) => handleEdit(e.target.name, e.target.value)}
            />
            {errors.insurance_company && (
              <span className="text-red-500 text-sm ">
                {errors.insurance_company}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Insurance Active Date
            </label>
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
            {errors.insurance_active_date && (
              <span className="text-red-500 text-sm ">
                {errors.insurance_active_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Insurance Expiry Date
            </label>
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
            {errors.insurance_expiry_date && (
              <span className="text-red-500 text-sm ">
                {errors.insurance_expiry_date}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
            <label
              className="font-sfpro tracking-wide font-medium
                          text-input text-base mb-1"
            >
              Insurance Card
            </label>
            {isEdit ? (
              <div className="flex items-center gap-x-2">
                <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
                {/* {documents.insuranceCard ? documents.insuranceCard.document.name : "Not available"}
                <WiCloudRefresh className="text-blue-600 text-xl" /> */}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {documents.insuranceCard ? documents.insuranceCard.document.name : "Not available"}
                <WiCloudRefresh className="text-gray-500 text-xl" />
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
          <Button onClick={handleNextStep} text={"Next"} />
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

  );
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(VisaDetails);
