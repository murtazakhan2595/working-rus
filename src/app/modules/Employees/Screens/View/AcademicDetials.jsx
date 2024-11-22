import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { renderDate } from "utils/renderValues";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const AcademicInfo = ({
  educations,
  isEditable,
  employeeId,
  getDataByHooks,
}) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Academic Details</CardTitle>
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
          <div className="grid w-full grid-cols-1 gap-4 mb-4">
            {educations?.map((edu, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between w-full mb-7"
              >
                <div>
                  <div className="text-sm font-semibold text-black xl:text-base lg:text-base md:text-sm whitespace-nowrap">
                    {edu.institute_name || "------"}
                  </div>
                  <div className="text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                    {edu.education_level || "------"} in{" "}
                    {edu.program || "------"}
                  </div>
                  <div className="text-sm xl:text-base lg:text-base md:text-sm text-muted-foreground">
                    {renderDate(edu?.edu_start_date)} -{" "}
                    {renderDate(edu?.edu_end_date)}
                  </div>
                </div>
                <div>
                  {edu.education_body?.file && (
                    <a
                      download={edu.education_body?.name}
                      className="flex items-center gap-2 text-sm no-underline"
                      href={edu?.education_body?.file}
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
          currentClick={5}
        />
      )}
    </>
  );
};

export default AcademicInfo;
