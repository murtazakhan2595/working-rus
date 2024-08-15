import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import moment from "moment";
import { PageLoader } from "components";
import { getEmployeeCerficationData } from "app/hooks/employee";

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
      {loading ? (
        <PageLoader />
      ) : (
        <div className="bg-white shadow border w-full rounded-lg p-4 mb-6">
          <div className="flex justify-between">
            <h2 className="text-xl">Certification and License</h2>
            {isEditable && (
              <div
                className="flex gap-4 items-center"
                onClick={() => {
                  setShowPersonalDetailCard(true);
                }}
              >
                <FiPlus className="text-lg cursor-pointer opacity-80" />
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
              </div>
            )}
          </div>
          <hr />
          <div className="py-4 overflow-auto no-scrollbar">
            {certifications?.map((cer, index) => (
              <div
                key={index}
                className="w-full flex flex-wrap justify-between mb-7"
              >
                <div>
                  <div className="text-lg mb-2">
                    {cer.certification_name || "------"}
                  </div>
                  <div className="text-lg opacity-80">
                    {cer.certification_institute || "------"}
                  </div>
                  <div className="opacity-70">
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
                      className="flex items-center gap-x-2 mb-3 text-sm opacity-50 py-2 mt-2 font-semibold border border-black rounded-lg font-opensans px-4 no-underline text-black"
                      href={cer?.certification_body?.file}
                    >
                      {" "}
                      Certification <FiDownload />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
