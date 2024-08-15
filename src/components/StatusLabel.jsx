// Header.js
import React from "react";

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
    <div className="flex items-center space-x-2 mx-1" style={{borderBottom:"0.75px solid #5C5E64"}}>
      <span
        className={`w-3 h-3 rounded-full ${color}`}
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-gray-600 ml-0">{` ${text}`}</span>
    </div>
  );
};

