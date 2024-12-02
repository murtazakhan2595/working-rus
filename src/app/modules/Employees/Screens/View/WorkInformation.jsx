import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import {
  DepartmentName,
  DesignationName,
  ManagerName,
  getCountryFullName,
  getWorkPlaceType,
} from "utils/getValuesFromTables";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

import { renderDate } from "utils/renderValues";

const WorkInformation = ({
  userData,
  isEditable,
  employeeId,
  getDataByHooks,
}) => {
  const workInformation = [
    {
      title: "Department",
      data: <DepartmentName value={userData?.department_name} />,
    },

    {
      title: "Position",
      data: <DesignationName value={userData?.department_position} />,
    },
    { title: "Work Email", data: userData?.work_email },
    { title: "Employee Type", data: userData?.employee_type },

    { title: "Employee Status", data: userData?.employee_status },
    { title: "Work Type", data: getWorkPlaceType(userData?.employee_work_type) },
    {
      title: "Work Location",
      data: getCountryFullName(userData?.employee_location),
    },
    {
      title: "Direct Report To",
      data: <ManagerName value={userData?.direct_report} />,
    },
    {
      title: "Joining Date",
      data: renderDate(userData?.joining_date),
    },
  ];
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Job Details</CardTitle>
            {isEditable && (
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    setShowPersonalDetailCard(true);
                  }}
                >
                  <CiEdit className="text-2xl cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex items-center pt-6 space-x-4">
          <div className="grid w-full lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
            {workInformation.map((info, index) => (
              <div className="flex flex-row w-full gap-2" key={index}>
                <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000">
                  {info.title}
                </div>
                <div className="flex-1 text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                  {info.data || "N/A"}
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
          employeeId={userData.id}
          currentClick={8}
        />
      )}
    </>
  );
};

export default WorkInformation;
