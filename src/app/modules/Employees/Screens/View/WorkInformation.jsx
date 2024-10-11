import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import {
  DepartmentName,
  DesignationName,
  ManagerName,
  getCountryFullName,
} from "utils/getValuesFromTables";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

import moment from "moment";

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
    { title: "Work Type", data: userData?.employee_work_type },
    {
      title: "Work Location",
      data: getCountryFullName(userData?.employee_location),
    },
    {
      title: "Direct Report To",
      data: <ManagerName value={userData?.direct_report} />,
    },

    { title: "Department Head", data: userData?.department_manager },
    {
      title: "Joining Date",
      data: moment(userData?.joining_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
  ];
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Job Details</CardTitle>
            {isEditable && (
              <div className="flex gap-4 items-center">
                <FiPlus className="text-2xl cursor-pointer opacity-80" />
                <div
                  onClick={() => {
                    setShowPersonalDetailCard(true);
                  }}
                >
                  {" "}
                  <CiEdit className="text-2xl cursor-pointer opacity-80" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex items-center pt-6 space-x-4">
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3 w-full">
            {workInformation.map((info, index) => (
              <div className="flex w-full gap-3" key={index}>
                <div className="w-1/2 1100:w-[35%] text-base text-muted-foreground">
                  {info.title}
                </div>
                <div className="w-1/2 1100:w-[65%]text-base text-black"
                  style={{ overflowWrap: "break-word" }}>{info.data || "N/A"}</div>
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
          currentClick={1}
        />
      )}
    </>
  );
};

export default WorkInformation;
