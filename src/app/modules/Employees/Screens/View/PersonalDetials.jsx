import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  getCountryFullName,
  getBloodGroup,
  getGender,
} from "utils/getValuesFromTables";
import moment from "moment";
import { renderDate } from "utils/renderValues";
import { PageLoader } from "components";
import { getEmployeeData } from "app/hooks/employee";
import { DetailBox } from "components/SheetCardExtension";

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
        { title: "Gender", data: getGender(userData?.gender) },
        { title: "Blood Group", data: getBloodGroup(userData?.blood_group) },
        { title: "Mother Name", data: userData?.mother_name },
        {
          title: "Date of Birth",
          data: renderDate(userData?.date_of_birth),
        },
        {
          title: "Contact No",
          data: `+${userData?.country_code}${userData?.mobile_no}`,
        },
        {
          title: "Permanent Address",
          data: userData?.residential_address,
          className: "col-span-4",
        },
        {
          title: "Present Address",
          data: userData?.current_address,
          className: "col-span-4",
        },
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
            <CardTitle className="text-primary">
              Personal Information{" "}
            </CardTitle>
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
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="grid w-full lg:grid-cols-4 gap-4 md:grid-cols-3 grid-cols-2">
              {personalInfo.map(({ className, title, data }, index) => (
                <DetailBox
                  orientation="horizontal"
                  key={index}
                  className={className || ""}
                  label={title}
                  value={data}
                  fallbackText={"--"}
                />
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
