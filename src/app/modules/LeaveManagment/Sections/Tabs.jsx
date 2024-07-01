import React, { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { jobIcon } from "assets/images";
import { FaCircleArrowRight } from "react-icons/fa6";
import { fetchJobPosts } from "app/hooks/recruitment";
import { getEmployeeType, getWorkType, getJobType, getWorkLocation } from 'utils/getValuesFromTables';
import moment from "moment";


const Tabs = ({ activeTab, onTabChange, activeJobId, changeJobFilter }) => {
  

  return (
    <div className="bg-white w-full rounded-[10px] py-2 px-4 mb-2 h-[100%]">
     
    </div>
  );
};

export default Tabs;
