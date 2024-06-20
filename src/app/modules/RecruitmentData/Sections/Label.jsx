import React from "react";

const Label = ({ title, src }) => {
  return (
    <>
      <span className="flex items-center gap-x-2 bg-[#F0F1F2] rounded-lg text-sm font-lato text-baseGray p-2">
        <img src={src} alt="" />
        {title}
      </span>
    </>
  );
};

export default Label;
