import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const Experience = ({ experience, isEditable, employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
     <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Experience</CardTitle>
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
          {experience?.map((exp, index) => (
            <div key={index} className="w-full mb-7">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">{exp.exp_organization || "N/A"}</div>
                {exp?.exp_letter && (
                  <a
                    download={exp?.exp_letter[0]?.name}
                    className="text-sm flex gap-2 items-center no-underline"
                    href={exp?.exp_letter[0].file}
                  >
                    Experience Letter <FiDownload />
                  </a>
                )}
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[250px] mb-3 md:mb-0">
                  <div className="text-base text-muted-foreground">
                    {exp.exp_designation || "------"}
                  </div>
                  <div className="text-base text-muted-foreground">
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
                <div className="md:w-[calc(100%-250px)] text-base text-muted-foreground">
                  {exp.exp_discription || "--------"}
                </div>
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
