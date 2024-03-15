import React, { useEffect, useState } from 'react';
import Datepicker from '../Dashboard/Datepicker';
import Button from './Button';
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { visaOptions } from '../../../data/Data';
import moment from 'moment';

const VisaDetials = ({ prevstep, nextstep }) => {
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

    // const visaDetailsSchema = Joi.object({
    //     passport_number: Joi.required().label('Passport Number'),
    //     Passport_Issuance_Country: Joi.required().label('Issuance Country'),
    //     Passport_Issuance_Date: Joi.date().required().label('Passport Issuance Date'),
    //     Passport_Expiry_Date: Joi.date().required().label('Passport Expiry Date'),

    //     // visa
    //     entry_permit_number: Joi.string().required().label('Entry Permit Number'),
    //     country_of_visa_issuance: Joi.string().required().label('Visa Issuance Country'),
    //     uid_number: Joi.string().required().label('UID Number'),
    //     visa_type: Joi.string().required().label('Visa Type'),
    //     visa_issuance_date: Joi.date().iso().required().label('Visa Issuance Date'),
    //     visa_expiry_date: Joi.date().iso().required().label('Visa Expiry Date'),
    //     visa_duration: Joi.string().required().label('Visa Duration'),
    //     visa_country_entry_date: Joi.date().iso().required().label('Visa Country Entry Date'),
    //     visa_country_exit_date: Joi.date().iso().required().label('Visa Country Exit Date'),
    //     enter_permit: Joi.any().label('Entry Permit'),
    //     visa_page: Joi.any().label('Visa Page'),
    //     medical: Joi.any().label('Medical Result'),
    //     id_application: Joi.any().label('ID Application'),

    //     living_country_id_no: Joi.required().label('Living Country ID Number'),
    //     place_of_issuance: Joi.required().label('Place of Issuance'),
    //     id_issuance_date: Joi.date().required().label('ID Issuance Date'),
    //     id_expiry_date: Joi.date().required().label('ID Expiry Date'),
    //     id_front: Joi.string().trim().allow('').label('ID Front'),
    //     id_back: Joi.string().trim().allow('').label('ID Back'),
    //     // id 
    //     dha_id: Joi.required().label('DHA ID'),
        
    //     card_number: Joi.required().label('Card Number'),
    //     insurance_policy: Joi.required().label('Insurance Policy'),
    //     insurance_company: Joi.required().label('Insurance Company'),
    //     insurance_active_date: Joi.date().required().label('Insurance Active Date'),
    //     insurance_expiry_date: Joi.required().label('Insurance Expiry Date'),
    // });

    let [visaDetails, setVisaDetails] = useState({
        passport_number: storedData?.passport_number ? storedData.passport_number : null,
        Passport_Issuance_Country: storedData?.Passport_Issuance_Country ? storedData.Passport_Issuance_Country : null,
        Passport_Issuance_Date: storedData?.Passport_Issuance_Date ? storedData.Passport_Issuance_Date : null,
        Passport_Expiry_Date: storedData?.Passport_Expiry_Date ? storedData.Passport_Expiry_Date : null,
        entry_permit_number: storedData?.entry_permit_number ? storedData.entry_permit_number : "",
        country_of_visa_issuance: storedData?.country_of_visa_issuance ? storedData.country_of_visa_issuance : "",
        uid_number: storedData?.uid_number ? storedData.uid_number : "",
        visa_type: storedData?.visa_type ? storedData.visa_type : "",
        visa_issuance_date: storedData?.visa_issuance_date ? storedData.visa_issuance_date : null,
        visa_expiry_date: storedData?.visa_expiry_date ? storedData.visa_expiry_date : null,
        visa_duration: storedData?.visa_duration ? storedData.visa_duration : "",
        visa_country_entry_date: storedData?.visa_country_entry_date ? storedData.visa_country_entry_date : null,
        visa_country_exit_date: storedData?.visa_country_exit_date ? storedData.visa_country_exit_date : null,
        living_country_id_no: storedData?.living_country_id_no ? storedData.living_country_id_no : "",
        place_of_issuance: storedData?.place_of_issuance ? storedData.place_of_issuance : "",
        id_issuance_date: storedData?.id_issuance_date ? storedData.id_issuance_date : null,
        id_expiry_date: storedData?.id_expiry_date ? storedData.id_expiry_date : null,
        dha_id: storedData?.dha_id ? storedData.dha_id : "",
        card_number: storedData?.card_number ? storedData.card_number : "",
        insurance_policy: storedData?.insurance_policy ? storedData.insurance_policy : "",
        insurance_company: storedData?.insurance_company ? storedData.insurance_company : "",
        insurance_active_date: storedData?.insurance_active_date ? storedData.insurance_active_date : null,
        insurance_expiry_date: storedData?.insurance_expiry_date ? storedData.insurance_expiry_date : null,
    })

    const [visaDetailsFiles, setVisaDetailsFiles] = useState(storedVisaDetailsFiles || {});
    const [showVisa, setShowVisa] = useState(true);
    const [showInsurance, setShowInsurance] = useState(true);

    const toggleShowVisa = () => {
        setShowVisa(!showVisa)
    }

    const toggleShowInsurance = () => {
        setShowInsurance(!showInsurance)
    }


    const handleChange = (name, value) => {
        setVisaDetails({ ...visaDetails, [name]: value });
        console.log("Updated visaDetails:", { ...visaDetails, [name]: value });
    };

    // Handle change for date inputs
    const handleDateChange = (date, name) => {
        const formattedDate = moment(date).format("YYYY-MM-DD"); // Format the date as "YYYY-MM-DD"
        setVisaDetails({ ...visaDetails, [name]: formattedDate });
        console.log("Updated visaDetails:", { ...visaDetails, [name]: formattedDate });
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
        // Save visa details to session storage
        setDataInSessionStorage("visaDetails", visaDetails);
    }, [visaDetails]);

    useEffect(() => {
        // Save visa files to session storage
        setDataInSessionStorage("visaDetailsFiles", visaDetailsFiles);
    }, [visaDetailsFiles]);


    // Function to handle previous step
    const handlePreviousStep = () => {
        prevstep();
    };

    // Function to handle next step
    const handleNextStep = () => {
        nextstep();
    };

    // Get country options for Select component
    const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
        value: countryCode,
        label: getAllCountries()[countryCode].name
    }));

    return (
        <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
            <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">
                Passport Details
            </h2>
            <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Passport Number:
                    </label>
                    <input type="text" name="passport_number" value={visaDetails.passport_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Passport Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
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
                        className=""
                        name="Passport_Issuance_Country"
                        options={countryOptions}
                        value={countryOptions.find(
                            (option) => option.label === visaDetails.Passport_Issuance_Country
                        )}
                        onChange={(selectedOption) =>
                            handleChange("Passport_Issuance_Country", selectedOption.label)
                        }
                    // required
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
                        selected={visaDetails.Passport_Issuance_Date ? moment(visaDetails.Passport_Issuance_Date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "Passport_Issuance_Date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
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
                        selected={visaDetails.Passport_Expiry_Date ? moment(visaDetails.Passport_Expiry_Date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "Passport_Expiry_Date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                </div>

                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Passport Copy:
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)}  />
                </div>

            </div>

            <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
                <p className='text-baseBlue tracking-wide lg:text-lg'>Visa Details</p>
                <input type="checkbox" checked={showVisa} onChange={toggleShowVisa} />
                <label className='text-sm text-gray-500'>Not Applicable</label>

            </h2>
            {showVisa && <div className='flex w-[100%] flex-wrap gap-3'>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Entry Permit Number
                    </label>

                    <input type="text" name="entry_permit_number" value={visaDetails.entry_permit_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Entry Permit Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Issuance Country
                    </label>
                    <Select
                        className=""
                        name="country_of_visa_issuance"
                        options={countryOptions}
                        // value={visaDetails.country_of_visa_issuance}
                        value={countryOptions.find(
                            (option) => option.label === visaDetails.country_of_visa_issuance
                        )}
                        onChange={(selectedOption) =>
                            handleChange("country_of_visa_issuance", selectedOption.label)
                        }
                    // required
                    />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        UID Number
                    </label>
                    <input type="text" name="uid_number" value={visaDetails.uid_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="UID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Type
                    </label>
                    <Select
                        className=""
                        name="visa_type"
                        options={visaOptions}
                        value={visaOptions.find(
                            (option) => option.value === visaDetails.visa_type
                        )}
                        onChange={(selectedOption) =>
                            handleChange("visa_type", selectedOption.value)
                        }
                    // required
                    />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Issuance Date
                    </label>
                    {/* <input type="date" value={visaIssuanceDate} onChange={(e) => setVisaIssuanceDate(e.target.value)} placeholder="Visa Issuance Date" /> */}
                    <Datepicker
                        selected={visaDetails.visa_issuance_date ? moment(visaDetails.visa_issuance_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "visa_issuance_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
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
                        selected={visaDetails.visa_expiry_date ? moment(visaDetails.visa_expiry_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "visa_expiry_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                </div>
                {/* <input type="date" value={visaExpiryDate} onChange={(e) => setVisaExpiryDate(e.target.value)} placeholder="Visa Expiry Date" /> */}
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Duration
                    </label>
                    <input type="text" name="visa_duration" value={visaDetails.visa_duration} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Visa Duration" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Country Entry Date
                    </label>
                    {/* <input type="date" value={visaCountryEntryDate} onChange={(e) => setVisaCountryEntryDate(e.target.value)} placeholder="Visa Country Entry Date" /> */}
                    <Datepicker
                        selected={visaDetails.visa_country_entry_date ? moment(visaDetails.visa_country_entry_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "visa_country_entry_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
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
                        selected={visaDetails.visa_country_exit_date ? moment(visaDetails.visa_country_exit_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "visa_country_exit_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                </div>
                {/* <input type="date" value={visaCountryExitDate} onChange={(e) => setVisaCountryExitDate(e.target.value)} placeholder="Visa Country Exit Date" /> */}
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Entry Permit
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)}  />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Page
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)}  />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

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

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Application
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)}  />
                    {/* <input type="text" value={idApplication} onChange={(e) => setIdApplication(e.target.value)} placeholder="ID Application" /> */}
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
                    <input type="text" name="living_country_id_no" value={visaDetails.living_country_id_no} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Living Country ID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Place of Issuance
                    </label>
                    <Select
                        className=""
                        name="place_of_issuance"
                        options={countryOptions}
                        value={countryOptions.find(
                            (option) => option.value === visaDetails.place_of_issuance
                        )}
                        onChange={(selectedOption) =>
                            handleChange("place_of_issuance", selectedOption.label)
                        }
                    // required
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
                        selected={visaDetails.id_issuance_date ? moment(visaDetails.id_issuance_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "id_issuance_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                    {/* <input type="date" value={idIssuanceDate} onChange={(e) => setIdIssuanceDate(e.target.value)} placeholder="ID Issuance Date" /> */}
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Expiry Date
                    </label>
                    {/* <input type="date" value={idExpiryDate} onChange={(e) => setIdExpiryDate(e.target.value)} placeholder="ID Expiry Date" /> */}
                    <Datepicker
                        selected={visaDetails.id_expiry_date ? moment(visaDetails.id_expiry_date, "YYYY-MM-DD").toDate() : null}
                        onChange={(date) => handleDateChange(date, "id_expiry_date")}
                        dateFormat="yyyy-MM-dd"
                        className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Front
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('id_front', e.target.files)}  />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Back
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('id_back', e.target.files)}  />
                </div>
            </div>

            <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
                <p className='text-baseBlue tracking-wide lg:text-lg'>Insurance Details</p>
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
                        <input type="text" name="dha_id" value={visaDetails.dha_id}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            placeholder="DHA ID" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Card Number
                        </label>
                        <input type="text" name="card_number" value={visaDetails.card_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Card Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Insurance Policy
                        </label>
                        <input type="text" name='insurance_policy' value={visaDetails.insurance_policy} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Policy" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Insurance Company
                        </label>
                        <input type="text" name='insurance_company' value={visaDetails.insurance_company} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Company" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Insurance Active Date
                        </label>
                        {/* <input type="date" value={insuranceActiveDate} onChange={(e) => setInsuranceActiveDate(e.target.value)} placeholder="Insurance Active Date" /> */}

                        <Datepicker
                            selected={visaDetails.insurance_active_date ? moment(visaDetails.insurance_active_date, "YYYY-MM-DD").toDate() : null}
                            onChange={(date) => handleDateChange(date, "insurance_active_date")}
                            dateFormat="yyyy-MM-dd"
                            className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                        />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Insurance Expiry Date
                        </label>
                        {/* <input type="date" value={insuranceExpiryDate} onChange={(e) => setInsuranceExpiryDate(e.target.value)} placeholder="Insurance Expiry Date" /> */}
                        <Datepicker
                            selected={visaDetails.insurance_expiry_date ? moment(visaDetails.insurance_expiry_date, "YYYY-MM-DD").toDate() : null}
                            onChange={(date) => handleDateChange(date, "insurance_expiry_date")}
                            dateFormat="yyyy-MM-dd"
                            className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                        />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className="font-sfpro tracking-wide font-medium
                        text-input text-base mb-1"
                        >
                            Insurance Card

                        </label>
                        <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)}  />
                    </div>
                </div>

            }
            <div className="flex gap-x-20 mt-6 lg:mt-6 md:mt-0 mb-6">
                <Button
                    onClick={handlePreviousStep}
                    text={'Previous'} />
                <Button
                    onClick={handleNextStep}
                    text={'Next'} />
            </div>
        </div>
    );
}

export default VisaDetials;
