import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { getCountryFullName } from "utils/getValuesFromTables";
import moment from "moment";
const PersonalInformation = ({ userData, isEditable, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const personalInfo = [
    { title: "First Name", data: userData.first_name },
    { title: "ID Card No", data: userData?.nic },
    { title: "Nationality", data: getCountryFullName(userData?.nationality) },
    { title: "Father Name", data: userData?.father_name },
    { title: "Last Name", data: userData?.last_name },
    { title: "Email Address", data: userData?.other_email },
    { title: "Marital Status", data: userData?.marital_status },
    { title: "Mother Name", data: userData?.mother_name },
    {
      title: "Date of Birth",
      data: moment(userData.date_of_birth).format("MMM DD, YYYY"),
    },
    { title: "Contact No", data: userData?.mobile_no },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Personal Information</CardTitle>
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
          <div className="grid grid-cols-3 gap-4 mb-4 md:grid-cols-3">
            {personalInfo.map((info, index) => (
              <div className="flex w-full gap-3" key={index}>
                <div className="w-[150px] lg:w-[40%] text-base text-muted-foreground">
                  {info.title}
                </div>
                <div
                  className="w-[calc(100%-150px)] lg:w-[60%] text-base text-black"
                  style={{ overflowWrap: "break-word" }}
                >
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
          currentClick={1}
        />
      )}
    </>
  );
};

export default PersonalInformation;
