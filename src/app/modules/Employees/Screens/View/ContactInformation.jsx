import React, { useState } from "react";
import { FiCornerDownRight } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";

const ContactInformation = ({ contactInformation, isEditable, employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);

  return (
    <> 
     <div className="bg-white shadow border 800:w-1/2 w-full rounded-lg p-4 mb-6">
      <div className="flex justify-between">
        <h2 className="text-xl">Contact Information</h2>
        {isEditable &&
          <div className="flex gap-4 items-center" onClick={() => {
            setShowPersonalDetailCard(true);
          }}>
            <CiEdit className="text-2xl cursor-pointer opacity-80" />
          </div>
        }
      </div>
      <hr />

      {/* ****************************** Bank Info **************************** */}
      <div className="flex w-full pt-5">

        <div className="flex flex-col gap-4 w-full no-scrollbar">
          {contactInformation.map((contactInfo, index) => (
            <div className="flex w-full gap-3" key={index}>
              <div className={`opacity-60 w-[50%] 500:w-[35%] ${contactInfo?.sub && "pl-2 flex"}`}>{contactInfo?.sub && <FiCornerDownRight className="mr-2 mt-[0.23rem" />} {contactInfo.title}</div>
              <div className="500:w-[65%] w-[50%]"> {contactInfo.data || "-----"}</div>
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
            getDataByHooks()
          }}
          employeeId={employeeId}
          currentClick={2}
        />
      )}
    </>
  );
};

export default ContactInformation;


