import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { StatusLabel, SheetUI, EmployeeDetailUI } from "components";
import { getLeaveData } from "app/hooks/leaveTracker";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleRequest } from "app/hooks/general";

const ViewLeaveDetails = ({
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
  const handleSubmit = async (status, { request_id }) => {
    try {
      const response = await handleRequest(request_id, status === "Approved");
      // return
      if (response) {
        toast.success(`Request ${status} Successfully!`);
        setForceLoad(!forceLoad);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    }
  };
  const handleClick = (event, status, data) => {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit(status, data);
  };
  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
            <EmployeeOverview
              id={data.employee}
              showId={true}
              showEmail={true}
              avatarSize={16}
            />
            <StatusLabel className="ml-10" status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
          </div>
        );
      },
    },
    {
      title: "Employee Details",
      field: [
        {
          key: "employee",
          label: "",
          formatter: (cell) => (
            <EmployeeDetailUI
              id={cell}
              InformationKeys={[
                "name",
                "department",
                "position",
                "branch",
                "manager",
              ]}
              ViewVariant={"vertical"}
              className
            />
          ),
        },
      ],
    },
    {
      title: "Leave Details",
      footerTitle: "Request At",
      footerField: "created_at",
      field: [
        {
          key: "leave_type_name",
          label: "Leave Type",
        },
        {
          key: "allotted_count",
          label: "Alloted Leaves",
          formatter: (cell) => cell || "0",
        },
        {
          key: "consumed_count",
          label: "Consumed Leave",
          formatter: (cell) => cell || "0",
        },
        {
          key: "start_date",
          label: "Start Date",
          formatter: (cell) => renderDate(cell, "--", "time"),
        },
        {
          key: "end_date",
          label: "End Date",
          formatter: (cell) => renderDate(cell, "--", "time"),
        },
        {
          key: "leave_duration_name",
          label: "Leave Duration",
        },
        {
          key: "total_days",
          label: "Total Days",
          formatter: (cell) => cell || "0",
        },
        {
          key: "full_paid_days",
          label: "Full Paid Days",
          formatter: (cell) => cell || "0",
        },
        {
          key: "half_paid_days",
          label: "Half Paid Days",
          formatter: (cell) => cell || "0",
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
    },
    {
      title: "Approval Details",
      field: [
        {
          key: "approval_details",
          formatter: (cell) => (
            <StatusList status_list={cell} className="my-3" />
          ),
        },
      ],
    },
    {
      customContent: true,
      renderContent: (data) => {
        if (
          data &&
          data.status?.toLowerCase() === "pending" &&
          (data.current_approver === user_id || user_role.includes(1))
        )
          return (
            <div className="flex flex-wrap justify-end gap-2 my-5">
              <Button
                variant="success"
                onClick={(event) => handleClick(event, "Approved", data)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleClick(event, "Rejected", data)}
              >
                Reject
              </Button>
            </div>
          );
        return null;
      },
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getLeaveData(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Leave Details"
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        deleteItemName="name"
        editTooltip="Edit Leave"
        deleteTooltip="Delete Leavr"
      >
        <DetailContent fields={fields} />
      </NavigationSheetComponent>
    </>
  );
};

export default ViewLeaveDetails;
