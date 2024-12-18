import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar";
import {
  EmployeeID,
  EmployeeName,
  DepartmentName,
  DesignationName,
} from "utils/getValuesFromTables";
import { useSelector } from "react-redux";

const EmployeeInfo = () => {
  const userDetail = useSelector((state) => state.emp.user_details);
  if (!userDetail) return null;
  return (
    <div className="flex justify-start flex-col">
      <Avatar
        className="h-14 w-14"
        src={userDetail.profile_picture}
        fallbackText={`${userDetail.first_name?.charAt(
          0
        )}${userDetail.lasst_name?.charAt(0)}`}
        text={`${userDetail.first_name} ${userDetail.lasst_name}`}
        alt={userDetail.first_name?.charAt(0).toUpperCase()}
      />
      <div className="flex flex-col mt-4 flex-wrap whitespace-break-spaces">
        <div className="text-neutral-1000 text-xs font-normal">
          <EmployeeID value={userDetail.id} />
        </div>
        <div className="font-large capitalize text-neutral-1200">
          <EmployeeName value={userDetail.id} />
        </div>
        <div className="text-sm flex flex-col items-start gap-1 ">
          <DesignationName value={userDetail.department_position} /> |{" "}
          <DepartmentName value={userDetail.department_name} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
