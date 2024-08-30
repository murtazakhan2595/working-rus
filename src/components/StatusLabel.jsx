// Header.js
import { Badge } from "../components/ui/badge";
import React from "react";

const StatusLabel = ({ status, value }) => {
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
    <Badge variant="ghost" className={`${className} p-2 ` }> {value ?? status}</Badge>
     
    </>
  );
};

export default StatusLabel;
