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
import ScheduleShiftModal from "../Modals/ScheduleShiftModal";
import { generateShiftScheduleLog } from "../Section/getEmployeeActiveShift";
import { HasAccess } from "utils/PermissionUtils";

const DraftSchedule = ({ draftSchedules, reload, employees }) => {
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [proceedState, setProceedState] = useState(null);
  const [deleteState, setDeleteState] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userProfile = useSelector((state) => state.user.userProfile);
  const isApprovePermitted = HasAccess("APPROVE_SHIFT_SCHEDULES");

  console.log("Draft Schedules", draftSchedules);

  const handleScheduleSelect = (schedule) => {
    setActiveSchedule(schedule);
  };

  const handleProceedForApproval = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to proceed for approval");
      return;
    }

    setProceedState({
      open: true,
      data: activeSchedule,
    });
  };

  const handleReject = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to delete");
      return;
    }

    setDeleteState({
      open: true,
      data: activeSchedule,
    });
  };

  const handleEdit = () => {
    if (!activeSchedule) {
      toast.error("Please select a schedule to edit");
      return;
    }

    setIsEditModalOpen(true);
  };

  const confirmProceedForApproval = async () => {
    setProcessing(true);
    try {
      // Create a new record for pending schedule (without draft flag)
      const originalSchedule = proceedState.data;
      
      // Prepare payload for new pending schedule
      const newSchedulePayload = {
        employee: originalSchedule.employee,
        shift: originalSchedule.shift,
        schedule_name: originalSchedule.schedule_name,
        start_date: originalSchedule.start_date,
        end_date: originalSchedule.end_date,
        is_org_based: originalSchedule.is_org_based,
        custom_schedule: originalSchedule.custom_schedule,
        total_weekly_hours: originalSchedule.total_weekly_hours,
        assigned_by: originalSchedule.assigned_by,
        status: "Pending", // Set status to Pending for approval
        is_off_day: originalSchedule.is_off_day,
        // Note: draft will be false by default (backend handles this)
        // Clear rejection reason if this was a rejected schedule
        rejection_reason: null,
      };

      // Create new pending schedule
      const newResponse = await saveShiftSchedule(newSchedulePayload);

      if (newResponse) {
        // Delete the old draft schedule completely
        const deleteResponse = await deleteShiftSchedule(originalSchedule.id);

        if (deleteResponse) {
          // No log generation for draft operations
          toast.success("Schedule proceeded for approval successfully!");
          setProceedState(null);
          setActiveSchedule(null);

          // Reload the data
          if (typeof reload === "function") {
            reload();
          }
        } else {
          toast.error("Failed to process draft schedule");
        }
      } else {
        toast.error("Failed to create pending schedule");
      }
    } catch (error) {
      console.error("Error proceeding schedule for approval:", error);
      toast.error("Failed to proceed schedule for approval");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditSuccess = () => {
    // Reload the data after successful edit
    if (typeof reload === "function") {
      reload();
    }
    setActiveSchedule(null);
  };

  const confirmDelete = async () => {
    setProcessing(true);
    try {
      // No log generation for draft operations
      const response = await deleteShiftSchedule(deleteState.data.id);

      if (response) {
        toast.success("Draft schedule deleted successfully");
        setDeleteState(null);
        setActiveSchedule(null);

        // Reload the data
        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      console.error("Error deleting draft schedule:", error);
      toast.error("Failed to delete draft schedule");
    } finally {
      setProcessing(false);
    }
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
              <p className="text-sm">Draft Schedules</p>
              <p className="text-sm">{draftSchedules?.count || 0}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[700px] overflow-auto">
          {draftSchedules?.count > 0 &&
            draftSchedules?.results?.map((schedule, index) => (
              <ListView
                pendingShift={schedule}
                key={index}
                handleSelect={handleScheduleSelect}
                active={activeSchedule}
                getShiftName={getShiftName}
                isDraft={true}
              />
            ))}
          {(!draftSchedules?.results ||
            draftSchedules.results.length === 0) && (
            <div className="text-center py-4">No draft schedule found</div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 w-full p-4 bg-gray-100 rounded-lg shadow-lg">
        {/* Rejection Reason Display */}
        {activeSchedule &&
          activeSchedule.status === "Rejected" &&
          activeSchedule.rejection_reason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-red-600 font-medium text-sm">
                  Rejection Reason:
                </div>
              </div>
              <div className="mt-1 text-red-700 text-sm">
                {activeSchedule.rejection_reason}
              </div>
              {activeSchedule.approved_by && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-red-600 font-medium text-sm">
                    Rejected by:
                  </span>
                  <EmployeeOverview
                    id={activeSchedule.approved_by}
                    showId={true}
                  />
                </div>
              )}
            </div>
          )}

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
                {processing && deleteState?.open ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={handleProceedForApproval}
                disabled={!activeSchedule || processing}
              >
                {processing && proceedState?.open
                  ? "Processing..."
                  : "Proceed for Approval"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Proceed for Approval Confirmation Dialog */}
      {proceedState?.open && (
        <AlertDialogue
          title="Proceed for Approval?"
          description={`Are you sure you want to proceed this draft schedule for approval for Employee ${proceedState?.data?.employee}?`}
          isOpen={proceedState.open}
          setIsOpen={(isOpen) =>
            setProceedState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmProceedForApproval}
          isLoading={processing}
          continueButtonText="Proceed for Approval"
          continueButtonVariant="default"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteState?.open && (
        <AlertDialogue
          title="Delete Draft Schedule?"
          description={`Are you sure you want to delete this draft schedule for Employee ${deleteState?.data?.employee}? This action cannot be undone.`}
          isOpen={deleteState.open}
          setIsOpen={(isOpen) =>
            setDeleteState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
          isLoading={processing}
          continueButtonText="Delete"
          continueButtonVariant="destructive"
        />
      )}

      {/* Edit Schedule Modal - Pass isDraft prop */}
      {isEditModalOpen && (
        <ScheduleShiftModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          selectedDates={null}
          employees={employees}
          editSchedule={activeSchedule}
          onScheduleSuccess={handleEditSuccess}
          isDraft={true} // Pass isDraft prop for editing draft schedules
        />
      )}
    </div>
  );
};

const ListView = ({ pendingShift, handleSelect, active, getShiftName, isDraft = false }) => {
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

      <div className="flex items-center justify-between gap-4">
        {/* Employee Info */}
        <div className="flex-1">
          <EmployeeOverview
            id={pendingShift?.employee}
            showPosition={true}
            showDepartment={true}
            showBranchName={true}
          />
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`
            px-3 py-1.5 rounded-full text-xs font-medium
            ${
              pendingShift.status === "Pending"
                ? "bg-[#FEF3C7] text-[#92400E]"
                : pendingShift.status === "Rejected"
                ? "bg-[#FEE2E2] text-[#991B1B]"
                : "bg-[#F3F4F6] text-[#1F2937]"
            }
          `}
          >
            {console.log("Draft Schedule Status", pendingShift.status, pendingShift.draft)}
            {pendingShift.draft && pendingShift.status === "Pending" ? "Pending Draft" : pendingShift.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DraftSchedule;