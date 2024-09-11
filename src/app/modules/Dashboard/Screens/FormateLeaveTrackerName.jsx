import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { EmployeeName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../src/@/components/ui/avatar"

export default function FormateLeaveTrackerName({ row }) {
  const employeeName = EmployeeName({ value: row.employee_id });;
  const name = employeeName.props.children.toLowerCase();
  return (
    <>
    <div className="flex items-center gap-2">
      <div className="flex flex-row items-center gap-4">
      <Avatar className="hidden h-14 w-14 sm:inline">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback className="flex items-center justify-center rounded-full border-plum-500 bg-plum-300">{name?.toUpperCase().charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-col flex-">
                <div className="font-medium"> {row.name}</div>
             <div   className="hidden text-sm text-muted-foreground md:inline">
             <DesignationName value={row.position}/>
             </div>
            
              </div>
              
      
      </div>
    </div>
     
  
   </>
  );
}
