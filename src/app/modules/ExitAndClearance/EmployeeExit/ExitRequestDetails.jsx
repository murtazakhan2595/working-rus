import { getEmployeeData } from "app/hooks/employee";
import moment from "moment";
import { useEffect, useState } from "react";
import { getCountryFullName } from "utils/getValuesFromTables";
import PersonalInformation from "./sections/PersonalDetails";
import ExitDetails from "./sections/ExitDetails";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";

const ExitRequestDetails = ({ exitData, reloadData = () => {} }) => {
  return (
    <div className="flex flex-col gap-5">
      <PersonalInformation reloadData={reloadData} />
      <ExitDetails exitData={exitData} />
    </div>
  );
};

export default ExitRequestDetails;
