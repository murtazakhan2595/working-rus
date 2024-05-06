import React, { useEffect, useState } from 'react';
import Datepicker from '../Dashboard/Datepicker';
import Button from './Button';
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { visaOptions } from '../../../data/Data';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getEmployeeVisaDetailData, saveEmployeeVisaDetailData, getEmployeeVisaDetailsFiles } from '../../hooks/employee';
import { EmployeeVisaDetails } from '../../utils/Types/Employee'
import { connect } from "react-redux";
import { BiEdit } from 'react-icons/bi';
import { WiCloudRefresh } from 'react-icons/wi';
import { RxCross2 } from 'react-icons/rx';
import { downloadAttachment } from '../../../utils/fileUtils';
import { LuExternalLink } from "react-icons/lu";
import Tooltip from '@mui/material/Tooltip';
import { downloadFiles } from '../../../utils/downUtils';
import { BsDownload } from "react-icons/bs";

const VisaDetails = ({ prevstep, nextstep, baseUrl, userProfile, token }) => {

    const [visaDetails, setVisaDetails] = useState({});
    const [visaDetailsFiles, setVisaDetailsFiles] = useState({});

    useEffect(() => {
        getEmployeeVisaDetailData(baseUrl, userProfile?.id, token).then(responseEmpPersonalInformation => {
            setVisaDetails(responseEmpPersonalInformation);
            // setImagePreview(responseEmpPersonalInformation.profile_picture);

        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render


    useEffect(() => {
        getEmployeeVisaDetailsFiles(baseUrl, userProfile?.id, token).then(response => {
            setVisaDetailsFiles(response);
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, token]); // Empty dependency array ensures this effect runs only once after the initial render


    console.log(visaDetails, visaDetailsFiles);

    const handleChange = (name, value) => {
        setVisaDetails({ ...visaDetails, [name]: value });
    };

    // Handle change for date inputs
    const handleDateChange = (date, name) => {
        const formattedDate = moment(date).format("YYYY-MM-DD"); // Format the date as "YYYY-MM-DD"
        setVisaDetails({ ...visaDetails, [name]: formattedDate });
    };

    const handleFileChange = (name, files) => {
        Promise.all(
            Array.from(files).map((file) => {
                if (file.size <= 300 * 1024) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve({ name: file.name, data: event.target.result });
                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(file);
                    });
                } else {
                    // Display error message if file size exceeds 500 KB
                    toast.error("File size should be less than or equal to 300 KB!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    return null;
                }
            })
        )
            .then((fileContents) => {
                const updatedFiles = { ...visaDetailsFiles };
                updatedFiles[name] = fileContents && fileContents.length > 0 ? fileContents[0] : {};
                setVisaDetailsFiles(updatedFiles);
            })
            .catch((error) => console.error("Error reading files:", error));
    };


    // Function to handle previous step
    const handlePreviousStep = () => {
        prevstep();
    };

    // Function to handle next step
    const handleNextStep = () => {
        if (visaDetails.is_passport_applicable) {
            // Check if fields are filled
            if (!visaDetails.passport_number || !visaDetails.Passport_Issuance_Country || !visaDetails.Passport_Issuance_Date || !visaDetails.Passport_Expiry_Date || !visaDetailsFiles.passport_copy) {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
                return false;
            }
        } 
         if (visaDetails.is_visa_applicable) {
            if (!visaDetails.entry_permit_number || !visaDetails.country_of_visa_issuance || !visaDetails.uid_number || !visaDetails.visa_type || !visaDetails.visa_issuance_date || !visaDetails.visa_expiry_date || !visaDetails.visa_duration || !visaDetails.visa_country_entry_date || !visaDetailsFiles.enter_permit || !visaDetailsFiles.visa_page || !visaDetailsFiles.medical || !visaDetailsFiles.id_application) {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
                return false;
            }
        }
         if (visaDetails.is_insurance_applicable) {
            if (!visaDetails.dha_id || !visaDetails.card_number || !visaDetails.insurance_policy || !visaDetails.insurance_company || !visaDetails.insurance_active_date || !visaDetails.insurance_expiry_date || !visaDetailsFiles.insurance_card) {
                toast.error("Please fill in all required fields!", {
                    position: "top-right",
                    autoClose: 1000,
                });
                return false;
            }
        } 
         if (!visaDetails.living_country_id_no || !visaDetails.place_of_issuance || !visaDetails.id_issuance_date || !visaDetails.id_expiry_date || !visaDetailsFiles.id_front || !visaDetailsFiles.id_back) {
            toast.error("Please fill all ID Details fields!", {
                position: "top-right",
                autoClose: 1000,
            });

        }

        saveEmployeeVisaDetailData(baseUrl, userProfile?.id, token, visaDetails, visaDetailsFiles);
        nextstep();

    };

    // Get country options for Select component
    const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
        value: countryCode,
        label: getAllCountries()[countryCode].name
    }));

    return (
        <div className="bg-[#F9F9F9] h-[76vh] overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
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
                            (option) => option.label === visaDetails.place_of_issuance
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
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Expiry Date
                    </label>
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
                    {visaDetailsFiles.id_front?.document &&
                        <div className="flex items-center gap-x-2">
                            <Tooltip
                                title="View Doc"
                            >
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() =>
                                        downloadAttachment(
                                            visaDetailsFiles.id_front?.document?.data,
                                            visaDetailsFiles.id_front?.document?.name
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
                                            visaDetailsFiles.id_front?.document?.data,
                                            visaDetailsFiles.id_front?.document?.name
                                        )
                                    }
                                >
                                    {visaDetailsFiles.id_front ? <BsDownload /> : "Not available"}
                                </button>
                            </Tooltip>
                            <div className='py-1 px-3'>{visaDetailsFiles.id_front?.document?.name}</div>

                        </div>
                    }
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Back
                    </label>
                    <input type="file" onChange={(e) => handleFileChange('id_back', e.target.files)} />
                    {visaDetailsFiles.id_back?.document &&
                        <div className="flex items-center gap-x-2">
                            <Tooltip
                                title="View Doc"
                            >
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() =>
                                        downloadAttachment(
                                            visaDetailsFiles.id_back?.document?.data,
                                            visaDetailsFiles.id_back?.document?.name
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
                                            visaDetailsFiles.id_back?.document?.data,
                                            visaDetailsFiles.id_back?.document?.name
                                        )
                                    }
                                >
                                    {visaDetailsFiles.id_back ? <BsDownload /> : "Not available"}
                                </button>
                            </Tooltip>
                            <div className='py-1 px-3'>{visaDetailsFiles.id_back?.document?.name}</div>

                        </div>
                    }
                </div>
            </div>

            <div>
                <h2 className="mb-2 lg:mb-4 mt-2 flex items-center gap-x-3 lg:mt-5">
                    <p className='text-baseBlue tracking-wide lg:text-lg'>Passport Details</p>
                    <label className='text-sm text-gray-500'>Applicable:</label>
                    <div className='flex items-center gap-x-2'>
                        <p className='text-sm'>Yes</p>
                        <input type="checkbox"
                            name='is_passport_applicable_yes'
                            checked={visaDetails.is_passport_applicable}
                            onChange={(e) => handleChange('is_passport_applicable', e.target.checked)}
                        />
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <p className='text-sm'>No</p>
                        <input type="checkbox"
                            name='is_passport_applicable_no'
                            checked={!visaDetails.is_passport_applicable}
                            onChange={(e) => handleChange('is_passport_applicable', !e.target.checked)}
                        />
                    </div>

                </h2>
                {visaDetails.is_passport_applicable &&
                    <div className='flex w-[100%] flex-wrap items-center gap-x-5'>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Number{visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <input type="text" name="passport_number" value={visaDetails.passport_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Passport Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"

                            />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Issuance Country{visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}:
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
                                Issuance Date{visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}:
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
                                Expiry Date{visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <Datepicker
                                selected={visaDetails.Passport_Expiry_Date ? moment(visaDetails.Passport_Expiry_Date, "YYYY-MM-DD").toDate() : null}
                                onChange={(date) => handleDateChange(date, "Passport_Expiry_Date")}
                                dateFormat="yyyy-MM-dd"
                                className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                                required={visaDetails.is_passport_applicable}
                            />
                        </div>

                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[25%]">

                            <label
                                className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                            >
                                Passport Copy{visaDetails.is_passport_applicable && <span className="text-red-500 text-2xl">*</span>}:
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('passport_copy', e.target.files)} />
                            {visaDetailsFiles.passport_copy?.document &&
                                <div className="flex items-center gap-x-2">
                                    <Tooltip
                                        title="View Doc"
                                    >
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                downloadAttachment(
                                                    visaDetailsFiles.passport_copy?.document?.data,
                                                    visaDetailsFiles.passport_copy?.document?.name
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
                                                    visaDetailsFiles.passport_copy?.document?.data,
                                                    visaDetailsFiles.passport_copy?.document?.name
                                                )
                                            }
                                        >
                                            {visaDetailsFiles.passport_copy ? <BsDownload /> : "Not available"}
                                        </button>
                                    </Tooltip>
                                    <div className='py-1 px-3'>{visaDetailsFiles.passport_copy?.document?.name}</div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>

            {/* visa details */}
            <div>
                <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
                    <p className='text-baseBlue tracking-wide lg:text-lg'>Visa Details</p>
                    <label className='text-sm text-gray-500'>Applicable:</label>
                    <div className='flex items-center gap-x-2'>
                        <p className='text-sm'>Yes</p>
                        <input type="checkbox"
                            name='is_visa_applicable_yes'
                            checked={visaDetails.is_visa_applicable}
                            onChange={(e) => handleChange('is_visa_applicable', e.target.checked)}
                        />
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <p className='text-sm'>No</p>
                        <input type="checkbox"
                            name='is_visa_applicable_no'
                            checked={!visaDetails.is_visa_applicable}
                            onChange={(e) => handleChange('is_visa_applicable', !e.target.checked)}
                        />
                    </div>

                </h2>
                {visaDetails.is_visa_applicable &&
                    <div className='flex w-[100%] flex-wrap gap-3'>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-medium
                        text-input text-base mb-1`}
                            >
                                Entry Permit Number {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>

                            <input type="text" name="entry_permit_number" value={visaDetails.entry_permit_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Entry Permit Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-medium text-input text-base mb-1 $`}
                            >
                                Visa Issuance Country {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                                UID Number {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="text" name="uid_number" value={visaDetails.uid_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="UID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Type {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                                Visa Issuance Date {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                                Visa Expiry Date {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                                Visa Duration {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="text" name="visa_duration" value={visaDetails.visa_duration} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Visa Duration" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Country Entry Date {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Entry Permit {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('enter_permit', e.target.files)} />
                            {visaDetailsFiles.enter_permit?.document &&
                                <div className="flex items-center gap-x-2">
                                    <Tooltip
                                        title="View Doc"
                                    >
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                downloadAttachment(
                                                    visaDetailsFiles.enter_permit?.document?.data,
                                                    visaDetailsFiles.enter_permit?.document?.name
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
                                                    visaDetailsFiles.enter_permit?.document?.data,
                                                    visaDetailsFiles.enter_permit?.document?.name
                                                )
                                            }
                                        >
                                            {visaDetailsFiles.enter_permit ? <BsDownload /> : "Not available"}
                                        </button>
                                    </Tooltip>
                                    <div className='py-1 px-3'>{visaDetailsFiles.enter_permit?.document?.name}</div>

                                </div>
                            }
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Visa Page {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('visa_page', e.target.files)} />
                            {visaDetailsFiles.visa_page?.document &&
                                <div className="flex items-center gap-x-2">
                                    <Tooltip
                                        title="View Doc"
                                    >
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                downloadAttachment(
                                                    visaDetailsFiles.visa_page?.document?.data,
                                                    visaDetailsFiles.visa_page?.document?.name
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
                                                    visaDetailsFiles.visa_page?.document?.data,
                                                    visaDetailsFiles.visa_page?.document?.name
                                                )
                                            }
                                        >
                                            {visaDetailsFiles.visa_page ? <BsDownload /> : "Not available"}
                                        </button>
                                    </Tooltip>
                                    <div className='py-1 px-3'>{visaDetailsFiles.visa_page?.document?.name}</div>

                                </div>}
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                Medical Result {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file"
                                onChange={(e) => handleFileChange('medical', e.target.files)}
                            />
                            {visaDetailsFiles.medical?.document &&
                                <div className="flex items-center gap-x-2">
                                    <Tooltip
                                        title="View Doc"
                                    >
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                downloadAttachment(
                                                    visaDetailsFiles.medical?.document?.data,
                                                    visaDetailsFiles.medical?.document?.name
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
                                                    visaDetailsFiles.medical?.document?.data,
                                                    visaDetailsFiles.medical?.document?.name
                                                )
                                            }
                                        >
                                            {visaDetailsFiles.medical ? <BsDownload /> : "Not available"}
                                        </button>
                                    </Tooltip>
                                    <div className='py-1 px-3'>{visaDetailsFiles.medical?.document?.name}</div>

                                </div>
                            }
                        </div>
                        <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                            <label
                                className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1`}
                            >
                                ID Application {visaDetails.is_visa_applicable && <span className="text-red-500 text-2xl">*</span>}
                            </label>
                            <input type="file" onChange={(e) => handleFileChange('id_application', e.target.files)} />
                            {visaDetailsFiles.id_application?.document &&
                                <div className="flex items-center gap-x-2">
                                    <Tooltip
                                        title="View Doc"
                                    >
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                downloadAttachment(
                                                    visaDetailsFiles.id_application?.document?.data,
                                                    visaDetailsFiles.id_application?.document?.name
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
                                                    visaDetailsFiles.id_application?.document?.data,
                                                    visaDetailsFiles.id_application?.document?.name
                                                )
                                            }
                                        >
                                            {visaDetailsFiles.id_application ? <BsDownload /> : "Not available"}
                                        </button>
                                    </Tooltip>
                                    <div className='py-1 px-3'>{visaDetailsFiles.id_application?.document?.name}</div>

                                </div>
                            }
                        </div>
                    </div>
                }
            </div>


            <h2 className="mb-2 lg:mb-4 lg:mt-7 mt-2 flex items-center gap-x-3">
                <p className='text-baseBlue tracking-wide lg:text-lg'>Insurance Details</p>
                <label className='text-sm text-gray-500'>Applicable:</label>
                <div className='flex items-center gap-x-2'>
                    <p className='text-sm'>Yes</p>
                    <input type="checkbox"
                        name='is_insurance_applicable_yes'
                        checked={visaDetails.is_insurance_applicable}
                        onChange={(e) => handleChange('is_insurance_applicable', e.target.checked)}
                    />
                </div>
                <div className='flex items-center gap-x-2'>
                    <p className='text-sm'>No</p>
                    <input type="checkbox"
                        name='is_insurance_applicable_no'
                        checked={!visaDetails.is_insurance_applicable}
                        onChange={(e) => handleChange('is_insurance_applicable', !e.target.checked)}
                    />
                </div>
            </h2>


            {visaDetails.is_insurance_applicable &&
                <div className='flex w-[100%] flex-wrap items-center gap-3'>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                        <label
                            className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            DHA ID {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                            Card Number {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name="card_number" value={visaDetails.card_number} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Card Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                      `}
                        >
                            Insurance Policy {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name='insurance_policy' value={visaDetails.insurance_policy} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Policy" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Insurance Company {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
                        </label>
                        <input type="text" name='insurance_company' value={visaDetails.insurance_company} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Insurance Company" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                    </div>
                    <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                        <label className={`font-sfpro tracking-wide font-mediumtext-input text-base mb-1
                    `}
                        >
                            Insurance Active Date {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                            Insurance Expiry Date {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}
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
                        > Insurance Card {visaDetails.is_insurance_applicable && <span className="text-red-500 text-2xl">*</span>}

                        </label>
                        <input type="file" onChange={(e) => handleFileChange('insurance_card', e.target.files)} />
                        {visaDetailsFiles.insurance_card?.document &&
                            <div className="flex items-center gap-x-2">
                                <Tooltip
                                    title="View Doc"
                                >
                                    <button
                                        className="text-blue-600 underline"
                                        onClick={() =>
                                            downloadAttachment(
                                                visaDetailsFiles.insurance_card?.document?.data,
                                                visaDetailsFiles.insurance_card?.document?.name
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
                                                visaDetailsFiles.insurance_card?.document?.data,
                                                visaDetailsFiles.insurance_card?.document?.name
                                            )
                                        }
                                    >
                                        {visaDetailsFiles.insurance_card ? <BsDownload /> : "Not available"}
                                    </button>
                                </Tooltip>
                                <div className='py-1 px-3'>{visaDetailsFiles.insurance_card?.document?.name}</div>

                            </div>
                        }
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
const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(VisaDetails);
