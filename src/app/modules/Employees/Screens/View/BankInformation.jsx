import React, { useState, useEffect } from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { CiEdit } from "react-icons/ci";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader } from "components";
import { getEmployeeData } from "app/hooks/employee";
import { DetailBox } from "components/SheetCardExtension";

const BankInformation = ({ isEditable, userId }) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [personalInfo, setPersonalInfo] = React.useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getDataByHooks = async () => {
    setIsLoading(true);
    try {
      let userData = await getEmployeeData(userId);
      setPersonalInfo([
        { title: "IBAN Number", data: userData.account_iban },
        { title: "Bank Name", data: userData?.bank_name },
        {
          title: "Account Title",
          data: userData?.account_title,
        },
        { title: "Branch Code", data: userData?.branch_code },
        { title: "Account Number", data: userData?.account_number },
        { title: "Routing Code", data: userData?.swift_code },
        {
          title: "Branch Address",
          data: userData?.branch_address,
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
          currentClick={3}
        />
      )}
    </>
  );
};

export default BankInformation;
