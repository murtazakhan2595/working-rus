// src/app/modules/Attendance/ShiftCalendar/PendingSchedule/PendingSchedule.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getShiftSchedule, saveShiftSchedule, deleteShiftSchedule } from "app/hooks/shiftManagement";
import moment from "moment";
import { EmployeeOverview, EmployeeID } from "components";
import ScheduleCalendar from "./ScheduleCalendar";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import RejectReasonDialog from "./RejectReasonDialog";
import ScheduleShiftModal from "../Modals/ScheduleShiftModal";
import { generateShiftScheduleLog } from "../Section/getEmployeeActiveShift";
import { HasAccess } from "utils/PermissionUtils";

const PendingSchedule = ({ pendingSchedules, reload, employees }) => {
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [approveState, setApproveState] = useState(null);
  const [rejectState, setRejectState] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userProfile = useSelector((state) => state.user.userProfile);
  const isApprovePermitted = HasAccess("APPROVE_SHIFT_SCHEDULES");

  console.log("Pending Schedules", pendingSchedules);

  const handleScheduleSelect = (schedule) => {
    setActiveSchedule(schedule);
  };

  const handleApprove = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to approve");
      return;
    }

    setApproveState({
      open: true,
      data: activeSchedule,
    });
  };

  const handleReject = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to reject");
      return;
    }

    setRejectState({
      open: true,
      data: activeSchedule,
    });
    setRejectReason("");
  };

  const handleEdit = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to edit");
      return;
    }

    setIsEditModalOpen(true);
  };

  const confirmApprove = async () => {
    setProcessing(true);
    try {
      // Generate log for the new approved entry
      await generateShiftScheduleLog({
        scheduleData: approveState.data,
        logType: "Change Request",
        userProfile,
        status: "Approved",
      });
      // Create a new approved record
      const originalSchedule = approveState.data;

      // Prepare payload for new approved schedule
      const newApprovedPayload = {
        employee: originalSchedule.employee,
        shift: originalSchedule.shift,
        schedule_name: originalSchedule.schedule_name,
        start_date: originalSchedule.start_date,
        end_date: originalSchedule.end_date,
        is_org_based: originalSchedule.is_org_based,
        custom_schedule: originalSchedule.custom_schedule,
        total_weekly_hours: originalSchedule.total_weekly_hours,
        assigned_by: originalSchedule.assigned_by,
        status: "Approved",
        is_off_day: originalSchedule.is_off_day,
        approved_by: userProfile.id,
        // Note: draft will be false by default (backend handles this)
      };

      // Create new approved schedule
      const newResponse = await saveShiftSchedule(newApprovedPayload);

      if (newResponse) {
        // Delete the old pending schedule
        const deleteResponse = await deleteShiftSchedule(originalSchedule.id);

        if (deleteResponse) {
          toast.success("Schedule approved successfully!");
          setApproveState(null);
          setActiveSchedule(null);

          // Reload the data
          if (typeof reload === "function") {
            reload();
          }
        } else {
          toast.error("Failed to process pending schedule");
        }
      } else {
        toast.error("Failed to create approved schedule");
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
      // No log generation when moving rejected schedules back to drafts
      const response = await saveShiftSchedule({
        id: rejectState?.data?.id,
        approved_by: userProfile.id,
        status: "Rejected",
        rejection_reason: rejectReason,
        draft: true, // Move back to draft tab
      });

      if (response) {
        toast.success("Schedule rejected and moved back to drafts");
        setRejectState(null);
        setRejectReason("");
        setActiveSchedule(null); // Clear selection after rejection

        // Reload the data
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

  const handleEditSuccess = () => {
    // Reload the data after successful edit
    if (typeof reload === "function") {
      reload();
    }
    setActiveSchedule(null); // Clear selection after edit
  };

  // Get shift name helper function
  const getShiftName = (schedule) => {
    if (schedule.is_org_based && schedule.shift_details) {
      return schedule.shift_details.name || "Organization Shift";
    } else {
      return schedule.schedule_name || "Custom Schedule";
    }
  };

  return (
    <div className="flex gap-2">
      <Card className="min-w-[40%]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <p className="text-sm">All Members</p>
              <p className="text-sm">{pendingSchedules?.count || 0}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[700px] overflow-auto">
          {pendingSchedules?.count > 0 &&
            pendingSchedules?.results?.map((schedule, index) => (
              <ListView
                pendingShift={schedule}
                key={index}
                handleSelect={handleScheduleSelect}
                active={activeSchedule}
                getShiftName={getShiftName}
              />
            ))}
          {(!pendingSchedules?.results ||
            pendingSchedules.results.length === 0) && (
            <div className="text-center py-4">No pending schedule found</div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 w-full p-4 bg-gray-100 rounded-lg shadow-lg">
        <ScheduleCalendar pendingSchedule={activeSchedule} />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={!activeSchedule || processing}
          >
            Edit Schedule
          </Button>
          {isApprovePermitted && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={!activeSchedule || processing}
              >
                {processing && rejectState?.open
                  ? "Processing..."
                  : "Reject with Reason"}
              </Button>
              <Button
              onClick={handleApprove}
              disabled={!activeSchedule || processing}
            >
              {processing && approveState?.open ? "Processing..." : "Approve"}
            </Button>
          </div>)}
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      {approveState?.open && (
        <AlertDialogue
          title="Approve Schedule?"
          description={`Are you sure you want to approve this shift schedule for Employee ${approveState?.data?.employee}?`}
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
          employeeId={rejectState?.data?.employee}
        />
      )}

      {/* Edit Schedule Modal */}
      {isEditModalOpen && (
        <ScheduleShiftModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          selectedDates={null}
          employees={employees}
          editSchedule={activeSchedule} // Pass the schedule to edit
          onScheduleSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

const ListView = ({ pendingShift, handleSelect, active, getShiftName }) => {
  const isActive = active && active.id === pendingShift.id;

  return (
    <div
      className={`
        relative mb-3 p-4 rounded-lg border-2 cursor-pointer
        transition-all duration-150 
        ${
          isActive
            ? "bg-plum-300 text-plum-1100 border-plum-400 shadow-md transform scale-[1.01]"
            : "border-gray-200 hover:bg-plum-500 hover:text-plum-900 hover:border-plum-300"
        }
      `}
      onClick={() => handleSelect(pendingShift)}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-plum-600 rounded-r-full" />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left Section - Employee Info */}
        <div className="flex-1">
          <div className="mb-3">
            <EmployeeOverview
              id={pendingShift?.employee}
              showPosition={true}
              showDepartment={true}
              showBranchName={true}
            />
          </div>

          {/* Shift Details - Better organized */}
          <div className="space-y-1.5 pl-12">
            <div className="text-base font-medium text-neutral-1100">
              {getShiftName(pendingShift)}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {moment(pendingShift.start_date).format("MMM DD, YYYY")}
              </span>
              <span className="text-muted-foreground">—</span>
              <span className="text-muted-foreground">
                {moment(pendingShift.end_date).format("MMM DD, YYYY")}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Weekly Hours: {pendingShift.total_weekly_hours}h
            </div>
          </div>
        </div>

        {/* Right Section - Status & Type */}
        <div className="flex flex-col items-end justify-center gap-2 min-w-[90px]">
          <span
            className={`
            px-3 py-1.5 rounded-full text-xs font-medium
            ${
              pendingShift.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : pendingShift.status === "Approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {pendingShift.status}
          </span>

          <span
            className={`
            text-xs font-medium
            ${pendingShift.is_org_based ? "text-blue-600" : "text-purple-600"}
          `}
          >
            {pendingShift.is_org_based ? "Org Shift" : "Custom"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PendingSchedule;
