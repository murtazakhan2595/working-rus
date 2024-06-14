import React, { useState } from "react";
import PropTypes from "prop-types";
import { IoArrowForwardCircle } from "react-icons/io5";

const Tabs = ({ tabs, onTabChange, tabContents }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="bg-white w-full rounded-[10px] p-2">
      <div className="flex justify-between items-center border-b border-[#F0F1F2]">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-[#35B6E9] text-baseGray font-lato text-base"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">{tabContents ? tabContents[activeTab] : null}</div>
    </div>
  );
};

export default Tabs;
