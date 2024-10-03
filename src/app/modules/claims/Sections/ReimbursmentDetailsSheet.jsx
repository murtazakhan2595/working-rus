import { useState } from "react";
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
import { saveReimbursement } from "app/hooks/payroll";
import statusRejectedIcon from "assets/images/status-rejected.svg";


// Function to calculate "X days ago"
const calculateTimeAgo = (date) => {
  if (!date) return null; // Handle null dates
  const now = moment(); // Current date
  const approvalDate = moment(date); // Approval date
  const diffInDays = now.diff(approvalDate, "days"); // Difference in days

  if (diffInDays === 0) {
    return "Today"; // If it's the same day
  } else if (diffInDays === 1) {
    return "1d ago"; // If it was 1 day ago
  } else {
    return `${diffInDays}d ago`; // Otherwise, show X days ago
  }
};

const ReimbursmentDetailsSheet = ({
  claimRequest,
  isOpen,
  setIsOpen,
  isMyClaims,
  employeeData,
  reload
}) => {
  const detailItems = [
    {
      label: "Expense type",
      value: getExpenseType(claimRequest.expense_type),
    },
    { label: "Amount", value: claimRequest.amount },
    { label: "Date of Expense", value: claimRequest.payment_date },
    { label: "Description", value: claimRequest.description },
  ];
const approvalSteps = [
  {
    icon:
      claimRequest?.status_manager?.status === "approved"
        ? statusApprovedIcon
        : claimRequest?.status_manager?.status === "rejected"
        ? statusRejectedIcon
        : statusPendingIcon, // Check for rejected, else pending
    text: "Manager Approval",
    time: calculateTimeAgo(claimRequest?.status_manager?.date),
  },
  {
    icon:
      claimRequest?.status_hr?.status === "approved"
        ? statusApprovedIcon
        : claimRequest?.status_hr?.status === "rejected"
        ? statusRejectedIcon
        : statusPendingIcon, // Check for rejected, else pending
    text: "HR Approval",
    time: calculateTimeAgo(claimRequest?.status_hr?.date),
  },
  {
    icon:
      claimRequest?.status_superadmin?.status === "approved"
        ? statusApprovedIcon
        : claimRequest?.status_superadmin?.status === "rejected"
        ? statusRejectedIcon
        : statusPendingIcon, // Check for rejected, else pending
    text: "Final Approval",
    time: calculateTimeAgo(claimRequest?.status_superadmin?.date),
  },
];

  const formSheetData = {
    triggerText: null,
    title: "Reimbursment requests",

    description: null,
    footer: null,
  };
  const userProfile = useSelector((state) => state.user.userProfile);

  const handleStatusChange = async (status) => {
    console.log(userProfile);
    if(userProfile.role === 3){
      claimRequest.status_hr = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }
    if(userProfile.role === 2){
      claimRequest.status_manager = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }
    if (userProfile.role === 1) {
      claimRequest.status_superadmin = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }
    if(claimRequest?.status_manager?.status === "approved" && claimRequest?.status_hr?.status === "approved" && claimRequest?.status_superadmin?.status === "approved"){
      claimRequest.status = "approved";
      claimRequest.approval_date = moment().format("YYYY-MM-DD");
    }
    else if(status === "rejected"){
      claimRequest.status = "rejected";
      claimRequest.approval_date = null;
      claimRequest.rejection_date= moment().format("YYYY-MM-DD");
    }
     const response = await saveReimbursement(claimRequest);
     if (response) {
       toast.success("Claim request updated successfully");
       setIsOpen(false);
       reload()
     }
  }

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="500px"
      >
        <EmployeeDataInfo
          name={claimRequest.full_name}
          email={claimRequest.work_email}
          id={claimRequest.employeeid}
        />
        <div className="font-inter mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
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
                <div className="flex gap-4 items-center mt-4 max-w-full">
                  <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                    <div>Attachment</div>
                  </div>
                  <div className="flex-1 shrink leading-5 basis-0 text-neutral-800 py-4 px-4 border border-[#f0f0f3] flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Paperclip size={16} />
                      <div className="text-[#1c2024] text-sm font-medium ">
                        Receipt
                      </div>
                      <div className="text-[#8b8d98] text-sm font-normal">
                        {getFileSizeInKB(claimRequest?.attachment?.file)}KB
                      </div>
                    </div>
                    <button
                      className="text-[#ab4aba] text-xs font-semibold "
                      onClick={() => {
                        filebase64Download(claimRequest?.attachment);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
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
                  {` ${moment(claimRequest?.date_of_expense).format(
                    "MMMM DD, YYYY"
                  )}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="font-inter mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
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
        {!isMyClaims && (
          <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                handleStatusChange("rejected");
              }}
            >
              Reject
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="default"
              className=" bg-[#1c2024] text-white"
              onClick={() => {
                handleStatusChange("approved");
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


export default ReimbursmentDetailsSheet;