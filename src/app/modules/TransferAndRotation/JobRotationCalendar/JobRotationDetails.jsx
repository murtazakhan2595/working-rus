// src/app/modules/TransferAndRotation/JobRotationCalendar/JobRotationDetails.jsx
import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { BranchName } from "utils/getValuesFromTables";
import { getJobRotationById } from "app/hooks/transferAndRotation";

// Status transformation function (same as in calendar view)
const transformJobRotationStatus = (rotation) => {
  const { status: apiStatus, effective_date, rotation_cap_time } = rotation;
  const currentDate = moment();
  const effectiveDate = moment(effective_date);
  const capEndDate = effectiveDate.clone().add(rotation_cap_time, "days");

  switch (apiStatus) {
    case "pending":
      return "Pending Approval";

    case "rejected":
      return "Cancelled";

    case "approved":
      if (currentDate.isBefore(effectiveDate)) {
        return "Scheduled";
      }

      if (
        currentDate.isAfter(effectiveDate) &&
        currentDate.isBefore(capEndDate)
      ) {
        return "In Progress";
      }

      if (currentDate.isAfter(capEndDate)) {
        return "Overdue";
      }

      return "Scheduled";

    default:
      return "Pending Approval";
  }
};

const JobRotationDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );
  const [forceLoad, setForceLoad] = useState(false);

  const handleAction = async (status, data) => {
    try {
      // TODO: Implement actual API calls for job rotation actions
      console.log(`Performing action: ${status} on rotation ${data.id}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Job rotation ${status.toLowerCase()} successfully!`);
      setForceLoad(!forceLoad);
      reloadData();
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("An error occurred while processing the request");
    }
  };

  const handleClick = (event, status, data) => {
    event.preventDefault();
    event.stopPropagation();
    handleAction(status, data);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Approval":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Scheduled":
        return "bg-green-50 text-green-700 border-green-200";
      case "In Progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "Cancelled":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getTimelineInfo = (data) => {
    if (!data) return null;

    const effectiveDate = moment(data.effective_date);
    const currentDate = moment();
    const transformedStatus = transformJobRotationStatus(data);

    if (transformedStatus === "In Progress") {
      const capEndDate = effectiveDate
        .clone()
        .add(data.rotation_cap_time, "days");
      const daysRemaining = capEndDate.diff(currentDate, "days");
      return {
        type: "cap_time",
        message: `${daysRemaining} days remaining in cap time`,
        color: daysRemaining > 5 ? "text-green-600" : "text-yellow-600",
      };
    }

    if (transformedStatus === "Overdue") {
      return {
        type: "overdue",
        message: "Cap time has expired. Action required.",
        color: "text-red-600",
      };
    }

    if (transformedStatus === "Scheduled") {
      const daysUntilEffective = effectiveDate.diff(currentDate, "days");
      return {
        type: "upcoming",
        message: `${daysUntilEffective} days until effective date`,
        color: "text-blue-600",
      };
    }

    return null;
  };

  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        // Transform the status for display
        const transformedStatus = transformJobRotationStatus(data);

        return (
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <EmployeeOverview
              id={data?.employee?.id || data?.employee}
              showId={true}
              showEmail={true}
              showBranchName={true}
              showDepartment={true}
              showPosition={true}
              avatarSize={16}
            />
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                transformedStatus
              )}`}
            >
              {transformedStatus}
            </div>
          </div>
        );
      },
    },
    {
      title: "Rotation Details",
      footerTitle: "Requested At",
      footerField: "request_date",
      field: [
        {
          key: "effective_date",
          label: "Effective Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "rotation_cap_time",
          label: "Cap Time",
          formatter: (cell) => `${cell} days`,
        },
        {
          key: "reason",
          label: "Reason for Rotation",
        },
      ],
    },
    {
      title: "Transfer Information",
      field: [
        {
          key: "branch",
          label: "From Branch",
          formatter: (cell) => cell,
        },
        {
          key: "new_branch",
          label: "To Branch",
          formatter: (cell) => BranchName({ value: cell }),
        },
      ],
    },
    {
      customContent: true,
      renderContent: (data) => {
        if (!data) return null;
        const timelineInfo = getTimelineInfo(data);
        if (!timelineInfo) return null;

        return (
          <div className="p-3 border rounded-lg bg-blue-50 my-4">
            <div
              className={`flex items-center gap-2 text-sm ${timelineInfo.color}`}
            >
              <span className="font-medium">{timelineInfo.message}</span>
            </div>
          </div>
        );
      },
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getJobRotationById(id);

      if (isMounted && response) {
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error fetching job rotation:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Job Rotation Details"
      currentItem_Id={currentId}
      ForceItemLoad={forceLoad}
      dataList={DataList}
      reloadData={reloadData}
      allowEdit={false}
      allowDelete={false}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Job Rotation"
      deleteTooltip="Delete Job Rotation"
    >
      <DetailContent title="Job Rotation Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default JobRotationDetails;
