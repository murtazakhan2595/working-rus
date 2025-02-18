import React, { useEffect, useState } from "react";
import TimeIcon from "assets/images/timeIcon";
import moment from "moment";
import { TooltipText } from "components";
import { renderDate } from "utils/renderValues";

export const getTaskDateStatus = (date) => {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  if (moment(date).isSame(moment(currentDate))) {
    return "Due Today";
  } else if (moment(date).isBefore(moment(currentDate))) {
    return "Overdue";
  } else if (moment(date).isAfter(moment(currentDate))) {
    return "Due Soon";
  }
};
export const getBackgroundClass = (dateStatus, isChecked) => {
  if (isChecked) {
    return "bg-[#ECFDF3]";
  }
  if (dateStatus === "Due Today") {
    return "bg-amber-100";
  } else if (dateStatus === "Overdue") {
    return "bg-[#ffe2e2]";
  } else {
    return "bg-gray-50";
  }
};

const getDateIconColor = (date) => {
  const status = getTaskDateStatus(date);
  if (status === "Due Today") {
    return "#FF9A1F";
  } else if (status === "Overdue") {
    return "#FF4C4C";
  } else {
    return "#5C5E64";
  }
};

const TaskEndDate = ({
  dueDate,
  taskStatus = "",
  tooltipMessagePrefix = "This card",
}) => {
  if (!dueDate || !moment(dueDate).isValid()) return null;
  const taskDateStatus = getTaskDateStatus(dueDate);
  const taskCompleted = taskStatus && taskStatus.toUpperCase() === "COMPLETED";

  const getIconColor = () => {
    if (taskCompleted) {
      return "#12B76A";
    }
    return getDateIconColor(dueDate);
  };

  const getTooltipMessage = () => {
    let message = "";
    if (taskCompleted) {
      message = "is complete.";
    } else if (taskDateStatus === "Overdue") {
      message = "has past due date.";
    } else if (taskDateStatus === "Due Today") {
      message = "is due today.";
    } else {
      message = "is due later.";
    }
    return `${tooltipMessagePrefix} ${message}`;
  };

  const textStyle = {
    color: getIconColor(),
  };

  return (
    <TooltipText
      tooltipTriggerText={
        <div
          className={`${getBackgroundClass(
            taskDateStatus,
            taskCompleted
          )} w-fit flex flex-row gap-1 rounded px-2 py-1 items-center text-xs`}
        >
          <TimeIcon color={getIconColor()} />
          <div style={textStyle} className="select-none">
            {renderDate(dueDate)}
          </div>
        </div>
      }
      content={getTooltipMessage()}
    />
  );
};

export default TaskEndDate;
