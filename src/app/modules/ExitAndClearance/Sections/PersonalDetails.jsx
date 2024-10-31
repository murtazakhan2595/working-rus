import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
// import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";

const PersonalInformation = ({
  personalInfo,
  userData,
}) => {
  return (
    <>
      <div className="bg-white  border w-full rounded-lg p-6 mb-6">
        <div className="flex justify-between">
          <h2 className="text-neutral-1200 text-xl font-bold">
            Employee Information
          </h2>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row py-4">
          {/* Image Section */}
          <div className="md:w-[25%] w-full flex flex-col items-start mb-6 lg:mb-0">
            {userData?.profile_picture?.file || userData?.profile_picture ? (
              <img
                src={
                  userData?.profile_picture?.file || userData?.profile_picture
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            ) : (
              <div className="opacity-70">Profile</div>
            )}

            <div className="font-semibold text-lg">
              {userData.personalInformation?.first_name}{" "}
              {userData.personalInformation?.last_name}
            </div>
            <div className="opacity-70">
              ID: TXB-{userData.id?.toString().padStart(4, "0")}
            </div>
          </div>
          {/* Personal Info Sections */}
          <div className="w-full flex flex-col lg:flex-row gap-8 overflow-visible no-scrollbar whitespace-break-spaces">
            {personalInfo.map((infoGroup, index) => (
              <div key={index} className="w-full flex flex-col gap-4">
                {infoGroup.map((info) => (
                  <div className="flex w-full gap-3" key={info.title}>
                    <div className="opacity-60 w-[150px] lg:w-[40%]">
                      {info.title}
                    </div>
                    <div className="w-[calc(100%-150px)] lg:w-[60%] capitalize">
                      {info.data || "-----"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
