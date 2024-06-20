import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Tabs = ({ tabs, onTabChange, tabContents }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex justify-between items-center pr-3">
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 ${activeTab === tab
                ? "border-b-2 border-[#35B6E9] text-baseGray text-base"
                : "text-gray-500"
              }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>


      <div className="flex items-center gap-x-3">
        <div className="font-lato text-[#47484C] text-[17px]">Add New Job</div>
        <Link to="/job-post" className="p-2 rounded-md bg-black" style={{fontSize:'12px'}}><FaPlus className="text-white" /></Link>
      </div>


    </div>
    // <div className="mt-4">{tabContents ? tabContents[activeTab] : null}</div>
  );
};

export default Tabs;
