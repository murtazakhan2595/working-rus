// Header.js
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Card } from "components/ui/card";
import { ScrollArea } from "src/@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { Badge } from "components/ui/badge";
import { Check, CircleCheck, CircleDot, X, CircleSlash } from "lucide-react";
import { cn } from "src/@/lib/utils.js";
import { cva } from "class-variance-authority";
import { renderDate } from "utils/renderValues";
import statusPendingIcon from "assets/images/status-pending.svg";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { handleRequest } from "app/hooks/general";
import { toast } from "react-toastify";
import { TextAreaInput } from 'components/FormControl'
import { SheetUI } from 'components'

const statusVariants = cva("", {
  variants: {
    variant: {
      default: "border-transparent bg-neutral-300 text-neutral-1100",
      ghost: "border-transparent bg-transparent text-neutral-1200",
      outline: "text-slate-900 dark:text-slate-50",
      plum: "bg-plum-300 text-plum-1100",
      error: "bg-red-50 text-red-400",
      alarming: "bg-orange-50 text-orange-700",
      "info-secondary": "bg-purple-50 text-purple-800",
      disable: "bg-gray-400 text-purple-1100",
      warning: "bg-amber-50 text-amber-500",
      success: "bg-emerald-50 text-emerald-700",
      neutral: "bg-neutral-300 text-neutral-1100",
      info: "bg-blue-50 text-blue-800",
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
  else if (status.includes("acknowledge")) return "success";
  else if (status.includes("signed")) return "success";
  else if (status.includes("viewed")) return "warning";
  else if (status.includes("screen")) return "warning";
  else if (status.includes("late")) return "warning";
  else if (status.includes("draft")) return "warning";
  else if (status.includes("warning")) return "warning";
  else if (status.includes("success")) return "success";
  else if (status.includes("declined")) return "error";
  else if (status.includes("error")) return "error";
  else if (status.includes("cancelled")) return "error";
  else if (status.includes("expired")) return "error";
  else if (status.includes("alarming")) return "alarming";
  else if (status.includes("rejected")) return "error";
  else if (status.includes("pending")) return "default";
  else if (status.includes("interview")) return "info-secondary";
  else if (status.includes("no")) return "error";
  else if (status.includes("yes")) return "success";
  else if (status.includes("new")) return "info";
  else if (status.includes("progress")) return "info";
  else if (status.includes("scheduled")) return "info-secondary";
  else if (status.includes("publish")) return "info-secondary";
  else if (status.includes("close")) return "disable";
  else if (status.includes("resume")) return "plum";
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
          "flex items-center h-fit capitalize-text",
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

const MultiStatusLabel = React.forwardRef(
  (
    {
      statusList,
      key,
      variant,
      className,
      size,
      iconVariant,
      displayAll,
      displayCount = 3,
      fallBackText = "",
      ...props
    },
    ref
  ) => {
    //  const [searchQuery, setSearchQuery] = React.useState("");
    if (!statusList || !Array.isArray(statusList) || statusList.length === 0)
      return fallBackText ?? null;
    const displayedStatus = displayAll
      ? statusList
      : statusList?.slice(0, displayCount || 3);
    const remainingCount = statusList.length - displayedStatus.length;
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-wrap gap-1 cursor-pointer">
            {displayedStatus.map((status, index) => {
              return (
                <StatusLabel
                  key={index}
                  {...props}
                  variant={variant}
                  status={status}
                  className={cn("font-normal", className)}
                >
                  {status ? typeof status === 'string' ? status?.toLowerCase() : status : ""}
                </StatusLabel>
              );
            })}
            {remainingCount > 0 && !displayAll && (
              <StatusLabel
                {...props}
                variant={variant}
                className={cn("font-normal", className)}
              >
                +{remainingCount}
              </StatusLabel>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Card className="border-0 shadow-none">
            <div className="p-4 space-y-4">
              {/* {remainingCount > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Member"
                    className="pl-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              )} */}
              <ScrollArea className="[&>div>div[style]]:!block">
                <div className="pr-2 space-y-3 max-h-[200px]">
                  {statusList.map((status, index) => {
                    return (
                      <div
                        key={`${status}-${index}`}
                        className="flex justify-between w-full items-center cursor-pointer"
                      >
                        {status}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiStatusLabel.displayName = "MultiStatusLabel";

export const StatusButtons = ({
  permissionKey, // Can now be string or array
  permissionLogic = "OR", // "OR" or "AND" logic for multiple permissions
  status,
  current_approver,
  final_approver = [],
  request_id,
  setResponse = () => { },

  // 🚀 NEW: Custom approval flow props
  onApprove = null, // Custom approve handler - if provided, skips default API call
  onReject = null, // Custom reject handler - if provided, skips default API call
  approveText = "Approve", // Customizable button text
  rejectText = "Reject", // Customizable button text
  showApprove = true, // Allow hiding approve button
  showReject = true, // Allow hiding reject button
  ApprovalConfig = null,//If comments are required and on approval from approver
  RejectionConfig = null,//If comments are required and on rejection from approver
}) => {
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [FormSheetData, setFormSheetData] = useState({});

  // Handle multiple permission keys
  const checkPermissions = () => {
    if (!permissionKey) return false;

    // Single permission key (backward compatibility)
    if (typeof permissionKey === "string") {
      return HasAccess(permissionKey);
    }

    // Multiple permission keys
    if (Array.isArray(permissionKey)) {
      if (permissionLogic === "AND") {
        // User must have ALL permissions
        return permissionKey.every((key) => HasAccess(key));
      } else {
        // User must have AT LEAST ONE permission (OR logic)
        return permissionKey.some((key) => HasAccess(key));
      }
    }

    return false;
  };

  const managePermitted = checkPermissions();

  if (!managePermitted) return null;
  if (!status || status?.toLowerCase() !== "pending") return null;
  if (!current_approver && !user_role.includes(1)) return null;

  if ((current_approver || []).includes(user_id) || user_role.includes(1) || (final_approver || []).includes(user_id)) {
    // 🚀 UPDATED: Default API-based approval flow
    const handleDefaultSubmit = async (status, data = {}) => {
      try {
        const response = await handleRequest(request_id, status === "Approved", data);
        if (response) {
          toast.success(`Request ${status} Successfully!`);
          setResponse(true, status, data);
        } else {
          setResponse(false, status);
        }
      } catch (error) {
        console.error("Approving Request Error", error);
        setResponse(false, status);
      }
    };

    // 🚀 NEW: Enhanced click handlers
    const handleApproveClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (ApprovalConfig) {
        setOpenCommentModal(true);
        setFormSheetData({
          triggerText: "Submit & Approve",
          title: ApprovalConfig?.label,
          description: null,
          footer: null,
          className: "max-w-[478px] w-full h-[450px]",
          status: 'Approved',
          required: ApprovalConfig.required,
        });
      }

      else if (onApprove) {
        // Use custom approve handler
        onApprove(handleDefaultSubmit);
      } else {
        // Use default API flow
        handleDefaultSubmit("Approved");
      }
    };

    const handleRejectClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (RejectionConfig) {
        setOpenCommentModal(true);
        setFormSheetData({
          triggerText: "Submit & Reject",
          title: RejectionConfig?.label,
          description: null,
          footer: null,
          className: "max-w-[478px] w-full h-[450px]",
          status: 'Rejected',
          required: RejectionConfig.required,
        });
      } else if (onReject) {
        // Use custom reject handler
        onReject();
      } else {
        // Use default API flow
        handleDefaultSubmit("Rejected");
      }
    };

    return (
      <div className="flex flex-wrap justify-end gap-2 my-5">
        {showApprove && (
          <Button variant="success" onClick={handleApproveClick}>
            {approveText}
          </Button>
        )}
        {showReject && (
          <Button variant="destructive" onClick={handleRejectClick}>
            {rejectText}
          </Button>
        )}
        {openCommentModal && (
          <SheetUI
            isOpen={openCommentModal}
            setIsOpen={setOpenCommentModal}
            variant="modal"
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: { comment: null },
              enableReinitialize: true,
              handleSubmit: (data) => {
                handleDefaultSubmit(FormSheetData.status, data);
              },
              validateFormSchema: (values) => {
                const error = {};
                if (FormSheetData.required && !values.comment)
                  error.comment = "This field is required";
                return error;
              },
              submitButtonText: FormSheetData.triggerText,
              cancelButtonText: "Cancel",
              columns: 1,
              formFields: [
                {
                  sheetCardExtension: false,
                  InputFields: [
                    {
                      InputField: TextAreaInput,
                      name: "comment",
                      required: FormSheetData.required,
                      rows: 3,
                      placeholder: FormSheetData.title,

                    },
                  ].filter(Boolean),
                },
              ],
            }}
          ></SheetUI>
        )}
      </div>
    );
  }
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
    "flex justify-center items-center px-1 bg-white h-[33px] w-[33px] ",
    className
  );
  const iconSize = "22";
  const iconClassName =
    "object-contain self-stretch my-auto aspect-square rounded-full";
  const style = { padding: "3px" };
  if (Status === "approved")
    return (
      <div className={`${custonClassName}`}>
        <Check
          className={`${iconClassName} bg-[#00C483] text-white`}
          style={style}
          size={iconSize}
          strokeWidth={1.5}
        />
      </div>
    );
  else if (Status === "rejected")
    return (
      <div className={`${custonClassName}`}>
        <RxCross2
          className={`${iconClassName} bg-[#EA4335] text-white`}
          style={style}
          size={iconSize}
        />
      </div>
    );
  else if (Status === "pending")
    return (
      <div className={`${custonClassName}`}>
        <img
          loading="lazy"
          src={statusPendingIcon}
          alt=""
          className={iconClassName}
        />
      </div>
    );
  else if (Status === "skipped")
    return (
      <div className={`${custonClassName}`}>
        <CircleSlash
          className={`${iconClassName} bg-gray-400 text-gray-700`}
          style={style}
          size={iconSize}
        />
      </div>
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

export const StatusList = ({ status_list, className, infoPrefix = "By" }) => {
  if (!status_list || !Array.isArray(status_list) || status_list.length === 0)
    return <></>;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {status_list.map(({ status, info, time, infoPrefix: specific_info_prefix, description }, index) => {
        return (
          <div key={`status-list-${index}`} className="flex items-center">
            <StatusViewIcon status={status} className="mr-1 mt-1" />
            <div className="flex flex-col">
              <span className="text-capitalize">
                {status.toLowerCase()} {specific_info_prefix ?? infoPrefix} {info}
              </span>
              <span className="text-xs text-neutral-1000">
                {description}
              </span>
              <span className="text-xs text-neutral-900">
                {renderDate(time, "", "date-time")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { StatusLabel, statusVariants, MultiStatusLabel };
