import React, { useState } from "react";
import { IoIosArrowBack, IoIosSearch, IoIosArrowForward } from "react-icons/io";
import { LiaHomeSolid } from "react-icons/lia";
import { MdOutlineGroups2 ,MdOutlinePayment} from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { PiShootingStarBold } from "react-icons/pi";
import {Outlet} from "react-router-dom";
const Sidebar = ({isSidebarOpen,setIsSidebarOpen}) => {

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar content goes here */}
      <div
        className={`bg-[#2f4acf] h-screen w-64 p-4  ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="text-xl bg-white py-3 px-7 flex flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold mb-4 rounded-md">
          <img src="/logo.png" className="inline-block w-10" alt="logo" />
          <h1 className="inline-block">TECBRIX</h1>
        </div>
        <ul>
          <li>
            <div className="relative">
              <IoIosSearch className="absolute top-3 left-3 text-white" />
              <input
                type="search"
                placeholder="Search"
                className="focus:outline-none focus:border-non bg-[#8292e2] py-2 pl-10 pr-4 text-white placeholder-white border-none w-56 rounded-md"
              />
            </div>
          </li>

          <li className="flex mb-3 mt-5 bg-blue-900 rounded-md py-2 px-4 items-center gap-1">
            <LiaHomeSolid className="text-white text-xl" />{" "}
            <p className="text-white">Home</p>
          </li>

          <li className="flex mb-3 mt-5  rounded-md py-2 px-4 items-center gap-1">
            <MdOutlineGroups2 className="text-white text-xl" />{" "}
            <p className="text-white">Team</p>
          </li>

          <li className="flex mb-3 mt-5  rounded-md py-2 px-4 items-center gap-1">
            <BiTimeFive className="text-white text-xl" />{" "}
            <p className="text-white">Time</p>
          </li>
          
          <li className="flex mb-3 mt-5  rounded-md py-2 px-4 items-center gap-1">
            <MdOutlinePayment className="text-white text-xl" />{" "}
            <p className="text-white">Pay</p>
          </li>

          <li className="flex mb-3 mt-5  rounded-md py-2 px-4 items-center gap-1">
            <PiShootingStarBold className="text-white text-xl" />{" "}
            <p className="text-white">Perfomance</p>
          </li>
          <hr className="opacity-40"/>
        </ul>
      </div>

      {/* Sidebar collapse button */}
      <button
        className={`bg-[#2f4acf] text-white p-2 absolute ${
          isSidebarOpen ? "left-64" : "left-0"
        } rounded-e-lg top-0 mt-4 mr-4`}
        onClick={handleSidebarToggle}
      >
        {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>
     
        <Outlet />
    </div>
  );
};

export default Sidebar;
