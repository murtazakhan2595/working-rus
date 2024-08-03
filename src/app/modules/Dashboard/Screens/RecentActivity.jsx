import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { GoPeople } from "react-icons/go";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getEmployeeCustomList } from "app/hooks/general";


function RecentActivity() {
 
  return (
    <section className="flex flex-col items-center gap-6 px-[14px] pt-6 bg-white rounded-md h-full">
      <div className=" justify-between items-center inline-flex w-full">
        <div className="items-center gap-3 flex">
          {/* <GoPeople className="text-lg font-bold" /> */}
          <div className="text-[#323233] text-lg font-normalleading-tight">
          Recent Activity
          </div>
        </div>
       
      </div>

    </section>
  );
}

export default RecentActivity;
