import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { renderDate } from "utils/renderValues";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const Experience = ({ experience, isEditable, employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
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
        <CardContent className="flex items-center pt-6 space-x-4">
          <div className="grid w-full grid-cols-1 gap-4 mb-4">
            {experience?.map((exp, index) => (
              <div key={index} className="w-full mb-7">
                <div className="flex flex-col justify-between mb-2 md:flex-row">
                  <div className="text-sm text-black break-all xl:text-base lg:text-base md:text-sm xl:break-normal lg:break-all md:break-all">
                    {exp.exp_organization || "N/A"}
                  </div>
                  {exp?.exp_letter && (
                    <a
                      download={exp?.exp_letter[0]?.name}
                      className="flex items-center gap-2 text-sm no-underline "
                      href={exp?.exp_letter[0].file}
                    >
                      {exp.exp_end_date ? `Experience Letter` : `Resume`}{" "}
                      <FiDownload />
                    </a>
                  )}
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="mb-3 md:mb-0">
                    <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                      {exp.exp_designation || "------"}
                    </div>
                    <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                      {renderDate(exp.exp_start_date)}-{" "}
                      {exp.exp_end_date
                        ? renderDate(exp.exp_end_date)
                        : "Till date"}{" "}
                    </div>
                  </div>
                  <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
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
