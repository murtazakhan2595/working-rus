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
import { ImportRecords } from "components";
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
import { uploadHolidaysData } from "app/hooks/leaveTracker";
import { exportRecordToExcel } from "utils/downloadUtils";
import { HasAccess } from "utils/PermissionUtils";

const ImportAttendance = ({ reloadData = () => {} }) => {
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
      const dataToExport = [
        {
          "Holiday Name": "Labor Day",
          "Start Date": "2025-05-01",
          "End Date": "",
          Branches: "New York",
          Country: "United States",
          Religion: "Islam",
        },
        {
          "Holiday Name": "Chritmas Eve",
          "Start Date": "2025-12-25",
          "End Date": "2026-01-03",
          Branches: "",
          Country: "United States,Canada",
          Religion: "Islam",
        },
      ];
      exportRecordToExcel(dataToExport, "Holiday", `Holiday-Import-Template`);
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
      // Call the API to upload employees data
      const response = await uploadHolidaysData(formData);
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
        toast.success("Holidays imported successfully", {
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
    <ImportRecords
      title={"Import Attendance"}
      description={
        "Upload a file to bulk import attendance data against employee Id. Make sure your data follows the required format."
      }
      downloadTemplateEndpoint={"/attendance/bulk-upload"}
      uploadEndpoint={"/attendance/bulk-upload"}
      module={"Attendance"}
      formatInformation={[
        { Employee: ["Employee unique id"], required: true },
        { Date: ["Attendance Date"], required: true },
        { "Check In": ["Employee check-in time"], required: true },
        { "Check Out": ["Employee check-out time"], required: true },
        {
          Status: ["Attendance status(Present, Absent, Late)"],
          required: false,
        },
      ]}
      uploadRecord={uploadHolidaysData}
    />
  );
};

export default ImportAttendance;
