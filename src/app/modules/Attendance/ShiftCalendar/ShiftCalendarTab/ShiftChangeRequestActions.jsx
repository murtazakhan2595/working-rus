import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import SheetComponent from "components/ui/SheetComponent";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { TextAreaInput } from "components/FormControl";
import { Button } from "components/ui/button";
import moment from "moment";
import { EmployeeOverview } from "components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { generateShiftScheduleLog } from "../Section/getEmployeeActiveShift";
import { StatusButtons, StatusList } from "components";

const ShiftChangeRequestActions = ({ data, reload }) => {

  console.log("ShiftChangeRequestActions mounted", data);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);

  const handleView = () => {
    setViewSheetOpen(true);
  };

 const handleApprovalResponse = async (success, status) => {
   if (!success) {
     toast.error(`Failed to ${status.toLowerCase()} request`);
     return;
   }

   // Show initial success message
   toast.success(`Request ${status} Successfully!`);

   // For rejection, we need to show the rejection reason modal first
   if (status === "Rejected") {
     setRejectModalOpen(true);
     return; // Don't close the modal yet, let them enter rejection reason
   }

   // 🚀 NEW: Only apply approval logic if this is the FINAL approval
   if (status === "Approved") {
     const isThisFinalApproval = isFinalApproval();

     console.log("Approval Debug Info:", {
       currentLevel: data.current_level,
       approvalLevels: data.approval_levels,
       approvalDetails: data.approval_details,
       isFinalApproval: isThisFinalApproval,
     });

     if (isThisFinalApproval) {
       console.log("✅ Final approval - applying business logic");
       await applyApprovalLogic();
     } else {
       console.log(
         "⏳ Intermediate approval - business logic will run after final approval"
       );
     }
   }

   // Close modal and reload
   reload();
   setViewSheetOpen(false);
 };

 const isFinalApproval = () => {
   // Method 1: Check if current level has is_final_approval flag
   const currentApprovalLevel = data.approval_levels?.find(
     (level) => level.level_number === data.current_level
   );

   if (currentApprovalLevel?.is_final_approval) {
     return true;
   }

   // Method 2: Check if this is the highest level number
   const maxLevel = Math.max(
     ...(data.approval_levels?.map((level) => level.level_number) || [0])
   );
   if (data.current_level === maxLevel) {
     return true;
   }

   // Method 3: Check if all approval levels are completed (fallback)
   const allApproved = data.approval_details?.every(
     (detail) =>
       detail.status === "APPROVED" ||
       detail.level_number === data.current_level
   );

   return allApproved;
 };

  // 🚀 EXTRACTED: Approval business logic
  const applyApprovalLogic = async () => {
    setIsSubmitting(true);
    try {
      await generateShiftScheduleLog({
        scheduleData: data,
        logType: "Change Request",
        userProfile: userProfile,
        status: "Approved",
      });

      const payload = {
        ...data,
        employee: data.employee.id || data.employee,
        status: "Approved",
        approved_by: userProfile.employee_id || userProfile.id,
        approval_date: moment().format("YYYY-MM-DD"),
        is_change_request: "false",
      };

      const response = await saveShiftSchedule(payload);

      if (response) {
        toast.success("Shift changes have been applied successfully!");
      } else {
        toast.warning("Request approved but failed to apply changes");
      }
    } catch (error) {
      console.error("Error applying approval logic:", error);
      toast.warning("Request approved but failed to complete all actions");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 UPDATED: Rejection with reason
  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await generateShiftScheduleLog({
        scheduleData: data,
        logType: "Change Request",
        userProfile: userProfile,
        status: "Rejected",
      });

      const payload = {
        ...data,
        employee: data.employee.id || data.employee,
        status: "Rejected",
        approved_by: userProfile.employee_id || userProfile.id,
        approval_date: moment().format("YYYY-MM-DD"),
        rejection_reason: rejectionReason,
      };

      const response = await saveShiftSchedule(payload);

      if (response) {
        toast.success("Shift change request rejected with reason");
        reload();
        setRejectModalOpen(false);
        setViewSheetOpen(false);
        setRejectionReason("");
      } else {
        toast.error("Failed to save rejection reason");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("An error occurred while saving rejection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSheetData = {
    triggerText: null,
    title: "Shift Change Request Details",
    footer: null,
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText="View Request"
        menuTooltip="Request Actions"
      />

      <SheetComponent
        {...formSheetData}
        isOpen={viewSheetOpen}
        setIsOpen={setViewSheetOpen}
        width="700px"
      >
      {console.log("ShiftChangeRequestActions mounted", data)}
        <div className="flex flex-col gap-4">
          {/* Employee Info */}
          <div className="mb-4">
            <EmployeeOverview
              id={data.employee}
              showPosition={true}
              showDepartment={true}
              showBranchName={true}
            />
          </div>

          {/* Request Information Card */}
          <DetailCard
            detailCardTitle="Request Information"
            date={data.created_at}
            dateTitle="Request Date"
          >
            <DetailBox
              label="Requested By"
              value={<EmployeeOverview id={data.assigned_by} />}
            />
            <DetailBox
              label="Status"
              value={
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    data.status === "Approved"
                      ? "bg-emerald-50 text-teal-700"
                      : data.status === "Rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-muted-700"
                  }`}
                >
                  {data.status}
                </span>
              }
            />
          </DetailCard>

          {/* ✅ ADD: Approval Details Section */}
          {data.approval_details && data.approval_details.length > 0 && (
            <DetailCard detailCardTitle="Approval Details" className="mt-4">
              <StatusList
                status_list={data.approval_details}
                className="my-3"
              />
            </DetailCard>
          )}

          {/* Shift Changes Card */}
          <DetailCard detailCardTitle="Shift Changes" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Current Shift</th>
                    <th className="text-left py-2 px-3">Requested Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison_data?.map((day, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">
                        {moment(day.date).format("ddd, MMM DD")}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={
                            day.current_shift === "OFF"
                              ? "text-blue-600 font-medium"
                              : ""
                          }
                        >
                          {day.current_shift}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={
                            day.requested_shift === "OFF"
                              ? "text-blue-600 font-medium"
                              : ""
                          }
                        >
                          {day.requested_shift}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailCard>

          {/* Rejection Reason (if rejected) */}
          {data.status === "Rejected" && data.rejection_reason && (
            <div className="mt-4 p-3 border rounded-md bg-red-50 text-sm">
              <div className="font-medium mb-1 text-red-800">
                Rejection Reason
              </div>
              <div className="text-red-700">{data.rejection_reason}</div>
            </div>
          )}

          {/* 🚀 UPDATED: Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={() => setViewSheetOpen(false)}
              size="lg"
            >
              Close
            </Button>

            <StatusButtons
              permissionKey={[
                "EDIT_PENDING_SCHEDULES",
                "APPROVE_SHIFT_SCHEDULES",
              ]}
              permissionLogic="OR"
              status={data?.status}
              current_approver={data?.current_approver || []}
              request_id={data?.hierarchy_request || data?.request}
              setResponse={handleApprovalResponse}
            />
          </div>
        </div>
      </SheetComponent>

      {/* 🚀 UPDATED: Rejection Modal - Now triggered by approval flow */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Shift Change Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <TextAreaInput
              name="rejection_reason"
              value={rejectionReason}
              label="Rejection Reason"
              required={true}
              onChange={(field, value) => setRejectionReason(value)}
              maxRows={3}
              placeholder="Please provide a reason for rejecting this request"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectionReason("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectWithReason} // 🚀 Use the new handler
              disabled={!rejectionReason.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShiftChangeRequestActions;
