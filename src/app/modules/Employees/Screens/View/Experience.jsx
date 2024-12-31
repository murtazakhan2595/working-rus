import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { renderDate } from "utils/renderValues";
import { getEmployeeProfessionalExperianceData } from "app/hooks/employee";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { getFileNameFromURL } from "utils/downUtils";
import { PageLoader } from "components";

const Experience = ({ isEditable, employeeId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [experiences, setExperiences] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const getDataByHooks = async () => {
    setIsLoading(true);
    try {
      const expData = await getEmployeeProfessionalExperianceData(employeeId);
      setExperiences(
        Array.isArray(expData) && expData?.length > 0 && expData[0]?.id
          ? expData
          : null
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Experience</CardTitle>
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
              {experiences ? (
                experiences?.map((exp, index) => (
                  <div key={index} className="w-full mb-7">
                    <div className="flex flex-col justify-between mb-2 md:flex-row">
                      <div className="text-sm text-black break-all xl:text-base lg:text-base md:text-sm xl:break-normal lg:break-all md:break-all">
                        {exp.exp_organization || "N/A"}
                      </div>
                      {exp?.exp_letter && (
                        <a
                          download={getFileNameFromURL(exp?.exp_letter)}
                          target="_blank"
                          className="flex items-center gap-2 text-sm no-underline "
                          href={exp?.exp_letter}
                        >
                          {exp.exp_end_date ? `Experience Letter` : `Resume`}{" "}
                          <FiDownload />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row">
                      <div className="mb-3 md:mb-0">
                        <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                          {exp.exp_designation || "N/A"}
                        </div>
                        <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                          {renderDate(exp.exp_start_date)} -{" "}
                          {exp.exp_end_date
                            ? renderDate(exp.exp_end_date)
                            : "Till date"}
                        </div>
                      </div>
                      <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                        {exp.exp_discription}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                    Experience is not posted yet.
                  </div>
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
          currentClick={4}
        />
      )}
    </>
  );
};

export default Experience;
