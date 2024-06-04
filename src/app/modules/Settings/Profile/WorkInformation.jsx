import React from "react";

const WorkInformation = ({ workInformation }) => {
 

  return (
    <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
      <h2 className="text-xl mb-4">Work Information</h2>
      <hr />
      <div className="flex flex-col 1100:flex-row py-4 overflow-auto no-scrollbar">
        {workInformation.map((infoGroup, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-4 w-full 1100:w-1/3 pt-5">
            {infoGroup.map((info) => (
              <div className="flex w-full gap-3" key={info.title}>
                <div className="opacity-60 w-1/2 1100:w-[35%]">{info.title}</div>
                <div className="w-1/2 1100:w-[65%]">{info.data || "-----"}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkInformation;
