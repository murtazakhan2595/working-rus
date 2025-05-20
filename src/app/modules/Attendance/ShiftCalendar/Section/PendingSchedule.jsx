// src/app/modules/Attendance/ShiftManagement/Sections/PendingSchedule.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { TextAreaInput } from "components/FormControl";
import ShiftCalendarView from "../index";

const PendingSchedule = () => {
  const [pendingSchedules, setPendingSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Mock data for pending schedules (replace with API call later)
  useEffect(() => {
    setPendingSchedules([
      {
        id: 1,
        employee_id: 101,
        employee_name: "John Doe",
        branch_id: 1,
        branch_name: "Main Branch",
        submitted_by: "Branch Manager A",
        submitted_date: "2025-05-15",
        schedule_dates: [
          "2025-05-20",
          "2025-05-21",
          "2025-05-22",
          "2025-05-23",
          "2025-05-24",
        ],
        shifts: [
          {
            date: "2025-05-20",
            is_off: false,
            start_time: "2025-05-20T09:00:00",
            end_time: "2025-05-20T18:00:00",
          },
          {
            date: "2025-05-21",
            is_off: false,
            start_time: "2025-05-21T09:00:00",
            end_time: "2025-05-21T18:00:00",
          },
          { date: "2025-05-22", is_off: true },
          {
            date: "2025-05-23",
            is_off: false,
            start_time: "2025-05-23T09:00:00",
            end_time: "2025-05-23T18:00:00",
          },
          {
            date: "2025-05-24",
            is_off: false,
            start_time: "2025-05-24T09:00:00",
            end_time: "2025-05-24T18:00:00",
          },
        ],
      },
      {
        id: 2,
        employee_id: 102,
        employee_name: "Jane Smith",
        branch_id: 2,
        branch_name: "Downtown Branch",
        submitted_by: "Branch Manager B",
        submitted_date: "2025-05-16",
        schedule_dates: [
          "2025-05-20",
          "2025-05-21",
          "2025-05-22",
          "2025-05-23",
          "2025-05-24",
        ],
        shifts: [
          {
            date: "2025-05-20",
            is_off: false,
            start_time: "2025-05-20T10:00:00",
            end_time: "2025-05-20T19:00:00",
          },
          {
            date: "2025-05-21",
            is_off: false,
            start_time: "2025-05-21T10:00:00",
            end_time: "2025-05-21T19:00:00",
          },
          {
            date: "2025-05-22",
            is_off: false,
            start_time: "2025-05-22T10:00:00",
            end_time: "2025-05-22T19:00:00",
          },
          { date: "2025-05-23", is_off: true },
          { date: "2025-05-24", is_off: true },
        ],
      },
    ]);
  }, []);

  const handleApprove = (scheduleId) => {
    // This would call the API to approve the schedule
    toast.success("Schedule approved successfully!");

    // Update UI by removing the approved schedule
    setPendingSchedules(
      pendingSchedules.filter((schedule) => schedule.id !== scheduleId)
    );
    setSelectedSchedule(null);
  };

  const handleReject = (scheduleId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    // This would call the API to reject the schedule
    toast.success("Schedule rejected successfully");

    // Update UI by removing the rejected schedule
    setPendingSchedules(
      pendingSchedules.filter((schedule) => schedule.id !== scheduleId)
    );
    setSelectedSchedule(null);
    setShowRejectForm(false);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Shift Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending schedules to review
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border-r pr-4">
                <h3 className="font-medium mb-4">Submitted Schedules</h3>
                <div className="space-y-2">
                  {pendingSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedSchedule?.id === schedule.id
                          ? "bg-primary-50 border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowRejectForm(false);
                      }}
                    >
                      <div className="font-medium">
                        {schedule.employee_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Branch: {schedule.branch_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Submitted by: {schedule.submitted_by}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {schedule.submitted_date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                {selectedSchedule ? (
                  <div>
                    <h3 className="font-medium mb-4">
                      Schedule for {selectedSchedule.employee_name}
                    </h3>

                    <ShiftCalendarView
                      shifts={selectedSchedule.shifts}
                      employeeName={selectedSchedule.employee_name}
                      editable={true}
                    />

                    <div className="mt-6 space-y-4">
                      {showRejectForm ? (
                        <div className="border p-4 rounded-md">
                          <TextAreaInput
                            name="rejectReason"
                            label="Reason for Rejection"
                            value={rejectReason}
                            onChange={(name, value) => setRejectReason(value)}
                            required={true}
                          />
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowRejectForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(selectedSchedule.id)}
                            >
                              Reject & Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowRejectForm(true)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleApprove(selectedSchedule.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    Select a schedule to review
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingSchedule;
