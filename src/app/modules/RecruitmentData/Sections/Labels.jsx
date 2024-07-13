// Header.js
import React from "react";

const Labels = ({ label, iconDot, iconColor, backgroungColor, src }) => {
  if (!label) return "";
  return (
    <>
      <div
        className={`flex text-capitalize items-center text-baseGray font-lato text-base font-normal rounded-2xl px-3 py-1 ${
          backgroungColor ?? "bg-[#E6E9F0]"
        }`}
      >
        {src && <img src={src} alt="" className="mr-1" />}
        {iconDot && (
          <span className={`w-3 h-3 rounded-full mr-2 ${iconColor}`}></span>
        )}
        {label}
      </div>
    </>
  );
};

export default Labels;
