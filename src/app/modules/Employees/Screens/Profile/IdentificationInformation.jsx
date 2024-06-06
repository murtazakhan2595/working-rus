import React, { useState } from "react";
import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const IdentificationInformation = () => {
  const [showPassportFields, setShowPassportFields] = useState(false);
  const [showVisaFields, setShowVisaFields] = useState(false);
  const [showInsuranceFields, setShowInsuranceFields] = useState(false);

  return (
    <div className="screen flex justify-center">
      <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
        <div className="flex justify-center flex-grow h-[80vh] overflow-y-auto">
          <div className="md:mx-auto w-full md:max-w-3xl">
            <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
              Identification Details
            </h2>
            <hr />
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              ID card
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="living_country_id_no" />
              </div>
              <div className="w-full md:w-[48%]">
                <SelectComponent name="place_of_issuance" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="id_issuance_date" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="id_expiry_date" />
              </div>
              <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                <input type="file" name="id_front" id="" />
              </div>
              <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                <input type="file" name="id_back" id="" />
              </div>
            </div>
            {/* Passport details */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showPassportFields}
                onChange={() => setShowPassportFields(!showPassportFields)}
              />
              <label className="ml-2">Passport Details</label>
            </div>
            {showPassportFields && (
              <>
                <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                  Passport
                </h2>
                <div className="flex flex-wrap gap-x-3">
                  <div className="w-full md:w-[48%]">
                    <TextInput name="passport_number" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <SelectComponent name="Passport_Issuance_Country" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="Passport_Issuance_Date" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="Passport_Expiry_Date" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="passport_copy" id="" />
                  </div>
                </div>
              </>
            )}
            {/* visa details */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showVisaFields}
                onChange={() => setShowVisaFields(!showVisaFields)}
              />
              <label className="ml-2">Visa Details</label>
            </div>
            {showVisaFields && (
              <>
                <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                  Visa
                </h2>
                <div className="flex flex-wrap gap-x-3">
                  <div className="w-full md:w-[48%]">
                    <TextInput name="entry_permit_number" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <SelectComponent name="country_of_visa_issuance" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <TextInput name="uid_number" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <SelectComponent name="visa_type" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="visa_issuance_date" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="visa_expiry_date" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <TextInput name="visa_duration" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="visa_country_entry_date" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="visa_country_exit_date" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="enter_permit" id="" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="visa_page" id="" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="medical" id="" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="id_application" id="" />
                  </div>
                </div>
              </>
            )}
            {/* insurance details */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showInsuranceFields}
                onChange={() => setShowInsuranceFields(!showInsuranceFields)}
              />
              <label className="ml-2">Insurance Details</label>
            </div>
            {showInsuranceFields && (
              <>
                <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                  Insurance
                </h2>
                <div className="flex flex-wrap gap-x-3">
                  <div className="w-full md:w-[48%]">
                    <TextInput name="dha_id" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <TextInput name="card_number" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <TextInput name="insurance_policy" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <TextInput name="insurance_company" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="insurance_active_date" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <DateInput name="insurance_expiry_date" />
                  </div>
                  <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
                    <input type="file" name="insurance_card" id="" />
                  </div>
                </div>
              </>
            )}
            <hr />

            <CustomButton label="Next" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationInformation;
