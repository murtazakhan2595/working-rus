// utils/clearanceApprovalUtils.js

/**
 * Determines approval permissions for clearance checklist items
 * Prioritizes reassign_approver over original assignment scope
 *
 * @param {Object} item - The checklist item
 * @param {number} currentUserId - Current logged-in user ID
 * @param {boolean} isOnHold - Whether clearance is on hold
 * @param {string} returnType - 'boolean' or 'approver' or 'details'
 * @returns {boolean|Object} - Based on returnType
 */
export const checkClearanceApproval = (
  item,
  currentUserId,
  isOnHold = false,
  returnType = "boolean"
) => {

  console.log("Approval Check Debug:", {
    itemId: item?.id,
    currentUserId,
    isOnHold,
    returnType,
    reassignApprover: item?.reassign_approver,
    assignmentScope: item?.assignment_scope,
    directReport: item?.direct_report,
    indirectReport: item?.indirect_report,
    designationList: item?.employees_with_matching_designation,
  });
  
  // Basic validation
  if (!item || !currentUserId) {
    return returnType === "boolean" ? false : null;
  }

  // Block all approvals when on hold
  if (isOnHold) {
    return returnType === "boolean"
      ? false
      : { canApprove: false, reason: "On hold" };
  }

  // PRIORITY 1: Check reassign_approver first (highest priority)
  if (item.reassign_approver && item.reassign_approver !== null) {
    const canApprove =
      parseInt(currentUserId) === parseInt(item.reassign_approver);

    // Debug logging
    console.log("Reassignment Debug:", {
      itemId: item.id,
      currentUserId,
      reassign_approver: item.reassign_approver,
      currentUserIdParsed: parseInt(currentUserId),
      reassignApproverParsed: parseInt(item.reassign_approver),
      canApprove,
    });

    if (returnType === "boolean") {
      return canApprove;
    } else if (returnType === "approver") {
      return canApprove ? item.reassign_approver : null;
    } else {
      return {
        canApprove,
        approverType: "REASSIGNED",
        approverId: item.reassign_approver,
        reason: canApprove
          ? "Reassigned approver match"
          : "Not the reassigned approver",
        reassignNotes: item.reassign_notes || null,
      };
    }
  }

  // PRIORITY 2: Fall back to original assignment scope logic
  if (!item.assignment_scope) {
    return returnType === "boolean"
      ? false
      : { canApprove: false, reason: "No assignment scope" };
  }

  let canApprove = false;
  let approverType = item.assignment_scope;
  let approverId = null;
  let reason = "";

  switch (item.assignment_scope) {
    case "DIRECT":
      canApprove = currentUserId === parseInt(item.direct_report);
      approverId = item.direct_report;
      reason = canApprove ? "Direct report match" : "Not the direct report";
      break;

    case "INDIRECT":
      canApprove =
        Array.isArray(item.indirect_report) &&
        item.indirect_report.includes(currentUserId);
      approverId = canApprove ? currentUserId : item.indirect_report;
      reason = canApprove
        ? "Indirect report match"
        : "Not in indirect reports list";
      break;

    case "DESIGNATION":
      canApprove =
        Array.isArray(item.employees_with_matching_designation) &&
        item.employees_with_matching_designation.includes(currentUserId);
      approverId = canApprove
        ? currentUserId
        : item.employees_with_matching_designation;
      reason = canApprove ? "Designation match" : "Not in designation list";
      break;

    default:
      canApprove = false;
      reason = "Unknown assignment scope";
  }

  // Return based on requested type
  if (returnType === "boolean") {
    return canApprove;
  } else if (returnType === "approver") {
    return canApprove ? approverId : null;
  } else {
    return {
      canApprove,
      approverType,
      approverId,
      reason,
      reassignNotes: null, // No reassignment in original scope
    };
  }
};

/**
 * Simplified boolean check for approval permission
 */
export const canUserApproveItem = (item, currentUserId, isOnHold = false) => {
  return checkClearanceApproval(item, currentUserId, isOnHold, "boolean");
};

/**
 * Get the actual approver ID for an item
 */
export const getItemApprover = (item, currentUserId, isOnHold = false) => {
  return checkClearanceApproval(item, currentUserId, isOnHold, "approver");
};

/**
 * Get detailed approval information
 */
export const getApprovalDetails = (item, currentUserId, isOnHold = false) => {
  return checkClearanceApproval(item, currentUserId, isOnHold, "details");
};

/**
 * Check if item is eligible for reassignment
 * AC1: Only pending, unlocked, non-hold items can be reassigned
 */
export const canReassignItem = (item, currentUserId, isOnHold = false) => {
  return (
    item.status === "PENDING" &&
    !item.is_locked &&
    !isOnHold &&
    canUserApproveItem(item, currentUserId, isOnHold)
  );
};

/**
 * Get all users who can approve a specific item (useful for reassignment dropdown)
 */
export const getPotentialApprovers = (item) => {
  const approvers = [];

  // If already reassigned, only the reassigned approver can approve
  if (item.reassign_approver) {
    return [item.reassign_approver];
  }

  // Otherwise, get approvers based on assignment scope
  switch (item.assignment_scope) {
    case "DIRECT":
      if (item.direct_report) {
        approvers.push(item.direct_report);
      }
      break;
    case "INDIRECT":
      if (Array.isArray(item.indirect_report)) {
        approvers.push(...item.indirect_report);
      }
      break;
    case "DESIGNATION":
      if (Array.isArray(item.employees_with_matching_designation)) {
        approvers.push(...item.employees_with_matching_designation);
      }
      break;
  }

  return approvers;
};
