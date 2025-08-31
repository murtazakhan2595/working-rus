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
import {
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ESignatureComponent } from "./SignatureComponent";

export const MyClearanceDetailsModal = ({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  clearanceTypes = [],
}) => {
  const [checklistItems, setChecklistItems] = useState([]);

  // Check if clearance is on hold
  const isOnHold = clearanceRequest?.status === "ONHOLD";

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

  // Format status display properly (convert ONHOLD to "On Hold")
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get status variant for styling
  const getStatusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROCESS":
        return "info";
      case "REJECTED":
        return "error";
      case "ONHOLD":
        return "error";
      default:
        return "warning";
    }
  };

  // Define the fields to display using your existing pattern
  const fields = [
    // Hold Warning (if on hold)
    ...(isOnHold
      ? [
          {
            customContent: true,
            renderContent: (data) => {
              return (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800 mb-1">
                        Clearance on Hold
                      </h4>
                      <p className="text-sm text-red-700 mb-2">
                        This clearance is currently on hold. All actions are
                        blocked until the hold is removed.
                      </p>
                      {clearanceRequest?.on_hold_reason && (
                        <div className="text-sm text-red-700">
                          <span className="font-medium">Reason:</span>{" "}
                          {clearanceRequest.on_hold_reason}
                        </div>
                      )}
                      {clearanceRequest?.on_hold_attachment && (
                        <div className="flex items-center gap-1 mt-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <a
                            href={clearanceRequest.on_hold_attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-800 hover:underline font-medium"
                          >
                            View Hold Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          },
        ]
      : []),

    // Progress Overview - Styled similar to clearance records
    {
      title: "Progress Overview",
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-sm font-medium text-neutral-1100">
                Overall Status:
              </span>
              <div className="mt-2">
                <StatusLabel
                  status={formatStatus(clearanceRequest?.status)}
                  variant={getStatusVariant(clearanceRequest?.status)}
                >
                  {formatStatus(clearanceRequest?.status)}
                </StatusLabel>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-neutral-1100">
                Progress:
              </span>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-neutral-1200">
                    {progress}%
                  </span>
                </div>
                <span className="text-xs text-neutral-1000">
                  {progress}% Complete
                </span>
              </div>
            </div>
          </div>
        );
      },
    },

    // Clearance Details Section
    {
      title: "Clearance Details",
      field: [
        {
          key: "clearance_type",
          label: "Clearance Type",
          formatter: () => clearanceTypeName,
        },
        {
          key: "start_date",
          label: "Start Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "completion_date",
          label: "Completion Date",
          formatter: (cell) => (cell ? renderDate(cell) : "Not completed yet"),
        },
      ],
    },

    // Checklist Items & E-Signatures
    {
      title: "Checklist Items & E-Signatures",
      customContent: true,
      renderContent: (data) => {
        const items = data?.checklistItems || checklistItems || [];

        if (items.length === 0) {
          return (
            <div className="text-center py-8 text-neutral-1100">
              <p>No checklist items found for this clearance request.</p>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            <div className="text-sm text-neutral-1100 mb-4">
              Review your clearance checklist items and submit e-signatures
              where required.
            </div>

            {/* Table-like header */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-neutral-100 border border-neutral-300 rounded-t-md text-sm font-medium text-neutral-1200">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Assignment Scope</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">E-Signature</div>
              <div className="col-span-2">Updated</div>
            </div>

            {/* Table body - Compact rows similar to clearance records */}
            <div className="border border-neutral-300 border-t-0 rounded-b-md">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 p-3 text-sm border-b border-neutral-200 last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-neutral-50"
                  }`}
                >
                  {/* Item Name */}
                  <div className="col-span-4">
                    <div className="font-medium text-neutral-1200 capitalize">
                      {item.checklist_name || "Checklist Item"}
                    </div>
                    {item.remarks && (
                      <div className="text-xs text-neutral-1100 mt-1">
                        Remarks: {item.remarks}
                      </div>
                    )}
                  </div>

                  {/* Assignment Scope */}
                  <div className="col-span-2 text-neutral-1100">
                    {item.assignment_scope || "N/A"}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
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

                  {/* E-Signature Status - Compact */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      {item.e_signature_status === "ACKNOWLEDGED" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : item.e_signature_status === "PENDING" ? (
                        <Clock className="h-4 w-4 text-orange-600" />
                      ) : (
                        <span className="h-4 w-4 flex items-center justify-center bg-gray-300 rounded-full text-xs">
                          -
                        </span>
                      )}
                      <span className="text-xs text-neutral-1100">
                        {item.e_signature_status === "ACKNOWLEDGED"
                          ? "Done"
                          : item.e_signature_status === "PENDING"
                          ? "Required"
                          : "Not Required"}
                      </span>
                    </div>
                  </div>

                  {/* Updated Date */}
                  <div className="col-span-2 text-neutral-1100">
                    {renderDate(item.updated_at) || "Never"}
                  </div>

                  {/* E-Signature Component - Full width row below */}
                  {item.e_signature_status === "PENDING" && (
                    <div className="col-span-12 mt-3 pt-3 border-t border-neutral-200">
                      <ESignatureComponent
                        item={item}
                        onSignatureUpload={handleESignatureUpload}
                        disabled={
                          item.is_locked ||
                          clearanceRequest?.status === "COMPLETED" ||
                          clearanceRequest?.status === "REJECTED" ||
                          clearanceRequest?.status === "ONHOLD"
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
