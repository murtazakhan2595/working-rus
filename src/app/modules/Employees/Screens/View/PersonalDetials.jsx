import React, { useState, useEffect } from "react";

const PersonalInformation = ({ personalInfo, userData }) => {

  return (
    <>
      <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
        <h2 className="text-xl mb-4">Personal Details</h2>
        <hr />
        <div className="flex flex-col lg:flex-row py-4">
          {/* Image Section */}
          <div className="md:w-[25%] w-full flex flex-col items-start mb-6 lg:mb-0">
            <img
              src={userData.personalInformation?.profile_picture?.file || userData.personalInformation?.profile_picture}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div className="font-semibold text-lg">
              {userData.personalInformation?.first_name} {userData.personalInformation?.last_name}
            </div>
            <div className="opacity-70">
              ID: TXB-{userData.id?.toString().padStart(4, "0")}
            </div>
          </div>
          {/* Personal Info Sections */}
          <div className="lg:w-2/3 w-full flex flex-col lg:flex-row gap-8 overflow-auto no-scrollbar">
            {personalInfo.map((infoGroup, index) => (
              <div key={index} className="w-full flex flex-col gap-4">
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
    </>
  );
};

export default PersonalInformation;
