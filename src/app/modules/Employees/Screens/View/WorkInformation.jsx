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
import moment from "moment";

const WorkInformation = ({
  userData,
  isEditable,
  employeeId,
  getDataByHooks,
}) => {
  const workInformation = [
    [
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
    ],
    [
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
    ],
    [
      { title: "Department Head", data: userData?.department_manager },
      {
        title: "Joining Date",
        data: moment(userData?.joining_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
    ],
  ];
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl">Work Information</h2>
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
        <hr />
        <div className="flex flex-col 1100:flex-row py-4 overflow-auto no-scrollbar">
          {workInformation.map((infoGroup, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-col gap-4 w-full 1100:w-1/3 pt-5"
            >
              {infoGroup.map((info) => (
                <div className="flex w-full gap-3" key={info.title}>
                  <div className="opacity-60 w-1/2 1100:w-[35%]">
                    {info.title}
                  </div>
                  <div className="w-1/2 1100:w-[65%]">
                    {info.data || "-----"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {showPersonalDetailCard && (
        <EmployeeDetailModal
          openModal={showPersonalDetailCard}
          closeModal={() => {
            setShowPersonalDetailCard(false);
            getDataByHooks();
          }}
          employeeId={employeeId}
          currentClick={8}
        />
      )}
    </>
  );
};

export default WorkInformation;
