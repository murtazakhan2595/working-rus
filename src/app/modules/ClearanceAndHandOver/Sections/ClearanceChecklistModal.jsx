import React, { useState, useEffect } from "react";
import { SheetUI } from "components";
import { SelectInputComponent, TextAreaInput } from "components/FormControl";
import { Progress } from "src/@/components/ui/progress";
import { Badge } from "components/ui/badge";
import { StatusIcon, getStatusVariant } from "components/StatusLabel";
import { toast } from "react-toastify";

// Dummy checklist data based on clearance type and department
const generateChecklistData = (clearanceRequest) => {
  const baseItems = {
    "IT Department": [
      {
        id: 1,
        name: "Return laptop and accessories",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: true,
      },
      {
        id: 2,
        name: "Return ID card and access cards",
        eSignatureStatus: "Not Required",
        status: "Pending",
        required: true,
      },
      {
        id: 3,
        name: "Software license handover",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: clearanceRequest.clearance_type !== "Leave",
      },
    ],
    "HR Department": [
      {
        id: 4,
        name: "Final settlement calculation",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: true,
      },
      {
        id: 5,
        name: "Exit interview completion",
        eSignatureStatus: "Not Required",
        status: "Pending",
        required: ["Resignation", "Termination", "External Transfer"].includes(
          clearanceRequest.clearance_type
        ),
      },
      {
        id: 6,
        name: "Update employee records",
        eSignatureStatus: "Acknowledged",
        status: "Pending",
        required: true,
      },
    ],
    "Finance Department": [
      {
        id: 7,
        name: "Clear outstanding advances",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: true,
      },
      {
        id: 8,
        name: "Final payroll processing",
        eSignatureStatus: "Not Required",
        status: "Pending",
        required: ["Resignation", "Termination"].includes(
          clearanceRequest.clearance_type
        ),
      },
    ],
    "Reporting Manager": [
      {
        id: 9,
        name: "Handover of ongoing projects",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: true,
      },
      {
        id: 10,
        name: "Knowledge transfer completion",
        eSignatureStatus: "Pending",
        status: "Pending",
        required: clearanceRequest.clearance_type !== "Leave",
      },
    ],
  };

  // Filter items based on requirements
  const filteredItems = {};
  Object.keys(baseItems).forEach((department) => {
    filteredItems[department] = baseItems[department].filter(
      (item) => item.required
    );
  });

  return filteredItems;
};

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Not Applicable", label: "Not Applicable" },
  { value: "Rejected", label: "Rejected" },
];

export default function ClearanceChecklistModal({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
}) {
  const [checklistData, setChecklistData] = useState({});
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (clearanceRequest) {
      const generatedChecklist = generateChecklistData(clearanceRequest);
      setChecklistData(generatedChecklist);

      // Initialize form data
      const initialFormData = {};
      Object.keys(generatedChecklist).forEach((department) => {
        initialFormData[department] = {
          items: {},
          remarks: "",
          isLocked: Math.random() > 0.7, // Simulate some departments already submitted
        };
        generatedChecklist[department].forEach((item) => {
          initialFormData[department].items[item.id] = item.status;
        });
      });
      setFormData(initialFormData);
    }
  }, [clearanceRequest]);

  const FormSheetData = {
    triggerText: "",
    title: `Clearance Checklist - ${clearanceRequest?.employee_name}`,
    description: `${clearanceRequest?.clearance_type} clearance for ${clearanceRequest?.employee_id}`,
    footer: null,
    width: "800px",
  };

  // Calculate progress
  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;

    Object.keys(checklistData).forEach((department) => {
      checklistData[department].forEach((item) => {
        totalItems++;
        const currentStatus =
          formData[department]?.items[item.id] || item.status;
        if (
          currentStatus === "Approved" ||
          currentStatus === "Not Applicable"
        ) {
          completedItems++;
        }
      });
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Check if any item is rejected
  const hasRejectedItems = () => {
    return Object.keys(checklistData).some((department) =>
      checklistData[department].some((item) => {
        const currentStatus =
          formData[department]?.items[item.id] || item.status;
        return currentStatus === "Rejected";
      })
    );
  };

  // Get overall status
  const getOverallStatus = () => {
    if (hasRejectedItems()) return "Rejected";

    const progress = calculateProgress();
    if (progress === 100) return "Completed";
    if (progress > 0) return "In Process";
    return "Pending";
  };

  const handleItemStatusChange = (department, itemId, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      [department]: {
        ...prev[department],
        items: {
          ...prev[department].items,
          [itemId]: newStatus,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleRemarksChange = (department, remarks) => {
    setFormData((prev) => ({
      ...prev,
      [department]: {
        ...prev[department],
        remarks,
      },
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lock the sections that have been updated
      setFormData((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((department) => {
          if (hasChanges) {
            updated[department].isLocked = true;
          }
        });
        return updated;
      });

      setHasChanges(false);
      toast.success("Checklist updated successfully!");

      // If all completed, show completion message
      if (getOverallStatus() === "Completed") {
        toast.success("Clearance process completed!");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reload();
  };

  // Generate form fields for each department
  const generateFormFields = () => {
    return Object.keys(checklistData).map((department) => ({
      sheetCardExtension: true,
      sheetCardTitle: (
        <div className="flex justify-between items-center">
          <span>{department}</span>
          {formData[department]?.isLocked && (
            <Badge variant="success">Submitted</Badge>
          )}
        </div>
      ),
      InputFields: [
        // Department items
        ...checklistData[department].map((item) => ({
          InputField: ({ value, onFieldUpdate, disabled }) => (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <StatusIcon
                    status={formData[department]?.items[item.id] || item.status}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">E-Signature:</span>
                  <Badge variant={getStatusVariant(item.eSignatureStatus)}>
                    {item.eSignatureStatus}
                  </Badge>
                </div>
              </div>
              <div className="w-40">
                <SelectInputComponent
                  value={formData[department]?.items[item.id] || item.status}
                  options={statusOptions}
                  disabled={disabled || formData[department]?.isLocked}
                  onFieldUpdate={(field, newValue) => {
                    handleItemStatusChange(department, item.id, newValue);
                  }}
                />
              </div>
            </div>
          ),
          name: `${department}_item_${item.id}`,
          label: "",
          colsSpan: 2,
          value: formData[department]?.items[item.id] || item.status,
        })),
        // Department remarks
        {
          InputField: TextAreaInput,
          name: `${department}_remarks`,
          label: "Remarks (Optional)",
          placeholder: "Add any additional comments for this section...",
          disabled: formData[department]?.isLocked,
          value: formData[department]?.remarks || "",
          colsSpan: 2,
          rows: 2,
          onFieldUpdate: (field, value) => {
            handleRemarksChange(department, value);
          },
        },
      ],
    }));
  };

  const progress = calculateProgress();
  const overallStatus = getOverallStatus();

  return (
    <>
      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: {},
          enableReinitialize: false,
          handleSubmit: handleSubmit,
          submitButtonText: "Update Checklist",
          cancelButtonText: "Close",
          columns: 2,
          disableSubmit: isSubmitting || !hasChanges,
          loadingMessage: isSubmitting ? "Updating checklist..." : "",
          formFields: [
            // Progress header
            {
              sheetCardExtension: true,
              sheetCardTitle: "Clearance Progress Overview",
              InputFields: [
                {
                  InputField: () => (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-neutral-900">
                            Overall Status:
                          </span>
                          <div className="mt-1">
                            <Badge variant={getStatusVariant(overallStatus)}>
                              {overallStatus}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-900">
                            Progress:
                          </span>
                          <div className="mt-2">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-neutral-900 mt-1">
                              {progress}% Complete
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-900">
                        <strong>Employee:</strong>{" "}
                        {clearanceRequest?.employee_name} (
                        {clearanceRequest?.employee_id})
                        <br />
                        <strong>Type:</strong>{" "}
                        {clearanceRequest?.clearance_type}
                        <br />
                        <strong>Department:</strong>{" "}
                        {clearanceRequest?.department}
                      </div>
                    </div>
                  ),
                  name: "progress_overview",
                  label: "",
                  colsSpan: 2,
                },
              ],
            },
            // Department sections
            ...generateFormFields(),
          ],
        }}
      />
    </>
  );
}
