import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "app/modules/Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import { PageLoader } from "components";
import { getEmployeeVisaDetailData } from "app/hooks/employee";
import moment from "moment";
import { FiDownload } from "react-icons/fi";
import { getVisaLabel } from "utils/getVisaLabel";
import { getCountryFullName } from "utils/getValuesFromTables";

const IdentificationDetails = ({ isEditable, employeeId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [identificationDetails, setIdentificationDetails] = useState([]);
  console.log(employeeId, "898989");
  const [loading, setLoading] = useState(false);
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      const visaData = await getEmployeeVisaDetailData(employeeId);
      const identificationDetailsData = [
        ...[
          {
            title: "ID Details",
            fields: [
              {
                title: "Current Country ID",
                data: visaData.living_country_id_no,
              },
              { title: "Issuance Country", data: visaData.place_of_issuance },
              {
                title: "ID Issuance Date",
                data: moment(visaData.id_issuance_date, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                ),
              },
              {
                title: "ID Expiry Date",
                data: moment(visaData?.id_expiry_date, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                ),
              },
              {
                title: "ID Front Image",
                data: visaData?.id_front?.document?.file && (
                  <a
                    href={visaData.id_front.document.file}
                    download={visaData.id_front.document.name}
                    className="flex items-center no-underline text-black"
                  >
                    <FiDownload />
                  </a>
                ),
              },
              {
                title: "ID Back Image",
                data: visaData?.id_back?.document?.file && (
                  <a
                    href={visaData.id_back.document.file}
                    download={visaData.id_back.document.name}
                    className="flex items-center no-underline text-black"
                  >
                    <FiDownload />
                  </a>
                ),
              },
            ],
          },
        ],
        ...(visaData.is_passport_applicable
          ? [
              {
                title: "Passport Details",
                fields: [
                  {
                    title: "Passport Number",
                    data: visaData.passport_number,
                  },
                  {
                    title: "Issuance Country",
                    data: getCountryFullName(
                      visaData.Passport_Issuance_Country
                    ),
                  },
                  {
                    title: "Issuance Date",
                    data: moment(
                      visaData?.Passport_Issuance_Date,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY"),
                  },
                  {
                    title: "Expiry Date",
                    data: moment(
                      visaData?.Passport_Expiry_Date,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY"),
                  },
                  {
                    title: "Passport Copy",
                    data: visaData?.passport_copy?.document?.file && (
                      <a
                        href={visaData.passport_copy.document.file}
                        download={visaData.passport_copy.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                ],
              },
            ]
          : []),
        ...(visaData.is_insurance_applicable
          ? [
              {
                title: "Insurance Details",
                fields: [
                  { title: "DHA ID", data: visaData.dha_id },
                  { title: "Card Number", data: visaData.card_number },
                  {
                    title: "Insurance Policy",
                    data: visaData.insurance_policy,
                  },
                  {
                    title: "Insurance Company",
                    data: visaData.insurance_company,
                  },
                  {
                    title: "Active Date",
                    data: moment(
                      visaData?.insurance_active_date,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY"),
                  },
                  {
                    title: "Expiry Date",

                    data: moment(
                      visaData?.insurance_expiry_date,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY"),
                  },
                  {
                    title: "Insurance Card",
                    data: visaData?.insurance_card?.document?.file && (
                      <a
                        href={visaData.insurance_card.document.file}
                        download={visaData.insurance_card.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                ],
              },
            ]
          : []),
        ...(visaData.is_visa_applicable
          ? [
              {
                title: "Visa Details",
                fields: [
                  {
                    title: "Entry Permit Number",
                    data: visaData.entry_permit_number,
                  },
                  {
                    title: "Visa Type",
                    data: getVisaLabel(visaData.visa_type),
                  },
                  {
                    title: "Issuance Country",
                    data: getCountryFullName(visaData.country_of_visa_issuance),
                  },
                  {
                    title: "Issuance Date",
                    data: moment(
                      visaData.visa_issuance_date,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY"),
                  },
                  {
                    title: "Expiry Date",
                    data: moment(visaData.visa_expiry_date).format(
                      "DD-MM-YYYY"
                    ),
                  },
                  { title: "Visa Duration", data: visaData.visa_duration },
                  {
                    title: "Visa Country Entry Date",
                    data: moment(visaData.visa_country_entry_date).format(
                      "DD-MM-YYYY"
                    ),
                  },
                  {
                    title: "Visa Country Exit Date",
                    data: moment(visaData.visa_country_exit_date).format(
                      "DD-MM-YYYY"
                    ),
                  },
                  { title: "UID Number", data: visaData.uid_number },
                  {
                    title: "Entry Permit",
                    data: visaData?.enter_permit?.document?.file && (
                      <a
                        href={visaData.enter_permit.document.file}
                        download={visaData.enter_permit.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "Visa Page",
                    data: visaData?.visa_page?.document?.file && (
                      <a
                        href={visaData.visa_page.document.file}
                        download={visaData.visa_page.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "Medical Result",
                    data: visaData?.medical?.document?.file && (
                      <a
                        href={visaData.medical.document.file}
                        download={visaData.medical.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "ID Application",
                    data: visaData?.id_application?.document?.file && (
                      <a
                        href={visaData.id_application.document.file}
                        download={visaData.id_application.document.name}
                        className="flex items-center no-underline text-black"
                      >
                        <FiDownload />
                      </a>
                    ),
                  },
                ],
              },
            ]
          : []),
      ];
      setIdentificationDetails(identificationDetailsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getDataByHooks();
  }, [employeeId]);
  return (
    <>
      <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl">Identification Details</h2>
          {isEditable && (
            <div
              className="flex gap-4 items-center"
              onClick={() => {
                setShowPersonalDetailCard(true);
              }}
            >
              <CiEdit className="text-2xl cursor-pointer opacity-80" />
            </div>
          )}
        </div>
        <hr />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          {identificationDetails.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              {section.fields.map((field, fieldIndex) => (
                <div className="flex justify-between mb-2" key={fieldIndex}>
                  <div className="opacity-60 w-1/2">{field.title}</div>
                  <div className="w-1/2">{field.data || "-----"}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {showPersonalDetailCard && (
        <EmployeeDetailModal
          openModal={showPersonalDetailCard}
          closeModal={() => {
            setShowPersonalDetailCard(false);
            getDataByHooks();
          }}
          employeeId={employeeId}
          currentClick={7}
        />
      )}
    </>
  );
};

export default IdentificationDetails;
