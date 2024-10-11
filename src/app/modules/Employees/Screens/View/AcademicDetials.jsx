import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import moment from "moment";
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
            <CardTitle>Academic Details</CardTitle>
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
            {educations?.map((edu, index) => (
              <div
                key={index}
                className="w-full flex flex-wrap justify-between mb-7"
              >
                <div>
                  <div className="text-[#111827] font-semibold whitespace-nowrap">
                    {edu.institute_name || "------"}
                  </div>
                  <div className="text-base text-black">
                    {edu.education_level || "------"} in{" "}
                    {edu.program || "------"}
                  </div>
                  <div className="text-base text-muted-foreground">
                    {moment(edu?.edu_start_date, "YYYY-MM-DD").format(
                      "DD MMMM, YYYY"
                    ) || "00-00-0000"}{" "}
                    -{" "}
                    {moment(edu?.edu_end_date, "YYYY-MM-DD").format(
                      "DD MMMM, YYYY"
                    ) || "00-00-0000"}
                  </div>
                </div>
                <div>
                  {edu.education_body?.file && (
                    <a
                      download={edu.education_body?.name}
                      className="flex items-center gap-x-2 mb-3 text-sm opacity-50 py-2 mt-2 font-semibold border border-black rounded-lg font-opensans px-4 no-underline text-black"
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
