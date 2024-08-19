// Header.js
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";

export const Labels = ({ label, iconDot, iconColor, backgroungColor, src }) => {
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


export const StatusLabel = ({ status, value }) => {
  if (!status) {
    return "";
  }
  let classname = "";
  if (status === "Onboard") {
    classname = "label-green-2FD115";
  } else if (status === "Contacted" || status === "warning-orange") {
    classname = "label-warning-FF9900";
  } else if (status === "warning") {
    classname = "label-warning";
  } else if (status === "Offered") {
    classname = "label-warning-D5D912";
  } else if (status === "Rejected") {
    classname = "label-danger";
  } else if (status === "Declined" || status === "Denied") {
    classname = "label-Denied";
  } else if (status === "Selected" || status === "Approved") {
    classname = "label-success";
  } else if (status === "Shortlisted") {
    classname = "label-green-28D9AC";
  } else if (status === "Pending") {
    classname = "label-Pending";
  } else {
    classname = "label-draft";
  }
  return (
    <>
      <span
        className={`p-2 ${classname} badge`}
        style={{ color: "#323333", minWidth: "100px", fontWeight: "normal" }}
      >
        {value ?? status}
      </span>
    </>
  );
};

export const LabelHolo = ({ text, color }) => {
  return (
    <div
      className="flex items-center space-x-2 mx-1"
      style={{ borderBottom: "0.75px solid #5C5E64" }}
    >
      <span
        className={`w-3 h-3 rounded-full ${color}`}
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-gray-600 ml-0">{` ${text}`}</span>
    </div>
  );
};

export const StatusCircleLabel = ({ label, status }) => {
  const normalizedStatus = status.toLowerCase();
  return (
    <div className="flex items-center gap-[6px]">
      {normalizedStatus.includes("accepted") ? (
        <FaRegCircle className="text-lime-600" />
      ) : normalizedStatus.includes("approved") ? (
        <FaRegCircle className="text-lime-600" />
      ) : normalizedStatus.includes("rejected") ? (
        <FaRegCircle className="text-red-600" />
      ) : normalizedStatus.includes("exit") ? (
        <FaRegCircle className="text-[#1599D1]" />
      ) : normalizedStatus.includes("clearance") ? (
        <FaRegCircle className="text-[#D19C15]" />
      ) : (
        <FaRegCircle className="text-gray-600" />
      )}
      <div className="capitalize text-zinc-600 text-sm font-normal">
        {label ?? status}
      </div>
    </div>
  );
};

export const StatusViewIcon = ({ status }) => {
  if (!status) return <></>;
  const className = "text-[20px] d-inline rounded-full mr-5";
  const style = { padding: "3px" };
  if (status === "Approved")
    return (
      <FaCheck
        className={`${className} bg-[#00C483] text-white`}
        style={style}
      />
    );
  else if (status === "Rejected")
    return (
      <RxCross2
        className={`${className} bg-[#EA4335] text-white`}
        style={style}
      />
    );
  else if (status === "Pending")
    return (
      <BsCircleFill
        className={`${className} bg-[#E8E8E8]`}
        style={{
          ...{ style },
          ...{ color: "#D9D9D9", border: "3px solid #E8E8E8" },
        }}
      />
    );
  else return <></>;
};
