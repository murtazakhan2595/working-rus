// Header.js
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Badge } from "../components/ui/badge";
import { CircleCheck, CircleDot, X } from "lucide-react";

export const Labels = ({ label, iconDot, iconColor, backgroungColor, src }) => {
  if (!label) return "";
  return (
    <>
      <div
        className={`flex text-capitalize items-center text-baseGray  text-base font-normal rounded-2xl px-3 py-1 ${
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
  console.log("STAUTS", status)
  if (!status) {
    return "";
  }
  let className = "";
  if (status === "Onboard") {
    className = "bg-amber-100 text-amber-500";
  } else if (status === "Contacted" || status === "warning-orange") {
    className = "label-warning-FF9900";
  } else if (status === "warning") {
    className = "label-warning";
  } else if (status === "Offered") {
    className = "label-warning-D5D912";
  } else if (status === "Rejected" || status === "Declined" || status === "Denied" ) {
    className = "bg-red-100 text-red-500";
  } else if (status === "Selected" || status === "Approved") {
    className = "label-success";
  } else if (status === "Shortlisted") {
    className = "bg-emerald-100 text-emerald-500";
  } else if (status === "Pending") {
    className = "bg-neutral-300 text-neutral-1100";
  } else {
    className = "bg-neutral-300 text-neutral-1100";
  }
  return (
    <Badge className={className}>
    {value ?? status}
    </Badge>
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
export const Status = (status) => {
  if (!status) return "";
  if (status.includes("Approved")) return "Approved";
  else if (status.includes("Declined")) return "Rejected";
  else if (status.includes("Pending")) return "Pending";
  else return "Viewed";
};

export const getDecision = (status) => {
  if (status === "Approved") return "Approved";
  else if (status === "Denied") return "Denied";
  else if (status === "Pending") return "Awaiting Decision";
  else return status;
};

export const StatusIcon = ({ status }) => {
  if (!status) return <></>;
  const className = "text-[20px] d-inline rounded-full mr-5";
  const style = { padding: "3px" };
  status = Status(status);
  if (status === "Approved")
    return (
      <CircleCheck
        className={`${className} bg-[#00C483] text-white`}
        style={style}
      />
    );
  else if (status === "Rejected")
    return (
      <X className={`${className} bg-[#EA4335] text-white`} style={style} />
    );
  else if (status === "Pending")
    return (
      <CircleDot
        className={`${className} bg-[#E8E8E8]`}
        style={{
          ...{ style },
          ...{ color: "#D9D9D9", border: "3px solid #E8E8E8" },
        }}
      />
    );
  else return <></>;
};
