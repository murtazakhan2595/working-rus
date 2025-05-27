import React, { useState, useEffect } from "react";
import { NavigationSheetComponent, DetailContent, ViewDetailSheetCardExtension, CircularActionButtons } from "components";
import AssetRequestSheet from "./AssetRequestSheet";
import moment from "moment";
import { EmployeeOverview } from "components";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { requestAsset } from "app/hooks/assets";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

const ViewAssetRequest = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  AssetRequestList = [],
  isMyRequest = false,
  onEdit = null
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);

    // Define the fields to display - using a function to get current item
  const getFields = (currentItem) => [
    {
      key: "category",
      label: "Category",
      formatter: () => 
        currentItem?.asset?.asset_type?.name || 
        currentItem?.category?.name || 
        "Not specified"
    },
    {
      key: "asset",
      label: "Assigned Asset",
      formatter: () => currentItem?.asset?.asset_name || "Not assigned"
    },
    {
      key: "asset",
      label: "Asset ID", 
      formatter: () => currentItem?.asset?.id || "N/A"
    },
    {
      key: "asset",
      label: "Location",
      formatter: () => 
        currentItem?.asset?.asset_location_name || "Not assigned"
    },
    {
      key: "asset_purchase_date",
      label: "Purchase Date",
      formatter: () => 
        currentItem?.asset?.asset_purchase_date 
          ? moment(currentItem.asset.asset_purchase_date).format("MMM D, YYYY")
          : "Not specified"
    },
    {
      key: "asset_warranty_expiry", 
      label: "Warranty Expiry",
      formatter: () =>
        currentItem?.asset?.asset_warranty_expiry
          ? moment(currentItem.asset.asset_warranty_expiry).format("MMM D, YYYY") 
          : "Not specified"
    },
    {
      key: "asset",
      label: "Initial Condition",
      formatter: () => currentItem?.asset?.asset_initial_condition || "Not specified"
    },
    {
      key: "asset",
      label: "Purchase Cost", 
      formatter: () =>
        currentItem?.asset?.asset_purchase_price
          ? `$${currentItem.asset.asset_purchase_price.toFixed(2)}`
          : "Not specified"
    },
    {
      key: "asset_assigned_date",
      label: "Assigned Date",
      formatter: (value) =>
        value ? moment(value).format("MMM D, YYYY") : "Not assigned yet"
    },
    {
      key: "asset_return_date",
      label: "Return Date", 
      formatter: (value) =>
        value ? moment(value).format("MMM D, YYYY") : "N/A"
    },
    {
      key: "reason",
      label: "Reason"
    },
    {
      key: "additional_notes",
      label: "Additional Notes"
    },
    {
      key: "rejection_reason",
      label: "Rejection Reason"
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
      )
    }
  ].filter(field => {
    // Filter out fields that don't have values
    if (field.key === "rejection_reason" && !currentItem?.rejection_reason) return false;
    if (field.key === "additional_notes" && !currentItem?.additional_notes) return false;
    return true;
  });

  // Custom content with employee overview and status
  const CustomContent = ({ currentItem }) => {
    const showButtons =
      !isMyRequest &&
      currentItem?.asset_status === "Pending" &&
      (userProfile.role === 2 || userProfile.role === 3 || userProfile.role === 1);

    const handleStatusChange = async (status) => {
      try {
        let updatedRequest = {};
        if (isMyRequest) {
          updatedRequest = {
            ...currentItem,
            asset_status: status,
          };
        } else {
          updatedRequest = {
            ...currentItem,
            asset_status: status,
            asset_assigned_by: userProfile.id,
            asset_assigned_date:
              status === "Accepted" ? moment().format("YYYY-MM-DD") : null,
          };
        }

        const response = await requestAsset(updatedRequest);
        if (response) {
          toast.success("Asset request updated successfully");
          setIsOpen(false);
          reload();
        } else {
          toast.error("Error updating asset request");
        }
      } catch (error) {
        console.error("Error updating request:", error);
        toast.error("Error updating request: " + error.message);
      }
    };

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
              onClick={() => handleStatusChange("Withdrawal")}
            >
              Withdraw Request
            </Button>
          )}
        </div>

        {/* Request Details */}
        <DetailContent
          title="Request Details"
          currentItem={currentItem}
          fields={getFields(currentItem)}
          dateField="created_at"
          dateTitle="Request Date"
        />

        {/* Action Buttons for HR/Admin */}
        {showButtons && (
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => {
                // Handle reject with reason - could open a dialog
                const reason = prompt("Please provide a reason for rejection:");
                if (reason) {
                  handleStatusChange("Rejected");
                }
              }}
            >
              Reject with Reason
            </Button>
            <Button
              type="button"
              size="lg"
              variant="default"
              onClick={() => handleStatusChange("Accepted")}
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
    if (!Array.isArray(AssetRequestList) || AssetRequestList.length === 0) return null;
    
    const currentIndex = AssetRequestList.findIndex(item => item.id === currentItemId);
    return `${currentIndex + 1} of ${AssetRequestList.length}`;
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit(currentItem);
    }
  };

  return (
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
  );
};

export default ViewAssetRequest; 