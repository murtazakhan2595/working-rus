import React, { useState } from 'react';
import Datepicker from '../Dashboard/Datepicker';
import Button from './Button';

const VisaDetials = () => {
    const [passportNumber, setPassportNumber] = useState('');
    const [passportIssuanceCountry, setPassportIssuanceCountry] = useState('');
    const [passportIssuanceDate, setPassportIssuanceDate] = useState('');
    const [passportExpiryDate, setPassportExpiryDate] = useState('');
    const [passportCopy, setPassportCopy] = useState([]);

    const [entryPermitNumber, setEntryPermitNumber] = useState('');
    const [visaIssuanceCountry, setVisaIssuanceCountry] = useState('');
    const [uidNumber, setUidNumber] = useState('');
    const [visaType, setVisaType] = useState('');
    const [visaIssuanceDate, setVisaIssuanceDate] = useState('');
    const [visaExpiryDate, setVisaExpiryDate] = useState('');
    const [visaDuration, setVisaDuration] = useState('');
    const [visaCountryEntryDate, setVisaCountryEntryDate] = useState('');
    const [visaCountryExitDate, setVisaCountryExitDate] = useState('');
    const [entryPermitDocument, setEntryPermitDocument] = useState([]);
    const [visaPage, setVisaPage] = useState([]);
    const [medicalResult, setMedicalResult] = useState('');
    const [idApplication, setIdApplication] = useState('');

    const [livingCountryIDNumber, setLivingCountryIDNumber] = useState('');
    const [placeOfIssuance, setPlaceOfIssuance] = useState('');
    const [idIssuanceDate, setIdIssuanceDate] = useState('');
    const [idExpiryDate, setIdExpiryDate] = useState('');
    const [idUploadFront, setIdUploadFront] = useState([]);
    const [idUploadBack, setIdUploadBack] = useState([]);

    const [dhaID, setDhaID] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [insurancePolicy, setInsurancePolicy] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceActiveDate, setInsuranceActiveDate] = useState('');
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
    const [insuranceCardUpload, setInsuranceCardUpload] = useState([]);

    const handlePassportCopyChange = (e) => {
        const files = Array.from(e.target.files);
        setPassportCopy(files);
    };

    const handleEntryPermitDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setEntryPermitDocument(files);
    };

    const handleVisaPageChange = (e) => {
        const files = Array.from(e.target.files);
        setVisaPage(files);
    };

    const handleIdUploadFrontChange = (e) => {
        const files = Array.from(e.target.files);
        setIdUploadFront(files);
    };

    const handleIdUploadBackChange = (e) => {
        const files = Array.from(e.target.files);
        setIdUploadBack(files);
    };

    const handleInsuranceCardUploadChange = (e) => {
        const files = Array.from(e.target.files);
        setInsuranceCardUpload(files);
    };

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
                    <input type="text" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} placeholder="Passport Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]"
                    />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Passport Issuance:
                    </label>
                    <input type="text" value={passportIssuanceCountry}
                        onChange={(e) => setPassportIssuanceCountry(e.target.value)} placeholder="Passport Issuance Country" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[15%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Issuance Date:
                    </label>
                    <Datepicker />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[13%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Expiry Date:
                    </label>
                    <Datepicker />
                </div>

                {/* <input type="date" value={passportExpiryDate} onChange={(e) => setPassportExpiryDate(e.target.value)} placeholder="Passport Expiry Date" className='w-[48%]' /> */}
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[23%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Passport Copy:
                    </label>
                    <input type="file" onChange={handlePassportCopyChange} multiple />
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

                    <input type="text" value={entryPermitNumber} onChange={(e) => setEntryPermitNumber(e.target.value)} placeholder="Entry Permit Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Issuance Country
                    </label>
                    <input type="text" value={visaIssuanceCountry} onChange={(e) => setVisaIssuanceCountry(e.target.value)} placeholder="Visa Issuance Country" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        UID Number
                    </label>
                    <input type="text" value={uidNumber} onChange={(e) => setUidNumber(e.target.value)} placeholder="UID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Type
                    </label>
                    <input type="text" value={visaType} onChange={(e) => setVisaType(e.target.value)} placeholder="Visa Type" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Issuance Date
                    </label>
                    {/* <input type="date" value={visaIssuanceDate} onChange={(e) => setVisaIssuanceDate(e.target.value)} placeholder="Visa Issuance Date" /> */}
                    <Datepicker />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Expiry Date
                    </label>
                    <Datepicker />
                </div>
                {/* <input type="date" value={visaExpiryDate} onChange={(e) => setVisaExpiryDate(e.target.value)} placeholder="Visa Expiry Date" /> */}
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Duration
                    </label>
                    <input type="text" value={visaDuration} onChange={(e) => setVisaDuration(e.target.value)} placeholder="Visa Duration" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Country Entry Date
                    </label>
                    {/* <input type="date" value={visaCountryEntryDate} onChange={(e) => setVisaCountryEntryDate(e.target.value)} placeholder="Visa Country Entry Date" /> */}
                    <Datepicker />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Country Exit Date
                    </label>
                    <Datepicker />
                </div>
                {/* <input type="date" value={visaCountryExitDate} onChange={(e) => setVisaCountryExitDate(e.target.value)} placeholder="Visa Country Exit Date" /> */}
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Entry Permit
                    </label>
                    <input type="file" onChange={handleEntryPermitDocumentChange} multiple />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Visa Page
                    </label>
                    <input type="file" onChange={handleVisaPageChange} multiple />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Medical Result
                    </label>
                    <input type="file"
                        // onChange={handleMedicalResultChange} 
                        multiple />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Application
                    </label>
                    <input type="file"
                        // onChange={handleMedicalResultChange} 
                        multiple />
                    {/* <input type="text" value={idApplication} onChange={(e) => setIdApplication(e.target.value)} placeholder="ID Application" /> */}
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
                    <input type="text" value={livingCountryIDNumber} onChange={(e) => setLivingCountryIDNumber(e.target.value)} placeholder="Living Country ID Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Place of Issuance
                    </label>
                    <input type="text" value={placeOfIssuance} onChange={(e) => setPlaceOfIssuance(e.target.value)} placeholder="Place of Issuance" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">
                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID issuance Date
                    </label>
                    <Datepicker />
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
                    <Datepicker />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Front
                    </label>
                    <input type="file" onChange={handleIdUploadFrontChange} multiple />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        ID Back
                    </label>
                    <input type="file" onChange={handleIdUploadBackChange} multiple />
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
                    <input type="text" value={dhaID} onChange={(e) => setDhaID(e.target.value)}
                        placeholder="DHA ID" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Card Number
                    </label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />
                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Insurance Policy
                    </label>
                    <input type="text" value={insurancePolicy} onChange={(e) => setInsurancePolicy(e.target.value)} placeholder="Insurance Policy" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Insurance Company
                    </label>
                    <input type="text" value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} placeholder="Insurance Company" className="pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50 w-[100%]" />

                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Insurance Active Date
                    </label>
                    {/* <input type="date" value={insuranceActiveDate} onChange={(e) => setInsuranceActiveDate(e.target.value)} placeholder="Insurance Active Date" /> */}

                    <Datepicker />

                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Insurance Expiry Date
                    </label>
                    {/* <input type="date" value={insuranceExpiryDate} onChange={(e) => setInsuranceExpiryDate(e.target.value)} placeholder="Insurance Expiry Date" /> */}
                    <Datepicker />

                </div>
                <div className="flex flex-col gap-y-1 w-[100%] lg:w-[20%]">

                    <label
                        className="font-sfpro tracking-wide font-medium
                            text-input text-base mb-1"
                    >
                        Insurance Card

                    </label>
                    <input type="file" onChange={handleInsuranceCardUploadChange} multiple />
                </div>
            </div>
            <div className="flex gap-x-20 mt-6 lg:mt-6 md:mt-0 mb-6">
                <Button
                    // onClick={prevstep}
                    text={'Previous'} />
                <Button
                    //  onClick={handleNextStep}
                    text={'Next'} />
            </div>
        </div>
    );
}

export default VisaDetials;
