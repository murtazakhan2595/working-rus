import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function RenderJobTitle({ row }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center gap-2 text-[#5c5e64] text-sm font-normal">
        <Icon />
        <div className=" flex-col justify-start items-start gap-1 inline-flex">
          <div className="text-[#5c5e64] text-[11px] font-normal">
            {row.id}
          </div>
          <div className="text-[#5c5e64] text-sm font-bold ">
            {row.Job_Title}
          </div>
        </div>
      </div>
    </div>
  );
}


const colors = ['#53b7e2', '#c3268e', '#496bad', '#8353e2'];

function Icon() {
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    // Select a random color from the colors array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      fill="none"
      viewBox="0 0 38 38"
    >
      <rect width="37.997" height="38" fill={bgColor} rx="18.998"></rect>
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="2"
        d="M11 12l8 5.6V28M27 12l-8 5.6V28"
      ></path>
    </svg>
  );
}
