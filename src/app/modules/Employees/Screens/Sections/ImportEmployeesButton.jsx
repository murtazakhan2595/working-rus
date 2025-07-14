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
import { getDownloadTemplate, uploadEmployeesData } from "app/hooks/employee";
import { HasAccess } from "utils/PermissionUtils";

// Import the SwitchInput component
import { SwitchInput } from "components/FormControl";
import { updateUploadEmployeesData } from "app/hooks/employee";

const ImportEmployeesButton = ({reload}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState(null);
  const [showFieldInfo, setShowFieldInfo] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false); // New state for edit/new toggle

  // Create a ref for the file input element
  const fileInputRef = useRef(null);

  // Reference data state
  const importEmployeesPermitted = HasAccess("IMPORT_EMPLOYEES");

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
      const response = await getDownloadTemplate();

      // If the response is already a CSV string
      if (typeof response === "string" || typeof response.data === "string") {
        const csvData = typeof response === "string" ? response : response.data;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employee_import_template.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Invalid template format received", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

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

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isEditMode", isEditMode); // Include edit mode flag

      // Call the API to upload employees data

      let response = {}
      if (isEditMode) {
        response = await updateUploadEmployeesData(formData);
      } else{
        response = await uploadEmployeesData(formData);
      }

      // Handle successful response
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success(
          `Employees ${isEditMode ? "updated" : "imported"} successfully`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);
        resetFileInput();
        if(reload && typeof reload === 'function') {
          console.log("Reloading employee data...");
          //  add one sec delay to ensure the UI updates
          setTimeout(() => {
            reload(true);
          }
          , 1000);
        }
      }
      // Handle error responses with validation errors
      else if (response && response.errors) {
        // Format validation errors for display
        const errors = Array.isArray(response.errors)
          ? response.errors
          : [response.errors];
        const formattedErrors = formatErrorMessages(errors);
        setValidationErrors(formattedErrors);

        // Reset file input when errors occur
        resetFileInput();

        // Also show a toast notification
        toast.error(
          `Failed to ${
            isEditMode ? "update" : "import"
          } employees. Please check the validation errors.`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
      // Handle other error responses without specific validation errors
      else {
        setValidationErrors([
          "The file contains invalid data. Please check the format and try again.",
        ]);

        // Reset file input when errors occur
        resetFileInput();

        toast.error(`Failed to ${isEditMode ? "update" : "import"} employees`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error uploading employees:", error);

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

      // Reset file input when errors occur
      resetFileInput();

      toast.error(`${isEditMode ? "Update" : "Import"} failed`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Required fields data
  const requiredFields = [
    { name: "Emp#", description: "Employee unique identifier" },
    { name: "Employee Name", description: "Full name of the employee" },
    { name: "Designation", description: "Job title or position" },
    { name: "Department", description: "Department name" },
    { name: "Branch", description: "Office location or branch" },
    { name: "Worktype", description: "Remote, On-site, Hybrid" },
    {
      name: "Employee Personal Email ID",
      description: "Personal email address",
    },
    { name: "UserID", description: "System user identifier" },
    { name: "Joining Date", description: "Date of Joining (YYYY-MM-DD)" },
    { name: "Employee Type", description: "Intern, Part-time, Full-time" },
    { name: "Employee Status", description: "Employee status" },
    { name: "Date of Birth", description: "Date of Birth (YYYY-MM-DD)" },
    { name: "Marital Status", description: "Marital status" },
    { name: "Gender", description: "Gender information" },
  ];

  const optionalFields = [
    {
      name: "Probation Start Date",
      description: "Probation start date (YYYY-MM-DD)",
    },
    {
      name: "Probation End Date",
      description: "Probation end date (YYYY-MM-DD)",
    },
    {
      name: "Blood Group",
      description: "Blood group (A+, A-, B+, B-, O+, O-, AB+, AB-)",
    },
    {
      name: "Contract Start Date",
      description: "Contract start date (YYYY-MM-DD)",
    },
    {
      name: "Contract End Date",
      description: "Contract end date (YYYY-MM-DD)",
    },
    { name: "PO Box Number", description: "Post office box number" },
    { name: "Religion", description: "Religious affiliation" },
    { name: "Residential Address", description: "Current residential address" },
    { name: "Current Address", description: "Current address" },
    { name: "Nationality", description: "Employee nationality" },
    { name: "Direct Report", description: "Direct reporting manager" },
    { name: "Indirect Report", description: "Indirect reporting manager" },
  ];

  return (
    <>
      {importEmployeesPermitted && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark"
          type="button"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Employees
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
            setIsEditMode(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Import Employees</DialogTitle>
            <DialogDescription className="text-sm ">
              Upload a CSV or Excel file to bulk import employee data. Ensure
              your data follows the required format.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-6 py-4">
              {/* Import Mode Selection */}
              <div className="border border-blue-300 bg-blue-50 rounded-md p-3">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  Import Mode
                </h3>
                <SwitchInput
                  name="isEditMode"
                  value={isEditMode}
                  onChange={(name, value) => setIsEditMode(value)}
                  label="Edit Existing Data"
                  description={
                    isEditMode
                      ? "Update existing employee records"
                      : "Add new employee records"
                  }
                  className="w-full"
                />
                <p className="text-xs text-blue-700 mt-2">
                  {isEditMode
                    ? "When enabled, the system will update existing employee records based on Emp# field."
                    : "When disabled, the system will create new employee records."}
                </p>
              </div>

              {/* Download Template Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
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

              {/* Field Information Section */}
              <div className="border border-blue-300 bg-blue-50 rounded-md p-3 mt-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowFieldInfo(!showFieldInfo)}
                >
                  <div className="flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    <h3 className="text-sm font-medium text-blue-800">
                      Required Field Information
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
                          • <strong>Date Format:</strong> Use YYYY-MM-DD for all
                          date fields
                        </li>
                        <li>
                          • <strong>Emp# Field:</strong> Must be unique for each
                          employee
                        </li>
                        <li>
                          • <strong>File Format:</strong> Accepts .csv, .xlsx,
                          and .xls files
                        </li>
                        <li>
                          • <strong>Edit Mode:</strong> When enabled, Emp# will
                          be used to match existing records
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-sm font-medium">
                  Upload Employee Data
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
                {file && <p className="text-sm">Selected file: {file.name}</p>}
              </div>

              {/* Validation Errors */}
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

              {/* Validation Message */}
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
                setIsOpen(false);
                resetFileInput();
                setValidationErrors([]);
                setValidationMessage(null);
                setIsEditMode(false);
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
              {isUploading
                ? "Uploading..."
                : `${isEditMode ? "Update &" : "Upload &"} Import`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportEmployeesButton;
