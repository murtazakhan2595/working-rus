import React, { useState, useEffect } from "react";
import { SheetUI } from "components";
import { SelectInputComponent, TextAreaInput } from "components/FormControl";
import { Progress } from "src/@/components/ui/progress";
import { Badge } from "components/ui/badge";
import { StatusIcon, getStatusVariant } from "components/StatusLabel";
import { toast } from "react-toastify";
import {
  getClearanceRequestItems,
  updateClearanceRequestItem,
} from "app/hooks/clearanceAndHandover";
import { renderDate } from "utils/renderValues";
import {
  clearanceStatusOptions,
  clearanceRequestStatusOptions,
} from "data/Data";
import { useSelector } from "react-redux";

export default function ClearanceChecklistModal({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  clearanceTypes,
}) {
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current logged-in user
  const userProfile = useSelector((state) => state.user.userProfile);
  const currentUserId = userProfile?.id;

  useEffect(() => {
    if (clearanceRequest && isOpen) {
      fetchChecklistItems();
    }
  }, [clearanceRequest, isOpen]);

  // Helper function to format checklist name
  const formatChecklistName = (name) => {
    if (!name) return "Checklist Item";

    // Replace underscores and camelCase with spaces, then capitalize
    return name
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim();
  };

  // Check if current user can edit specific item based on assignment scope
  const canUserEditItem = (item) => {
    if (!currentUserId || !item.assignment_scope) return false;
    console.log(
      "canuser edit ?",
      currentUserId,
      item.assignment_scope,
      item.direct_report
    );

    switch (item.assignment_scope) {
      case "DIRECT":
        return currentUserId === parseInt(item.direct_report);
      case "INDIRECT":
        return (
          Array.isArray(item.indirect_report) &&
          item.indirect_report.includes(currentUserId)
        );
      case "DESIGNATION":
        return (
          Array.isArray(item.employees_with_matching_designation) &&
          item.employees_with_matching_designation.includes(currentUserId)
        );
      default:
        return false;
    }
  };

  // Check if user can edit any item in group (for remarks field)
  const canUserEditGroupRemarks = (groupItems) => {
    return groupItems.some((item) => canUserEditItem(item));
  };

  const fetchChecklistItems = async () => {
    setLoading(true);
    try {
      const payload = {
        filterData: { request: clearanceRequest.id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "id",
      };

      const response = await getClearanceRequestItems(payload);
      if (response && response.results) {
        setChecklistItems(response.results);
      }
    } catch (error) {
      console.error("Error fetching checklist items:", error);
      toast.error("Failed to load checklist items");
    } finally {
      setLoading(false);
    }
  };

  // Simple local state update - no API calls
  const updateItemStatus = (itemId, newStatus) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Simple local state update - no API calls
  const updateItemRemarks = (itemId, newRemarks) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, remarks: newRemarks } : item
      )
    );
  };

  // Calculate progress
  const calculateProgress = () => {
    if (checklistItems.length === 0) return 0;
    const completedItems = checklistItems.filter(
      (item) => item.status === "APPROVED" || item.status === "NOT_APPLICABLE"
    ).length;
    return Math.round((completedItems / checklistItems.length) * 100);
  };

  // Get overall status
  const getOverallStatus = () => {
    const hasRejected = checklistItems.some(
      (item) => item.status === "REJECTED"
    );
    if (hasRejected) return "REJECTED";

    const progress = calculateProgress();
    if (progress === 100) return "COMPLETED";
    if (progress > 0) return "IN_PROCESS";
    return "PENDING";
  };

  // ONLY API CALL - when form is submitted (only update items user can edit)
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);

      // Update only items that user has permission to edit
      const editableItems = checklistItems.filter((item) =>
        canUserEditItem(item)
      );

      if (editableItems.length === 0) {
        toast.warning("You don't have permission to update any items.");
        return;
      }

      const updatePromises = editableItems.map((item) =>
        updateClearanceRequestItem(item.id, {
          status: item.status,
          remarks: item.remarks || "",
        })
      );

      await Promise.all(updatePromises);

      toast.success(
        `Updated ${editableItems.length} checklist item(s) successfully!`
      );

      if (getOverallStatus() === "COMPLETED") {
        toast.success("Clearance process completed!");
      }

      // Close and reload
      handleClose();
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reload();
  };

  // Group items by checklist name instead of ID
  const groupedItems = checklistItems.reduce((groups, item) => {
    const groupKey = formatChecklistName(item.checklist_name) || "General";
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});

  // Simple form fields generation with permission checks
  const generateFormFields = () => {
    return Object.keys(groupedItems).map((groupName) => ({
      sheetCardExtension: true,
      sheetCardTitle: groupName,
      InputFields: [
        // Status dropdowns for each item
        ...groupedItems[groupName].map((item) => {
          const canEdit = canUserEditItem(item);
          const isDisabled = item.is_locked || !canEdit;

          return {
            InputField: SelectInputComponent,
            name: `status_${item.id}`,
            label: `${formatChecklistName(item.checklist_name)} Status`,
            placeholder: canEdit ? "Select Status" : "No permission",
            value: item.status,
            options: clearanceRequestStatusOptions,
            disabled: isDisabled,
            colsSpan: 1,
            // Add visual indicator for permission status
            helperText: !canEdit
              ? "You don't have permission to edit this item"
              : undefined,
            onFieldUpdate: (field, newValue) => {
              if (canEdit) {
                updateItemStatus(item.id, newValue);
              }
            },
          };
        }),

        // Remarks textarea for the group (only show if user can edit at least one item)
        ...(canUserEditGroupRemarks(groupedItems[groupName])
          ? [
              {
                InputField: TextAreaInput,
                name: `remarks_${groupName}`,
                label: "Remarks (Optional)",
                placeholder: "Add any additional comments...",
                value: groupedItems[groupName][0]?.remarks || "",
                disabled: groupedItems[groupName].every(
                  (item) => item.is_locked
                ),
                colsSpan: 2,
                rows: 2,
                onFieldUpdate: (field, newValue) => {
                  // Update remarks for first item in group
                  if (groupedItems[groupName][0]) {
                    updateItemRemarks(groupedItems[groupName][0].id, newValue);
                  }
                },
              },
            ]
          : []),
      ],
    }));
  };

  const progress = calculateProgress();
  const overallStatus = getOverallStatus();

  // Check if user has permission to edit any items
  const hasAnyEditPermission = checklistItems.some((item) =>
    canUserEditItem(item)
  );

  if (loading) {
    return <div>Loading checklist...</div>;
  }

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={{
        triggerText: "",
        title: `Clearance Checklist - ${
          clearanceRequest?.employee_name || "Employee"
        }`,
        footer: null,
        width: "800px",
      }}
      formConfig={{
        initialValues: {},
        enableReinitialize: false,
        handleSubmit: handleSubmit,
        submitButtonText: hasAnyEditPermission ? "Update Checklist" : "Close",
        cancelButtonText: "Close",
        columns: 2,
        disableSubmit: isSubmitting || !hasAnyEditPermission,
        hideSubmit: !hasAnyEditPermission, // Hide submit button if no edit permissions
        loadingMessage: isSubmitting ? "Updating checklist..." : "",
        formFields: [
          // Progress header
          {
            sheetCardExtension: true,
            sheetCardTitle: "Progress Overview",
            InputFields: [
              {
                InputField: () => (
                  <div className="space-y-4">
                    {!hasAnyEditPermission && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> You don't have permission to
                          edit any items in this checklist. This view is
                          read-only for you.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">
                          Overall Status:
                        </span>
                        <div className="mt-1">
                          <Badge
                            variant={
                              overallStatus === "COMPLETED"
                                ? "success"
                                : overallStatus === "IN_PROCESS"
                                ? "info"
                                : overallStatus === "REJECTED"
                                ? "error"
                                : "warning"
                            }
                          >
                            {overallStatus.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Progress:</span>
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                          <span className="text-xs mt-1">
                            {progress}% Complete
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <strong>Employee:</strong>{" "}
                      {clearanceRequest?.employee_name || "N/A"}
                      <br />
                      <strong>Type:</strong>{" "}
                      {clearanceTypes?.find(
                        (type) => type?.id === clearanceRequest?.clearance_type
                      )?.name || "N/A"}
                      <br />
                      <strong>Start Date:</strong>{" "}
                      {renderDate(clearanceRequest?.start_date) || "N/A"}
                    </div>
                  </div>
                ),
                name: "progress_overview",
                label: "",
                colsSpan: 2,
              },
            ],
          },
          // Dynamic checklist sections
          ...generateFormFields(),
        ],
      }}
    />
  );
}
