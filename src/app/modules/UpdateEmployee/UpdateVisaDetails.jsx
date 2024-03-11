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

const VisaDetails = ({ prevstep,
  nextstep,
  token,
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
  let updatedData = getDataFromSessionStorage("visaDetails");

  let [defaultData, setDefaultData] = useState({});
  const [visaDetailsFiles, setVisaDetailsFiles] = useState(storedVisaDetailsFiles || {});
  let [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState({
    entryPermitDoc: null,
    visaPageDoc: null,
    medicalDoc: null,
    idAppDoc: null,
    idFront: null,
    idBack: null,
    insuranceCard: null,
  });
  const [docs, setDocs] = useState([]);
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
      const InsuranceCardResponse = await axios.get(`${baseUrl}/attachment/?search={"employee_id":${id}}`, { headers });

      setDocs(InsuranceCardResponse.data);
      console.log(InsuranceCardResponse.data);

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

  // useEffect(() => {
  //     // Save visa details to session storage
  //     setDataInSessionStorage("visaDetails", visaDetails);
  // }, [visaDetails]);


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
    }

    // Update defaultData state
    setDefaultData({ ...defaultData, [name]: modifiedValue });
    setIsEdit(true);
  };




  const updateDataOnServer = async () => {
    try {
      // Make a copy of the updated data
      const updatedDataCopy = { ...defaultData };

      // Patch the updated data to the API
      const response = await axios.patch(`${baseUrl}/emp/${id}`, updatedDataCopy, { headers });

      const passportCopyRes = await axios.patch(`${baseUrl}/attachment/${documents.passportCopyDoc.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.passport_copy[0]?.name,
        "description": `${visaDetailsFiles.passport_copy[0]?.name} file`,
        "document": visaDetailsFiles.passport_copy[0]?.data
      }, { headers });


      const visaRes = await axios.patch(`${baseUrl}/attachment/${documents.visaPageDoc.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.visa_page[0]?.name,
        "description": `${visaDetailsFiles.visa_page[0]?.name} file`,
        "document": visaDetailsFiles.visa_page[0]?.data
      }, { headers });

      const medicalRes = await axios.patch(`${baseUrl}/attachment/${documents.medicalDoc.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.medical[0]?.name,
        "description": `${visaDetailsFiles.medical[0]?.name} file`,
        "document": visaDetailsFiles.medical[0]?.data
      }, { headers });

      const idAppRes = await axios.patch(`${baseUrl}/attachment/${documents.idAppDoc?.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.id_application[0]?.name,
        "description": `${visaDetailsFiles.id_application[0]?.name} file`,
        "document": visaDetailsFiles.id_application[0]?.data
      }, { headers });



      const idFrontRes = await axios.patch(`${baseUrl}/attachment/${documents.idFront?.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.id_front[0]?.name,
        "description": `${visaDetailsFiles.id_front[0]?.name} file`,
        "document": visaDetailsFiles.id_front[0]?.data
      }, { headers });

      const idBackRes = await axios.patch(`${baseUrl}/attachment/${documents.idBack?.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.id_back[0]?.name,
        "description": `${visaDetailsFiles.id_back[0]?.name} file`,
        "document": visaDetailsFiles.id_back[0]?.data
      }, { headers });

      // console.log('id back response', idBackRes);

      const insuranceRes = await axios.patch(`${baseUrl}/attachment/${documents.insuranceCard?.id}`, {
        "employee_id": id,
        "name": visaDetailsFiles.insurance_card[0]?.name,
        "description": `${visaDetailsFiles.insurance_card[0]?.name} file`,
        "document": visaDetailsFiles.insurance_card[0]?.data
      }, { headers });

      if (response.status === 200) {
        // If the update is successful, clear session storage
        sessionStorage.clear();
        // Notify user
        toast.success("Visa details updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        // Move to the next step
        nextstep();
      }
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle errors here
    }
  };


  const handleSave = () => {
    // Call the function to update data on the server
    console.log('handle saved above')
    updateDataOnServer();
    console.log('handle saved below ')
    setIsEdit(false);
  };

  // Function to handle removing a document
  const removeDocument = (documentName) => {
    setDocuments({ ...documents, [documentName]: null });
  };


  return (
    <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <div className="flex justify-between">
        <h2 className="text-baseBlue tracking-wide mb-4 lg:text-lg">
          Passport Details
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
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[13%]">
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
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">
          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Passport Copy:
          </label>
          <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
        </div>
      </div>

      <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:mt-7 lg:text-lg mt-2">
        Visa Details
      </h2>
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
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <h2 className="text-input opacity-70 tracking-wide text-base mt-3 mb-3 lg:mb-4 lg:text-base">
            Entry Permit:
          </h2>
          <div
            className={`${isEdit ? "text-gray-700" : "text-gray-500"
              } flex mb-2`}
          >
            {/* <div className="bg-gray-200 border-gray-400 border py-1 px-3 rounded-l-md ">
              {isEdit ? (
                <label
                  htmlFor="entry-permit-upload"
                  className="cursor-pointer"
                >
                  Upload Entry Permit
                </label>
              ) : "Entry Permit"}
            </div> */}
            <div className="py-1 px-3 border-gray-200 border rounded-r-md">
              {documents.entryPermitDoc ? documents.entryPermitDoc.name : "Not available"}
            </div>
          </div>
          {/* {isEdit && ( */}
          <>
            <input
              type="file"
              name="enter_permit"
              className="hidden"
              onChange={(e) => handleFileChange('enter_permit', e.target.files)}


            />
          </>
          {/* )} */}
        </div>


        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.visaPageDoc ? documents.visaPageDoc.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Visa Page
          </label>
          <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
        </div>



        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.medicalDoc ? documents.medicalDoc.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>


          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Medical Result
          </label>
          <input type="file"
            onChange={(e) => handleFileChange('medical', e.target.files)}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.idAppDoc ? documents.idAppDoc.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Application
          </label>
          <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
        </div>
      </div>

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

          />
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
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.idFront ? documents.idFront.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Front
          </label>
          <input type="file" onChange={(e) => handleFileChange('id_front', e.target.files)}
          />
        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.idBack ? documents.idBack.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            ID Back
          </label>
          <input type="file" onChange={(e) => handleFileChange('id_back', e.target.files)}
          />
        </div>
      </div>

      <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-2 lg:mt-7 lg:text-lg mt-2">
        Insurance Details
      </h2>
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

        </div>
        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
          <div className="flex items-center gap-x-2">
            {documents.insuranceCard ? documents.insuranceCard.name : "Not available"}
            <WiCloudRefresh className={`${isEdit ? "text-blue-600" : "text-gray-500"} text-xl`} />
          </div>

          <label
            className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
          >
            Insurance Card
          </label>
          <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
        </div>
      </div>
      <div className="flex gap-x-5 mb-40 mt-5">
        {!isEdit && <Button onClick={prevstep} text={"Previous"} />}
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
