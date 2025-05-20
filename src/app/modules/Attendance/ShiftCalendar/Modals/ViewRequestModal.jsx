// src/app/modules/Attendance/ShiftManagement/Modals/ViewRequestModal.jsx
import React, { useState } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Button } from "components/ui/button";
import { TextAreaInput } from "components/FormControl";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import moment from "moment";

const ViewRequestModal = ({
  isOpen,
  setIsOpen,
  request,
  onApprove = () => {},
  onReject = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleApproveClick = () => {
    onApprove(request.id);
  };

  const handleRejectClick = () => {
    if (showRejectForm) {
      if (!rejectReason.trim()) {
        return; // Don't submit if no reason provided
      }
      onReject(request.id, rejectReason);
    } else {
      setShowRejectForm(true);
    }
  };

  const formSheetData = {
    title: "Shift Change Request Details",
    description: null,
    footer: null,
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
        discard: false,
      })}

      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="568px"
      >
        <div className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Employee Name</div>
                  <div>{request.employee_name}</div>
                </div>
                <div>
                  <div className="font-medium">Requested By</div>
                  <div>{request.requested_by}</div>
                </div>
              </div>

              <div>
                <div className="font-medium">Request Date</div>
                <div>{moment(request.request_date).format("MMM D, YYYY")}</div>
              </div>

              <div>
                <div className="font-medium">Shift Date</div>
                <div>
                  {moment(request.shift_date).format("dddd, MMM D, YYYY")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Current Shift</div>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100">
                      {request.current_shift}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Requested Shift</div>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-md text-sm font-medium bg-blue-100">
                      {request.requested_shift}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-medium">Status</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium inline-block
                    ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>

              {request.rejection_reason && (
                <div>
                  <div className="font-medium">Rejection Reason</div>
                  <div className="text-red-600">{request.rejection_reason}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {request.status === "Pending" && (
            <div className="space-y-4">
              {showRejectForm ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Rejection Reason</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TextAreaInput
                      name="rejectReason"
                      label="Please provide a reason for rejection"
                      value={rejectReason}
                      onChange={(name, value) => setRejectReason(value)}
                      required={true}
                    />
                  </CardContent>
                </Card>
              ) : null}

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>

                {!showRejectForm ? (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={handleRejectClick}
                    >
                      Reject
                    </Button>

                    <Button variant="default" onClick={handleApproveClick}>
                      Approve
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={handleRejectClick}
                      disabled={!rejectReason.trim()}
                    >
                      Reject & Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {request.status !== "Pending" && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </SheetComponent>
    </>
  );
};

export default ViewRequestModal;
