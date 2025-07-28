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
    const isEffectiveDatePassed = currentDate.isAfter(effectiveDate);
    const daysUntilEffective = effectiveDate.diff(currentDate, "days");

    if (data.status === "In Progress") {
      const capEndDate = effectiveDate.clone().add(data.cap_time_days, "days");
      const daysRemaining = capEndDate.diff(currentDate, "days");
      return {
        type: "cap_time",
        message: `${daysRemaining} days remaining in cap time`,
        color: daysRemaining > 5 ? "text-green-600" : "text-yellow-600",
      };
    }

    if (data.status === "Overdue") {
      return {
        type: "overdue",
        message: "Cap time has expired. Action required.",
        color: "text-red-600",
      };
    }

    if (!isEffectiveDatePassed && data.status === "Scheduled") {
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
                data?.status || ""
              )}`}
            >
              {data?.status || "N/A"}
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
          key: "id",
          label: "Rotation ID",
          formatter: (cell, row) => <FormatID value={cell} prefix={"JR-"} />,
        },
        {
          key: "effective_date",
          label: "Effective Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "cap_time_days",
          label: "Cap Time",
          formatter: (cell) => `${cell} days`,
        },
        {
          key: "reason",
          label: "Reason for Rotation",
        },
        {
          key: "requested_by",
          label: "Requested By",
        },
      ],
    },
    {
      title: "Transfer Information",
      field: [
        {
          key: "current_branch",
          label: "From Branch",
          formatter: (cell) => (cell ? `${cell.name} (${cell.code})` : "N/A"),
        },
        {
          key: "new_branch",
          label: "To Branch",
          formatter: (cell) => (cell ? `${cell.name} (${cell.code})` : "N/A"),
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
    {
      title: "Approval Details",
      field: [
        {
          key: "approval_details",
          formatter: (cell) => (
            <StatusList status_list={cell || []} className="my-3" />
          ),
        },
      ],
    },
    {
      customContent: true,
      renderContent: (data) => {
        if (!data || !data.status) return null;

        // Action buttons based on status
        const renderActionButtons = () => {
          switch (data.status) {
            case "Pending Approval":
              return (
                <div className="flex flex-wrap justify-end gap-2 my-5">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={(event) => handleClick(event, "Rejected", data)}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={(event) => handleClick(event, "Approved", data)}
                  >
                    Approve
                  </Button>
                </div>
              );
            case "Scheduled":
              return (
                <div className="flex flex-wrap justify-end gap-2 my-5">
                  <Button
                    variant="outline"
                    onClick={(event) => handleClick(event, "Cancelled", data)}
                  >
                    Cancel Rotation
                  </Button>
                </div>
              );
            case "In Progress":
              return (
                <div className="flex flex-wrap justify-end gap-2 my-5">
                  <Button
                    onClick={(event) => handleClick(event, "Completed", data)}
                  >
                    Mark Complete
                  </Button>
                </div>
              );
            case "Overdue":
              return (
                <div className="flex flex-wrap justify-end gap-2 my-5">
                  <Button
                    variant="outline"
                    onClick={(event) => handleClick(event, "Extended", data)}
                  >
                    Extend Cap Time
                  </Button>
                  <Button
                    onClick={(event) => handleClick(event, "Completed", data)}
                  >
                    Mark Complete
                  </Button>
                </div>
              );
            default:
              return null;
          }
        };

        return renderActionButtons();
      },
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      // TODO: Replace with actual API call
      // const response = await getJobRotationData(id);

      // Mock: Find the rotation in DataList
      const rotation = DataList.find((item) => item.id === id);
      if (isMounted && rotation) {
        return rotation;
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
