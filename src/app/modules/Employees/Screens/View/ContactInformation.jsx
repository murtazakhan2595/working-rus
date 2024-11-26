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
    {
      titile: "Emergency Contact",
      fields: [
        {
          title: "Full Name",
          data: userData?.emergency_first_name,
        },
        { title: "Relation", sub: true, data: userData?.emergency_relation },
        { title: "Emergency Contact", data: userData?.emergency_phone_no },
      ],
    },
    {
      titile: "Permanent Address",
      fields: [
        { title: "Address", data: userData?.emergency_permanent_address },
      ],
    },
    {
      titile: "Present Address",
      fields: [{ title: "Address", data: userData?.emergency_current_address }],
    },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Contact Information</CardTitle>
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
          <div className="grid w-full lg:grid-cols-3 gap-4 grid-cols-1 gap-4 mb-4">
            {contactInformation.map((contactInfo, index) => (
              <div key={index}>
                <div className="text-[#111827] text-sm font-semibold whitespace-nowrap py-3">
                  {contactInfo.titile}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {contactInfo &&
                    contactInfo.fields &&
                    contactInfo.fields.map((info, infoIndex) => (
                      <div className="flex w-full gap-3" key={infoIndex}>
                        <div className="text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000">
                          {info.title}
                        </div>
                        <div className="text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                          {info.data || "N/A"}
                        </div>
                      </div>
                    ))}
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
