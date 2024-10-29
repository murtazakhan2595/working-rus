import { getEmployeeData } from "app/hooks/employee";
import moment from "moment";
import { useEffect, useState } from "react";
import { getCountryFullName } from "utils/getValuesFromTables";
import PersonalInformation from "./sections/PersonalDetails";
import ExitDetails from "./sections/ExitDetails";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";
import ApplicationStatus from "./sections/ApplicationStatus";

const ExitRequestDetails = ({ userProfile, exitData, isTermination }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const exitInfo = [
    [
      { title: "First Name", data: userData.first_name },
      { title: "Last Name", data: userData?.last_name },
      {
        title: "Department",
        data: <DepartmentName value={userData?.department_name} />,
      },
      {
        title: "Designation",
        data: <DesignationName value={userData?.department_position} />,
      },
    ],
    [
      {
        title: "Report to",
        data: <ManagerName value={userData?.direct_report} />,
      },
      { title: "Work Type", data: userData?.employee_work_type },
      // { title: "Organization", data: exitData?.organization[0] },
      { title: "Phone no.", data: userData?.mobile_no },
    ],
  ];
  console.log("exitInfo", exitInfo);
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      let empData = await getEmployeeData(userProfile.id);
      console.log("emp data at exit", empData);
      setUserData(empData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <div>
      <div className="justify-between items-start inline-flex w-full mb-4">
        <h4 className="text-xl">
          Exit Request
        </h4>
        <ApplicationStatus row={exitData} />
      </div>
      {!loading && (
        <PersonalInformation
          isEditable={false}
          personalInfo={exitInfo}
          userData={userData}
          getDataByHooks={getDataByHooks}
        />
      )}
      <ExitDetails exitData={exitData} />
    </div>
  );
};

export default ExitRequestDetails;
