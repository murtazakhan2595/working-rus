import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";
import { getExpenseType } from "utils/getValuesFromTables";
import { filebase64Download } from "utils/fileUtils";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveReimbursement } from "app/hooks/payroll";
import statusRejectedIcon from "assets/images/status-rejected.svg";
import { DetailCard, DetailBox, DisplayFile } from "components/SheetCardExtension";

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
  reload,
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
    if (userProfile.role === 3) {
      claimRequest.status_hr = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }
    if (userProfile.role === 2) {
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
    if (
      claimRequest?.status_manager?.status === "approved" &&
      claimRequest?.status_hr?.status === "approved" &&
      claimRequest?.status_superadmin?.status === "approved"
    ) {
      claimRequest.status = "approved";
      claimRequest.approval_date = moment().format("YYYY-MM-DD");
    } else if (status === "rejected") {
      claimRequest.status = "rejected";
      claimRequest.approval_date = null;
      claimRequest.rejection_date = moment().format("YYYY-MM-DD");
    }
    const response = await saveReimbursement(claimRequest);
    if (response) {
      toast.success("Claim request updated successfully");
      setIsOpen(false);
      reload();
    }
  };
  const hasPendingApprovalForUser = () => {
    if (userProfile.role === 3) {
      // HR role
      return claimRequest?.status_hr?.status === "pending";
    } else if (userProfile.role === 2) {
      // Manager role
      return claimRequest?.status_manager?.status === "pending";
    } else if (userProfile.role === 1) {
      // Superadmin role
      return claimRequest?.status_superadmin?.status === "pending";
    }
    return false;
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        
      >
        <EmployeeDataInfo
          name={claimRequest.full_name}
          email={claimRequest.work_email}
          id={claimRequest.employeeid}
        />
        <DetailCard
          detailCardTitle="Details"
          date={` ${moment(claimRequest?.date_of_expense).format(
            "MMMM DD, YYYY"
          )}`}
          dateTitle="Create on:"
        >
          <div className="flex w-full mt-3">
            <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
              {detailItems.map((item, index) => (
                <DetailBox label={item?.label} value={item?.value} />
              ))}
              <div className="flex items-center max-w-full gap-4 mt-4">
                <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                  <div className="text-neutral-900">Attachment</div>
                </div>
                {claimRequest?.attachment?.file ? (
                  <DisplayFile
                    firstName="Receipt"
                    lastName=""
                    file={claimRequest?.attachment?.file}
                    onDownload={()=>filebase64Download(claimRequest?.attachment)}
                  />
                ) : (
                  "No attachment found"
                )}
              </div>
            </div>
          </div>
        </DetailCard>

        <DetailCard detailCardTitle="Approval Status">
          <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
          {approvalSteps.map((step, index) => (
            <div className="z-0 flex items-center justify-between w-full gap-10">
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
        </DetailCard>
        {!isMyClaims && hasPendingApprovalForUser() && (
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
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
              // className=" bg-[#1c2024] text-white"
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
