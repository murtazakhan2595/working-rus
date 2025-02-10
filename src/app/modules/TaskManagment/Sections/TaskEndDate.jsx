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

const TaskEndDate = ({ dueDate, taskStatus = "" }) => {
  if (!dueDate || !moment(dueDate).isValid()) return null;
  const taskDateStatus = getTaskDateStatus(dueDate);
  const taskCompleted = taskStatus.toUpperCase() === "COMPLETED";
  console.log(
    moment(dueDate).isValid(),
    taskCompleted,
    taskDateStatus,
    "moment(dueDate).isValid()"
  );

  const getIconColor = () => {
    if (taskCompleted) {
      return "#12B76A";
    }
    return getDateIconColor(dueDate);
  };

  const getTooltipMessage = () => {
    if (taskCompleted) {
      return "The card is complete.";
    }
    if (taskDateStatus === "Overdue") {
      return "The card has past due date.";
    } else if (taskDateStatus === "Due Today") {
      return "The card is due today.";
    } else {
      return "The card is due later.";
    }
  };

  const textStyle = {
    color: getIconColor(),
  };

  return (
    <>
      <TooltipText
        tooltipTriggerText={
          <div
            className={`${getBackgroundClass(
              taskDateStatus,
              taskCompleted
            )} w-fit flex flex-row gap-1 rounded px-2 py-1 items-center`}
          >
            <TimeIcon color={getIconColor()} />
            <div style={textStyle} className="select-none">
              {renderDate(dueDate)}
            </div>
          </div>
        }
        content={getTooltipMessage()}
      />
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center text-xs rounded px-1 py-1 ${getBackgroundClass(
                task?.end_date
              )} cursor-pointer`}
              onMouseEnter={() => setShowCheckbox(true)}
              onMouseLeave={() => setShowCheckbox(false)}
              onClick={handleContainerClick}
            >
              <div className="relative w-5 h-5">
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    showCheckbox ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Input
                    type="checkbox"
                    checked={isChecked}
                    value={isChecked}
                    className="w-4 h-4"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(!isChecked);
                    }}
                  />
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    showCheckbox ? "opacity-0 z-0" : "opacity-100 z-10"
                  }`}
                >
                  <TimeIcon color={getIconColor()} />
                </div>
              </div>
              <div style={textStyle} className="select-none">
                {moment(task?.end_date).format("MMMM DD")}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipMessage()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </>
  );
};

export default TaskEndDate;
