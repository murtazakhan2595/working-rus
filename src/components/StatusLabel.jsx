// Header.js
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Badge } from "../components/ui/badge";

export const Labels = ({ label, iconDot, iconColor, backgroungColor, src }) => {
  if (!label) return "";
  return (
    <>
      <div
        className={`flex text-capitalize items-center text-baseGray font-lato text-base font-normal rounded-2xl px-3 py-1 ${
          backgroungColor ?? "bg-plum-500"
        }`}
      >
        {src && <img src={src} alt="" className="mr-1" />}
        {iconDot && (
          <span className={`w-3 h-3 rounded-full mr-2 ${iconColor}`}></span>
        )}
        
      </div>
      {/* <Badge variant="secondary" className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full">

      {label}
         </Badge> */}
    </>
  );
};

export const StatusLabel = ({ status, value }) => {
  if (!status) {
    return "";
  }
  let className = "";
  if (status === "Onboard") {
    className = "label-green-2FD115";
  } else if (status === "Contacted" || status === "warning-orange") {
    className = "label-warning-FF9900";
  } else if (status === "warning") {
    className = "label-warning";
  } else if (status === "Offered") {
    className = "label-warning-D5D912";
  } else if (status === "Rejected") {
    className = "label-danger";
  } else if (status === "Declined" || status === "Denied") {
    className = "label-Denied";
  } else if (status === "Selected" || status === "Approved") {
    className = "label-success";
  } else if (status === "Shortlisted") {
    className = "label-green-28D9AC";
  } else if (status === "Pending") {
    className = "label-Pending";
  } else {
    className = "label-draft";
  }
  return (
    <>
      <span
        className={`${className} h-[22px] px-3 py-[3px] rounded-[999px] justify-center items-center gap-1.5 inline-flex`}
        // style={{ color: "#323333", minWidth: "100px", fontWeight: "normal" }}
      >
          <div className={`${className} font-semibold text-xs font-['Inter'] leading-3`}>
        {value ?? status}
          </div>
      </span>
    </>
  );
};

export const LabelHolo = ({ text, color }) => {
  return (
    <div
      className="flex items-center mx-1 space-x-2"
      style={{ borderBottom: "0.75px solid #5C5E64" }}
    >
      <span
        className={`w-3 h-3 rounded-full ${color}`}
        style={{ backgroundColor: color }}
      ></span>
      <span className="ml-0 text-gray-600">{` ${text}`}</span>
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
      <div className="text-sm font-normal capitalize text-zinc-600">
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
