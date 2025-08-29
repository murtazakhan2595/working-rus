import React, { useState, useEffect } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  ViewDetailSheetCardExtension,
  CircularActionButtons,
} from "components";
import AssetRequestSheet from "./AssetRequestSheet";
import moment from "moment";
import { EmployeeOverview } from "components";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { requestAsset, getAssetList } from "app/hooks/assets";
import { initialState } from "state/slices/UserSlice";
import { SelectInputComponent, TextAreaInput } from "components/FormControl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { StatusButtons, StatusList } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { handleRequest } from "app/hooks/general";
import { DetailCard } from "components/SheetCardExtension";
import { updateAsset } from "app/hooks/assets";

const baseUrl = initialState.baseUrl;

const ViewAssetRequest = ({
  isOpen,
  setIsOpen,
  data,
  reload = () => {},
  AssetRequestList = [],
  isMyRequest = false,
  onEdit = null,
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);

  // Asset selection state
  const [showAssetSelection, setShowAssetSelection] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  // Rejection dialog state
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // 🚀 NEW: Return dialog state
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  console.log("data", data);

  // Define the fields to display - using a function to get current item
  const getFields = (currentItem) =>
    [
      {
        key: "category",
        label: "Category",
        formatter: () =>
          currentItem?.asset?.asset_type?.name ||
          currentItem?.category?.name ||
          "Not specified",
      },
      {
        key: "asset",
        label: "Assigned Asset",
        formatter: () => currentItem?.asset?.asset_name || "Not assigned",
      },
      {
        key: "asset",
        label: "Asset ID",
        formatter: () => currentItem?.asset?.id || "N/A",
      },
      {
        key: "asset",
        label: "Location",
        formatter: () =>
          currentItem?.asset?.asset_location_name || "Not assigned",
      },
      {
        key: "asset_purchase_date",
        label: "Purchase Date",
        formatter: () =>
          currentItem?.asset?.asset_purchase_date
            ? moment(currentItem.asset.asset_purchase_date).format(
                "MMM D, YYYY"
              )
            : "Not specified",
      },
      {
        key: "asset_warranty_expiry",
        label: "Warranty Expiry",
        formatter: () =>
          currentItem?.asset?.asset_warranty_expiry
            ? moment(currentItem.asset.asset_warranty_expiry).format(
                "MMM D, YYYY"
              )
            : "Not specified",
      },
      {
        key: "asset",
        label: "Initial Condition",
        formatter: () =>
          currentItem?.asset?.asset_initial_condition || "Not specified",
      },
      {
        key: "asset",
        label: "Purchase Cost",
        formatter: () =>
          currentItem?.asset?.asset_purchase_price
            ? `$${currentItem.asset.asset_purchase_price.toFixed(2)}`
            : "Not specified",
      },
      {
        key: "asset_assigned_date",
        label: "Assigned Date",
        formatter: (value) =>
          value ? moment(value).format("MMM D, YYYY") : "Not assigned yet",
      },
      {
        key: "asset_returned_date",
        label: "Return Date",
        formatter: (value) =>
          value ? moment(value).format("MMM D, YYYY") : "N/A",
      },
      {
        key: "reason",
        label: "Reason",
      },
      {
        key: "additional_notes",
        label: "Additional Notes",
      },
      {
        key: "rejection_reason",
        label: "Rejection Reason",
      },
      {
        key: "asset_status",
        label: "Request Status",
        formatter: (value) => (
          <span
            className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
              value === "Accepted" || value === "Approved"
                ? "bg-emerald-50 text-teal-700"
                : value === "Rejected"
                ? "bg-red-50 text-red-700"
                : value === "Withdrawal"
                ? "bg-yellow-50 text-yellow-700"
                : value === "Returned"
                ? "bg-blue-50 text-blue-700"
                : "bg-[#f0f0f3] text-[#7f838d]"
            }`}
          >
            {value || "N/A"}
          </span>
        ),
      },
    ].filter((field) => {
      // Filter out fields that don't have values
      if (field.key === "rejection_reason" && !currentItem?.rejection_reason)
        return false;
      if (field.key === "additional_notes" && !currentItem?.additional_notes)
        return false;
      return true;
    });

  // FIXED: Fetch available assets for assignment with proper data structure
  const fetchAvailableAssets = async (currentItem) => {
    if (!currentItem?.category_id && !currentItem?.category?.id) return;

    setIsLoadingAssets(true);
    try {
      const categoryId = currentItem.category_id || currentItem.category?.id;
      const assetsResponse = await getAssetList({
        options: { page: 1, sizePerPage: 100 },
        filterData: {
          asset_status: "Unassigned",
          asset_category: categoryId,
        },
      });
      console.log("Available assets response:", assetsResponse);

      if (assetsResponse && assetsResponse.results) {
        // FIXED: Store the complete asset data, not just value/label
        const formattedAssets = assetsResponse.results.map((asset) => ({
          value: asset.id,
          label: asset.asset_name,
          category_id: asset.category_id,
          // Store the complete asset data for details display
          assetData: asset,
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

  const handleAssetAssignment = async () => {
    if (!selectedAssetId) {
      toast.error("Please select an asset to assign");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      // STEP 1: Call the approval API first
      const approvalResponse = await handleRequest(
        currentItem?.hierarchy_request ||
          currentItem?.request ||
          currentItem?.id,
        true // true = approve
      );

      if (!approvalResponse) {
        toast.error("Failed to approve request");
        setIsSubmittingStatus(false);
        return;
      }

      // STEP 2: If approval succeeds, then assign the asset
      const updatedRequest = {
        id: currentItem.id,
        asset_name: selectedAssetId,
        asset_assigned_by: userProfile.id,
        asset_assigned_date: moment().format("YYYY-MM-DD"),
        asset_employee_id:
          currentItem?.asset_employee_id || currentItem?.employee?.id || "",
        asset_request_status: currentItem?.asset_request_status,
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        // STEP 3: Update the asset status to "Assigned" in the main assets table
        try {
          const assetStatusUpdatePayload = {
            id: selectedAssetId,
            asset_status: "Assigned",
          };
          await updateAsset(assetStatusUpdatePayload);
          console.log("Asset status updated to Assigned");
        } catch (assetError) {
          console.error("Error updating asset status:", assetError);
          toast.warning(
            "Request approved and asset assigned, but status update failed"
          );
        }

        toast.success("Request approved and asset assigned successfully!");
        setShowAssetSelection(false);
        setSelectedAssetId("");
        setIsOpen(false);
        reload();
      } else {
        toast.warning("Request approved but failed to assign asset");
        // Still close modal since approval worked
        setShowAssetSelection(false);
        setSelectedAssetId("");
        setIsOpen(false);
        reload();
      }
    } catch (error) {
      console.error("Error in approval/assignment process:", error);
      toast.error("Error processing request: " + error.message);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      // STEP 1: Call the rejection API first
      const rejectionResponse = await handleRequest(
        currentItem?.hierarchy_request ||
          currentItem?.request ||
          currentItem?.id,
        false // false = reject
      );

      if (!rejectionResponse) {
        toast.error("Failed to reject request");
        setIsSubmittingStatus(false);
        return;
      }

      // STEP 2: If rejection succeeds, then save the reason
      const updatedRequest = {
        id: currentItem.id,
        rejection_reason: rejectionReason,
        asset_employee_id:
          currentItem?.asset_employee_id || currentItem?.employee?.id || "",
        asset_request_status: currentItem?.asset_request_status,
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        // STEP 3: If asset was previously assigned, revert its status to "Unassigned"
        if (currentItem?.asset?.id || currentItem?.asset_name) {
          try {
            const assetId = currentItem.asset?.id || currentItem.asset_name;
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

        toast.success("Request rejected successfully!");
        setShowRejectReason(false);
        setRejectionReason("");
        setIsOpen(false);
        reload();
      } else {
        toast.warning("Request rejected but failed to save reason");
        // Still close modal since rejection worked
        setShowRejectReason(false);
        setRejectionReason("");
        setIsOpen(false);
        reload();
      }
    } catch (error) {
      console.error("Error in rejection process:", error);
      toast.error("Error rejecting request: " + error.message);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // 🚀 NEW: Handle Return Asset
  const handleReturnAsset = async () => {
    setIsSubmittingReturn(true);
    try {
      // STEP 1: Update Asset Assignment (add return date and change status)
      const updatedRequest = {
        id: currentItem.id,
        asset_returned_date: moment().format("YYYY-MM-DD"),
        asset_request_status: "Returned",
        asset_employee_id:
          currentItem?.asset_employee_id || currentItem?.employee?.id || "",
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        // STEP 2: Update Asset Management (change status back to Unassigned)
        if (currentItem?.asset?.id || currentItem?.asset_name) {
          try {
            const assetId = currentItem.asset?.id || currentItem.asset_name;
            const assetStatusPayload = {
              id: assetId,
              asset_status: "Unassigned",
            };
            await updateAsset(assetStatusPayload);
            console.log("Asset status updated to Unassigned");
          } catch (assetError) {
            console.error("Error updating asset status:", assetError);
            toast.warning("Asset returned but failed to update asset status");
          }
        }

        toast.success("Asset returned successfully!");
        setShowReturnConfirm(false);
        setIsOpen(false);
        reload();
      } else {
        toast.error("Failed to return asset");
      }
    } catch (error) {
      console.error("Error returning asset:", error);
      toast.error("Error returning asset: " + error.message);
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  // Custom content with employee overview and status
  const CustomContent = ({ currentItem }) => {
    const showButtons = !isMyRequest && currentItem?.asset_status === "Pending";

    // 🚀 NEW: Show return button for accepted/assigned assets
    const showReturnButton =
      !isMyRequest &&
      currentItem?.asset_status === "Accepted" &&
      (HasAccess("MANAGE_ASSET_REQUEST") ||
        HasAccess("ASSIGN_ASSETS_TO_EMPLOYEE")) &&
      currentItem?.asset?.id; // Only show if asset is actually assigned

    // Handle accept button click
    const handleAcceptClick = () => {
      setShowAssetSelection(true);
      fetchAvailableAssets(currentItem);
    };

    // Handle withdrawal for employee
    const handleWithdrawal = async () => {
      setIsSubmittingStatus(true);
      try {
        const updatedRequest = {
          id: currentItem.id,
          asset_status: "Withdrawal",
        };

        const response = await requestAsset(updatedRequest);
        if (response) {
          toast.success("Request withdrawn successfully");
          setIsOpen(false);
          reload();
        } else {
          toast.error("Error withdrawing request");
        }
      } catch (error) {
        console.error("Error withdrawing request:", error);
        toast.error("Error withdrawing request: " + error.message);
      } finally {
        setIsSubmittingStatus(false);
      }
    };

    const handleCustomApprove = () => {
      // Check if asset is already assigned
      if (currentItem?.asset?.id || currentItem?.asset_name) {
        // Asset already assigned, just approve without showing selection dialog
        handleDirectApproval();
      } else {
        // No asset assigned yet, show asset selection dialog
        setShowAssetSelection(true);
        fetchAvailableAssets(currentItem);
      }
    };

    const handleDirectApproval = async () => {
      setIsSubmittingStatus(true);
      try {
        // Just call the approval API without asset assignment
        const approvalResponse = await handleRequest(
          currentItem?.hierarchy_request ||
            currentItem?.request ||
            currentItem?.id,
          true // true = approve
        );

        if (approvalResponse) {
          toast.success("Request approved successfully!");
          setIsOpen(false);
          reload();
        } else {
          toast.error("Failed to approve request");
        }
      } catch (error) {
        console.error("Error in approval process:", error);
        toast.error("Error approving request: " + error.message);
      } finally {
        setIsSubmittingStatus(false);
      }
    };

    // 🚀 NEW: Custom reject handler - shows rejection reason modal first
    const handleCustomReject = () => {
      setShowRejectReason(true);
    };

    // Prepare fields for DetailContent component
    const detailContentFields = [
      {
        field: getFields(currentItem),
        title: "Request Details",
        footerField: "created_at",
        footerTitle: "Request Date",
      },
    ];

    return (
      <div className="space-y-6">
        {/* Employee Overview */}
        <div className="flex items-center justify-between w-full gap-4 mt-6">
          <EmployeeOverview
            id={currentItem?.employee?.id}
            showEmail={true}
            showDepartment={true}
            showPosition={true}
            showId={true}
            showBranchName={true}
          />
          {isMyRequest && currentItem?.asset_status === "Pending" && (
            <Button
              variant="destructiveOutline"
              onClick={handleWithdrawal}
              disabled={isSubmittingStatus}
            >
              {isSubmittingStatus ? "Processing..." : "Withdraw Request"}
            </Button>
          )}
        </div>

        {/* Request Details */}
        <DetailContent currentItem={currentItem} fields={detailContentFields} />

        {currentItem?.approval_details &&
          currentItem.approval_details.length > 0 && (
            <DetailCard detailCardTitle="Approval Details" className="mt-4">
              <StatusList status_list={currentItem.approval_details} />
            </DetailCard>
          )}

        {/* 🚀 ENHANCED: StatusButtons with custom handlers */}
        <StatusButtons
          permissionKey={["MANAGE_ASSET_REQUEST"]}
          permissionLogic="OR"
          status={currentItem?.status || currentItem?.asset_status}
          current_approver={currentItem?.current_approver || []}
          request_id={
            currentItem?.hierarchy_request ||
            currentItem?.request ||
            currentItem?.id
          }
          // 🚀 NEW: Custom handlers instead of setResponse
          onApprove={handleCustomApprove} // Show asset assignment modal
          onReject={handleCustomReject} // Show rejection reason modal
          // 🚀 OPTIONAL: Customize button text
          approveText={
            currentItem?.asset?.id || currentItem?.asset_name
              ? "Approve Request" // Asset already assigned
              : "Approve & Assign Asset" // No asset assigned yet
          }
          rejectText="Reject with Reason"
        />

        {/* 🚀 NEW: Return Asset Button */}
        {showReturnButton && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setShowReturnConfirm(true)}
              disabled={isSubmittingReturn}
              variant="outline"
            >
              {isSubmittingReturn ? "Processing..." : "Return Asset"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const [currentItem, setCurrentItem] = useState(data);
  const [currentItemId, setCurrentItemId] = useState(data?.id);

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentItem(data);
      setCurrentItemId(data.id);
    }
  }, [isOpen, data]);

  // Navigation handlers
  const handleNext = () => {
    const validList = Array.isArray(AssetRequestList) ? AssetRequestList : [];
    if (validList.length === 0) return;

    const currentIndex = validList.findIndex(
      (item) => item.id === currentItemId
    );

    if (currentIndex < validList.length - 1) {
      const nextItem = validList[currentIndex + 1];
      setCurrentItemId(nextItem?.id);
      setCurrentItem(nextItem);
    } else {
      // Loop to first item
      const firstItem = validList[0];
      setCurrentItemId(firstItem?.id);
      setCurrentItem(firstItem);
    }
  };

  const handlePrevious = () => {
    const validList = Array.isArray(AssetRequestList) ? AssetRequestList : [];
    if (validList.length === 0) return;

    const currentIndex = validList.findIndex(
      (item) => item.id === currentItemId
    );

    if (currentIndex > 0) {
      const prevItem = validList[currentIndex - 1];
      setCurrentItemId(prevItem?.id);
      setCurrentItem(prevItem);
    } else {
      // Loop to last item
      const lastItem = validList[validList.length - 1];
      setCurrentItemId(lastItem?.id);
      setCurrentItem(lastItem);
    }
  };

  // Generate position indicator
  const getPositionIndicator = () => {
    if (!Array.isArray(AssetRequestList) || AssetRequestList.length === 0)
      return null;

    const currentIndex = AssetRequestList.findIndex(
      (item) => item.id === currentItemId
    );
    return `${currentIndex + 1} of ${AssetRequestList.length}`;
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit(currentItem);
    }
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Asset Request Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        positionIndicator={getPositionIndicator()}
      >
        <div className="flex flex-col gap-4">
          <CustomContent currentItem={currentItem} />
        </div>
      </ViewDetailSheetCardExtension>

      {/* Asset Selection Dialog */}
      <AssetSelectionDialog
        open={showAssetSelection}
        onOpenChange={setShowAssetSelection}
        onSubmit={handleAssetAssignment}
        isSubmitting={isSubmittingStatus}
        assets={availableAssets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        isLoading={isLoadingAssets}
        category={currentItem?.category?.name}
      />

      {/* Rejection Reason Dialog */}
      <RejectionReasonDialog
        open={showRejectReason}
        onOpenChange={setShowRejectReason}
        onSubmit={handleRejectWithReason}
        isSubmitting={isSubmittingStatus}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
      {console.log("currentItem:", currentItem)}
      {/* 🚀 NEW: Return Asset Confirmation Dialog */}
      <ReturnAssetDialog
        open={showReturnConfirm}
        onOpenChange={setShowReturnConfirm}
        onSubmit={handleReturnAsset}
        isSubmitting={isSubmittingReturn}
        assetName={currentItem?.asset?.asset_name}
        employeeName={`${currentItem?.employee?.first_name} ${currentItem?.employee?.last_name}`}
      />
    </>   
  );
};

// FIXED: Asset Selection Dialog Component
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

  // FIXED: Get selected asset data properly
  const selectedAssetData = assets.find(
    (asset) => asset.value === selectedAssetId
  )?.assetData;

  // Create fields array for selected asset details using the same format as getFields
  const getSelectedAssetFields = (assetData) => {
    if (!assetData) return [];

    const baseFields = [
      {
        key: "asset_name",
        label: "Asset Name",
        formatter: () => assetData.asset_name,
      },
      {
        key: "id",
        label: "Asset ID",
        formatter: () => assetData.id,
      },
      {
        key: "asset_purchase_price",
        label: "Purchase Price",
        formatter: () =>
          assetData.asset_purchase_price
            ? `${assetData.asset_purchase_price}`
            : "Not specified",
      },
      {
        key: "asset_initial_condition",
        label: "Condition",
        formatter: () => assetData.asset_initial_condition || "Not specified",
      },
      {
        key: "asset_location_name",
        label: "Location",
        formatter: () => assetData.asset_location_name || "Not specified",
      },
      {
        key: "asset_purchase_date",
        label: "Purchase Date",
        formatter: () =>
          assetData.asset_purchase_date
            ? moment(assetData.asset_purchase_date).format("MMM D, YYYY")
            : "Not specified",
      },
      {
        key: "asset_warranty_expiry",
        label: "Warranty Expiry",
        formatter: () =>
          assetData.asset_warranty_expiry
            ? moment(assetData.asset_warranty_expiry).format("MMM D, YYYY")
            : "Not specified",
      },
      {
        key: "asset_notes",
        label: "Notes",
        formatter: () => assetData.asset_notes || "No notes",
      },
    ];

    // Add dynamic fields if they exist
    const dynamicFields = [];
    if (
      assetData.dynamic_field_values &&
      Object.keys(assetData.dynamic_field_values).length > 0
    ) {
      Object.entries(assetData.dynamic_field_values).forEach(([key, value]) => {
        dynamicFields.push({
          key: `dynamic_${key}`,
          label: key,
          formatter: () => value,
        });
      });
    }

    return [...baseFields, ...dynamicFields].filter((field) => {
      // Filter out empty notes
      if (field.key === "asset_notes" && !assetData.asset_notes) return false;
      // Filter out empty warranty expiry
      if (
        field.key === "asset_warranty_expiry" &&
        !assetData.asset_warranty_expiry
      )
        return false;
      return true;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Asset to Assign</DialogTitle>
          <DialogDescription>
            Choose an available {category} to assign to this request
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 py-4">
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

          {/* FIXED: Use DetailContent component for consistency */}
          {selectedAssetId && selectedAssetData && (
            <div>
              <DetailContent
                currentItem={selectedAssetData}
                fields={[
                  {
                    field: getSelectedAssetFields(selectedAssetData),
                    title: "Selected Asset Details",
                  },
                ]}
              />
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

// Rejection Reason Dialog Component
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
              setTouched(true);
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

// 🚀 NEW: Return Asset Confirmation Dialog Component
const ReturnAssetDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  assetName,
  employeeName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Return Asset </DialogTitle>
          <DialogDescription>
            Are you sure you want to return this asset? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-muted-900">Asset:</span>
                <span className="text-gray-900">{assetName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-900">Employee:</span>
                <span className="text-gray-900">{employeeName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-900">Return Date:</span>
                <span className="text-gray-900">
                  {moment().format("MMM D, YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Once returned, the asset will become
              available for reassignment and the current assignment will be
              marked as completed.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Returning..." : "Return Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssetRequest;
