import React, { useState, useRef } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "src/@/components/ui/dialog";
import { Label } from "src/@/components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { toast } from "react-toastify";
import {
  Download,
  Upload,
  AlertCircle,
  Info,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Import only the template API
import { getPayrollAdjustmentTemplate } from "app/hooks/payroll";
import { uploadPayrollAdjustment } from "app/hooks/payroll";

const ImportPayrollAdjustmentsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showFieldInfo, setShowFieldInfo] = useState(true);

  // Create a ref for the file input element
  const fileInputRef = useRef(null);

  // Static data for component display
  const sampleEmployeeIds = ["TBX-0001", "TBX-0100", "TBX-0200"];

  // Function to reset the file input and state
  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file extension
      if (!selectedFile.name.endsWith(".xlsx")) {
        toast.error("Only .xlsx format is allowed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        resetFileInput();
        return;
      }

      setFile(selectedFile);
      // Clear previous validation errors when a new file is selected
      setValidationErrors([]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getPayrollAdjustmentTemplate();

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      // Use the filename from the API response (based on Content-Disposition header)
      link.setAttribute("download", "payroll_adjustments_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      setIsUploading(true);
      setValidationErrors([]); // Clear previous errors

      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Call the API to upload the file
      const response = await uploadPayrollAdjustment(formData);

      // Check if the response contains errors
      if (response.errors || (response.status && response.status >= 400)) {
        // Handle validation errors from the API
        const errorMessages = response.errors || [
          response.message || "Upload failed. Please try again.",
        ];
        setValidationErrors(
          Array.isArray(errorMessages) ? errorMessages : [errorMessages]
        );
        toast.error("Import failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        // Success case
        toast.success("Payroll adjustments imported successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsOpen(false);
        resetFileInput();
      }
    } catch (error) {
      console.error("Error uploading payroll adjustments:", error);

      // Generic error fallback
      setValidationErrors([
        "An unexpected error occurred. Please try again or contact support.",
      ]);

      // Reset file input when errors occur
      resetFileInput();

      toast.error("Import failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary-dark"
        type="button"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Adjustment
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setValidationErrors([]);
            resetFileInput();
          }
        }}
      >
        <DialogContent className="sm:max-w-6xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Import Payroll Adjustments</DialogTitle>
            <DialogDescription className="text-sm text-gray-900">
              Upload an Excel file to bulk import payroll adjustment data. Make
              sure your data follows the required format.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable container for the content */}
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-gray-900" />
                  <span>Download the template for correct formatting</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  type="button"
                >
                  Download
                </Button>
              </div>

              <div className="border border-blue-300 bg-blue-50 rounded-md p-3 mt-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowFieldInfo(!showFieldInfo)}
                >
                  <div className="flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    <h3 className="text-sm font-medium text-blue-800">
                      Required Field Format Information
                    </h3>
                  </div>
                  {showFieldInfo ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                {showFieldInfo && (
                  <div className="mt-2">
                    <p className="text-xs text-blue-700 mb-2">
                      For a successful import, the following fields require{" "}
                      <strong>specific values</strong>:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Employee Information:
                        </h4>
                        <p className="text-xs font-medium text-blue-700">
                          Employee ID:
                        </p>
                        <p className="text-xs text-blue-700 pl-2">
                          Use valid employee IDs from the system. Example:{" "}
                          {sampleEmployeeIds.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Required Format for Fields:
                        </h4>
                        <ul className="list-disc pl-5 text-xs text-blue-700">
                          <li>
                            <strong>Component Type/ Income Type</strong>:
                            "earning" or "deduction"
                          </li>
                          <li>
                            <strong>Amount Type/ "Amounts Type"</strong>:
                            "fixed" or "percentage"
                          </li>
                          <li>
                            <strong>Amount</strong>:
                            <ul className="list-disc pl-5">
                              <li>For "fixed": Any positive number</li>
                              <li>
                                For "percentage": Percentage value (max 100%)
                              </li>
                            </ul>
                          </li>
                          <li>
                            <strong>Payable Month</strong>: YYYY/MM format (must
                            be future month)
                          </li>
                          <li>
                            <strong>
                              Approval Required / "Is Manager Approval"
                            </strong>
                            : "True" or "False"
                          </li>
                        </ul>

                        <div className="mt-2">
                          <h4 className="text-xs font-medium text-blue-800 mb-1">
                            File Requirements:
                          </h4>
                          <p className="text-xs text-blue-700 pl-2">
                            Only <strong>.xlsx</strong> format is accepted
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-blue-700 mt-2 italic">
                      Using incorrect values will result in validation errors.
                      All data will be validated before import.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">
                  Upload Payroll Adjustment Data
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                {file && (
                  <p className="text-sm text-gray-900">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              {validationErrors.length > 0 && (
                <div className="border border-red-500 bg-red-50 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="w-full">
                      <div className="text-sm font-medium text-red-800 mb-2">
                        The following errors were found:
                      </div>
                      <ul className="list-disc pl-4 text-sm text-red-700 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="break-words">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetFileInput();
                setValidationErrors([]);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              type="button"
            >
              {isUploading ? "Uploading..." : "Upload & Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportPayrollAdjustmentsButton;
