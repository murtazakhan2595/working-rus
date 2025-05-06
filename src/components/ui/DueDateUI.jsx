import React, { useEffect, useState } from "react";
import moment from "moment";
import { TooltipText } from "components";
import { renderDate } from "utils/renderValues";
import { Badge } from "components/ui/badge";
import { Clock } from "lucide-react";

export const getDueDateStatus = (date) => {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  if (moment(date).isSame(moment(currentDate))) {
    return "Due Today";
  } else if (moment(date).isBefore(moment(currentDate))) {
    return "Overdue";
  } else if (moment(date).isAfter(moment(currentDate))) {
    return "Due Soon";
  }
};
export const getDateVariant = (dateStatus, isChecked) => {
  if (isChecked) {
    return "success";
  }
  if (dateStatus === "Due Today") {
    return "warning";
  } else if (dateStatus === "Overdue") {
    return "error";
  } else {
    return "neutral";
  }
};

const getDateIconColor = (date) => {
  const status = getDueDateStatus(date);
  if (status === "Due Today") {
    return "text-amber-500";
  } else if (status === "Overdue") {
    return "text-red-700";
  } else {
    return "text-neutral-1100";
  }
};

const DueDateUI = ({
  dueDate,
  completionState = "",
  tooltipMessagePrefix = "This card",
  showIcon = true,
  className,
}) => {
  if (!dueDate || !moment(dueDate).isValid()) return null;
  const dueDateStatus = getDueDateStatus(dueDate);
  const statusCompleted =
    completionState &&
    ["COMPLETED", "SIGNED", "APPROVED", "ACKNOWLEDGED"].includes(
      completionState.toUpperCase()
    );
  const getIconColor = () => {
    if (statusCompleted) {
      return "text-emerald-700";
    }
    return getDateIconColor(dueDate);
  };

  const getTooltipMessage = () => {
    let message = "";
    if (statusCompleted) {
      message = `is ${completionState.charAt(0) + completionState.slice(1).toLowerCase()}`;
    } else if (dueDateStatus === "Overdue") {
      message = "has past due date.";
    } else if (dueDateStatus === "Due Today") {
      message = "is due today.";
    } else {
      message = "is due later.";
    }
    return `${tooltipMessagePrefix} ${message}`;
  };

  return (
    <TooltipText
      tooltipTriggerText={
        <Badge
          className={`flex-row gap-1 rounded border-none ${className} `}
          variant={getDateVariant(dueDateStatus, statusCompleted)}
        >
          {showIcon && <Clock className={getIconColor()} size={14} />}
          <div className="select-none">{renderDate(dueDate)}</div>
        </Badge>
      }
      content={getTooltipMessage()}
    />
  );
};

export default DueDateUI;
