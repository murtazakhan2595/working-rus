// src/app/modules/Attendance/ShiftCalendar/Section/PendingScheduleAction.jsx
import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import DropdownActionMenu from "components/DropdownActionMenu";
import SheetComponent from "components/ui/CustomSheet";
import { toast } from "react-toastify";
import { saveShiftSchedule } from "app/hooks/shiftManagement";
import { getShiftById } from "app/hooks/attendance"; // Add this import for fetching shift details
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
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
        onCustom={handleShowCalendar} // Use the new 4th action
        onEdit={handleApprove}
        onDelete={handleReject}
        viewText="View Details"
        customText="Show Calendar" // Set calendar text
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

// Employee Calendar Dialog Component
const EmployeeCalendarDialog = ({ isOpen, setIsOpen, schedule }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);

  // Fetch shift details to get start/end times
  React.useEffect(() => {
    const fetchShiftDetails = async () => {
      if (!schedule || !schedule.shift_id) return;

      try {
        // Replace this with your actual API call
        const shiftData = await getShiftById(schedule.shift_id);
        setShiftDetails(shiftData);

        // Fallback to mock data if API fails (remove this in production)
        if (!shiftData) {
          const mockShiftData = {
            id: 35,
            name: "Regular Shift 05-18 (sun,mon)",
            type: "Regular",
            weekdays: "sun,mon",
            starttime: "2025-05-21T04:00:00Z",
            endtime: "2025-05-21T12:00:00Z",
            Is_org_based: false,
            organization: 1,
          };
          setShiftDetails(mockShiftData);
        }
      } catch (error) {
        console.error("Error fetching shift details:", error);

        // Use mock data as fallback (remove this in production)
        const mockShiftData = {
          id: 35,
          name: "Regular Shift 05-18 (sun,mon)",
          type: "Regular",
          weekdays: "sun,mon",
          starttime: "2025-05-21T04:00:00Z",
          endtime: "2025-05-21T12:00:00Z",
          Is_org_based: false,
          organization: 1,
        };
        setShiftDetails(mockShiftData);
      }
    };

    if (schedule?.shift_id && !schedule.is_off_day) {
      fetchShiftDetails();
    }
  }, [schedule]);

  // Generate calendar events from schedule data
  React.useEffect(() => {
    if (!schedule) return;

    const generateCalendarEvents = () => {
      const events = [];

      // Create events based on the schedule period
      const startDate = moment(schedule.start_date);
      const endDate = moment(schedule.end_date);

      // Generate events for each day in the range
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        const dateStr = currentDate.format("YYYY-MM-DD");

        if (schedule.is_off_day) {
          // OFF Day
          events.push({
            title: "OFF",
            start: dateStr,
            allDay: true,
            backgroundColor: "#3b82f6",
            borderColor: "#3b82f6",
            textColor: "#ffffff",
          });
        } else if (schedule.is_split_shift) {
          // Split Shift
          if (schedule.split_start_time && schedule.split_end_time) {
            const splitStart = moment(schedule.split_start_time);
            const splitEnd = moment(schedule.split_end_time);

            events.push({
              title: `Split Shift (${splitStart.format(
                "HH:mm"
              )} - ${splitEnd.format("HH:mm")})`,
              start: `${dateStr}T${splitStart.format("HH:mm:ss")}`,
              end: `${dateStr}T${splitEnd.format("HH:mm:ss")}`,
              backgroundColor: "#8b5cf6",
              borderColor: "#8b5cf6",
              textColor: "#ffffff",
            });
          } else {
            // Fallback for split shift without specific times
            events.push({
              title: "Split Shift",
              start: dateStr,
              allDay: true,
              backgroundColor: "#8b5cf6",
              borderColor: "#8b5cf6",
              textColor: "#ffffff",
            });
          }
        } else {
          // Regular Shift - Use actual shift times if available
          if (shiftDetails && shiftDetails.starttime && shiftDetails.endtime) {
            const shiftStart = moment(shiftDetails.starttime);
            const shiftEnd = moment(shiftDetails.endtime);

            // Create start and end times for this specific date
            const dayStartTime = moment(
              `${dateStr}T${shiftStart.format("HH:mm:ss")}`
            );
            const dayEndTime = moment(
              `${dateStr}T${shiftEnd.format("HH:mm:ss")}`
            );

            events.push({
              title: `${
                shiftDetails.name || "Regular Shift"
              } (${shiftStart.format("HH:mm")} - ${shiftEnd.format("HH:mm")})`,
              start: dayStartTime.toISOString(),
              end: dayEndTime.toISOString(),
              backgroundColor: "#22c55e",
              borderColor: "#22c55e",
              textColor: "#ffffff",
              extendedProps: {
                shiftName: shiftDetails.name,
                shiftType: shiftDetails.type,
                duration:
                  shiftEnd.diff(shiftStart, "hours", true).toFixed(1) +
                  " hours",
              },
            });
          } else {
            // Fallback when shift details are not available
            events.push({
              title: "Regular Shift",
              start: dateStr,
              allDay: true,
              backgroundColor: "#22c55e",
              borderColor: "#22c55e",
              textColor: "#ffffff",
            });
          }
        }

        currentDate.add(1, "day");
      }

      return events;
    };

    const events = generateCalendarEvents();
    setCalendarEvents(events);
    setLoading(false);
  }, [schedule, shiftDetails]); // Add shiftDetails as dependency

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-7xl w-[95vw] h-[90vh] overflow-y-auto p-6"
        style={{ maxWidth: "1400px" }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            Employee Schedule Calendar - Employee {schedule?.employee_id}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            View employee's scheduled shifts in calendar format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Employee Overview */}
          <div className="bg-white rounded-lg border p-4">
            <EmployeeOverview
              id={schedule.employee_id}
              showEmail={true}
              showDepartment={true}
              showPosition={true}
              showId={true}
              showBranchName={true}
            />
          </div>

          {/* Schedule Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Schedule Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Period:</span>
                <div className="text-gray-900">
                  {moment(schedule.start_date).format("MMM D")} -{" "}
                  {moment(schedule.end_date).format("MMM D, YYYY")}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <div className="text-gray-900">
                  {schedule.is_off_day
                    ? "OFF Day"
                    : schedule.is_split_shift
                    ? "Split Shift"
                    : "Regular Shift"}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Working Hours:
                </span>
                <div className="text-gray-900">
                  {schedule.is_off_day
                    ? "No working hours"
                    : schedule.is_split_shift
                    ? schedule.split_start_time && schedule.split_end_time
                      ? `${moment(schedule.split_start_time).format(
                          "HH:mm"
                        )} - ${moment(schedule.split_end_time).format("HH:mm")}`
                      : "Split shift times"
                    : shiftDetails &&
                      shiftDetails.starttime &&
                      shiftDetails.endtime
                    ? `${moment(shiftDetails.starttime).format(
                        "HH:mm"
                      )} - ${moment(shiftDetails.endtime).format("HH:mm")}`
                    : "Regular shift"}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                    {schedule.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional shift details if available */}
            {shiftDetails && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">
                  Shift Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Shift Name:
                    </span>
                    <div className="text-gray-900">{shiftDetails.name}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Weekdays:</span>
                    <div className="text-gray-900 capitalize">
                      {shiftDetails.weekdays?.replace(/,/g, ", ")}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Duration:</span>
                    <div className="text-gray-900">
                      {shiftDetails.starttime && shiftDetails.endtime
                        ? `${moment(shiftDetails.endtime)
                            .diff(moment(shiftDetails.starttime), "hours", true)
                            .toFixed(1)} hours`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Submitted By:
                  </span>
                  <div className="text-gray-900">{schedule.submitted_by}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Submitted Date:
                  </span>
                  <div className="text-gray-900">
                    {moment(schedule.created_at).format("MMM D, YYYY")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Schedule Calendar View</h3>
              <p className="text-sm text-gray-600 mt-1">
                Visual representation of the employee's shift schedule
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="text-gray-500 mt-2">Loading calendar...</div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="h-[500px] w-full">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="timeGridWeek"
                    initialDate={schedule.start_date}
                    events={calendarEvents}
                    height="100%"
                    eventDisplay="block"
                    dayMaxEvents={false}
                    eventTextColor="#ffffff"
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="02:00:00"
                    allDaySlot={true}
                    nowIndicator={true}
                    weekends={true}
                    // Show business hours if we have shift times
                    businessHours={
                      shiftDetails &&
                      shiftDetails.starttime &&
                      shiftDetails.endtime
                        ? {
                            daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
                            startTime: moment(shiftDetails.starttime).format(
                              "HH:mm"
                            ),
                            endTime: moment(shiftDetails.endtime).format(
                              "HH:mm"
                            ),
                          }
                        : undefined
                    }
                    // Highlight the schedule period
                    validRange={{
                      start: schedule.start_date,
                      end: moment(schedule.end_date)
                        .add(1, "day")
                        .format("YYYY-MM-DD"),
                    }}
                    // Event click handler to show details
                    eventClick={(info) => {
                      const event = info.event;
                      const props = event.extendedProps;

                      if (props.shiftName) {
                        alert(
                          `Shift: ${props.shiftName}\nType: ${props.shiftType}\nDuration: ${props.duration}`
                        );
                      }
                    }}
                    // Custom styling
                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                    dayHeaderClassNames="bg-gray-50 font-medium"
                    // Improve readability
                    eventMinHeight={30}
                    eventShortHeight={25}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Color Legend</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Regular Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Split Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>OFF Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <DialogFooter className="pt-4 border-t">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            {/* Future: Add Edit button here when edit functionality is implemented */}
            {/*
            <Button
              variant="default"
              type="button"
              size="lg"
              onClick={() => handleEdit(schedule)}
            >
              Edit Schedule
            </Button>
            */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Schedule View Sheet Component (keeping existing)
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
      width="800px"
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

// Reject Reason Dialog Component (keeping existing)
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
