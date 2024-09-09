import { getEmployeeData } from "app/hooks/employee";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ResignationStatusView,
  PersonalInformation,
  TerminationStatusView,
} from "./Sections";
import ExitDetails from "./Sections/ExitDetails";
import {
  DepartmentName,
  DesignationName,
  ManagerName,
} from "utils/getValuesFromTables";

const ExitRequestDetails = ({ userDetails, exitData, isTermination }) => {
  const [loading, setLoading] = useState(false);
  const exitInfo = [
    [
      { title: "First Name", data: userDetails.first_name },
      { title: "Last Name", data: userDetails?.last_name },
      {
        title: "Department",
        data: <DepartmentName value={userDetails?.department_name} />,
      },
      {
        title: "Designation",
        data: <DesignationName value={userDetails?.department_position} />,
      },
    ],
    [
      {
        title: "Report to",
        data: <ManagerName value={userDetails?.direct_report} />,
      },
      {
        title: "Work Type",
        data: userDetails?.employee_work_type
          ?.toLowerCase()
          ?.split("_")
          .join(" "),
      },
      { title: "Organization", data: exitData?.organization },
      { title: "Phone no.", data: userDetails?.mobile_no },
    ],
  ];

  return (
    <div className="m-2 mt-0 bg-white p-10 rounded-b-md relative">
      <div className="h-[35px] justify-between items-start inline-flex w-full mb-4">
        <div className="text-[#323233] text-[22px] font-bold ">
          {isTermination ? "Termination Request" : "Exit Request"}
        </div>
        {isTermination ? (
          <TerminationStatusView row={exitData} buttonTitle={"View Status"} />
        ) : (
          <ResignationStatusView row={exitData} buttonTitle={"View Status"} />
        )}
      </div>
      {!loading && (
        <PersonalInformation
          isEditable={false}
          personalInfo={exitInfo}
          userData={userDetails}
        />
      )}
      <ExitDetails exitData={exitData} isTermination={isTermination} />
    </div>
  );
};

export default ExitRequestDetails;
