import React, { useState, useEffect, useRef } from "react";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "src/@/components/ui/dialog";
import { Label } from "src/@/components/ui/label";
import { Input } from "components/ui/input";
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
import { uploadRecord } from "app/hooks/general";
import { exportRecordToExcel } from "utils/downloadUtils";
import { HasAccess } from "utils/PermissionUtils";
import { downloadTemplateFile } from "app/hooks/general";
import { downloadFile } from "utils/downloadUtils";
import { CoverFileUpload } from "components/FormControl";

const ImportRecords = ({
  reloadData = () => {},
  title = "Import Records",
  description = "Upload a file to bulk import data. Make sure your data follows the required format.",
  downloadTemplateEndpoint = null,
  uploadEndpoint = null,
  templateDataToExport = null,
  module = "Cohrus",
  formatInformation = [],
  modifyUploadedFile = async () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState(null);
  const [showFieldInfo, setShowFieldInfo] = useState(true);
  // Create a ref for the file input element
  const fileInputRef = useRef(null);

  const importPermitted = HasAccess("IMPORT_EMPLOYEES");

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

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      // Clear previous validation errors when a new file is selected
      setValidationErrors([]);
      setValidationMessage(null);
    }
  };

  const handleDownloadTemplate = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (downloadTemplateEndpoint) {
        const dataToExport = await downloadTemplateFile(
          downloadTemplateEndpoint
        );
        if (
          typeof dataToExport === "string" ||
          typeof dataToExport.data === "string"
        ) {
          const csvData =
            typeof dataToExport === "string" ? dataToExport : dataToExport.data;
          const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
          downloadFile(blob, `Import-${module}-Template`);
        } else {
          console.error("Unexpected response format:", dataToExport);
          toast.error("Invalid template format received", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        const dataToExport = templateDataToExport || [];
        exportRecordToExcel(dataToExport, module, `${module}-Import-Template`);
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
      const modifiedFile = await modifyUploadedFile(file);
      const fileToUpload = modifiedFile ? modifiedFile : file;

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", fileToUpload);
      // Call the API to upload employees data
      const response = await uploadRecord(formData, uploadEndpoint);
      // Handle successful response

      const { errors, message } = response;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        // Format validation errors for display
        // const formattedErrors = formatErrorMessages(errors);
        setValidationErrors(errors);
        setValidationMessage(message);

        // Reset file input when errors occur
        // Also show a toast notification
        // toast.error(
        //   "Failed to import holidays. Please check the validation errors.",
        //   {
        //     position: toast.POSITION.TOP_RIGHT,
        //   }
        // );
      } else {
        toast.success(`${module}Holidays imported successfully`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleClose(false);
      }
    } catch (error) {
      console.error("Error uploading holidays:", error);

      // Handle different types of error responses
      if (error?.response?.data?.errors) {
        // Backend returned specific validation errors
        const errors = error.response.data.errors;
        const formattedErrors = formatErrorMessages(
          Array.isArray(errors) ? errors : [errors]
        );
        setValidationErrors(formattedErrors);
      } else if (error?.response?.data?.message) {
        // Backend returned a single error message
        setValidationErrors([error.response.data.message]);
      } else {
        // Generic error fallback
        setValidationErrors([
          "An unexpected error occurred. Please try again or contact support.",
        ]);
      }
      toast.error("Import failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setValidationMessage(null);
    } finally {
      // Reset file input
      resetFileInput();
      setIsUploading(false);
    }
  };

  return (
    <>
      {importPermitted && (
        <Button
          onClick={() => setIsOpen(true)}
          // className="bg-primary hover:bg-primary-dark w-fit"
          variant="primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Attendance
        </Button>
      )}

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
            <DialogTitle className="text-primary">{title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-900">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Added a scrollable container for the content */}
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-4 py-4">
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
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Required Fields:
                        </h4>
                        {formatInformation.map((item, index) => {
                          if (!item.required) return null;
                          const [key, value] = Object.entries(item).find(
                            ([k]) => k !== "required"
                          );
                          return (
                            <div
                              key={index}
                              className="flex justify-start items-start"
                            >
                              <span className="text-xs font-medium text-blue-700 min-w-0 flex-shrink-0">
                                {key}:
                              </span>
                              <div>
                                {value.map((info, infoIndex) => (
                                  <div
                                    key={`${infoIndex}`}
                                    className="text-xs text-blue-700 ml-2 text-right"
                                  >
                                    {info}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Optional Fields:
                        </h4>
                        {formatInformation.map((item, index) => {
                          if (item.required) return null;
                          const [key, value] = Object.entries(item).find(
                            ([k]) => k !== "required"
                          );
                          return (
                            <div
                              key={index}
                              className="flex justify-start items-start"
                            >
                              <span className="text-xs font-medium text-blue-700 min-w-0 flex-shrink-0">
                                {key}:
                              </span>
                              <div>
                                {value.map((info, infoIndex) => (
                                  <div
                                    key={`${infoIndex}`}
                                    className="text-xs text-blue-700 ml-2 text-right"
                                  >
                                    {info}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Important Notes */}
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-blue-800 mb-2">
                        Important Notes:
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>
                          • <strong>Date Format:</strong> Use YYYY-MM-DD for all
                          date fields
                        </li>
                        <li>
                          • <strong>Time Format:</strong> Time should be entered
                          in 24-hour format (e.g., 21:45).
                        </li>
                        <li>
                          • <strong>File Format:</strong> Accepts .csv, .xlsx,
                          and .xls files
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-blue-700 mt-2 italic">
                      Using incorrect IDs or values will result in validation
                      errors.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <CoverFileUpload
                  name="file"
                  variant="AttachmentFileUpload"
                  label={`Upload ${module} Data`}
                  acceptType=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
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

          <DialogFooter className="flex justify-end mt-4">
            <Button
              variant="continue"
              onClick={() => {
                handleClose(false);
                resetFileInput();
                setValidationErrors([]);
                setValidationMessage(null);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              type="button"
            >
              <Download className="w-4 h-4 mr-2" /> Download Template
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

export default ImportRecords;
