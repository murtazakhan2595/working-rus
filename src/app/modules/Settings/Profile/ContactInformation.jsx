import React from "react";
import { FiCornerDownRight } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";

const ContactInformation = ({ contactInformation }) => {

  return (
    <div className="bg-white shadow border 800:w-1/2 w-full rounded-lg p-4 mb-6">
      <div className="flex justify-between">
        <h2 className="text-xl">Contact Information</h2>
        <div className="flex gap-4 items-center">
          <CiEdit className="text-2xl cursor-pointer opacity-80" />
        </div>
      </div>
      <hr />

      {/* ****************************** Bank Info **************************** */}
      <div className="flex w-full pt-5">

        <div className="flex flex-col gap-4 w-full no-scrollbar">
          {contactInformation.map((contactInfo,index) => (
            <div className="flex w-full gap-3" key={index}>
              <div className={`opacity-60 w-[50%] 500:w-[35%] ${contactInfo?.sub && "pl-2 flex"}`}>{contactInfo?.sub && <FiCornerDownRight/>} {contactInfo.title}</div>
              <div className="500:w-[65%] w-[50%]"> {contactInfo.data || "-----"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;


