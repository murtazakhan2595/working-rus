import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import moment from "moment";
import { MapPin, Calendar, Banknote, Info, Tag } from "lucide-react";
import AttachmentUI from "components/ui/AttachmentUI";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteReimbursement } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { getExpenseType } from "utils/getValuesFromTables";
import { useSelector } from "react-redux";
import { saveReimbursement } from "app/hooks/payroll";
import { EmployeeOverview } from "components";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
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

const ReimbursementDetailsSheet = ({
  claimRequest,
  isOpen,
  setIsOpen,
  isMyClaims,
  reload,
  expenseTypeOptions,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);

  const formSheetData = {
    triggerText: null,
    title: "Reimbursement Details",
    description: null,
    footer: null,
  };

  // Format currency
  const formatCurrency = (value) => {
    return `AED ${parseFloat(value).toFixed(2)}`;
  };

  // Organize reimbursement details into sections
  const basicDetails = [
    { label: "Employee Name", value: claimRequest?.full_name || "N/A" },
    {
      label: "Expense Type",
      value: getExpenseType(claimRequest.expense_type, expenseTypeOptions),
    },
    { label: "Description", value: claimRequest.description },
    { label: "Claim ID", value: claimRequest.id },
  ];

  const expenseDetails = [
    {
      label: "Date of Expense",
      value: claimRequest.payment_date
        ? moment(claimRequest.payment_date).format("MMM D, YYYY")
        : "N/A",
      icon: <Calendar size={16} className="text-muted-foreground" />,
    },
    {
      label: "Amount",
      value: formatCurrency(claimRequest.amount),
      icon: <Banknote size={16} className="text-muted-foreground" />,
    },
    {
      label: "Status",
      value: claimRequest.status,
      icon: <Info size={16} className="text-muted-foreground" />,
    },
  ];

  // Modified to only show Manager and HR approval steps
  const approvalSteps = [
    {
      label: "Manager Approval",
      value: claimRequest?.status_manager?.status || "pending",
      icon:
        claimRequest?.status_manager?.status === "approved"
          ? statusApprovedIcon
          : claimRequest?.status_manager?.status === "rejected"
          ? statusRejectedIcon
          : statusPendingIcon,
      time: calculateTimeAgo(claimRequest?.status_manager?.date),
    },
    {
      label: "HR Approval",
      value: claimRequest?.status_hr?.status || "pending",
      icon:
        claimRequest?.status_hr?.status === "approved"
          ? statusApprovedIcon
          : claimRequest?.status_hr?.status === "rejected"
          ? statusRejectedIcon
          : statusPendingIcon,
      time: calculateTimeAgo(claimRequest?.status_hr?.date),
    },
    // Final approval removed from UI but will still be handled in the backend
  ];

  // Helper function to extract filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return "Attachment";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReimbursement(claimRequest.id);
      toast.success("Reimbursement deleted successfully");
      setIsDeleteDialogOpen(false);
      setIsOpen(false);
      if (reload) reload();
    } catch (error) {
      console.error("Error deleting reimbursement:", error);
      toast.error("Failed to delete reimbursement");
    }
  };

  const handleStatusChange = async (status) => {
    // Update the status based on user role
    if (userProfile.role === 3 || userProfile.role === 1) {
      // HR role
      claimRequest.status_hr = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };

      // Automatically update final approval when HR approves
      // This ensures the backend flow continues to work as expected
      claimRequest.status_superadmin = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }

    if (userProfile.role === 2) {
      // Manager role
      claimRequest.status_manager = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }

    if (userProfile.role === 1) {
      // Superadmin role - keeping this for backend compatibility
      claimRequest.status_superadmin = {
        status: status,
        date: moment().format("YYYY-MM-DD"),
      };
    }

    // Determine the overall claim request status
    // Modified to consider only manager and HR approval since final approval is auto-updated with HR
    if (
      claimRequest?.status_manager?.status === "approved" &&
      claimRequest?.status_hr?.status === "approved"
    ) {
      claimRequest.status = "approved";
      claimRequest.approval_date = moment().format("YYYY-MM-DD");
    } else if (status === "rejected") {
      claimRequest.status = "rejected";
      claimRequest.approval_date = null;
      claimRequest.rejection_date = moment().format("YYYY-MM-DD");
    }

    // Exclude the attachment field from the request
    const { attachment, ...updatedClaimRequest } = claimRequest;

    try {
      // Send the updated claim request (without the attachment)
      const response = await saveReimbursement(updatedClaimRequest);
      if (response) {
        toast.success("Claim request updated successfully");
        setIsOpen(false);
        reload();
      }
    } catch (error) {
      console.error("Error updating claim request:", error);
      toast.error("Failed to update claim request");
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
      // Superadmin role - keeping this for backend compatibility
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
        width="568px"
        setIsOpen={setIsOpen}
      >
        <div className="w-full p-0">
          <div className="flex flex-col">
            <div className="flex-grow">
              <div className="p-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleDeleteClick}
                      className="border bg-white border-[#e8e8ec] text-neutral-1200 text-xs font-semibold font-[inter]"
                    >
                      Delete
                    </Button>

                    {/* Delete Confirmation Dialog */}
                    {isDeleteDialogOpen && (
                      <AlertDialogue
                        isOpen={isDeleteDialogOpen}
                        setIsOpen={setIsDeleteDialogOpen}
                        handleContinue={handleConfirmDelete}
                        continueText="Delete"
                        title={`Are you sure you want to delete this reimbursement?`}
                        description="This action cannot be undone. Once deleted, the reimbursement data will be permanently removed."
                      />
                    )}
                  </div>
                </div>

                {/* Employee Overview */}
                <div className="font-[inter] mb-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                  <section className="flex flex-col justify-center p-6 text-sm bg-white">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Employee Information
                    </div>
                    <div className="flex w-full mt-3">
                      <EmployeeOverview
                        id={claimRequest.employeeid}
                        showEmail={true}
                      />
                    </div>
                  </section>
                </div>

                {/* Basic Details Section */}
                <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                  <section className="flex flex-col justify-center p-6 text-sm bg-white">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Basic Information
                    </div>
                    <div className="flex w-full mt-3">
                      <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                        {basicDetails.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center max-w-full gap-4 mt-4"
                          >
                            <div className="flex flex-col leading-none min-w-[88px] w-[132px]">
                              <div>{item.label}</div>
                            </div>
                            <div className="flex-1 leading-5 text-neutral-900 shrink basis-0">
                              {item.value || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                  <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div>
                        <span className="text-[#8b8d98] text-xs font-medium leading-tight">
                          Created on:
                        </span>
                        <span className="text-[#8b8d98] text-xs font-normal leading-3">
                          {` ${moment(claimRequest?.created_at).format(
                            "MMMM DD, YYYY"
                          )}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense Details Section */}
                <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                  <section className="flex flex-col justify-center p-6 text-sm bg-white">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Expense Information
                    </div>
                    <div className="flex w-full mt-3">
                      <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                        {expenseDetails.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center max-w-full gap-4 mt-4"
                          >
                            <div className="flex flex-col leading-none min-w-[88px] w-[132px]">
                              <div>{item.label}</div>
                            </div>
                            <div className="flex-1 leading-5 text-neutral-900 shrink basis-0 flex items-center gap-2 capitalize">
                              {item.icon}
                              {item.value || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                  <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div>
                        <span className="text-[#8b8d98] text-xs font-medium leading-tight">
                          Last updated:
                        </span>
                        <span className="text-[#8b8d98] text-xs font-normal leading-3">
                          {` ${moment(claimRequest?.updated_at).format(
                            "MMMM DD, YYYY"
                          )}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Status Section - Modified to only show Manager and HR approval */}
                <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                  <section className="flex flex-col justify-center p-6 text-sm bg-white">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Approval Status
                    </div>
                    <div className="flex w-full mt-3">
                      <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                        {approvalSteps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-center max-w-full gap-4 mt-4"
                          >
                            <div className="flex flex-col leading-none min-w-[88px] w-[132px]">
                              <div>{step.label}</div>
                            </div>
                            <div className="flex-1 leading-5 text-neutral-900 shrink basis-0 flex items-center gap-2">
                              <img
                                src={step.icon}
                                alt=""
                                className="object-contain self-stretch my-auto aspect-square w-[25px]"
                              />
                              <span className="capitalize">{step.value}</span>
                              {step.time && (
                                <span className="text-xs text-[#6B7280] ml-2">
                                  ({step.time})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Attachments Section */}
                {claimRequest.attachment && (
                  <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                    <section className="flex flex-col justify-center p-6 text-sm bg-white">
                      <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        Attachments
                      </div>
                      <div className="flex w-full mt-3">
                        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
                          <AttachmentUI
                            id="receipt"
                            attachment={claimRequest.attachment}
                            name={getFilenameFromUrl(claimRequest.attachment)}
                            viewOnly={true}
                            removeFile={() => {}} // Empty function since it's view only
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* Action Buttons */}
                {!isMyClaims && hasPendingApprovalForUser() ? (
                  <div className="flex justify-end mt-6 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleStatusChange("rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      variant="default"
                      onClick={() => handleStatusChange("approved")}
                    >
                      Accept
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetComponent>
    </div>
  );
};

export default ReimbursementDetailsSheet;
