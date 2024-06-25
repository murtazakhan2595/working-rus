import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import moment from "moment";

const AcademicInfo = ({ educations, isEditable,employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <> 
      <div className="bg-white shadow border w-full rounded-lg p-4 mb-6">
      <div className="flex justify-between">
      </div>
      <div className="flex justify-between"onClick={() => {
            setShowPersonalDetailCard(true);
          }}>
        <h2 className="text-xl">Academic Detials</h2>
        {isEditable &&
          <div className="flex gap-4 items-center">
          <FiPlus className="text-lg cursor-pointer opacity-80" />
          <CiEdit className="text-2xl cursor-pointer opacity-80" />
        </div>
        }
      </div>
      <hr />
      <div className="py-4 overflow-auto no-scrollbar">
        {educations?.map((edu, index) => (
          <div key={index} className="w-full flex flex-wrap justify-between mb-7">
            <div>
              <div className="text-lg mb-2">
                {edu.institute_name || "------"}
              </div>
              <div className="text-lg opacity-80">
                {edu.education_level || "------"} in {edu.program || "------"}
              </div>
              <div className="opacity-70">
                {moment(edu?.edu_start_date, "YYYY-MM-DD").format(
                  "DD MMMM, YYYY"
                )
                || "00-00-0000"} -{" "}
                {moment(edu?.edu_end_date, "YYYY-MM-DD").format(
                  "DD MMMM, YYYY"
                )
                || "00-00-0000"}
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
    </div>
    {showPersonalDetailCard && (
      <EmployeeDetailModal
        openModal={showPersonalDetailCard}
        closeModal={() => {
          setShowPersonalDetailCard(false);
          getDataByHooks()
        }}
        employeeId={employeeId}
        currentClick={5}
      />
    )}
  </>
  );
};

export default AcademicInfo;
