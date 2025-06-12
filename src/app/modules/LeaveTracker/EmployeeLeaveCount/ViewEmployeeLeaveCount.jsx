import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI, EmployeeDetailUI } from "components";
import { getLeaveData } from "app/hooks/leaveTracker";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextAreaInput } from "components/FormControl";
import { handleRequest } from "app/hooks/general";

const FormSheetData = {
  triggerText: "Submit",
  title: "Reject Attendance Update Request",
  description: null,
  footer: null,
  className: "max-w-[478px] w-full h-[400px]",
};
const ViewEmployeeLeaveCount = ({
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
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [RejectedData, setRejectData] = useState(false);
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
  const handleRejectClick = (event, data) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenRejectModal(true);
    setRejectData(data);
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
          key: "leave_type_names",
          label: "Leave Type",
        },
        {
          key: "attendance_date",
          label: "Alloted Leaves",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "requested_checkin",
          label: "Consumed Leave",
          formatter: (cell) => renderDate(cell, "--", "time"),
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
        },
        {
          key: "full_paid_days",
          label: "Full Paid Days",
        },
        {
          key: "half_paid_days",
          label: "Half Paid Days",
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
                onClick={(event) => handleRejectClick(event, data)}
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
      {openRejectModal && (
        <SheetUI
          isOpen={openRejectModal}
          setIsOpen={setOpenRejectModal}
          variant="modal"
          sheetConfig={FormSheetData}
          formConfig={{
            initialValues: RejectedData,
            enableReinitialize: true,
            handleSubmit: (data) => {
              handleSubmit("Rejected", data);
            },
            validateFormSchema: (values) => {
              const error = {};
              if (!values.rejection_reason)
                error.rejection_reason = "Reason is required";
              return error;
            },
            submitButtonText: "Submit",
            cancelButtonText: "Cancel",
            columns: 1,
            formFields: [
              {
                sheetCardExtension: false,
                sheetCardTitle: "Attendance Details",
                InputFields: [
                  {
                    InputField: TextAreaInput,
                    name: "rejection_reason",
                    required: true,
                    label: "Rejection Reson",
                    rows: 3,
                  },
                ].filter(Boolean),
              },
            ],
          }}
        ></SheetUI>
      )}
    </>
  );
};

export default ViewEmployeeLeaveCount;
