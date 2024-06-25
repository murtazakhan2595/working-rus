import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { formatDate } from "../../../../hooks/employee";
import moment from "moment";

const Experience = ({ experience, isEditable, employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <div className="bg-white shadow border w-full rounded-lg p-4 mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl">Experience</h2>
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
          {experience?.map((exp, index) => (
            <div key={index} className="w-full mb-7">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-lg">{exp.exp_organization || "------"}</h3>
                {exp.exp_letter?.file && (
                  <a
                    download={exp.exp_letter?.name}
                    className="text-sm opacity-60 flex gap-2 items-center no-underline text-black"
                    href={exp.exp_letter.file}
                  >
                    Experience Letter <FiDownload />
                  </a>
                )}
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[250px] mb-3 md:mb-0">
                  <div className="text-lg opacity-80">
                    {exp.exp_designation || "------"}
                  </div>
                  <div className="opacity-80">
                    {moment(exp.exp_start_date, "YYYY-MM-DD").format(
                      "DD MMMM, YYYY"
                    ) || "00/00/0000"}{" "}
                    -{" "}
                    {exp.exp_end_date
                      ? moment(exp.exp_end_date, "YYYY-MM-DD").format(
                          "DD MMMM, YYYY"
                        )
                      : "Till date"}{" "}
                  </div>
                </div>
                <div className="md:w-[calc(100%-250px)] opacity-70">
                  {exp.exp_discription || "--------"}
                </div>
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
          currentClick={4}
        />
      )}
    </>
  );
};

export default Experience;
