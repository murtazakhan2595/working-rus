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
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

const ContactInformation = ({
  userData,
  isEditable,
  employeeId,
  getDataByHooks,
}) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const contactInformation = [
    { title: "Emergency Contact", data: userData?.emergency_phone_no },
    {
      title: "Full Name",
      sub: true,
      data:
        // userData?.emergency_first_name + " " + userData?.emergency_last_name,
        userData?.emergency_first_name,
    },
    { title: "Relation", sub: true, data: userData?.emergency_relation },
    { title: "Permanent Address", data: userData?.residential_address },
    { title: "Present Address", data: userData?.current_address },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
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
        </CardHeader>
        <CardContent className="flex items-center pt-6 space-x-4">
          <div className="grid grid-cols-3 gap-4 mb-4 md:grid-cols-3">
            {contactInformation.map((contactInfo, index) => (
              <div className="flex w-full gap-3" key={index}>
                <div
                  className={`opacity-60 w-[50%] 500:w-[35%] ${
                    contactInfo?.sub && "pl-2 flex"
                  }`}
                >
                  {contactInfo?.sub && (
                    <FiCornerDownRight className="mr-2 mt-[0.23rem" />
                  )}{" "}
                  {contactInfo.title}
                </div>
                <div className="500:w-[65%] w-[50%]">
                  {" "}
                  {contactInfo.data || "N/A"}
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
          employeeId={employeeId}
          currentClick={2}
        />
      )}
    </>
  );
};

export default ContactInformation;
