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
        key: "asset_return_date",
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
              value === "Accepted"
                ? "bg-emerald-50 text-teal-700"
                : value === "Rejected"
                ? "bg-red-50 text-red-700"
                : value === "Withdrawal"
                ? "bg-yellow-50 text-yellow-700"
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

  // Handle asset assignment
  const handleAssetAssignment = async () => {
    if (!selectedAssetId) {
      toast.error("Please select an asset to assign");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      const updatedRequest = {
        id: currentItem.id,
        asset_status: "Accepted",
        asset_name: selectedAssetId,
        asset_assigned_by: userProfile.id,
        asset_assigned_date: moment().format("YYYY-MM-DD"),
      };

      console.log("Asset assignment payload:", updatedRequest);
      const response = await requestAsset(updatedRequest);

      if (response) {
        toast.success("Asset assigned successfully");
        setShowAssetSelection(false);
        setSelectedAssetId("");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error assigning asset");
      }
    } catch (error) {
      console.error("Error assigning asset:", error);
      toast.error("Error assigning asset: " + error.message);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Handle rejection with reason
  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      const updatedRequest = {
        id: currentItem.id,
        asset_status: "Rejected",
        rejection_reason: rejectionReason,
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        toast.success("Asset request rejected successfully");
        setShowRejectReason(false);
        setRejectionReason("");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error rejecting asset request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting request: " + error.message);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Custom content with employee overview and status
  const CustomContent = ({ currentItem }) => {
    const showButtons = !isMyRequest && currentItem?.asset_status === "Pending";

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

        {/* Action Buttons for HR/Admin */}
        {showButtons && (
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => setShowRejectReason(true)}
              disabled={isSubmittingStatus}
            >
              Reject with Reason
            </Button>
            <Button
              type="button"
              size="lg"
              variant="default"
              onClick={handleAcceptClick}
              disabled={isSubmittingStatus}
            >
              Accept & Assign Asset
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
            <div >
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

export default ViewAssetRequest;
