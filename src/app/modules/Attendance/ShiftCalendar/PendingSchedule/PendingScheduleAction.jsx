// src/app/modules/Attendance/ShiftCalendar/Section/PendingScheduleAction.jsx
import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import { useSelector } from "react-redux";
import EmployeeCalendarDialog from "./EmployeeCalendarDialog";
import ScheduleViewSheet from "./ScheduleViewSheet";
import RejectReasonDialog from "./RejectReasonDialog";

const PendingScheduleAction = ({ data, reload }) => {
  const [viewSchedule, setViewSchedule] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const [approveState, setApproveState] = useState(null);
  const [rejectState, setRejectState] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const userProfile = useSelector((state) => state.user.userProfile);

  const handleView = () => {
    setViewSchedule({
      visible: true,
      data: data,
    });
  };

  const handleShowCalendar = () => {
    setShowCalendar({
      visible: true,
      data: data,
    });
  };

  const handleApprove = () => {
    setApproveState({
      open: true,
      data: data,
    });
  };

  const handleReject = () => {
    setRejectState({
      open: true,
      data: data,
    });
    setRejectReason("");
  };

  const confirmApprove = async () => {
    setProcessing(true);
    try {
      const response = await saveShiftSchedule({
        id: approveState?.data?.id,
        approved_by: userProfile.id,
        status: "Approved",
      });

      if (response) {
        toast.success("Schedule approved successfully!");
        setApproveState(null);

        // Reload the table
        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      console.error("Error approving schedule:", error);
      toast.error("Failed to approve schedule");
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessing(true);
    try {
      const response = await saveShiftSchedule({
        id: rejectState?.data?.id,
        approved_by: userProfile.id,
        status: "Rejected",
        rejection_reason: rejectReason,
      });

      if (response) {
        toast.success("Schedule rejected successfully");
        setRejectState(null);
        setRejectReason("");

        // Reload the table
        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      console.error("Error rejecting schedule:", error);
      toast.error("Failed to reject schedule");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onCustom={handleShowCalendar}
        onEdit={handleApprove}
        onDelete={handleReject}
        viewText="View Details"
        customText="Show Calendar"
        editText="Approve"
        deleteText="Reject"
        menuTooltip="Schedule Actions"
      />

      {/* Approve Confirmation */}
      {approveState?.open && (
        <AlertDialogue
          title="Approve Schedule?"
          description={`Are you sure you want to approve this shift schedule for Employee ${approveState?.data?.employee_id}?`}
          isOpen={approveState.open}
          setIsOpen={(isOpen) =>
            setApproveState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmApprove}
          isLoading={processing}
          continueButtonText="Approve"
          continueButtonVariant="default"
        />
      )}

      {/* View Schedule Sheet */}
      {viewSchedule?.visible && (
        <ScheduleViewSheet
          isOpen={viewSchedule.visible}
          setIsOpen={(isOpen) =>
            setViewSchedule((prev) => ({ ...prev, visible: isOpen }))
          }
          schedule={viewSchedule.data}
        />
      )}

      {/* Calendar View Dialog */}
      {showCalendar?.visible && (
        <EmployeeCalendarDialog
          isOpen={showCalendar.visible}
          setIsOpen={(isOpen) =>
            setShowCalendar((prev) => ({ ...prev, visible: isOpen }))
          }
          schedule={showCalendar.data}
        />
      )}

      {/* Reject Reason Dialog */}
      {rejectState?.open && (
        <RejectReasonDialog
          open={rejectState.open}
          onOpenChange={(isOpen) =>
            setRejectState((prev) => ({ ...prev, open: isOpen }))
          }
          onSubmit={confirmReject}
          isSubmitting={processing}
          reason={rejectReason}
          setReason={setRejectReason}
          employeeId={rejectState?.data?.employee_id}
        />
      )}
    </>
  );
};

export default PendingScheduleAction;
