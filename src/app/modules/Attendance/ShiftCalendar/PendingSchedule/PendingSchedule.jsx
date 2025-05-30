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
import { getShiftSchedule, saveShiftSchedule } from "app/hooks/shiftManagement";
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
      await generateShiftScheduleLog({
        scheduleData: approveState.data,
        logType: "Change Request",
        userProfile,
        status: "Approved",
      });
      const response = await saveShiftSchedule({
        id: approveState?.data?.id,
        approved_by: userProfile.id,
        status: "Approved",
      });

      if (response) {
        
        toast.success("Schedule approved successfully!");
        setApproveState(null);
        setActiveSchedule(null); // Clear selection after approval

        // Reload the data
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
      await generateShiftScheduleLog({
        scheduleData: rejectState.data,
        logType: "Change Request",
        userProfile,
        status: "Rejected",
      });
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
      className={`flex flex-row items-center justify-start gap-4 py-3 px-2 border-b-2 hover:bg-plum-500 hover:text-plum-900 cursor-pointer rounded-md transition-colors duration-150 ${
        isActive
          ? "bg-plum-300 text-plum-1100 border-plum-400"
          : "border-gray-200"
      }`}
      onClick={() => {
        handleSelect(pendingShift);
      }}
    >
      <EmployeeOverview
        id={pendingShift?.employee}
        showPosition={true}
        showDepartment={true}
      />
      <div className="flex flex-col justify-start gap-1 flex-1">
        <div className="flex justify-start text-base font-medium text-neutral-1100">
          {getShiftName(pendingShift)}
        </div>
        <div className="flex justify-start text-sm text-muted-foreground">
          {moment(pendingShift.start_date).format("MMM DD, YYYY")} -{" "}
          {moment(pendingShift.end_date).format("MMM DD, YYYY")}
        </div>
        <div className="flex justify-start text-xs text-muted-foreground">
          Weekly Hours: {pendingShift.total_weekly_hours}h
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex flex-col items-end">
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
          {pendingShift.status}
        </span>
        {pendingShift.is_org_based ? (
          <span className="text-xs text-blue-600 mt-1">Org Shift</span>
        ) : (
          <span className="text-xs text-purple-600 mt-1">Custom</span>
        )}
      </div>
    </div>
  );
};

export default PendingSchedule;
