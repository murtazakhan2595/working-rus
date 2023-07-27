import React from "react";
import { TbCircleChevronsDown } from "react-icons/tb";

const Dashboard = () => {
  return (
        <div className="mb-5 pb-3 mt-2 pt-3 rounded w-[45%] bg-white pl-3 pr-8 ml-10 flex flex-col items-start justify-start gap-3">
          <h1 className="text-xl mb-3 font-bold">To-Do List</h1>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-500">Email Sarrah</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-500">Schedule The Meeting</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-500">Update The Page</p>
          </div>
          <div className="flex gap-3 w-full px-2 border-b border-gray-500">
            <input type="checkbox" name="" id="" />
            <p className="text-gray-500">Assign Work To Sarrah</p>
          </div>
          <div className="flex w-full justify-center items-center">
            <TbCircleChevronsDown className="text-gray-400 text-xl drop-shadow-lg text-center" />
          </div>
        </div>
  );
};

export default Dashboard;
