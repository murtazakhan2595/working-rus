import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import moment from "moment";
import { PageLoader } from "components";
import { getEmployeeCerficationData } from "app/hooks/employee";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const Certifications = ({ isEditable, employeeId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [certifications, setCertifications] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      const certificationData = await getEmployeeCerficationData(employeeId);
      setCertifications(certificationData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  console.log(certifications);
  if (certifications?.length <= 0) {
    return <></>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Certification and License</CardTitle>
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
        <CardContent className="flex items-center pt-6 space-x-4">
          <div className="grid grid-cols-1 gap-4 mb-4 w-full">
            {certifications?.map((cer, index) => (
              <div
                key={index}
                className="w-full flex flex-wrap justify-between mb-7"
              >
                <div>
                  <div className="text-[#111827] font-semibold whitespace-nowrap">
                    {cer.certification_institute || "N/A"}
                  </div>
                  <div className="text-base text-black">
                    {cer.certification_name || "N/A"}
                  </div>
                  <div className="text-base text-black">
                    {moment(cer.completion_date, "YYYY-MM-DD").format(
                      "DD MMMM, YYYY"
                    ) || "00-00-0000"}
                    {cer.expiry_date && " - "}
                    {moment(cer.expiry_date, "YYYY-MM-DD").format(
                      "DD MMMM, YYYY"
                    ) || ""}
                  </div>
                </div>
                <div>
                  {cer.certification_body?.file && (
                    <a
                      download={cer.certification_body?.name}
                      className="text-sm flex gap-2 items-center no-underline"
                      href={cer?.certification_body?.file}
                    >
                      Certification <FiDownload />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
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
