import React, { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import moment from "moment";
import { Button } from "components/ui/button";
import { filebase64Download, getFileSizeInKB } from "utils/fileUtils";
import AttachmentUI from "components/ui/AttachmentUI";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
import statusRejectedIcon from "assets/images/status-rejected.svg";
import statusWithdrawalIcon from "assets/images/status-withdrawal.svg";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAttachmentById,
  requestAsset,
  getAssetList,
} from "app/hooks/assets";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { getDesignationName } from "utils/getValuesFromTables";
import { EmployeeOverview } from "components";
import { getDepartmentName } from "utils/getValuesFromTables";
import { FileMinus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { TextAreaInput, SelectInputComponent } from "components/FormControl";
import { StatusList } from "components";
import { updateAsset } from "app/hooks/assets";

const AssetRequestViewSheet = ({
  request,
  isOpen,
  setIsOpen,
  isMyRequest = false,
  reload,
}) => {
  const assetRequest = request;
  const [attachments, setAttachments] = useState([]);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  const [showAssetSelection, setShowAssetSelection] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  console.log("AssetRequestViewSheet", assetRequest);

  useEffect(() => {
    const fetchData = async () => {
      // Handle attachments if they exist in the assigned asset
      if (
        assetRequest?.assigned_asset?.attachments &&
        assetRequest.assigned_asset.attachments.length > 0
      ) {
        const validAttachments = assetRequest.assigned_asset.attachments.filter(
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
    {
      label: "Category",
      value:
        assetRequest?.asset?.asset_type?.name ||
        assetRequest?.category?.name ||
        "Not specified",
    },
    // Show assigned asset details if available
    assetRequest?.asset && {
      label: "Assigned Asset",
      value: assetRequest.asset.asset_name,
    },
    assetRequest?.asset && {
      label: "Asset ID",
      value: assetRequest.asset.id,
    },
    ...Object.entries(assetRequest?.asset?.dynamic_field_values || {}).map(
      ([key, value]) => ({
        label: key,
        value: value || "Not specified",
      })
    ),
    {
      label: "Location",
      value:
        assetRequest?.asset?.asset_location_name || "(Not assigned)",
    },
    !isMyRequest &&
      assetRequest?.asset && {
        label: "Purchase Date",
        value: assetRequest.asset.asset_purchase_date
          ? moment(assetRequest.asset.asset_purchase_date).format("MMM D, YYYY")
          : "Not specified",
      },
    !isMyRequest &&
      assetRequest?.asset && {
        label: "Warranty Expiry",
        value: assetRequest.asset.asset_warranty_expiry
          ? moment(assetRequest.asset.asset_warranty_expiry).format(
              "MMM D, YYYY"
            )
          : "Not specified",
      },
    assetRequest?.asset && {
      label: "Initial Condition",
      value: assetRequest.asset.asset_initial_condition || "Not specified",
    },
    !isMyRequest &&
      assetRequest?.asset && {
        label: "Purchase Cost",
        value: assetRequest.asset.asset_purchase_price
          ? `$${assetRequest.asset.asset_purchase_price.toFixed(2)}`
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
    assetRequest?.reason && {
      label: "Reason",
      value: assetRequest?.reason,
    },
  ].filter(Boolean);

  const approvalSteps = [
    {
      icon:
        assetRequest?.asset_status === "Approved" ||
        assetRequest?.asset_status === "Accepted"
          ? statusApprovedIcon
          : assetRequest?.asset_status === "Rejected" ||
            assetRequest?.asset_status === "Declined"
          ? statusRejectedIcon
          : assetRequest?.asset_status === "Withdrawal"
          ? statusWithdrawalIcon
          : statusPendingIcon,
      text:
        assetRequest?.asset_status === "Approved" ||
        assetRequest?.asset_status === "Accepted"
          ? "Request Approved"
          : assetRequest?.asset_status === "Rejected" ||
            assetRequest?.asset_status === "Declined"
          ? "Request Rejected"
          : assetRequest?.asset_status === "Withdrawal"
          ? "Request Withdrawn"
          : "Request Pending",
    },
  ];

  const formSheetData = {
    title: "Asset Request Details",
    description: null,
    footer: null,
  };

  // NEW: Fetch available assets for assignment
  const fetchAvailableAssets = async () => {
    if (!assetRequest?.category_id) return;

    setIsLoadingAssets(true);
    try {
      const response = await getAssetList({
        options: { page: 1, sizePerPage: 100 },
        filterData: {
          category_id: assetRequest.category_id,
          asset_status: "Unassigned",
        },
      });

      if (response?.results) {
        const formattedAssets = response.results.map((asset) => ({
          value: asset.id,
          label: `${asset.asset_name} - ${Object.values(
            asset.dynamic_field_values || {}
          ).join(", ")}`,
          asset: asset,
        }));
        setAvailableAssets(formattedAssets);
      }
    } catch (error) {
      console.error("Error fetching available assets:", error);
      toast.error("Failed to load available assets");
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleStatusChange = async (status) => {
    console.log("handle status change", status, assetRequest);
    if (status === "Accepted" && !isMyRequest) {
      if (assetRequest?.asset?.id || assetRequest?.asset_name) {
        handleDirectApproval();
      } else {
        setShowAssetSelection(true);
        fetchAvailableAssets();
      }
      return;
    }

    setIsSubmittingRejection(true);
    if (assetRequest?.asset_status !== "Pending") {
      return;
    }

    try {
      let updatedRequest = {};
      if (isMyRequest) {
        updatedRequest = {
          ...assetRequest,
        };
      } else {
        updatedRequest = {
          ...assetRequest,
          asset_assigned_by: userProfile.id,
          asset_assigned_date:
            status === "Accepted" ? moment().format("YYYY-MM-DD") : null,
        };
      }
      if (status === "Rejected") {
        updatedRequest.rejection_reason = rejectionReason;
      }
      if (status === "Withdrawal" && isMyRequest) {
        updatedRequest.asset_status = "Withdrawal"; // This is user action, not approval hierarchy
      }
      console.log("updatedRequest", updatedRequest);

      // Function to remove null/undefined values from payload
      const cleanPayload = (obj) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== null && value !== undefined && value !== "") {
            cleaned[key] = value;
          }
        }
        return cleaned;
      };

      // Clean the payload
      const cleanedPayload = cleanPayload(updatedRequest);
      console.log("cleanedPayload", cleanedPayload);

      const response = await requestAsset(cleanedPayload);

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
  const handleDirectApproval = async () => {
    setIsSubmittingRejection(true);
    try {
      const updatedRequest = {
        ...assetRequest,
        asset_assigned_by: userProfile.id,
        asset_assigned_date: moment().format("YYYY-MM-DD"),
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        // Update asset status to "Assigned" if asset is assigned
        if (assetRequest?.asset?.id || assetRequest?.asset_name) {
          try {
            const assetId = assetRequest.asset?.id || assetRequest.asset_name;
            const assetStatusUpdatePayload = {
              id: assetId,
              asset_status: "Assigned",
            };
            await updateAsset(assetStatusUpdatePayload);
            console.log("Asset status updated to Assigned");
          } catch (assetError) {
            console.error("Error updating asset status:", assetError);
            toast.warning("Request approved but asset status update failed");
          }
        }

        toast.success("Request approved successfully");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error approving request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Error approving request: " + error.message);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  const handleAssetAssignment = async () => {
    if (!selectedAssetId) {
      toast.error("Please select an asset to assign");
      return;
    }

    setIsSubmittingRejection(true);
    try {
      const updatedRequest = {
        ...assetRequest,
        assigned_asset_id: selectedAssetId,
        asset_assigned_by: userProfile.id,
        asset_assigned_date: moment().format("YYYY-MM-DD"),
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        toast.success("Asset assigned successfully");
        setShowAssetSelection(false);
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error assigning asset");
      }
    } catch (error) {
      console.error("Error assigning asset:", error);
      toast.error("Error assigning asset: " + error.message);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  const handleRejectWithAssetReversion = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setIsSubmittingRejection(true);
    try {
      // Step 1: Update request status and reason
      const updatedRequest = {
        ...assetRequest,
        asset_status: "Rejected",
        rejection_reason: rejectionReason,
        asset_assigned_by: userProfile.id,
      };

      const cleanedPayload = (obj) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== null && value !== undefined && value !== "") {
            cleaned[key] = value;
          }
        }
        return cleaned;
      };

      const response = await requestAsset(cleanedPayload(updatedRequest));

      if (response) {
        // Step 2: Revert asset status if asset was assigned
        if (assetRequest?.asset?.id || assetRequest?.asset_name) {
          try {
            const assetId = assetRequest.asset?.id || assetRequest.asset_name;
            const assetStatusRevertPayload = {
              id: assetId,
              asset_status: "Unassigned",
            };
            await updateAsset(assetStatusRevertPayload);
            console.log("Asset status reverted to Unassigned");
          } catch (assetError) {
            console.error("Error reverting asset status:", assetError);
            toast.warning("Request rejected but failed to revert asset status");
          }
        }

        toast.success("Asset request rejected successfully");
        setIsSubmittingRejection(false);
        setRejectionReason("");
        setShowRejectReason(false);
        setIsOpen(false);
        reload();
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Error updating request: " + error.message);
    } finally {
      setIsSubmittingRejection(false);
    }
  };
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    handleRejectWithAssetReversion(); // ✅ Use new function instead
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
          {isMyRequest && assetRequest?.asset_status === "Pending" && (
            <Button
              variant="destructiveOutline"
              onClick={() => {
                handleStatusChange("Withdrawal");
              }}
            >
              Withdraw Request
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
                <div className="flex-1 leading-5 shrink basis-0 text-neutral-800">
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

        {assetRequest?.approval_details &&
          assetRequest.approval_details.length > 0 && (
            <DetailCard detailCardTitle="Approval Details" className="mt-4">
              <StatusList
                status_list={assetRequest.approval_details}
                className="my-3"
              />
            </DetailCard>
          )}

        {assetRequest?.rejection_reason && (
          <div className="p-3 mt-4 text-sm border rounded-md bg-gray-50 text-gray-1100">
            <div className="mb-1 font-medium">Rejection Reason:</div>
            <div>{assetRequest.rejection_reason}</div>
          </div>
        )}

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
            <Button
              type="button"
              size="lg"
              variant="default"
              onClick={() => {
                handleStatusChange("Accepted");
              }}
            >
              {/* 🚀 UPDATED: Dynamic button text based on asset assignment status */}
              {
                assetRequest?.asset?.id || assetRequest?.asset_name
                  ? "Approve Request" // Asset already assigned
                  : "Accept & Assign Asset" // No asset assigned yet
              }
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

      {/* Rejection Reason Dialog */}
      <RejectionReasonDialog
        open={showRejectReason}
        onOpenChange={setShowRejectReason}
        onSubmit={handleReject}
        isSubmitting={isSubmittingRejection}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />

      {/* NEW: Asset Selection Dialog */}
      <AssetSelectionDialog
        open={showAssetSelection}
        onOpenChange={setShowAssetSelection}
        onSubmit={handleAssetAssignment}
        isSubmitting={isSubmittingRejection}
        assets={availableAssets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        isLoading={isLoadingAssets}
        category={assetRequest?.category?.name}
      />
    </div>
  );
};

const AssetSelectionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  assets,
  selectedAssetId,
  setSelectedAssetId,
  isLoading,
  category,
}) => {
  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setSelectedAssetId("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Asset to Assign</DialogTitle>
          <DialogDescription>
            Choose an available {category} to assign to this request
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SelectInputComponent
            name="asset_selection"
            error={false}
            touch={false}
            value={selectedAssetId}
            label="Available Assets"
            required={true}
            options={assets}
            onChange={(field, value) => {
              setSelectedAssetId(value);
            }}
            placeholder={isLoading ? "Loading assets..." : "Select an asset"}
            isLoading={isLoading}
          />

          {selectedAssetId && (
            <div className="p-3 mt-4 text-sm border rounded-md bg-gray-50">
              <div className="mb-1 font-medium">Selected Asset Details:</div>
              {(() => {
                const selectedAsset = assets.find(
                  (asset) => asset.value === selectedAssetId
                );
                if (!selectedAsset) return null;

                const dynamicValues =
                  selectedAsset.asset?.dynamic_field_values || {};
                return Object.entries(dynamicValues).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span>{value}</span>
                  </div>
                ));
              })()}
            </div>
          )}
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
            disabled={!selectedAssetId || isSubmitting}
          >
            {isSubmitting ? "Assigning..." : "Assign Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Existing RejectionReasonDialog component remains the same
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
