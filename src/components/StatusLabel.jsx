// Header.js
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { Badge } from "components/ui/badge";
import { CircleCheck, CircleDot, X } from "lucide-react";
import { cn } from "src/@/lib/utils.js";
import { cva } from "class-variance-authority";
import { EmployeeName } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";

const statusVariants = cva("", {
  variants: {
    variant: {
      default: "border-transparent bg-neutral-300 text-neutral-1100",
      ghost: "border-transparent bg-transparent text-neutral-1200",
      outline: "text-slate-900 dark:text-slate-50",
      plum: "bg-plum-300 text-plum-1100",
      error: "bg-red-50 text-red-400",
      warning: "bg-amber-50 text-amber-500",
      success: "bg-emerald-50 text-emerald-700",
      neutral: "bg-neutral-300 text-neutral-1100",
      info: "bg-blue-100 text-blue-900",
      "dot-plum":
        "bg-white border-neutral-300 flex items-center gap-2 text-neutral-1100",
      "dot-error": "bg-white border-neutral-300 flex items-center gap-2",
      "dot-warning": "bg-white border-neutral-300 flex items-center gap-2",
      "dot-emerald": "bg-white border-neutral-300 flex items-center gap-2",
      "dot-neutral": "bg-white border-neutral-300 flex items-center gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const getStatusVariant = (Status) => {
  if (!Status) return "default";
  const status = Status.toLowerCase();
  if (status.includes("approved")) return "success";
  else if (status.includes("accepted")) return "success";
  else if (status.includes("present")) return "success";
  else if (status.includes("viewed")) return "warning";
  else if (status.includes("late")) return "warning";
  else if (status.includes("success")) return "success";
  else if (status.includes("declined")) return "error";
  else if (status.includes("expired")) return "error";
  else if (status.includes("rejected")) return "error";
  else if (status.includes("acknowledge")) return "success";
  else if (status.includes("pending")) return "default";
  else return "default";
};

export const StatusIcon = ({ status }) => {
  const variant = getStatusVariant(status);
  const className =
    "text-[20px] inline-flex items-center justify-center rounded-full mr-2";
  const style = { padding: "3px" };

  switch (variant) {
    case "success":
      return (
        <CircleCheck
          className={`${className} bg-[#00C483] text-white`}
          style={style}
        />
      );
    case "error":
      return (
        <X className={`${className} bg-[#EA4335] text-white`} style={style} />
      );
    case "default":
      return (
        <CircleDot
          className={`${className} bg-[#E8E8E8]`}
          style={{ ...style, color: "#D9D9D9", border: "3px solid #E8E8E8" }}
        />
      );
    default:
      return null;
  }
};

const StatusLabel = React.forwardRef(
  ({ status, key, variant, className, size, iconVariant, ...props }, ref) => {
    const StatusVariant = variant ?? getStatusVariant(status);
    return (
      <Badge
        className={cn(
          statusVariants({
            variant: StatusVariant,
          }),
          "flex items-center",
          className
        )}
        ref={ref}
        key={key}
        size={size}
        {...props}
      >
        {iconVariant && (
          <StatusIcon status={status} iconVariant={iconVariant} />
        )}
        {props.children}
      </Badge>
    );
  }
);

StatusLabel.displayName = "StatusLabel";

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

export const StatusLabelAttendance = ({ status, value }) => {
  if (!status) {
    return "";
  }

  // Assign the appropriate class name based on the status
  let className = "";
  switch (status) {
    case "Present":
      className = "bg-[#E5FFF9] text-[#1D735E";
      break;
    case "Absent":
      className = "bg-[#F0F0F3] text-[#7F838D";
      break;
    case "Late":
      className = "bg-[#FAEFE1] text-[#B8761A]";
      break;
    case "Weekend ":
      className = "label-warning-D5D912";
      break;
  }

  // Render the badge with the appropriate label and style
  return <Badge className={className}>{status}</Badge>;
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

export const StatusViewIcon = ({ status, className }) => {
  if (!status) return <></>;
  const Status = status.toLowerCase();
  const custonClassName = cn(
    "text-[20px] d-inline rounded-full mr-5",
    className
  );
  const style = { padding: "3px" };
  if (Status === "approved")
    return (
      <FaCheck
        className={`${custonClassName} bg-[#00C483] text-white`}
        style={style}
      />
    );
  else if (Status === "rejected")
    return (
      <RxCross2
        className={`${custonClassName} bg-[#EA4335] text-white`}
        style={style}
      />
    );
  else if (Status === "pending")
    return (
      <BsCircleFill
        className={`${custonClassName} bg-[#E8E8E8]`}
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

export const JobStatusLabel = ({ label, type }) => {
  if (!label) return "";

  const getStylesByType = () => {
    switch (type) {
      case "status":
        return {
          bgColor:
            label.toLowerCase() === "open"
              ? "bg-green-100/50"
              : "bg-red-100/50",
          dotColor:
            label.toLowerCase() === "open"
              ? "before:bg-green-500"
              : "before:bg-red-500",
          textColor:
            label.toLowerCase() === "open" ? "text-green-700" : "text-red-700",
        };
      case "employeeType":
        return {
          bgColor: "bg-blue-100/50",
          dotColor: "before:bg-blue-500",
          textColor: "text-blue-700",
        };
      case "workType":
        return {
          bgColor: "bg-purple-100/50",
          dotColor: "before:bg-purple-500",
          textColor: "text-purple-700",
        };
      case "workLocation":
        return {
          bgColor: "bg-orange-100/50",
          dotColor: "before:bg-orange-500",
          textColor: "text-orange-700",
        };
      case "jobType":
        return {
          bgColor: "bg-emerald-100/50",
          dotColor: "before:bg-emerald-500",
          textColor: "text-emerald-700",
        };
      default:
        return {
          bgColor: "bg-gray-100/50",
          dotColor: "before:bg-gray-500",
          textColor: "text-gray-700",
        };
    }
  };

  const { bgColor, dotColor, textColor } = getStylesByType();

  return (
    <Badge
      variant="secondary"
      className={`relative pl-5 ${bgColor} ${textColor} before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full ${dotColor}`}
    >
      {label}
    </Badge>
  );
};

export const StatusList = ({ status_list, className }) => {
  if (!status_list || !Array.isArray(status_list) || status_list.length === 0)
    return <></>;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {status_list.map(({ status, approver, time }, index) => {
        return (
          <div key={`status-list-${index}`} className="flex">
            <StatusViewIcon status={status} className="mr-1 mt-1" />
            <div className="flex flex-col">
              <span className="text-capitalize">
                {status.toLowerCase()} By <EmployeeName value={approver} />
              </span>
              <span className="text-xs text-neutral-900">
                ({renderDate(time, "--", "date-time")})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { StatusLabel, statusVariants };
