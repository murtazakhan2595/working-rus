import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceChecklistModal from "./ClearanceChecklistModal";
import { HasAccess } from "utils/PermissionUtils";
import ClearanceHoldModal from "../OnHold/ClearanceHoldModal";

const ClearanceActions = ({
  data,
  reloadData = () => {},
  clearanceList = [],
  clearanceTypes,
}) => {
  const [viewChecklist, setViewChecklist] = useState(null);
  const [holdModal, setHoldModal] = useState({ isOpen: false, mode: "place" });

  // Permission checks
  const canManageHolds = HasAccess("ONHOLD_CLEARANCE");

  const isOnHold = data?.status === "ONHOLD";
  const isCompleted = data?.status === "COMPLETED";
  const isRejected = data?.status === "REJECTED";

  // Handle opening the checklist view
  const handleViewChecklist = () => {
    setViewChecklist(true);
  };

  // Handle opening hold modal
  const handlePlaceHold = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoldModal({ isOpen: true, mode: "place" });
  };

  const handleRemoveHold = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoldModal({ isOpen: true, mode: "remove" });
  };

  const handleViewHoldDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoldModal({ isOpen: true, mode: "view" });
  };

  // Prepare additional options for hold management using your additionalOptionsConfig
  const additionalOptions = [];

  if (canManageHolds) {
    if (isOnHold) {
      // If on hold, show remove hold option
      additionalOptions.push({
        text: "Remove Hold",
        action: handleRemoveHold,
      });
      // Also show view hold details for transparency
      additionalOptions.push({
        text: "View Hold Details",
        action: handleViewHoldDetails,
      });
    } else if (!isCompleted && !isRejected) {
      // If not on hold and not completed/rejected, show place hold option
      additionalOptions.push({
        text: "Place Hold",
        action: handlePlaceHold,
      });
    }
  } else if (isOnHold) {
    // Non-authorized users can still view hold details for transparency
    additionalOptions.push({
      text: "View Hold Details",
      action: handleViewHoldDetails,
    });
  }

  return (
    <>
      <DropdownActionMenu
        onView={handleViewChecklist}
        viewText="View Clearance Checklist"
        editText="Edit Clearance"
        deleteText="Delete Clearance"
        menuTooltip="Clearance Actions"
        // Using additionalOptionsConfig for hold actions
        additionalOptionsConfig={additionalOptions}
        // Hide edit and delete by not passing onEdit and onDelete
      />

      {/* View Clearance Checklist */}
      {viewChecklist && (
        <ClearanceChecklistModal
          isOpen={viewChecklist}
          setIsOpen={setViewChecklist}
          clearanceRequest={data}
          reload={reloadData}
          clearanceTypes={clearanceTypes}
        />
      )}

      {/* Hold Management Modal */}
      {holdModal.isOpen && (
        <ClearanceHoldModal
          isOpen={holdModal.isOpen}
          setIsOpen={(isOpen) => setHoldModal({ ...holdModal, isOpen })}
          clearanceRequest={data}
          reload={reloadData}
          mode={holdModal.mode}
        />
      )}
    </>
  );
};

export default ClearanceActions;
