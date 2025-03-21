import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "app/modules/Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import { getEmployeeVisaDetailData } from "app/hooks/employee";
import { FiDownload } from "react-icons/fi";
import { getVisaLabel } from "utils/getVisaLabel";
import { renderDate } from "utils/renderValues";
import { getCountryFullName } from "utils/getValuesFromTables";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader } from "components";

const IdentificationDetails = ({ isEditable, employeeId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [identificationDetails, setIdentificationDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      const visaData = await getEmployeeVisaDetailData(employeeId);
      const identificationDetailsData = [
        ...[
          {
            title: "Identification Details",
            fields: [
              {
                title: "Current Country ID",
                data: visaData.living_country_id_no,
              },
              {
                title: "Issuance Country",
                data: getCountryFullName(visaData.place_of_issuance),
              },
              {
                title: "ID Issuance Date",
                data: renderDate(visaData.id_issuance_date),
              },
              {
                title: "ID Expiry Date",
                data: renderDate(visaData?.id_expiry_date),
              },
              {
                title: "ID Front Image",
                data: visaData?.id_front?.document && (
                  <a
                    href={visaData.id_front.document}
                    target="_blank"
                    download={visaData.id_front.document.name}
                    className="flex items-center text-black no-underline"
                  >
                    Download <FiDownload />
                  </a>
                ),
              },
              {
                title: "ID Back Image",
                data: visaData?.id_back?.document && (
                  <a
                    href={visaData.id_back.document}
                    download={visaData.id_back.document.name}
                    target="_blank"
                    className="flex items-center text-black no-underline"
                  >
                    Download <FiDownload />
                  </a>
                ),
              },
            ],
          },
        ],
        ...(visaData.is_license_applicable
          ? [
              {
                title: "License Details",
                fields: [
                  {
                    title: "License Number",
                    data: visaData.license_number,
                  },
                  {
                    title: "Issuance Country",
                    data: getCountryFullName(
                      visaData.license_Issuance_Country
                    ),
                  },
                  {
                    title: "Issuance Date",
                    data: renderDate(visaData?.license_Issuance_Date),
                  },
                  {
                    title: "Expiry Date",
                    data: renderDate(visaData?.license_expiry_date),
                  },
                  {
                    title: "License Copy",
                    data: visaData?.license_copy?.document && (
                      <a
                        href={visaData.license_copy.document}
                        target="_blank"
                        download={visaData.license_copy.document.name}
                        className="flex items-center text-plum-900 no-underline"
                      >
                        Download <FiDownload />
                      </a>
                    ),
                  },
                ],
              },
            ]
          : []),
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
                    data: renderDate(visaData?.Passport_Issuance_Date),
                  },
                  {
                    title: "Expiry Date",
                    data: renderDate(visaData?.Passport_Expiry_Date),
                  },
                  {
                    title: "Passport Copy",
                    data: visaData?.passport_copy?.document && (
                      <a
                        href={visaData.passport_copy.document}
                        target="_blank"
                        download={visaData.passport_copy.document.name}
                        className="flex items-center text-black no-underline"
                      >
                        Download <FiDownload />
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
                    data: renderDate(visaData?.insurance_active_date),
                  },
                  {
                    title: "Expiry Date",

                    data: renderDate(visaData?.insurance_expiry_date),
                  },
                  {
                    title: "Insurance Card",
                    data: visaData?.insurance_card?.document && (
                      <a
                        href={visaData.insurance_card.document}
                        target="_blank"
                        download={visaData.insurance_card.document.name}
                        className="flex items-center text-black no-underline"
                      >
                        Download
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
                    data: renderDate(visaData.visa_issuance_date),
                  },
                  {
                    title: "Expiry Date",
                    data: renderDate(visaData.visa_expiry_date),
                  },
                  { title: "Visa Duration", data: visaData.visa_duration },
                  {
                    title: "Visa Country Entry Date",
                    data: renderDate(visaData.visa_country_entry_date),
                  },
                  {
                    title: "Visa Country Exit Date",
                    data: renderDate(visaData.visa_country_exit_date),
                  },
                  { title: "UID Number", data: visaData.uid_number },
                  {
                    title: "Entry Permit",
                    data: visaData?.enter_permit?.document && (
                      <a
                        href={visaData.enter_permit.document}
                        target="_blank"
                        download={visaData.enter_permit.document.name}
                        className="flex items-center text-black no-underline"
                      >
                        Download <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "Visa Page",
                    data: visaData?.visa_page?.document && (
                      <a
                        href={visaData.visa_page.document}
                        download={visaData.visa_page.document.name}
                        target="_blank"
                        className="flex items-center text-black no-underline"
                      >
                        Download <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "Medical Result",
                    data: visaData?.medical?.document && (
                      <a
                        href={visaData.medical.document}
                        target="_blank"
                        download={visaData.medical.document.name}
                        className="flex items-center text-black no-underline"
                      >
                        Download <FiDownload />
                      </a>
                    ),
                  },
                  {
                    title: "ID Application",
                    data: visaData?.id_application?.document && (
                      <a
                        href={visaData.id_application.document}
                        target="_blank"
                        download={visaData.id_application.document.name}
                        className="flex items-center text-black no-underline"
                      >
                        Download <FiDownload />
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataByHooks();
  }, [employeeId]);
  if (loading) {
    return (
      <Card>
        <PageLoader />
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        {identificationDetails.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-primary">{section.title}</CardTitle>
                {isEditable && (
                  <div
                    className="flex items-center gap-4"
                    onClick={() => {
                      setShowPersonalDetailCard(true);
                    }}
                  >
                    <CiEdit className="text-2xl cursor-pointer" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex items-center pt-6 space-x-4">
              <div className="grid w-full grid-cols-1 gap-4 mb-4">
                {section &&
                  section.fields &&
                  section.fields.map((object, index) => (
                    <div className="flex justify-between mb-2 " key={index}>
                      <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                        {object.title}
                      </div>
                      <div className="w-1/2 text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                        {object.data || "N/A"}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
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
