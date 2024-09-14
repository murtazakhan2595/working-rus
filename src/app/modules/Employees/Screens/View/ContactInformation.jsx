/**
 * ContactInformation component
 * 
 * Renders a contact information card with editable functionality
 * 
 * @param {object} contactInformation - An array of contact information objects
 * @param {boolean} isEditable - Whether the contact information is editable or not
 * @param {number} employeeId - The ID of the employee
 * @param {function} getDataByHooks - A function to retrieve data using hooks
 * 
 * @returns {React.ReactElement} A React element representing the contact information card
 * 
 * Example:
 * 
 * const contactInformation = [
 *   { title: 'Email', data: 'john.doe@example.com' },
 *   { title: 'Phone', data: '123-456-7890' },
 *   { title: 'Address', data: '123 Main St, Anytown, USA' }
 * ];
 * 
 * <ContactInformation 
 *   contactInformation={contactInformation} 
 *   isEditable={true} 
 *   employeeId={123} 
 *   getDataByHooks={() => console.log('Data retrieved using hooks')} 
 * />
 */
import React, { useState } from "react";
import { FiCornerDownRight } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";

const ContactInformation = ({ contactInformation, isEditable, employeeId, getDataByHooks }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);

  return (
    <> 
     <div className="w-full p-4 mb-6 bg-white border rounded-lg shadow 800:w-1/2">
      <div className="flex justify-between">
        <h2 className="text-xl">Contact Information</h2>
        {isEditable &&
          <div className="flex items-center gap-4" onClick={() => {
            setShowPersonalDetailCard(true);
          }}>
            <CiEdit className="text-2xl cursor-pointer opacity-80" />
          </div>
        }
      </div>
      <hr />

      {/* ****************************** Bank Info **************************** */}
      <div className="flex w-full pt-5">
        <div className="flex flex-col w-full gap-4 no-scrollbar">
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


