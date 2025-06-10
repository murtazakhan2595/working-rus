import { cancelEmployeeLeave } from "app/hooks/leaveTracker";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const CancelLeaveRequest = ({
  isOpen = true,
  setIsOpen = () => {},
  reloadData = () => {},
  id,
}) => {
  const confirmSubmit = async () => {
    try {
      // Save role
      const response = await cancelEmployeeLeave(id);
      if (response) {
        toast.success(`Leave Cancelled Successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleClose();
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to cancel leave.`;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };
  return (
    <AlertDialogue
      title={`Confirm Cancel Leave`}
      description={`Are you sure you want to cancel the leave?`}
      isOpen={isOpen}
      setIsOpen={handleClose}
      handleContinue={() => {
        confirmSubmit();
      }}
    />
  );
};

export default CancelLeaveRequest;
