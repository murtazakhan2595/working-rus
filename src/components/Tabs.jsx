// import React, { useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const Tabs = ({ tabs, onTabChange, buttonLabel }) => {
//   const [activeTab, setActiveTab] = useState(tabs[0]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     onTabChange(tab);
//   };

//   return (
//     <div className="flex items-center justify-between pr-3">
//       <div className="flex space-x-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`py-2 px-4 ${activeTab === tab
//               ? "border-b-2 border-[#35B6E9] text-baseGray text-base"
//               : "text-gray-500"
//               }`}
//             onClick={() => handleTabChange(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>


//       {buttonLabel &&
//         <div className="flex items-center gap-x-3">
//           <div className=" text-[#47484C] text-[17px]">{buttonLabel}</div>
//           <Link to="/job-post" className="p-2 bg-black rounded-md" style={{ fontSize: '12px' }}><FaPlus className="text-white" /></Link>
//         </div>
//       }


//     </div>
//   );
// };

// export default Tabs;


// src/components/GlobalTabs.jsx
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../src/@/components/ui/tabs"; // Adjust the path if needed

const TabComponent = ({ tabsData, activeTab, onValueChange, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={onValueChange}>
      <TabsList className="flex justify-center mb-4">
        {tabsData?.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
               >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabComponent
