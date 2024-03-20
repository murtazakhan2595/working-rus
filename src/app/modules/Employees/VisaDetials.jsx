import React, { useEffect, useState } from 'react';
import Datepicker from '../Dashboard/Datepicker';
import Button from './Button';
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { visaOptions } from '../../../data/Data';
import moment from 'moment';
import { toast } from 'react-toastify';

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
    const [showPassport, setShowPassport] = useState(false);
    const [showVisa, setShowVisa] = useState(false);
    const [showInsurance, setShowInsurance] = useState(false);
    const showId = true;

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

        if (showPassport) {
            // Check if fields are filled
            if (visaDetails.passport_number && visaDetails.Passport_Issuance_Country && visaDetails.Passport_Issuance_Date && visaDetails.Passport_Expiry_Date && visaDetailsFiles.passport_copy) {
                nextstep();
            } else {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
            }
        } else if (showVisa)
            if (visaDetails.entry_permit_number && visaDetails.country_of_visa_issuance && visaDetails.uid_number && visaDetails.visa_type && visaDetails.visa_issuance_date && visaDetails.visa_expiry_date && visaDetails.visa_duration && visaDetails.visa_country_entry_date && visaDetails.visa_country_exit_date && visaDetailsFiles.enter_permit && visaDetailsFiles.visa_page && visaDetailsFiles.medical && visaDetailsFiles.id_application) {
                nextstep();
            } else {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
            }

        else if (showInsurance) {
            if (visaDetails.dha_id && visaDetails.card_number && visaDetails.insurance_policy && visaDetails.insurance_company && visaDetails.insurance_active_date && visaDetails.insurance_expiry_date && visaDetailsFiles.insurance_card) {
                nextstep();
            } else {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
            }
        }

        else if (showId) {
            if (visaDetails.living_country_id_no && visaDetails.place_of_issuance && visaDetails.id_issuance_date && visaDetails.id_expiry_date && visaDetailsFiles.id_front && visaDetailsFiles.id_back) {
                nextstep();
            } else {
                toast.error("Please fill all ID Details fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
            }
        }

        else {
            nextstep();
        }


    };

    // Get country options for Select component
    const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
        value: countryCode,
        label: getAllCountries()[countryCode].name
    }));

    return (
        <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
            <div>
                <h2 className="mb-2 lg:mb-4 mt-2 flex items-center gap-x-3">
                    <p className='text-baseBlue tracking-wide lg:text-lg'>Passport Details</p>
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
                {showPassport &&
                    <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Number{showPassport && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <input type="text" name="passport_number" value={visaDetails.passport_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Passport Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"

                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Issuance Country{showPassport && <span className="text-red-500 text-2xl">*</span>}:
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

                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[15%]">

                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Issuance Date{showPassport && <span className="text-red-500 text-2xl">*</span>}:
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
                                Expiry Date{showPassport && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <Datepicker
                                selected={visaDetails.Passport_Expiry_Date ? moment(visaDetails.Passport_Expiry_Date, "YYYY-MM-DD").toDate() : null}
                                onChange={(date) => handleDateChange(date, "Passport_Expiry_Date")}
                                dateFormat="yyyy-MM-dd"
                                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                                required={showPassport}
                            />
                        </div>

                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">

                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Copy{showPassport && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
                        </div>

                    </div>}
            </div>

            {/* visa details */}
            <div>
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
                {showVisa &&
                    <div className='flex w-[100%] flex-wrap gap-3'>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-medium
                        text-input text-base mb-1`}
                            >
                                Entry Permit Number {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>

                            <input type="text" name="entry_permit_number" value={visaDetails.entry_permit_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Entry Permit Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-medium text-input text-base mb-1 $`}
                            >
                                Visa Issuance Country {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <Select
                                className=""
                                name="country_of_visa_issuance"
                                options={countryOptions}
                                value={countryOptions.find(
                                    (option) => option.label === visaDetails.country_of_visa_issuance
                                )}
                                onChange={(selectedOption) =>
                                    handleChange("country_of_visa_issuance", selectedOption.label)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1 $`}
                            >
                                UID Number {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="text" name="uid_number" value={visaDetails.uid_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="UID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Type {showVisa && <span className="text-red-500 text-2xl">*</span>}
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
                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Issuance Date {showVisa && <span className="text-red-500 text-2xl">*</span>}
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
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Expiry Date {showVisa && <span className="text-red-500 text-2xl">*</span>}
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
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Duration {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="text" name="visa_duration" value={visaDetails.visa_duration} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Visa Duration" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Country Entry Date {showVisa && <span className="text-red-500 text-2xl">*</span>}
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
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Country Exit Date {showVisa && <span className="text-red-500 text-2xl">*</span>}
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
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Entry Permit {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)} />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Page {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Medical Result {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file"
                                onChange={(e) => handleFileChange('medical', e.target.files)}
                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                ID Application {showVisa && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
                        </div>
                    </div>
                }
            </div>

            <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-2 lg:mt-7 lg:text-lg mt-2">
                ID Details <span className="text-red-500 text-2xl">*</span>
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
                    <input type="file" onChange={(e) => handleFileChange('id_front', e.target.files)} />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Back
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('id_back', e.target.files)} />
                </div>
            </div>

            <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
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


            {showInsurance &&
                <div className='flex w-[100%] flex-wrap items-center gap-3'>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                        <label
                            className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            DHA ID {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name="dha_id" value={visaDetails.dha_id}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            placeholder="DHA ID" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label
                            className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Card Number {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name="card_number" value={visaDetails.card_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Card Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                      `}
                        >
                            Insurance Policy {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name='insurance_policy' value={visaDetails.insurance_policy} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Policy" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Insurance Company {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name='insurance_company' value={visaDetails.insurance_company} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Company" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Insurance Active Date {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>

                        <Datepicker
                            selected={visaDetails.insurance_active_date ? moment(visaDetails.insurance_active_date, "YYYY-MM-DD").toDate() : null}
                            onChange={(date) => handleDateChange(date, "insurance_active_date")}
                            dateFormat="yyyy-MM-dd"
                            className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                        />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Insurance Expiry Date {showInsurance && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <Datepicker
                            selected={visaDetails.insurance_expiry_date ? moment(visaDetails.insurance_expiry_date, "YYYY-MM-DD").toDate() : null}
                            onChange={(date) => handleDateChange(date, "insurance_expiry_date")}
                            dateFormat="yyyy-MM-dd"
                            className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                        />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        > Insurance Card {showInsurance && <span className="text-red-500 text-2xl">*</span>}

                        </label>
                        <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
                    </div>
                </div>
            }

            <div className="flex gap-x-20 mt-6 lg:mt-6 md:mt-0 mb-6">
                <Button
                    onClick={handlePreviousStep}
                    text={'Previous'} />
                <Button
                    onClick={handleNextStep}
                    text={'Next'} type="submit" />
            </div>

        </div>
    );
}

export default VisaDetials;
