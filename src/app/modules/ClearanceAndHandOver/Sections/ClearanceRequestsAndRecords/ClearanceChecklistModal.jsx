import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SheetUI } from "components";
import { SelectInputComponent, TextAreaInput } from "components/FormControl";
import { Progress } from "src/@/components/ui/progress";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { StatusIcon, getStatusVariant } from "components/StatusLabel";
import { AlertTriangle, FileText, UserPlus } from "lucide-react";
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
import { canReassignItem, canUserApproveItem } from "./ClearanceApprovalUtils";
import { DesignationName } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { EmployeeID } from "utils/getValuesFromTables";
import { EmployeeInfo } from "utils/getValuesFromTables";
import { EmployeeOverview } from "components";

// Constants for better maintainability and code organization
const REASSIGNMENT_CONFIG = {
  MAX_NOTES_LENGTH: 500,
  ALLOWED_STATUSES: ["PENDING", "IN_PROCESS"],
  DISABLED_REASONS: {
    LOCKED: "Item is locked and cannot be reassigned",
    ON_HOLD: "Clearance is on hold - editing disabled",
    NO_PERMISSION: "You don't have permission to edit this item",
  },
};

const PROGRESS_CALCULATION = {
  COMPLETED_STATUSES: ["APPROVED", "NOT_APPLICABLE"],
  STATUS_WEIGHTS: {
    PENDING: 10,
    IN_PROCESS: 60,
    COMPLETED: 100,
    REJECTED: 0,
    ONHOLD: 0,
    APPROVED: 100,
    NOT_APPLICABLE: 100,
  },
};

// Enhanced memoized component for reassignment functionality
const ReassignmentSection = React.memo(
  ({
    itemId,
    showReassignment,
    reassignApprovers,
    reassignNotes,
    reassignmentSubmitting,
    employees,
    onToggleReassignment,
    onUpdateApprover,
    onUpdateNotes,
    onHandleReassignment,
  }) => {
    // Local state for enhanced UX
    const [localNotes, setLocalNotes] = useState(reassignNotes[itemId] || "");

    // Debounced notes update to reduce unnecessary renders
    const debouncedNotesUpdate = useCallback(
      debounce((value) => {
        onUpdateNotes(itemId, value);
      }, 300),
      [itemId, onUpdateNotes]
    );

    // Handle notes change with validation
    const handleNotesChange = useCallback(
      (field, value) => {
        if (value.length <= REASSIGNMENT_CONFIG.MAX_NOTES_LENGTH) {
          setLocalNotes(value);
          debouncedNotesUpdate(value);
        }
      },
      [debouncedNotesUpdate]
    );

    // Validate reassignment form
    const isFormValid = useMemo(() => {
      console.log("Validating form for itemId:", itemId, reassignApprovers[itemId], reassignApprovers);
      return (
        reassignApprovers[itemId]
      );
    }, [reassignApprovers, itemId]);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-1200">
            Task Reassignment
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleReassignment(itemId)}
            className="text-xs"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            {showReassignment[itemId] ? "Cancel" : "Reassign"}
          </Button>
        </div>

        {showReassignment[itemId] && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-3">
            <div>
              <label className="text-xs font-medium text-neutral-1200 mb-1 block">
                New Assignee *
              </label>
              <SelectInputComponent
                name={`reassign_approver_${itemId}`}
                placeholder="Select new assignee"
                value={reassignApprovers[itemId] || ""}
                options={employees}
                onChange={(field, value) => onUpdateApprover(itemId, value)}
              />
              {!isFormValid && (
                <p className="text-xs text-red-600 mt-1">
                  Please select a new assignee
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-1200 mb-1 block">
                Notes (Optional) - {localNotes.length}/
                {REASSIGNMENT_CONFIG.MAX_NOTES_LENGTH}
              </label>
              <TextAreaInput
                name={`reassign_notes_${itemId}`}
                placeholder="Reassignment notes..."
                value={localNotes}
                rows={2}
                onChange={handleNotesChange}
                maxLength={REASSIGNMENT_CONFIG.MAX_NOTES_LENGTH}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onHandleReassignment(itemId)}
                disabled={!isFormValid || reassignmentSubmitting[itemId]}
                className="text-xs"
              >
                {reassignmentSubmitting[itemId] ? "Reassigning..." : "Confirm"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Custom hook for managing checklist state
const useChecklistManager = (clearanceRequest, isOpen) => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChecklistItems = useCallback(async () => {
    if (!clearanceRequest?.id) return;

    setLoading(true);
    try {
      const payload = {
        filterData: { request: clearanceRequest.id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "id",
      };

      const response = await getClearanceRequestItems(payload);
      if (response?.results) {
        setChecklistItems(response.results);
      }
    } catch (error) {
      console.error("Error fetching checklist items:", error);
      toast.error("Failed to load checklist items");
    } finally {
      setLoading(false);
    }
  }, [clearanceRequest?.id]);

  useEffect(() => {
    if (clearanceRequest && isOpen) {
      fetchChecklistItems();
    }
  }, [clearanceRequest, isOpen, fetchChecklistItems]);

  return {
    checklistItems,
    setChecklistItems,
    loading,
    fetchChecklistItems,
  };
};

// Custom hook for reassignment management
const useReassignmentManager = (currentUserId, reload, fetchChecklistItems) => {
  const [showReassignment, setShowReassignment] = useState({});
  const [reassignApprovers, setReassignApprovers] = useState({});
  const [reassignNotes, setReassignNotes] = useState({});
  const [reassignmentSubmitting, setReassignmentSubmitting] = useState({});

  // Enhanced toggle with validation
  const toggleReassignment = useCallback((itemId) => {
    setShowReassignment((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));

    // Initialize reassignment data with validation
    setReassignApprovers((prev) => {
      if (prev[itemId] === undefined) {
        return { ...prev, [itemId]: "" };
      }
      return prev;
    });

    setReassignNotes((prev) => {
      if (prev[itemId] === undefined) {
        return { ...prev, [itemId]: "" };
      }
      return prev;
    });
  }, []);

  const updateReassignApprover = useCallback((itemId, approverId) => {
    setReassignApprovers((prev) => ({
      ...prev,
      [itemId]: approverId,
    }));
  }, []);

  const updateReassignNotes = useCallback((itemId, notes) => {
    // Enhanced validation for notes
    if (notes.length <= REASSIGNMENT_CONFIG.MAX_NOTES_LENGTH) {
      setReassignNotes((prev) => ({
        ...prev,
        [itemId]: notes,
      }));
    }
  }, []);

  // Enhanced reassignment handler with better error handling
  const handleReassignment = useCallback(
    async (itemId) => {
      const approverId = reassignApprovers[itemId];
      const notes = reassignNotes[itemId];

      // Enhanced validation
      if (!approverId || approverId.trim() === "") {
        toast.error("Please select a new assignee");
        return;
      }

      setReassignmentSubmitting((prev) => ({ ...prev, [itemId]: true }));

      try {
        const payload = {
          reassign_approver: approverId,
          reassign_notes: notes || "",
        };

        const response = await updateClearanceRequestItem(itemId, payload);

        if (response) {
          toast.success("Task reassigned successfully!");

          // Enhanced state cleanup
          setShowReassignment((prev) => ({ ...prev, [itemId]: false }));
          setReassignApprovers((prev) => ({
            ...prev,
            [itemId]: "",
          }));
          setReassignNotes((prev) => ({
            ...prev,
            [itemId]: "",
          }));

          // Refresh data with error handling
          try {
            await fetchChecklistItems();
            await reload();
          } catch (refreshError) {
            console.error("Error refreshing data:", refreshError);
            toast.warning("Item reassigned but data refresh failed");
          }
        }
      } catch (error) {
        console.error("Error reassigning task:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to reassign task";
        toast.error(errorMessage);
      } finally {
        setReassignmentSubmitting((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [reassignApprovers, reassignNotes, fetchChecklistItems, reload]
  );

  return {
    showReassignment,
    reassignApprovers,
    reassignNotes,
    reassignmentSubmitting,
    toggleReassignment,
    updateReassignApprover,
    updateReassignNotes,
    handleReassignment,
  };
};

export default function ClearanceChecklistModal({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  clearanceTypes,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current logged-in user and employees
  const userProfile = useSelector((state) => state.user.userProfile);
  const employees = useSelector((state) => state.emp.employees || []);
  const currentUserId = userProfile?.id;

  // Check if clearance is on hold
  const isOnHold = useMemo(
    () => clearanceRequest?.status === "ONHOLD",
    [clearanceRequest?.status]
  );

  // Use custom hooks for better code organization
  const { checklistItems, setChecklistItems, loading, fetchChecklistItems } =
    useChecklistManager(clearanceRequest, isOpen);

  const reassignmentManager = useReassignmentManager(
    currentUserId,
    reload,
    fetchChecklistItems
  );

  // Enhanced helper function to format checklist name
  const formatChecklistName = useCallback((name) => {
    if (!name) return "Checklist Item";

    // Enhanced formatting with better regex patterns
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim();
  }, []);

  // Enhanced permission checking with memoization
  const canUserEditItem = useCallback(
    (item) => {
      return canUserApproveItem(item, currentUserId, isOnHold);
    },
    [currentUserId, isOnHold]
  );

  const canUserEditGroupRemarks = useCallback(
    (groupItems) => {
      return groupItems.some((item) => canUserEditItem(item));
    },
    [canUserEditItem]
  );

  const canReassignItemCheck = useCallback(
    (item) => {
      return canReassignItem(item, currentUserId, isOnHold);
    },
    [currentUserId, isOnHold]
  );

  // Enhanced state update functions with validation
  const updateItemStatus = useCallback((itemId, newStatus) => {
    if (!PROGRESS_CALCULATION.STATUS_WEIGHTS.hasOwnProperty(newStatus)) {
      console.warn(`Invalid status: ${newStatus}`);
      return;
    }

    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  }, []);

  const updateItemRemarks = useCallback((itemId, newRemarks) => {
    // Enhanced validation for remarks
    if (newRemarks && newRemarks.length > 1000) {
      toast.warning("Remarks are too long. Maximum 1000 characters allowed.");
      return;
    }

    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, remarks: newRemarks } : item
      )
    );
  }, []);

  // Enhanced progress calculation with memoization
  const calculateProgress = useMemo(() => {
    if (checklistItems.length === 0) return 0;
    const completedItems = checklistItems.filter((item) =>
      PROGRESS_CALCULATION.COMPLETED_STATUSES.includes(item.status)
    ).length;
    return Math.round((completedItems / checklistItems.length) * 100);
  }, [checklistItems]);

  // Enhanced overall status calculation
  const getOverallStatus = useMemo(() => {
    const hasRejected = checklistItems.some(
      (item) => item.status === "REJECTED"
    );
    if (hasRejected) return "REJECTED";

    const progress = calculateProgress;
    if (progress === 100) return "COMPLETED";
    if (progress > 0) return "IN_PROCESS";
    return "PENDING";
  }, [checklistItems, calculateProgress]);

  // Enhanced submit handler with better error handling and validation
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);

      // Enhanced filtering for editable items
      const editableItems = checklistItems.filter((item) =>
        canUserEditItem(item)
      );

      if (editableItems.length === 0) {
        toast.warning("You don't have permission to update any items.");
        return;
      }

      // Validate all items before submission
      const invalidItems = editableItems.filter(
        (item) =>
          !item.status ||
          !PROGRESS_CALCULATION.STATUS_WEIGHTS.hasOwnProperty(item.status)
      );

      if (invalidItems.length > 0) {
        toast.error(
          "Some items have invalid status. Please review and try again."
        );
        return;
      }

      // Enhanced update promises with individual error handling
      const updatePromises = editableItems.map((item) =>
        updateClearanceRequestItem(item.id, {
          status: item.status,
          remarks: item.remarks || "",
        }).catch((error) => {
          console.error(`Failed to update item ${item.id}:`, error);
          return { error: true, itemId: item.id, message: error.message };
        })
      );

      const results = await Promise.all(updatePromises);

      // Check for failures
      const failures = results.filter((result) => result?.error);
      const successes = results.length - failures.length;

      if (failures.length > 0) {
        toast.error(
          `Updated ${successes} items successfully, but ${failures.length} failed.`
        );
      } else {
        toast.success(`Updated ${successes} checklist item(s) successfully!`);
      }

      // Enhanced completion check
      if (getOverallStatus === "COMPLETED") {
        toast.success("🎉 Clearance process completed!");
      }

      handleClose();
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    reload();
  }, [setIsOpen, reload]);

  // Enhanced grouping with better data structure
  const groupedItems = useMemo(() => {
    return checklistItems.reduce((groups, item) => {
      const groupKey = formatChecklistName(item.checklist_name) || "General";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  }, [checklistItems, formatChecklistName]);

  // Enhanced form fields generation with better validation and error handling
  const generateFormFields = useCallback(() => {
    return Object.keys(groupedItems).map((groupName) => ({
      sheetCardExtension: true,
      sheetCardTitle: "Checklist Items - " + groupName,
      InputFields: [
        // Enhanced status dropdowns for each item
        ...groupedItems[groupName].map((item) => {
          const canEdit = canUserEditItem(item);
          const isNotPending = item.status !== "PENDING";
          const isDisabled = item.is_locked || !canEdit || isNotPending;

          // Enhanced disabled reason logic
          const disabledReason = item.is_locked
            ? REASSIGNMENT_CONFIG.DISABLED_REASONS.LOCKED
            : isOnHold
            ? REASSIGNMENT_CONFIG.DISABLED_REASONS.ON_HOLD
            : !canEdit
            ? REASSIGNMENT_CONFIG.DISABLED_REASONS.NO_PERMISSION
            : isNotPending
            ? "Action already taken"
            : undefined;

          return {
            InputField: SelectInputComponent,
            name: `status_${item.id}`,
            label: `${formatChecklistName(item.checklist_name)} Status`,
            placeholder: canEdit ? "Select Status" : "No permission",
            value: item.status,
            options: clearanceRequestStatusOptions,
            disabled: isDisabled,
            colsSpan: 1,
            helperText: !canEdit ? disabledReason : undefined,
            onFieldUpdate: (field, newValue) => {
              if (canEdit) {
                updateItemStatus(item.id, newValue);
              }
            },
          };
        }),

        // Enhanced reassignment section using the stable component
        ...groupedItems[groupName]
          .map((item) => {
            const canReassign = canReassignItemCheck(item);

            if (!canReassign) return null;

            return {
              InputField: ReassignmentSection,
              name: `reassignment_${item.id}`,
              itemId: item.id,
              showReassignment: reassignmentManager.showReassignment,
              reassignApprovers: reassignmentManager.reassignApprovers,
              reassignNotes: reassignmentManager.reassignNotes,
              reassignmentSubmitting:
                reassignmentManager.reassignmentSubmitting,
              employees,
              onToggleReassignment: reassignmentManager.toggleReassignment,
              onUpdateApprover: reassignmentManager.updateReassignApprover,
              onUpdateNotes: reassignmentManager.updateReassignNotes,
              onHandleReassignment: reassignmentManager.handleReassignment,
              colsSpan: 2,
            };
          })
          .filter(Boolean),

        // Enhanced remarks textarea for the group
        ...(canUserEditGroupRemarks(groupedItems[groupName])
          ? [
              {
                InputField: TextAreaInput,
                name: `remarks_${groupName}`,
                label: "Remarks (Optional)",
                placeholder: "Add any additional comments...",
                value: groupedItems[groupName][0]?.remarks || "",
                disabled: groupedItems[groupName].every(
                  (item) => item.is_locked || isOnHold
                ),
                colsSpan: 2,
                maxRows: 2,
                maxLength: 1000,
                onFieldUpdate: (field, newValue) => {
                  if (groupedItems[groupName][0]) {
                    updateItemRemarks(groupedItems[groupName][0].id, newValue);
                  }
                },
              },
            ]
          : []),
      ],
    }));
  }, [
    groupedItems,
    canUserEditItem,
    canReassignItemCheck,
    canUserEditGroupRemarks,
    formatChecklistName,
    isOnHold,
    clearanceRequestStatusOptions,
    employees,
    reassignmentManager,
    updateItemStatus,
    updateItemRemarks,
  ]);

  const progress = calculateProgress;
  const overallStatus = getOverallStatus;

  // Check if user has permission to edit any items
  const hasAnyEditPermission = useMemo(
    () => checklistItems.some((item) => canUserEditItem(item)),
    [checklistItems, canUserEditItem]
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
        title: `Clearance Checklist - ${clearanceRequest?.employee_name}`,
        footer: null,
        width: "800px",
      }}
      formConfig={{
        initialValues: {},
        enableReinitialize: false,
        handleSubmit: handleSubmit,
        submitButtonText: hasAnyEditPermission ? "Update Checklist" : "",
        cancelButtonText: "Close",
        columns: 2,
        disableSubmit: isSubmitting || !hasAnyEditPermission,
        hideSubmit: !hasAnyEditPermission,
        loadingMessage: isSubmitting ? "Updating checklist..." : "",
        formFields: [
          // Enhanced progress header with hold warning
          {
            sheetCardExtension: true,
            sheetCardTitle: "Progress Overview",
            InputFields: [
              // Enhanced Progress Overview Section
              {
                InputField: () => (
                  <div className="space-y-4">
                    {/* Enhanced Hold Warning Banner */}
                    {isOnHold && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">
                              Clearance on Hold
                            </h4>
                            <p className="text-sm text-red-700 mb-2">
                              This clearance is currently on hold. All editing
                              actions are blocked until the hold is removed.
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
                    )}

                    {!hasAnyEditPermission && !isOnHold && (
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
                            {progress}% Complete (
                            {PROGRESS_CALCULATION.COMPLETED_STATUSES.map(
                              (status) =>
                                checklistItems.filter(
                                  (item) => item.status === status
                                ).length
                            ).reduce((a, b) => a + b, 0)}{" "}
                            of {checklistItems.length})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Employee Information with Department/Reporting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <EmployeeOverview
                        id={clearanceRequest?.employee}
                        showPosition={true}
                        showDepartment={true}
                        showBranchName={true}
                      />

                      <div className="space-y-2">
                        <div>
                          <strong>Clearance Type:</strong>{" "}
                          {clearanceTypes?.find(
                            (type) =>
                              type?.value === clearanceRequest?.clearance_type
                          )?.label || "N/A"}
                        </div>
                        <div>
                          <strong>Start Date:</strong>{" "}
                          {renderDate(clearanceRequest?.start_date) || "N/A"}
                        </div>
                        <div>
                          <strong>Direct Manager:</strong>{" "}
                          {checklistItems.length > 0 &&
                          checklistItems[0].direct_report ? (
                            <EmployeeName
                              value={checklistItems[0].direct_report}
                            />
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reporting Hierarchy Summary */}
                    {checklistItems.length > 0 && (
                      <div className="border-t pt-3">
                        <h4 className="text-sm font-medium mb-2">
                          Approval Hierarchy Summary
                        </h4>
                        <div className="space-y-1 text-sm">
                          {/* Group by designation for summary */}
                          {Object.entries(
                            checklistItems.reduce((acc, item) => {
                              const designationName = formatChecklistName(
                                item.checklist_name
                              );
                              if (!acc[designationName]) {
                                acc[designationName] = {
                                  designation: item.designation,
                                  direct_report: item.direct_report,
                                  assignment_scope: item.assignment_scope,
                                };
                              }
                              return acc;
                            }, {})
                          ).map(([checklistName, info]) => (
                            <div
                              key={checklistName}
                              className="flex justify-between items-center py-1"
                            >
                              <span className="font-medium">
                                {checklistName}:
                              </span>
                              <span className="text-neutral-1200">
                                {info.assignment_scope === "DIRECT" &&
                                  info.direct_report && (
                                    <EmployeeName value={info.direct_report} />
                                  )}
                                {info.assignment_scope === "DESIGNATION" && (
                                  <DesignationName
                                    value={info.designation}
                                    fallBackText="Designation-based"
                                  />
                                )}
                                {info.assignment_scope === "INDIRECT" &&
                                  "Indirect Reports"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
