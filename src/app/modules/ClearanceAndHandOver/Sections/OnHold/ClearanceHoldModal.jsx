import React, { useState } from "react";
import { SheetUI } from "components";
import { TextAreaInput, CoverFileUpload } from "components/FormControl";
import { Badge } from "components/ui/badge";
import { AlertTriangle, FileText, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { renderDate } from "utils/renderValues";
import { updateClearanceRequest } from "app/hooks/clearanceAndHandover";

const ClearanceHoldModal = ({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  mode = "place", // "place" or "remove" or "view"
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceHold = async (values, { setSubmitting, resetForm }) => {
    if (!clearanceRequest?.id) {
      toast.error("Clearance request data not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        on_hold_reason: values.on_hold_reason,
        on_hold_attachment: values.on_hold_attachment || null,
        status: "ONHOLD",
      };

      const response = await updateClearanceRequest(
        clearanceRequest.id,
        payload
      );

      if (response) {
        toast.success("Clearance hold placed successfully!");
        handleClose();
      } else {
        toast.error("Failed to place clearance hold");
      }
    } catch (error) {
      console.error("Error placing clearance hold:", error);
      toast.error("Failed to place clearance hold");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleRemoveHold = async (values, { setSubmitting }) => {
    if (!clearanceRequest?.id) {
      toast.error("Clearance request data not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        on_hold_reason: null,
        on_hold_attachment: null,
        status: "IN_PROCESS", // Reset to IN_PROCESS when removing hold
      };

      const response = await updateClearanceRequest(
        clearanceRequest.id,
        payload
      );

      if (response) {
        toast.success("Clearance hold removed successfully!");
        handleClose();
      } else {
        toast.error("Failed to remove clearance hold");
      }
    } catch (error) {
      console.error("Error removing clearance hold:", error);
      toast.error("Failed to remove clearance hold");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reload();
  };

  // Dummy submit handler for view mode (does nothing but closes modal)
  const handleViewModeSubmit = async (values, { setSubmitting }) => {
    handleClose();
  };

  // Determine modal configuration based on mode
  const getModalConfig = () => {
    switch (mode) {
      case "place":
        return {
          title: `Place Hold - ${
            clearanceRequest?.employee_name || "Employee"
          }`,
          submitText: "Place Hold",
          cancelText: "Cancel",
          handleSubmit: handlePlaceHold,
          formFields: getPlaceHoldFields(),
          hideSubmit: false,
        };
      case "remove":
        return {
          title: `Remove Hold - ${
            clearanceRequest?.employee_name || "Employee"
          }`,
          submitText: "Remove Hold",
          cancelText: "Cancel",
          handleSubmit: handleRemoveHold,
          formFields: getRemoveHoldFields(),
          hideSubmit: false,
        };
      case "view":
        return {
          title: `Hold Details - ${
            clearanceRequest?.employee_name || "Employee"
          }`,
          submitText: "Close", // Changed from null to "Close"
          cancelText: null, // Hide cancel button in view mode
          handleSubmit: handleViewModeSubmit, // Use dummy handler that just closes
          formFields: getViewHoldFields(),
          hideSubmit: false, // Changed to false so Close button shows
        };
      default:
        return getModalConfig("place");
    }
  };

  const getPlaceHoldFields = () => [
    {
      sheetCardExtension: true,
      sheetCardTitle: "Hold Information",
      InputFields: [
        {
          InputField: () => (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Warning: Placing Hold
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>
                      • This will block all clearance actions and checklist
                      editing
                    </li>
                    <li>
                      • Certificate generation and distribution will be disabled
                    </li>
                    <li>• SLA timers will be paused (if applicable)</li>
                    <li>• Only authorized personnel can remove this hold</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
          name: "warning_info",
          colsSpan: 2,
        },
        {
          InputField: TextAreaInput,
          name: "on_hold_reason",
          label: "Hold Reason",
          placeholder: "Enter the reason for placing this clearance on hold...",
          required: true,
          rows: 4,
          colsSpan: 2,
        },
        {
          InputField: CoverFileUpload,
          name: "on_hold_attachment",
          label: "Supporting Documents (Optional)",
          acceptType: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
          multiple: false,
          maxSize: 10,
          variant: "AttachmentFileUpload",
          colsSpan: 2,
          field_description:
            "Upload any supporting documents related to this hold",
        },
      ],
    },
  ];

  const getRemoveHoldFields = () => [
    {
      sheetCardExtension: true,
      sheetCardTitle: "Current Hold Information",
      InputFields: [
        {
          InputField: () => (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Currently On Hold
                  </span>
                </div>
                <div className="text-sm text-yellow-700">
                  Removing this hold will restore normal clearance operations
                  and allow departments to resume their checklist actions.
                </div>
              </div>

              {clearanceRequest?.on_hold_reason && (
                <div>
                  <label className="text-sm font-medium text-neutral-1200 mb-2 block">
                    Current Hold Reason:
                  </label>
                  <div className="p-3 bg-neutral-100 rounded-md text-sm text-neutral-800">
                    {clearanceRequest.on_hold_reason}
                  </div>
                </div>
              )}

              {clearanceRequest?.on_hold_attachment && (
                <div>
                  <label className="text-sm font-medium text-neutral-1200 mb-2 block">
                    Hold Attachment:
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-100 rounded-md">
                    <FileText className="h-4 w-4 text-neutral-600" />
                    <a
                      href={clearanceRequest.on_hold_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Hold Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          ),
          name: "hold_info_display",
          colsSpan: 2,
        },
      ],
    },
  ];

  const getViewHoldFields = () => [
    {
      sheetCardExtension: true,
      sheetCardTitle: "Hold Details",
      InputFields: [
        {
          InputField: () => (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="error" className="text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  On Hold
                </Badge>
                <span className="text-sm text-neutral-1100">
                  This clearance is currently on hold
                </span>
              </div>

              {/* Hold Reason Section */}
              <div>
                <label className="text-sm font-semibold text-neutral-1200 mb-3 block">
                  Hold Reason:
                </label>
                {clearanceRequest?.on_hold_reason ? (
                  <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-md">
                    <p className="text-sm text-neutral-800 leading-relaxed">
                      {clearanceRequest.on_hold_reason}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-500 italic">
                      No hold reason provided
                    </p>
                  </div>
                )}
              </div>

              {/* Supporting Document Section */}
              <div>
                <label className="text-sm font-semibold text-neutral-1200 mb-3 block">
                  Supporting Document:
                </label>
                {clearanceRequest?.on_hold_attachment ? (
                  <div className="flex items-center gap-3 p-4 bg-neutral-100 border border-neutral-300 rounded-md">
                    <FileText className="h-5 w-5 text-neutral-600 flex-shrink-0" />
                    <div>
                      <a
                        href={clearanceRequest.on_hold_attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View Hold Document
                      </a>
                      <p className="text-xs text-neutral-600 mt-1">
                        Click to open in new tab
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-500 italic">
                      No supporting document attached
                    </p>
                  </div>
                )}
              </div>

              {/* Last Updated Info */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-xs text-neutral-1100">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Last Updated:{" "}
                    {renderDate(
                      clearanceRequest?.updated_at,
                      "Never",
                      "date-time"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ),
          name: "view_hold_info",
          colsSpan: 2,
        },
      ],
    },
  ];

  const modalConfig = getModalConfig();

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={{
        triggerText: "",
        title: modalConfig.title,
        footer: null,
        width: "600px",
      }}
      formConfig={{
        initialValues: {
          on_hold_reason: "",
          on_hold_attachment: null,
        },
        enableReinitialize: false,
        handleSubmit: modalConfig.handleSubmit,
        submitButtonText: modalConfig.submitText,
        cancelButtonText: modalConfig.cancelText,
        columns: 2,
        disableSubmit: isSubmitting,
        hideSubmit: modalConfig.hideSubmit,
        loadingMessage: isSubmitting
          ? mode === "place"
            ? "Placing hold..."
            : "Removing hold..."
          : "",
        formFields: modalConfig.formFields,
      }}
    />
  );
};

export default ClearanceHoldModal;
