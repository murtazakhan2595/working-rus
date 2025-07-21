import React, { useState, useEffect, useRef } from "react";
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

// Import API services
import {
  getLeaveOpeningBalanceTemplate,
  uploadLeaveOpeningBalance,
} from "app/hooks/leaveTracker";
import { HasAccess } from "utils/PermissionUtils";
import { getLeaveTypes } from "app/hooks/leaveTracker";

const ImportOpeningBalance = ({ reloadData = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState(null);
  const [showFieldInfo, setShowFieldInfo] = useState(true);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  // Create a ref for the file input element
  const fileInputRef = useRef(null);


  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await getLeaveTypes({});
        console.log("Leave Types Response:", response);
        if (response?.results) {
          setLeaveTypeOptions(
            response.results.map((type) => ({
              value: type.id,
              label: type.name,
              leave_count: type.leave_count,
              ...type,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  // Process and format error messages for better readability
  const formatErrorMessages = (errors) => {
    const formattedErrors = [];

    if (!errors || errors.length === 0) return formattedErrors;

    errors.forEach((error) => {
      // Check if error is a string with JSON-like content
      if (
        typeof error === "string" &&
        (error.includes("{") || error.includes("["))
      ) {
        try {
          // Try to extract row information
          const rowMatch = error.match(/Row (\d+):/);
          const rowNum = rowMatch ? rowMatch[1] : "";

          // Check for date format errors which have a specific pattern
          if (error.includes("Date has wrong format")) {
            const dateFieldPattern =
              /'([^']+)': \[ErrorDetail\(string='Date has wrong format/g;
            let dateMatch;
            let dateFields = [];

            while ((dateMatch = dateFieldPattern.exec(error)) !== null) {
              const fieldName = dateMatch[1];
              dateFields.push(
                fieldName
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              );
            }

            if (dateFields.length > 0) {
              formattedErrors.push(
                `${
                  rowNum ? `Row ${rowNum}: ` : ""
                }Date fields must use YYYY-MM-DD format: ${dateFields.join(
                  ", "
                )}`
              );
              return; // Skip further processing for this error
            }
          }

          // Try to parse any JSON-like structure
          let errorObj = {};
          const jsonStart = error.indexOf("{");
          if (jsonStart !== -1) {
            try {
              // Extract the JSON part and parse it
              const jsonPart = error.substring(jsonStart);
              errorObj = JSON.parse(jsonPart.replace(/'/g, '"'));
            } catch {
              // If parsing fails, use regex to extract field names and error messages
              const fieldErrorPattern =
                /'([^']+)': \[ErrorDetail\(string='([^']+)/g;
              let match;
              while ((match = fieldErrorPattern.exec(error)) !== null) {
                errorObj[match[1]] = [{ message: match[2] }];
              }
            }
          }

          // Process each field error
          if (Object.keys(errorObj).length > 0) {
            Object.entries(errorObj).forEach(([field, fieldErrors]) => {
              // Handle case where fieldErrors is an array of ErrorDetail objects
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((fieldError) => {
                  let errorMessage = "";
                  if (typeof fieldError === "object" && fieldError.message) {
                    errorMessage = fieldError.message;
                  } else if (typeof fieldError === "string") {
                    errorMessage = fieldError;
                  } else if (fieldError && fieldError.string) {
                    errorMessage = fieldError.string;
                  }

                  if (errorMessage) {
                    const formattedField = field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                    formattedErrors.push(
                      `${
                        rowNum ? `Row ${rowNum}: ` : ""
                      }${formattedField}: ${errorMessage}`
                    );
                  }
                });
              } else {
                // Handle case where fieldErrors is not an array
                const formattedField = field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                formattedErrors.push(
                  `${
                    rowNum ? `Row ${rowNum}: ` : ""
                  }${formattedField}: ${fieldErrors}`
                );
              }
            });
          } else {
            // If we couldn't parse the JSON, just add the original error
            formattedErrors.push(error);
          }
        } catch (e) {
          // If any parsing fails, just add the original error
          formattedErrors.push(error);
        }
      } else {
        // For simple string errors, just add them directly
        formattedErrors.push(error);
      }
    });

    return formattedErrors;
  };

  // Function to reset the file input and state
  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Clear previous validation errors when a new file is selected
      setValidationErrors([]);
      setValidationMessage(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getLeaveOpeningBalanceTemplate();

      // Check if we got a valid blob response
      if (response && response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;

        // Set the correct filename and extension based on the blob type
        const filename = response.type.includes("spreadsheet")
          ? "leave_allocation_template.xlsx"
          : "leave_allocation_template.csv";

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Template downloaded successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("Invalid response format:", response);
        toast.error("Invalid template format received", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
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
      setValidationMessage(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Call the API to upload leave opening balance data
      const response = await uploadLeaveOpeningBalance(formData);

      // Check if response has status property (from axios response)
      const responseStatus = response?.status || response?.response?.status;
      const responseData = response?.data || response;

      // Handle 207 Multi-Status response (partial success/failure)
      if (responseStatus === 207) {
        const { errors, message } = responseData;

        if (errors && Array.isArray(errors) && errors.length > 0) {
          // Format validation errors for display
          const formattedErrors = formatErrorMessages(errors);
          setValidationErrors(formattedErrors);
          setValidationMessage(message);

          // Reset file input when errors occur
          resetFileInput();

          // Show a toast notification
          toast.error(
            "Import completed with errors. Please check the validation errors.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        } else {
          // 207 but no errors - partial success
          toast.success("Leave allocations imported successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          reloadData(true)
          handleClose();
        }
        return;
      }

      // Handle regular successful response (200/201)
      const { errors, message } = responseData;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        // Format validation errors for display
        const formattedErrors = formatErrorMessages(errors);
        setValidationErrors(formattedErrors);
        setValidationMessage(message);

        // Reset file input when errors occur
        resetFileInput();

        // Show a toast notification
        toast.error(
          "Failed to import leave allocations. Please check the validation errors.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } else {
        toast.success("Leave allocations imported successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error uploading leave allocations:", error);

      // Handle different types of error responses
      if (error?.response?.status === 207) {
        // Handle 207 Multi-Status response (partial success/failure)
        const responseData = error.response.data;

        if (
          responseData?.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          const formattedErrors = formatErrorMessages(responseData.errors);
          setValidationErrors(formattedErrors);
          setValidationMessage(responseData.message);

          // Reset file input when errors occur
          resetFileInput();

          toast.error(
            "Import completed with errors. Please check the validation errors.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        } else {
          // 207 but no errors - this shouldn't happen but handle it
          toast.success("Leave allocations imported successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          handleClose();
        }
      } else if (error?.response?.data?.errors) {
        // Backend returned specific validation errors
        const errors = error.response.data.errors;
        const formattedErrors = formatErrorMessages(
          Array.isArray(errors) ? errors : [errors]
        );
        setValidationErrors(formattedErrors);
        setValidationMessage(error.response.data.message);

        // Reset file input when errors occur
        resetFileInput();

        toast.error("Import failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error?.response?.data?.message) {
        // Backend returned a single error message
        setValidationErrors([error.response.data.message]);

        // Reset file input when errors occur
        resetFileInput();

        toast.error("Import failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        // Generic error fallback
        setValidationErrors([
          "An unexpected error occurred. Please try again or contact support.",
        ]);

        // Reset file input when errors occur
        resetFileInput();

        toast.error("Import failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Required fields for leave opening balance
  const requiredFields = [
    {
      name: "emp",
      description:
        "Employee ID - Serial Number (must match existing employee, i.e TBX-0001)",
    },
    {
      name: "leave_type",
      description: `Type of leave (e.g., ${LeaveTypeOptions.map((type) => type.label).join(", ")} ) - must match configured leave types`,
    },
    {
      name: "total_allotted",
      description: "Total leave days allocated for this type",
    },
  ];

  const optionalFields = [
    { name: "remarks", description: "Additional notes or comments" },
  ];

  return (
    <>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark w-fit"
          type="button"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Leave Allocations
        </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setValidationErrors([]);
            setValidationMessage(null);
            resetFileInput();
            handleClose();
          }
        }}
      >
        {/* Modified DialogContent with maxHeight and overflow settings for scrollability */}
        <DialogContent className="sm:max-w-6xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Import Leave Allocations
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-900">
              Upload a file to bulk import employee leave allocations. The
              template contains fields for employee ID, leave type, total
              allotted days, and remarks.
            </DialogDescription>
          </DialogHeader>

          {/* Added a scrollable container for the content */}
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
                      For a successful import, the following fields are
                      required:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {/* Required Fields */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Required Fields:
                        </h4>
                        <div className="space-y-1">
                          {requiredFields.map((field, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-start"
                            >
                              <span className="text-xs font-medium text-blue-700 min-w-0 flex-shrink-0">
                                {field.name}:
                              </span>
                              <span className="text-xs text-blue-700 ml-2 text-right">
                                {field.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optional Fields */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Optional Fields:
                        </h4>
                        <div className="space-y-1">
                          {optionalFields.map((field, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-start"
                            >
                              <span className="text-xs font-medium text-blue-700 min-w-0 flex-shrink-0">
                                {field.name}:
                              </span>
                              <span className="text-xs text-blue-700 ml-2 text-right">
                                {field.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-blue-800 mb-2">
                        Important Notes:
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>
                          • <strong>emp:</strong> Must match existing employee
                          ID - Serial number in the system
                        </li>
                        <li>
                          • <strong>leave_type:</strong> Must match configured
                          leave types (e.g., Annual Leaves, Sick Leaves)
                        </li>
                        <li>
                          • <strong>total_allotted:</strong> Must be a positive
                          number representing days
                        </li>
                        <li>
                          • <strong>File Format:</strong> Accepts .csv, .xlsx,
                          and .xls files
                        </li>
                        <li>
                          • <strong>Data Validation:</strong> Ensure employee
                          IDs - Serial numbers exist before import
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">
                  Upload Leave Allocation Data
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
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
              {validationMessage && (
                <div className="border border-emerald-500 bg-emerald-50 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="w-full">
                      <ul className="list-disc pl-4 text-sm text-emerald-700 space-y-1">
                        <li className="break-words">{validationMessage}</li>
                        <li className="break-words">
                          Please re-upload the file, ensuring that only the rows
                          with validation errors are included.
                        </li>
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
                handleClose();
                resetFileInput();
                setValidationErrors([]);
                setValidationMessage(null);
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

export default ImportOpeningBalance;
