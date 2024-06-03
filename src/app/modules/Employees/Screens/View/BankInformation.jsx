import React from "react";

const BankInformation = ({ bankInformation }) => {
  
  return (
    <div className="bg-white shadow border 800:w-1/2 w-full rounded-lg p-4 mb-6">
      <h2 className="text-xl mb-4">Bank Information</h2>
      <hr />

      {/* ********************* Bank INFO ************************ */}

      <div className="flex w-full pt-5">
        <div className="flex flex-col gap-4 w-full no-scrollbar">
          {bankInformation.map((bankInfo) => (
            <div className="flex w-full gap-3" key={bankInfo.title}>
              <div className="opacity-60 w-[50%] 500:w-[35%]">{bankInfo.title}</div>
              <div className="500:w-[65%] w-[50%]">{bankInfo.data || "-----"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankInformation;
