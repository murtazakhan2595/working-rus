// src/app/modules/Attendance/ShiftCalendar/Section/PendingScheduleAction.jsx
import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import DropdownActionMenu from "components/DropdownActionMenu";
import SheetComponent from "components/ui/CustomSheet";
import { toast } from "react-toastify";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import { useSelector } from "react-redux";
import { TextAreaInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { EmployeeOverview } from "components";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";

const PendingScheduleAction = ({ data, reload }) => {
  const [viewSchedule, setViewSchedule] = useState(null);
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
        onEdit={handleApprove}
        onDelete={handleReject}
        viewText="View Details"
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

// Schedule View Sheet Component
const ScheduleViewSheet = ({ isOpen, setIsOpen, schedule }) => {
  if (!schedule) return null;

  const getShiftTypeDisplay = () => {
    if (schedule.is_off_day) return "OFF Day";
    if (schedule.is_split_shift) return "Split Shift";
    return "Regular Shift";
  };

  const getTimeDisplay = () => {
    if (schedule.is_off_day) return "No working hours";
    if (schedule.is_split_shift) {
      return `Split: ${moment(schedule.split_start_time).format(
        "h:mm A"
      )} - ${moment(schedule.split_end_time).format("h:mm A")}`;
    }
    return "Regular shift timings";
  };

  const formSheetData = {
    title: "Shift Schedule Details",
    description: null,
    footer: null,
  };

  const scheduleDetails = [
    {
      label: "Employee ID",
      value: schedule.employee_id,
    },
    {
      label: "Branch",
      value: schedule.branch_name,
    },
    {
      label: "Submitted By",
      value: schedule.submitted_by,
    },
    {
      label: "Period",
      value: `${moment(schedule.start_date).format("MMM D, YYYY")} - ${moment(
        schedule.end_date
      ).format("MMM D, YYYY")}`,
    },
    {
      label: "Duration",
      value: `${
        Math.abs(
          moment(schedule.end_date).diff(moment(schedule.start_date), "days")
        ) + 1
      } days`,
    },
    {
      label: "Shift Type",
      value: getShiftTypeDisplay(),
    },
    {
      label: "Working Hours",
      value: getTimeDisplay(),
    },
    {
      label: "Submitted Date",
      value: moment(schedule.created_at).format("MMM D, YYYY h:mm A"),
    },
    {
      label: "Status",
      value: schedule.status,
    },
  ].filter(Boolean);

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="custom-sheet-width"
      width="600px"
    >
      {/* Employee Overview */}
      <div className="mb-6">
        <EmployeeOverview
          id={schedule.employee_id}
          showEmail={true}
          showDepartment={true}
          showPosition={true}
          showId={true}
          showBranchName={true}
        />
      </div>

      {/* Schedule Details Card */}
      <DetailCard
        detailCardTitle="Schedule Details"
        date={schedule.created_at}
        dateTitle="Submitted On"
      >
        <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
          {scheduleDetails.map((item, index) => (
            <DetailBox key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailCard>

      {/* Status Card */}
      <DetailCard detailCardTitle="Current Status" className="mt-4">
        <DetailBox
          label="Status"
          value={
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700">
              {schedule.status}
            </span>
          }
        />
        <DetailBox label="Assigned By" value={schedule.submitted_by} />
        {schedule.rejection_reason && (
          <>
            <DetailBox
              label="Rejection Reason"
              value={schedule.rejection_reason}
            />
          </>
        )}
      </DetailCard>

      {/* Close Button */}
      <div className="flex justify-end pt-6">
        <Button
          variant="outline"
          type="button"
          size="lg"
          onClick={() => setIsOpen(false)}
        >
          Close
        </Button>
      </div>
    </SheetComponent>
  );
};

// Reject Reason Dialog Component (keeping as Dialog since it's small)
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

export default PendingScheduleAction;
