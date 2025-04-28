import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import moment from "moment";
import { Button } from "components/ui/button";
import { filebase64Download, getFileSizeInKB } from "utils/fileUtils";
import AttachmentUI from "components/ui/AttachmentUI";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
import statusRejectedIcon from "assets/images/status-rejected.svg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAttachmentById } from "app/hooks/assets"; // Assuming similar function exists for assets
import { requestAsset } from "app/hooks/assets"; // Assuming this function exists
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { getDesignationName } from "utils/getValuesFromTables";
import { EmployeeOverview } from "components";
import { getDepartmentName } from "utils/getValuesFromTables";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { TextAreaInput } from "components/FormControl";
const AssetRequestViewSheet = ({
  request, // Updated from assetRequest to match what's being passed
  isOpen,
  setIsOpen,
  isMyRequest = false,
  reload,
}) => {
  // For compatibility with the existing prop structure
  const assetRequest = request;
  const [attachments, setAttachments] = useState([]);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Handle attachments if they exist in the asset
      if (
        assetRequest?.asset?.attachments &&
        assetRequest.asset.attachments.length > 0
      ) {
        const validAttachments = assetRequest.asset.attachments.filter(
          (att) => att.attachment !== null
        );
        setAttachments(validAttachments);
      }
    };

    if (assetRequest) {
      fetchData();
    }
  }, [assetRequest]);

  const userProfile = useSelector((state) => state.user.userProfile);

  // Only show approval buttons for admin/manager roles and when status is Pending
  const showButtons =
    !isMyRequest &&
    assetRequest?.asset_status === "Pending" &&
    (userProfile.role === 2 ||
      userProfile.role === 3 ||
      userProfile.role === 1);

  const isApproved =
    assetRequest?.asset_status === "Approved" ||
    assetRequest?.asset_status === "Accepted";

  const detailItems = [
    // Only show Asset ID if not my request OR if approved
    (!isMyRequest || isApproved) && {
      label: "Asset ID",
      value: assetRequest?.asset?.id || "Not specified",
    },
    {
      label: "Asset Name",
      value: assetRequest?.asset?.asset_name || assetRequest?.asset_name,
    },
    {
      label: "Asset Type",
      value: assetRequest?.asset?.asset_type || "Not specified",
    },
    // Only show Model if not my request OR if approved
    (!isMyRequest || isApproved) && {
      label: "Model",
      value: assetRequest?.asset?.asset_model || "Not specified",
    },
    // Only show Specifications if not my request OR if approved
    (!isMyRequest || isApproved) && {
      label: "Specifications",
      value: assetRequest?.asset?.asset_description || "Not specified",
    },
    // Only show Serial Number if not my request OR if approved
    (!isMyRequest || isApproved) && {
      label: "Serial Number",
      value: assetRequest?.asset?.asset_serial_number || "Not specified",
    },
    {
      label: "Location",
      value: assetRequest?.asset?.asset_location_name || "Not specified",
    },
    !isMyRequest && {
      label: "Purchase Date",
      value: assetRequest?.asset?.asset_purchase_date
        ? moment(assetRequest?.asset?.asset_purchase_date).format("MMM D, YYYY")
        : "Not specified",
    },
    !isMyRequest && {
      label: "Warranty Expiry",
      value: assetRequest?.asset?.asset_warranty_expiry
        ? moment(assetRequest?.asset?.asset_warranty_expiry).format(
            "MMM D, YYYY"
          )
        : "Not specified",
    },
    {
      label: "Initial Condition",
      value: assetRequest?.asset?.asset_initial_condition || "Not specified",
    },
    !isMyRequest && {
      label: "Purchase Cost",
      value: assetRequest?.asset?.asset_purchase_price
        ? `$${assetRequest?.asset?.asset_purchase_price.toFixed(2)}`
        : "Not specified",
    },
    {
      label: "Request Date",
      value: moment(assetRequest?.created_at).format("MMM D, YYYY"),
    },
    {
      label: "Assigned Date",
      value: assetRequest?.asset_assigned_date
        ? moment(assetRequest?.asset_assigned_date).format("MMM D, YYYY")
        : "Not assigned yet",
    },
    assetRequest?.asset_return_date && {
      label: "Return Date",
      value: moment(assetRequest?.asset_return_date).format("MMM D, YYYY"),
    },
    assetRequest?.additional_notes && {
      label: "Additional Notes",
      value: assetRequest?.additional_notes,
    },
  ].filter(Boolean); // Filter out any false entries

  const approvalSteps = [
    {
      icon:
        assetRequest?.asset_status === "Approved" ||
        assetRequest?.asset_status === "Accepted"
          ? statusApprovedIcon
          : assetRequest?.asset_status === "Rejected" ||
            assetRequest?.asset_status === "Declined"
          ? statusRejectedIcon
          : statusPendingIcon,
      text: "Request Approval",
    },
  ];

  const formSheetData = {
    triggerText: null,
    title: "Asset Request Details",
    description: null,
    footer: null,
  };

  const handleStatusChange = async (status) => {
    
    console.log("handle status change", status, assetRequest);
    setIsSubmittingRejection(true);
    if (assetRequest?.asset_status !== "Pending") {
      return;
    }

    try {
      let updatedRequest = {};
      if (isMyRequest) {
        updatedRequest = {
          ...assetRequest,
          asset_status: status,
        };
      } else {
        updatedRequest = {
          ...assetRequest,
          asset_status: status,
          asset_assigned_by: userProfile.id,
          asset_assigned_date:
            status === "Accepted" ? moment().format("YYYY-MM-DD") : null,
        };
      }
      if (status === "Rejected") {
        updatedRequest.rejection_reason = rejectionReason;
      }
      console.log("updatedRequest", updatedRequest);

      const response = await requestAsset(updatedRequest);

      if (response) {
        setIsSubmittingRejection(false);
        setRejectionReason("");
        setShowRejectReason(false);
        toast.success("Asset request updated successfully");

        setIsOpen(false);
        reload();

      } else {
         setIsSubmittingRejection(false);
         setRejectionReason("");
         setShowRejectReason(false);
        toast.error("Error updating asset request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Error updating request: " + error.message);
    }
  };
  // Handle rejection submission
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    handleStatusChange("Rejected");
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="600px"
      >
        <div className="flex items-center justify-between w-full gap-4 ">
          <EmployeeOverview
            id={assetRequest?.employee?.id}
            showEmail={true}
            showDepartment={true}
            showPosition={true}
            showId={true}
            showBranchName={true}
          />
          {isMyRequest && (
            <Button
              variant="destructiveOutline"
              onClick={(status) => {
                handleStatusChange("Withdrawal");
              }}
            >
              Withdraw Asset
            </Button>
          )}
        </div>

        {/* Details Section */}
        <DetailCard
          date={assetRequest?.created_at}
          detailCardTitle="Request Details"
        >
          <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
            {detailItems.map((item, index) => (
              <DetailBox key={index} label={item?.label} value={item?.value} />
            ))}

            {/* Attachments Section */}
            {attachments && attachments.length > 0 && (
              <div className="flex items-center max-w-full gap-4 mt-4">
                <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
                  <div>Attachments</div>
                </div>
                <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                  {attachments.map(
                    (attachment, index) =>
                      attachment.attachment && (
                        <AttachmentUI
                          key={attachment.id || index}
                          id={attachment.id}
                          attachment={attachment.attachment}
                          name={attachment.attachment.split("/").pop()}
                          viewOnly={true}
                          removeFile={() => {}} // Empty function since it's view only
                        />
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </DetailCard>

        {/* Approval Status Section */}
        <DetailCard detailCardTitle="Request Status">
          <div className="flex items-center justify-between w-full gap-4">
            <section className="flex relative flex-col max-w-[382px] mt-3">
              <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
              {approvalSteps.map((step, index) => (
                <div
                  key={index}
                  className="z-0 flex items-center justify-between w-full gap-10"
                >
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
            <div>
              rejection reason here
            </div>
          </div>
        </DetailCard>

        {/* Approval Buttons */}
        {!isMyRequest && showButtons && (
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => setShowRejectReason(true)}
            >
              Reject with Reason
            </Button>
            {/* <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => {
                handleStatusChange("Rejected");
              }}
            >
              Reject
            </Button> */}
            <Button
              type="button"
              size="lg"
              variant="default"
              onClick={() => {
                handleStatusChange("Accepted");
              }}
            >
              Accept
            </Button>
          </div>
        )}

        {/* Close Button for non-pending or my requests */}
        {(isMyRequest || assetRequest?.asset_status !== "Pending") && (
          <div className="flex justify-end pt-6">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </SheetComponent>
      <RejectionReasonDialog
        open={showRejectReason}
        onOpenChange={setShowRejectReason}
        onSubmit={handleReject}
        isSubmitting={isSubmittingRejection}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
    </div>
  );
};

const RejectionReasonDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  reason,
  setReason,
}) => {
  const [touched, setTouched] = useState(false);


  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setReason("");
      setTouched(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TextAreaInput
            name="rejection_reason"
            error={touched && reason.trim() === ""}
            touch={touched}
            value={reason}
            label={"Rejection Reason"}
            required={true}
            onChange={(field, value) => {
              setReason(value);
            }}
            maxRows={3}
            placeholder={"Please provide a reason for rejecting this request"}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={reason.trim() === "" || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AssetRequestViewSheet;
