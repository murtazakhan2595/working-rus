import React, { useState, useEffect } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusLabel,
} from "components";
import { Badge } from "components/ui/badge";
import { renderDate } from "utils/renderValues";
import { toast } from "react-toastify";
import { getClearanceRequestItems } from "app/hooks/clearanceAndHandover";
import { Progress } from "src/@/components/ui/progress";
import { ESignatureComponent } from "./SignatureComponent";

export const MyClearanceDetailsModal = ({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  clearanceTypes = [],
}) => {
  const [checklistItems, setChecklistItems] = useState([]);

  // This function will be called by NavigationSheetComponent
  const fetchCurrentItemDetails = async (id, isMounted) => {
    try {
      // Fetch checklist items for this clearance request
      const payload = {
        filterData: { request: id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "id",
      };

      const response = await getClearanceRequestItems(payload);

      if (isMounted) {
        const itemsData = response?.results || [];
        setChecklistItems(itemsData);

        // Return the clearance request with attached checklist items
        return {
          ...clearanceRequest,
          checklistItems: itemsData,
        };
      }
    } catch (error) {
      console.error("Error fetching clearance request details:", error);
      if (isMounted) {
        toast.error("Failed to load clearance details");
      }
      return clearanceRequest; // Fallback to original data
    }
  };

  // Handle e-signature upload
  const handleESignatureUpload = async (itemId, signatureFile) => {
    try {
      // This will be handled by ESignatureComponent
      // Update local state after successful upload
      setChecklistItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                e_signature_status: "ACKNOWLEDGED",
              }
            : item
        )
      );

      // Reload parent data
      reload();
    } catch (error) {
      console.error(
        "Error updating local state after e-signature upload:",
        error
      );
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (checklistItems.length === 0) return 0;
    const completedItems = checklistItems.filter(
      (item) =>
        item.status === "APPROVED" ||
        item.status === "NOT_APPLICABLE" ||
        item.e_signature_status === "ACKNOWLEDGED"
    ).length;
    return Math.round((completedItems / checklistItems.length) * 100);
  };

  const progress = calculateProgress();
  const clearanceTypeName =
    clearanceTypes?.find(
      (type) => type?.id === clearanceRequest?.clearance_type
    )?.name || "N/A";

  // Define the fields to display using your existing pattern
  const fields = [
    {
      title: "Progress Overview",
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Overall Status:</span>
                <div className="mt-1">
                  <StatusLabel
                    status={clearanceRequest?.status || "PENDING"}
                    variant={
                      clearanceRequest?.status === "COMPLETED"
                        ? "success"
                        : clearanceRequest?.status === "IN_PROCESS"
                        ? "info"
                        : clearanceRequest?.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                  >
                    {clearanceRequest?.status?.replace("_", " ") || "PENDING"}
                  </StatusLabel>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Progress:</span>
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs mt-1">{progress}% Complete</span>
                </div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div>
                <strong>Clearance Type:</strong> {clearanceTypeName}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {renderDate(clearanceRequest?.start_date) || "N/A"}
              </div>
              {clearanceRequest?.completion_date && (
                <div>
                  <strong>Completion Date:</strong>{" "}
                  {renderDate(clearanceRequest?.completion_date)}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Checklist Items & E-Signatures",
      customContent: true,
      renderContent: (data) => {
        const items = data?.checklistItems || checklistItems || [];

        if (items.length === 0) {
          return (
            <div className="text-center py-8 text-neutral-1100">
              No checklist items found for this clearance request.
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <div className="text-sm text-neutral-1100 mb-4">
              Review your clearance checklist items and submit e-signatures
              where required.
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-500 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-1200">
                      {item.checklist_name || "Checklist Item"}
                    </h4>
                    <div className="text-sm text-neutral-1100 mt-1">
                      Assignment Scope: {item.assignment_scope || "N/A"}
                    </div>
                    {item.remarks && (
                      <div className="text-sm text-neutral-1100 mt-1">
                        Remarks: {item.remarks}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <StatusLabel
                      status={item.status || "PENDING"}
                      variant={
                        item.status === "APPROVED"
                          ? "success"
                          : item.status === "REJECTED"
                          ? "error"
                          : item.status === "NOT_APPLICABLE"
                          ? "neutral"
                          : "warning"
                      }
                    >
                      {item.status || "PENDING"}
                    </StatusLabel>
                  </div>
                </div>

                <div className="border-t border-neutral-300 pt-3">
                  <ESignatureComponent
                    item={item}
                    onSignatureUpload={handleESignatureUpload}
                    disabled={
                      item.is_locked ||
                      clearanceRequest?.status === "COMPLETED" ||
                      clearanceRequest?.status === "REJECTED"
                    }
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-300">
                  <div className="flex justify-between text-xs text-neutral-1100">
                    <span>
                      Updated: {renderDate(item.updated_at) || "Never"}
                    </span>
                    {item.completed_at && (
                      <span>Completed: {renderDate(item.completed_at)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
    reload();
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="My Clearance Details"
      currentItem_Id={clearanceRequest?.id}
      dataList={[clearanceRequest]} // Single item for this use case
      reloadData={reload}
      allowEdit={false} // No editing in employee self-service
      allowDelete={false} // No deletion in employee self-service
      fetchCurrentItemDetails={fetchCurrentItemDetails}
      deleteItemName="clearance_request"
      editTooltip="Edit Clearance"
      deleteTooltip="Delete Clearance"
    >
      <DetailContent title="My Clearance Information" fields={fields} />
    </NavigationSheetComponent>
  );
};
