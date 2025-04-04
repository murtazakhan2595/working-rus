import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { renderDate } from "utils/renderValues";
import { getEmployeeCerficationData } from "app/hooks/employee";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader } from "components";
import { getFileNameFromURL } from "utils/downloadUtils";

const Certifications = ({ isEditable, employeeId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [certifications, setCertifications] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const getDataByHooks = async () => {
    setIsLoading(true);
    try {
      const certificationData = await getEmployeeCerficationData(employeeId);
      setCertifications(
        certificationData &&
          certificationData?.length > 0 &&
          certificationData[0]?.id
          ? certificationData
          : null
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  console.log(certifications);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">
              Certification and License
            </CardTitle>
            {isEditable && (
              <div
                className="flex items-center gap-4"
                onClick={() => {
                  setShowPersonalDetailCard(true);
                }}
              >
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
              </div>
            )}
          </div>
        </CardHeader>
        {isLoading ? (
          <PageLoader />
        ) : (
          <CardContent className="flex items-center pt-6 space-x-4">
            <div className="grid w-full grid-cols-1 gap-4 mb-4">
              {certifications ? (
                certifications?.map((cer, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap justify-between w-full mb-7"
                  >
                    <div>
                      <div className="text-base font-semibold text-black whitespace-nowrap">
                        {cer.certification_institute ||
                          "Cetitification Institute (N/A)"}
                      </div>
                      <div className="text-base text-black">
                        {cer.certification_name || "Certification Name (N/A)"}
                      </div>
                      <div className="text-base text-black">
                        {renderDate(cer.completion_date)}
                        {cer.expiry_date
                          ? ` - ${renderDate(cer.expiry_date)}`
                          : ""}
                      </div>
                    </div>
                    <div>
                      {cer.certification_body && (
                        <a
                          download={getFileNameFromURL(cer.certification_body)}
                          className="flex items-center gap-2 text-sm no-underline"
                          href={cer?.certification_body}
                          target="_blank"
                        >
                          Certification <FiDownload />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                  No Certifications yet.
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
      {showPersonalDetailCard && (
        <EmployeeDetailModal
          openModal={showPersonalDetailCard}
          closeModal={() => {
            setShowPersonalDetailCard(false);
            getDataByHooks();
          }}
          employeeId={employeeId}
          currentClick={6}
        />
      )}
    </>
  );
};

export default Certifications;
