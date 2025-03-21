import React, { useState } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import {
  DepartmentName,
  DesignationName,
  ManagerName,
  getCountryFullName,
  getWorkPlaceType,
  BranchName,
} from "utils/getValuesFromTables";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { DetailBox } from "components/SheetCardExtension";
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
    { title: "Brannch", data: <BranchName value={userData?.branch_id} /> },
    {
      title: "Position",
      data: <DesignationName value={userData?.department_position} />,
    },
    { title: "Work Email", data: userData?.work_email },
    { title: "Employee Type", data: userData?.employee_type },
    { title: "Employee Status", data: userData?.employee_status },
    {
      title: "Work Type",
      data: getWorkPlaceType(userData?.employee_work_type),
    },
    {
      title: "Work Location",
      data: getCountryFullName(userData?.employee_location),
    },
    {
      title: "Direct Report To",
      data: <ManagerName value={userData?.direct_report} />,
    },
    { title: "Joining Date", data: renderDate(userData?.joining_date) },
    ...(userData?.contract_start_date
      ? [
          {
            title: "Contract Start Date",
            data: renderDate(userData?.contract_start_date),
          },
        ]
      : []),
    ...(userData?.contract_end_date
      ? [
          {
            title: "Contract End Date",
            data: renderDate(userData?.contract_end_date),
          },
        ]
      : []),
  ].filter(Boolean); // Removes any undefined or falsy values

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
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="grid w-full lg:grid-cols-4 gap-4 md:grid-cols-3 grid-cols-2">
            {workInformation.map((info, index) => (
              <DetailBox
                 orientation="horizontal"
                key={index}
                className=""
                label={info.title}
                value={info.data}
                fallbackText={""}
              />
            ))}
          </div>
          <DetailBox
             orientation="horizontal"
            className=""
            label={"Job Description"}
            value={userData.jd_file}
            fallbackText={""}
          />
          <DetailBox
            orientation="horizontal"
            className=""
            label={"Job Kpis"}
            value={userData.kpi_file}
            fallbackText={""}
          />
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
