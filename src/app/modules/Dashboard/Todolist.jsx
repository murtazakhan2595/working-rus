import React from "react";
import { TbCircleChevronsDown } from "react-icons/tb";
import todoImg from "../../../assets/images/todolist.png"
const Dashboard = ({isSidebarOpen}) => {
  return (
    <div className="relative flex flex-col pt-5 justify-start sm:ml-5 sm:w-[95%] sm:mr-7 md:w-[60%] w-[90%] md:ml-10 items-start mx-auto ">
<img
    className="absolute top-0 right-0 transform translate-y-[-5%] translate-x-[-50%]"
    src={todoImg}
    alt=""
  />        <div className="mb-5 mt-2 pb-3 pl-3 pr-8 pt-3 rounded w-full 2xl:mx-0  bg-white  flex flex-col items-start justify-start gap-3">
          <h1 className="text-xl mb-3 font-bold">To-Do List</h1>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-400 text-sm">Email Sarrah</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-400 text-sm">Schedule The Meeting</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-400 text-sm">Update The Page</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-400 text-sm">Assign Work To Sarrah</p>
          </div>
          <div className="flex w-full justify-center items-center">
            <TbCircleChevronsDown className="text-gray-400 text-xl drop-shadow-lg text-center" />
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
