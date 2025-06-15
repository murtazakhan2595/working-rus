// src/app/modules/Attendance/ShiftCalendar/Section/RejectReasonDialog.jsx
import React from "react";
import { TextAreaInput } from "components/FormControl";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";

const RejectReasonDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  reason,
  setReason,
  employeeId,
}) => {
  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setReason("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting the schedule for Employee{" "}
            {employeeId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <TextAreaInput
            name="rejection_reason"
            error={reason.trim() === ""}
            touch={true}
            value={reason}
            label="Rejection Reason"
            required={true}
            onChange={(field, value) => setReason(value)}
            maxRows={3}
            placeholder="Please provide a reason for rejecting this schedule"
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
            variant="destructive"
            onClick={onSubmit}
            disabled={reason.trim() === "" || isSubmitting}
          >
            {isSubmitting ? "Rejecting..." : "Reject & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonDialog;
