import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { StatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import { getLeaveData } from "app/hooks/leaveTracker";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";

const ViewLeaveDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => { },
  DataList = [],
}) => {
  const [forceLoad, setForceLoad] = useState(false);
  
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
          formatter: (cell) => renderDate(cell, "--"),
        },
        {
          key: "end_date",
          label: "End Date",
          formatter: (cell) => renderDate(cell, "--"),
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
        return (
          <StatusButtons
            permissionKey={'MANAGE_LEAVE_REQUEST'}
            status={data?.status}
            current_approver={data.current_approver}
            final_approver={data.final_approvers}
            request_id={data.request_id}
            setResponse={(response, status) => {
              if (response) {
                setForceLoad(!forceLoad);
              }
            }}
          />
        );
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
