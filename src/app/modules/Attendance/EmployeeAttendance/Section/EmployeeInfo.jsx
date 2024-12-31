import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar";
import {
  EmployeeID,
  EmployeeName,
  DepartmentName,
  DesignationName,
} from "utils/getValuesFromTables";
import { useSelector } from "react-redux";

const EmployeeInfo = ({user}) => {
  if (!user) return null;
  return (
    <div className="flex justify-start flex-col">
      <Avatar
        className="h-14 w-14"
        src={user.profile_picture}
        fallbackText={`${user.first_name?.charAt(
          0
        )}${user.last_name?.charAt(0)}`}
        text={`${user.name}`}
        alt={user.first_name?.charAt(0).toUpperCase()}
      />
      <div className="flex flex-col mt-4 flex-wrap whitespace-break-spaces">
        <div className="text-neutral-1000 text-xs font-normal">
          <EmployeeID value={user.id} />
        </div>
        <div className="font-large capitalize text-lg text-neutral-1200">
          <EmployeeName value={user.id} />
        </div>
        <div className="text-sm flex flex-col items-start gap-1 ">
          <DesignationName value={user.department_position} /> |{" "}
          <DepartmentName value={user.department_name} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
