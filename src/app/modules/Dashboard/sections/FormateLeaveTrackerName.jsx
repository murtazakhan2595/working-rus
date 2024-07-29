import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { EmployeeName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";

export default function FormateLeaveTrackerName({ row }) {
  const employeeName = EmployeeName({ value: row.employee_id });;
  const name = employeeName.props.children.toLowerCase();
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center gap-2 text-[#5c5e64] text-sm font-normal">
        <div
          className={`${getRandomColor(
            name?.charAt(0)
          )} text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10`}
          style={{ minWidth: "40px" }}
        >
          {name?.toUpperCase().charAt(0)}
        </div>
        <div className="h-[35px] flex-col justify-start items-start gap-[5px] inline-flex">
          <div className="text-[#323233] text-sm font-bold ">{row.name}</div>
          <div className="justify-start items-start gap-[5px] inline-flex">
            <div className="text-[#5c5e64] text-[11px] font-normal ">
              <DesignationName value={row.position} />
            </div>
            {/* <div className="text-[#5c5e64] text-[11px] font-normal ">|</div>
            <div className="text-[#5c5e64] text-[11px] font-normal "></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
