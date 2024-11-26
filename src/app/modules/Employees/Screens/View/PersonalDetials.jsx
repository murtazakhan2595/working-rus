import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { getCountryFullName } from "utils/getValuesFromTables";
import moment from "moment";
import { PageLoader } from "components";
import { getEmployeeData } from "app/hooks/employee";
const PersonalInformation = ({ userId, isEditable }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [personalInfo, setPersonalInfo] = React.useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getDataByHooks = async () => {
    setIsLoading(true);
    try {
      let userData = await getEmployeeData(userId);
      setPersonalInfo([
        { title: "First Name", data: userData.first_name },
        { title: "ID Card No", data: userData?.nic },
        {
          title: "Nationality",
          data: getCountryFullName(userData?.nationality),
        },
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
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Personal Information</CardTitle>
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
        {isLoading ? (
          <PageLoader />
        ) : (
          <CardContent className="flex items-center pt-6 space-x-4">
            <div className="grid w-full lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
              {personalInfo.map((info, index) => (
                <div className="flex flex-row w-full gap-2" key={index}>
                  <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
                    {info.title}
                  </div>
                  <div className="flex-1 text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                    {info.data || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      {showPersonalDetailCard && (
        <EmployeeDetailModal
          openModal={showPersonalDetailCard}
          closeModal={() => {
            setShowPersonalDetailCard(false);
            getDataByHooks();
          }}
          employeeId={userId}
          currentClick={1}
        />
      )}
    </>
  );
};

export default PersonalInformation;
