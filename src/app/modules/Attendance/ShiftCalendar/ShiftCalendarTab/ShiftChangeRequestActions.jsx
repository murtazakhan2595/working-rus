// ShiftChangeRequestActions.jsx
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

const ShiftChangeRequestActions = ({ data, reload }) => {
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);

  const canApprove = data.status === "Pending" && true;

  const handleView = () => {
    setViewSheetOpen(true);
  };

  const handleApprove = async () => {
    if (!canApprove) return;

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
        toast.success("Shift change request approved successfully!");
        reload();
        setViewSheetOpen(false);
      } else {
        toast.error("Failed to approve shift change request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("An error occurred while approving the request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmitting(true);
    await generateShiftScheduleLog({
      scheduleData: data,
      logType: "Change Request",
      userProfile: userProfile,
      status: "Rejected",
    });
    try {
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
        toast.success("Shift change request rejected");
        reload();
        setRejectModalOpen(false);
        setViewSheetOpen(false);
        setRejectionReason("");
      } else {
        toast.error("Failed to reject shift change request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("An error occurred while rejecting the request");
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

      {/* View Sheet with Comparison Data */}
      <SheetComponent
        {...formSheetData}
        isOpen={viewSheetOpen}
        setIsOpen={setViewSheetOpen}
        width="700px"
      >
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            {canApprove ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setViewSheetOpen(false)}
                  disabled={isSubmitting}
                  size="lg"
                >
                  Close
                </Button>
                <Button
                  variant="destructiveOutline"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={isSubmitting}
                  size="lg"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Processing..." : "Approve"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setViewSheetOpen(false)}
                size="lg"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </SheetComponent>

      {/* Rejection Modal - Keep this as Dialog for quick action */}
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
              onClick={handleReject}
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
