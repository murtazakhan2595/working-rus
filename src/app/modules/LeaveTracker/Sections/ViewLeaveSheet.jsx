import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";
import { getExpenseType } from "utils/getValuesFromTables";
import { getFileSizeInKB } from "utils/fileUtils";
import { Paperclip } from "lucide-react";
import { filebase64Download } from "utils/fileUtils";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import statusRejectedIcon from "assets/images/status-rejected.svg";
import { getAttachmentById } from "app/hooks/leaveTracker";
import { saveLeaveTransaction } from "app/hooks/leaveTracker";

const ViewLeaveSheet = ({
  leaveApplication,
  isOpen,
  setIsOpen,
  isMyLeave,
  onClose,
  reload,
}) => {
  const [attachment, setAttachment] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      console.log("leaveApplication", leaveApplication);
      if (leaveApplication?.leave_request?.attachments) {
        const response = await getAttachmentById(
          leaveApplication?.leave_request?.attachments
        );
        if (response) {
          setAttachment(response);
        }
      }
    };
    fetchData();
  }, []);
  const userProfile = useSelector((state) => state.user.userProfile);
  const showButtons =
    (userProfile.role === 2 && leaveApplication.action_manager === "Pending") ||
    (userProfile.role === 3 && leaveApplication.action_hr === "Pending");

  const detailItems = [
    {
      label: "Leave Type",
      value: leaveApplication?.component_name,
    },
    {
      label: "Leave Dates",
      value: `${moment(leaveApplication?.leave_request?.start_date).format(
        "MMM D"
      )} - ${moment(leaveApplication?.leave_request?.end_date).format(
        "MMM D"
      )}`,
    },
    {
      label: "Number of Days",
      value: leaveApplication?.leave_request?.no_of_days,
    },
    { label: "Note", value: leaveApplication?.leave_request?.reason },
  ];
  const approvalSteps = [
    {
      icon:
        leaveApplication?.action_manager === "Approved"
          ? statusApprovedIcon
          : leaveApplication?.action_manager === "Declined"
          ? statusRejectedIcon
          : statusPendingIcon, // Check for rejected, else pending
      text: "Manager Approval",
    },
    {
      icon:
        leaveApplication?.action_hr === "Approved"
          ? statusApprovedIcon
          : leaveApplication?.status_hr === "Declined"
          ? statusRejectedIcon
          : statusPendingIcon, // Check for rejected, else pending
      text: "HR Approval",
    },
  ];

  const formSheetData = {
    triggerText: null,
    title: "Leave Requests",

    description: null,
    footer: null,
  };

  const handleStatusChange = async (status) => {
    console.log("handle status change", status, leaveApplication);
    if (
      (userProfile.role === 2 &&
        leaveApplication.action_manager !== "Pending") ||
      (userProfile.role === 3 && leaveApplication.action_hr !== "Pending")
    ) {
      return;
    }
    if (userProfile.role === 3 || userProfile.role === 1) {
      leaveApplication.action_hr = status;
    }
    if (userProfile.role === 2) {
      leaveApplication.action_manager = status;
    }
    const response = await saveLeaveTransaction(leaveApplication);
    if (response) {
      toast.success("Leave request updated successfully");
      setIsOpen(false);
      reload();
    } else {
      toast.error("Error updating leave request");
    }
  };

  console.log("attachment", attachment);

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={onClose}
        width="500px"
      >
        <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
          <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
            <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
              Details
            </div>
            <div className="flex mt-3 w-full">
              <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                {detailItems.map((item, index) => (
                  <div className="flex gap-4 items-center mt-4 max-w-full">
                    <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                      <div>{item.label}</div>
                    </div>
                    <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                      {item.value}
                    </div>
                  </div>
                ))}
                {attachment && (
                  <div className="flex gap-4 items-center mt-4 max-w-full">
                    <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                      <div>Attachment</div>
                    </div>
                    {attachment?.attachment && (
                      <div className="flex-1 shrink leading-5 basis-0 text-neutral-800 py-4 px-4 border border-[#f0f0f3] flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Paperclip size={16} />
                          <div className="text-[#1c2024] text-sm font-medium truncate max-w-14">
                            {attachment?.attachment?.name}
                          </div>
                          <div className="text-[#8b8d98] text-sm font-normal">
                            {getFileSizeInKB(attachment?.attachment?.file)}KB
                          </div>
                        </div>
                        <button
                          className="text-[#ab4aba] text-xs font-semibold "
                          onClick={() => {
                            filebase64Download(attachment?.attachment);
                          }}
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
          <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
              <div>
                <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                  Created on:
                </span>
                <span className="text-[#8b8d98] text-xs font-normal  leading-3">
                  {` ${moment(leaveApplication?.created_at).format(
                    "MMMM DD, YYYY"
                  )}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
          <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
            <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
              Approval Status
            </div>
            <section className="flex relative flex-col max-w-[382px] mt-3">
              <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
              {approvalSteps.map((step, index) => (
                <div className="flex z-0 gap-10 justify-between items-center w-full">
                  <div className="flex gap-4 self-stretch my-auto w-[194px]">
                    <div className="flex justify-center items-center px-1 bg-white h-[33px] w-[33px]">
                      <img
                        loading="lazy"
                        src={step.icon}
                        alt=""
                        className="object-contain self-stretch my-auto aspect-square w-[25px]"
                      />
                    </div>
                    <div className="py-0.5 my-auto text-xs leading-loose text-[#6B7280] min-h-[24px]">
                      {step.text}
                    </div>
                  </div>
                  {step.time && (
                    <div className="self-stretch py-0.5 my-auto text-xs leading-loose text-[#6B7280]">
                      {step.time}
                    </div>
                  )}
                </div>
              ))}
            </section>
          </section>
        </div>
        {!isMyLeave && showButtons && (
          <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => {
                handleStatusChange("Declined");
              }}
            >
              Reject
            </Button>
            <Button
              type="button"
              size="lg"
              variant="default"
              // className=" bg-[#1c2024] text-white"
              onClick={() => {
                handleStatusChange("Approved");
              }}
            >
              Accept
            </Button>
          </div>
        )}
      </SheetComponent>
    </div>
  );
};

export default ViewLeaveSheet;
