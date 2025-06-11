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
            formFiels: [
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

export default ViewLeaveDetails;

// import { useEffect, useState } from "react";
// import SheetComponent from "components/ui/SheetComponent";
// import moment from "moment";
// import { Button } from "components/ui/button";
// import { EmployeeOverview } from "components";
// import { getFileSizeInKB } from "utils/fileUtils";
// import { Paperclip } from "lucide-react";
// import { filebase64Download } from "utils/fileUtils";
// import statusApprovedIcon from "assets/images/status-approved.png";
// import statusPendingIcon from "assets/images/status-pending.svg";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import statusRejectedIcon from "assets/images/status-rejected.svg";
// import { getAttachmentById } from "app/hooks/leaveTracker";
// import { saveLeaveTransaction } from "app/hooks/leaveTracker";
// import { DetailBox, DetailCard } from "components/SheetCardExtension";

// const ViewLeaveDetails = ({
//   leaveApplication,
//   isOpen,
//   setIsOpen,
//   isMyLeave,
//   onClose,
//   reload,
//   isTeamView = false,
// }) => {
//   const [attachment, setAttachment] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("leaveApplication", leaveApplication);
//       if (leaveApplication?.leave_request?.attachments) {
//         const response = await getAttachmentById(
//           leaveApplication?.leave_request?.attachments
//         );
//         if (response) {
//           setAttachment(response);
//         }
//       }
//     };
//     fetchData();
//   }, []);
//   const userProfile = useSelector((state) => state.user.userProfile);
//   const userRole = isTeamView ? 2 : userProfile.role;
//   const showButtons =
//     (userRole === 2 && leaveApplication.action_manager === "Pending") ||
//     (userRole === 3 && leaveApplication.action_hr === "Pending");

//   const detailItems = [
//     {
//       label: "Leave Type",
//       value: leaveApplication?.component_name,
//     },
//     {
//       label: "Leave Dates",
//       value: `${moment(leaveApplication?.leave_request?.start_date).format(
//         "MMM D"
//       )} - ${moment(leaveApplication?.leave_request?.end_date).format(
//         "MMM D"
//       )}`,
//     },
//     {
//       label: "Number of Days",
//       value: leaveApplication?.leave_request?.no_of_days,
//     },
//     { label: "Note", value: leaveApplication?.leave_request?.reason },
//   ];
//   const approvalSteps = [
//     {
//       icon:
//         leaveApplication?.action_manager === "Approved"
//           ? statusApprovedIcon
//           : leaveApplication?.action_manager === "Declined"
//           ? statusRejectedIcon
//           : statusPendingIcon, // Check for rejected, else pending
//       text: "Manager Approval",
//     },
//     {
//       icon:
//         leaveApplication?.action_hr === "Approved"
//           ? statusApprovedIcon
//           : leaveApplication?.status_hr === "Declined"
//           ? statusRejectedIcon
//           : statusPendingIcon, // Check for rejected, else pending
//       text: "HR Approval",
//     },
//   ];

//   const formSheetData = {
//     triggerText: null,
//     title: "Leave Requests",

//     description: null,
//     footer: null,
//   };

//   const handleStatusChange = async (status) => {
//     console.log("handle status change", status, leaveApplication);
//     if (
//       (userRole === 2 &&
//         leaveApplication.action_manager !== "Pending") ||
//       (userRole === 3 && leaveApplication.action_hr !== "Pending")
//     ) {
//       return;
//     }
//     if (userRole === 3 || userRole === 1) {
//       leaveApplication.action_hr = status;
//     }
//     if (userRole === 2) {
//       leaveApplication.action_manager = status;
//     }
//     const response = await saveLeaveTransaction(leaveApplication);
//     if (response) {
//       toast.success("Leave request updated successfully");
//       setIsOpen(false);
//       reload();
//     } else {
//       toast.error("Error updating leave request");
//     }
//   };

//   return (
//     <div>
//       <SheetComponent
//         {...formSheetData}
//         contentClassName="custom-sheet-width"
//         isOpen={isOpen}
//         setIsOpen={onClose}
//         width="600px"
//       >
//         <EmployeeOverview
//           id={leaveApplication?.leave_request?.employee_info?.id}
//           showEmail={true}
//         />
//         <DetailCard
//           date={leaveApplication?.created_at}
//           detailCardTitle="Details"
//         >
//           <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
//             {detailItems.map((item, index) => (
//               <DetailBox label={item?.label} value={item?.value} />
//             ))}
//             {attachment && (
//               <div className="flex items-center max-w-full gap-4 mt-4">
//                 <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
//                   <div>Attachment</div>
//                 </div>
//                 {attachment?.attachment && (
//                   <div className="flex-1 shrink leading-5 basis-0 text-neutral-800 py-4 px-4 border border-[#f0f0f3] flex items-center gap-4">
//                     <div className="flex items-center gap-2">
//                       <Paperclip size={16} />
//                       <div className="text-sm font-medium truncate text-neutral-1200 max-w-14">
//                         {attachment?.attachment?.name}
//                       </div>
//                       <div className="text-[#8b8d98] text-sm font-normal">
//                         {getFileSizeInKB(attachment?.attachment?.file)}KB
//                       </div>
//                     </div>
//                     <button
//                       className="text-[#ab4aba] text-xs font-semibold "
//                       onClick={() => {
//                         filebase64Download(attachment?.attachment);
//                       }}
//                     >
//                       Download
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </DetailCard>

//         <DetailCard detailCardTitle="Approval Status">
//           <section className="flex relative flex-col max-w-[382px] mt-3">
//             <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
//             {approvalSteps.map((step, index) => (
//               <div className="z-0 flex items-center justify-between w-full gap-10">
//                 <div className="flex gap-4 self-stretch my-auto w-[194px]">
//                   <div className="flex justify-center items-center px-1 bg-white h-[33px] w-[33px]">
//                     <img
//                       loading="lazy"
//                       src={step.icon}
//                       alt=""
//                       className="object-contain self-stretch my-auto aspect-square w-[25px]"
//                     />
//                   </div>
//                   <div className="py-0.5 my-auto text-xs leading-loose text-[#6B7280] min-h-[24px]">
//                     {step.text}
//                   </div>
//                 </div>
//                 {step.time && (
//                   <div className="self-stretch py-0.5 my-auto text-xs leading-loose text-[#6B7280]">
//                     {step.time}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </section>
//         </DetailCard>
//         {!isMyLeave && showButtons && (
//           <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
//             <Button
//               variant="outline"
//               type="button"
//               size="lg"
//               onClick={() => {
//                 handleStatusChange("Declined");
//               }}
//             >
//               Reject
//             </Button>
//             <Button
//               type="button"
//               size="lg"
//               variant="default"
//               // className=" bg-[#1c2024] text-white"
//               onClick={() => {
//                 handleStatusChange("Approved");
//               }}
//             >
//               Accept
//             </Button>
//           </div>
//         )}
//       </SheetComponent>
//     </div>
//   );
// };

// export default ViewLeaveDetails;
