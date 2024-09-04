import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";

const PersonalInformation = ({
  personalInfo,
  userData,
  isEditable,
  getDataByHooks,
}) => {
  console.log("personal info",personalInfo);
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  return (
    <>
      <div className="w-full p-6 mb-6 bg-white border rounded-lg shadow">
        <div className="flex justify-between">
          <h2 className="text-lg">Personal Details</h2>
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
        <hr />
        <div className="flex flex-col py-4 lg:flex-row">
          {/* Image Section */}
          <div className="md:w-[25%] w-full flex flex-col items-start mb-6 lg:mb-0">
            {userData?.profile_picture?.file || userData?.profile_picture ? (
              <img
                src={
                  userData?.profile_picture?.file || userData?.profile_picture
                }
                alt="Profile"
                className="w-24 h-24 mb-4 rounded-full"
              />
            ) : (
              <div className="opacity-70">Profile</div>
            )}

            <div className="text-lg font-semibold">
              {userData.personalInformation?.first_name}{" "}
              {userData.personalInformation?.last_name}
            </div>
            <div className="opacity-70">
              ID: TXB-{userData.id?.toString().padStart(4, "0")}
            </div>
          </div>
          {/* Personal Info Sections */}
          <div className="flex flex-col w-full gap-8 overflow-visible lg:flex-row no-scrollbar whitespace-break-spaces">
            {personalInfo.map((infoGroup, index) => (
              <div key={index} className="flex flex-col w-full gap-4">
                {infoGroup.map((info) => (
                  <div className="flex w-full gap-3" key={info.title}>
                    <div className="opacity-60 w-[150px] lg:w-[40%]">
                      {info.title}
                    </div>
                    <div className="w-[calc(100%-150px)] lg:w-[60%]">
                      {info.data || "-----"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
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
