import React, { useState } from "react";
import { Button } from "components/ui/button";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import SheetComponent from "components/ui/SheetComponent";
import { Formik } from "formik";
import { TextAreaInput, DateInput } from "components/FormControl";
import {
  SheetCardExtension,
  handleCloseWithConfirmation,
} from "components/SheetCardExtension";

const AssetRequestDetailSheet = ({
  userProfile,
  isOpen,
  setIsOpen,
  request,
  reload,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  const formSheetData = {
    title: "Asset Request Details",
    description: null,
    footer: null,
  };

  const initialValues = {
    return_date: null,
    notes: "",
    rejection_reason: "",
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleApproveReject = async (values) => {
    setProcessing(true);

    try {
      const payload = {
        request_id: request.id,
        status: actionType === "approve" ? "Approved" : "Rejected",
        assigned_by: userProfile.id,
        ...(actionType === "approve" && values.return_date
          ? { return_date: values.return_date }
          : {}),
        ...(actionType === "approve"
          ? { notes: values.notes }
          : { rejection_reason: values.rejection_reason }),
      };

      // Simulate API call - replace with actual API
      const response = await fetch(
        `${userProfile.baseUrl}/asset_request/${request.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success(
          `Request ${
            actionType === "approve" ? "approved" : "rejected"
          } successfully`
        );
        setIsOpen(false);
        reload();
      } else {
        toast.error(`Failed to ${actionType} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
        width="568px"
      >
        <div className="mt-6 space-y-6">
          <SheetCardExtension title="Request Information">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Employee Name
                  </p>
                  <p className="text-sm font-semibold">
                    {request.employee_name || "Not Available"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Employee ID
                  </p>
                  <p className="text-sm font-semibold">
                    {request.employee_id || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p className="text-sm font-semibold">
                    {request.department || "Not Available"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Designation
                  </p>
                  <p className="text-sm font-semibold">
                    {request.designation || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Asset Name</p>
                <p className="text-sm font-semibold">
                  {request.asset_name || "Not Available"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Reason for Request
                </p>
                <p className="text-sm">
                  {request.reason || "No reason provided"}
                </p>
              </div>

              {request.additional_notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Additional Notes
                  </p>
                  <p className="text-sm">{request.additional_notes}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Request Date
                </p>
                <p className="text-sm">
                  {request.created_at
                    ? moment(request.created_at).format("MMM D, YYYY")
                    : "Not Available"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={`text-sm font-medium 
                  ${
                    request.status === "Pending"
                      ? "text-yellow-600"
                      : request.status === "Approved"
                      ? "text-green-600"
                      : request.status === "Rejected"
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {request.status || "Pending"}
                </p>
              </div>
            </div>
          </SheetCardExtension>

          {request.status === "Pending" && (
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => handleApproveReject(values)}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  {actionType === "approve" ? (
                    <SheetCardExtension title="Approval Details">
                      <DateInput
                        name="return_date"
                        error={props.errors?.return_date}
                        touch={props.touched?.return_date}
                        value={props.values.return_date}
                        label="Return Date (if applicable)"
                        required={false}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select return date"
                      />
                      <TextAreaInput
                        name="notes"
                        error={props.errors?.notes}
                        touch={props.touched?.notes}
                        value={props.values.notes}
                        label="Notes"
                        required={false}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        maxRows={3}
                        placeholder="Add any additional notes"
                      />
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outline"
                          type="button"
                          size="lg"
                          onClick={() => setActionType(null)}
                          disabled={processing}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          variant="default"
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Confirm Approval"}
                        </Button>
                      </div>
                    </SheetCardExtension>
                  ) : actionType === "reject" ? (
                    <SheetCardExtension title="Rejection Details">
                      <TextAreaInput
                        name="rejection_reason"
                        error={props.errors?.rejection_reason}
                        touch={props.touched?.rejection_reason}
                        value={props.values.rejection_reason}
                        label="Reason for Rejection"
                        required={true}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        maxRows={3}
                        placeholder="Explain why this request is being rejected"
                      />
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outline"
                          type="button"
                          size="lg"
                          onClick={() => setActionType(null)}
                          disabled={processing}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          variant="destructive"
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Confirm Rejection"}
                        </Button>
                      </div>
                    </SheetCardExtension>
                  ) : (
                    <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                      <Button
                        variant="outline"
                        type="button"
                        size="lg"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant="destructive"
                        type="button"
                        size="lg"
                        onClick={() => setActionType("reject")}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        type="button"
                        size="lg"
                        onClick={() => setActionType("approve")}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </Formik>
          )}

          {request.status !== "Pending" && (
            <div className="flex justify-end pt-6">
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </SheetComponent>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(AssetRequestDetailSheet);
