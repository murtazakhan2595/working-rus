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
  getDownloadTemplate,
  uploadEmployeesData,
  getUserRoles,
  getDepartmentNames,
  getDesignations,
  getManagerList,
  getShifts,
} from "app/hooks/employee";

import {getBranchList} from "app/hooks/general"
import { HasAccess } from "utils/PermissionUtils";

const ImportEmployeesButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showFieldInfo, setShowFieldInfo] = useState(true);
  // Create a ref for the file input element
  const fileInputRef = useRef(null);

  // Reference data state
  const [userRoles, setUserRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(false);
  const importEmployeesPermitted = HasAccess("IMPORT_EMPLOYEES");
  // Fetch reference data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchReferenceData();
    }
  }, [isOpen]);

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

  // Function to fetch all reference data
  const fetchReferenceData = async () => {
    setIsLoadingReferenceData(true);
    try {
      // Fetch user roles
      const rolesResponse = await getUserRoles();
      if (rolesResponse && rolesResponse.results) {
        setUserRoles(rolesResponse.results);
      }

      // Fetch departments
      const departmentsResponse = await getDepartmentNames();
      if (departmentsResponse && departmentsResponse.results) {
        setDepartments(departmentsResponse.results);
      }

      // Fetch designations
      const designationsResponse = await getDesignations();
      if (designationsResponse && designationsResponse.results) {
        setDesignations(designationsResponse.results);
      }

      // Fetch managers
      const managersResponse = await getManagerList();
      if (managersResponse && managersResponse) {
        setManagers(managersResponse);
      }

      // Fetch shifts
      const shiftsResponse = await getShifts();
      if (shiftsResponse && shiftsResponse.results) {
        setShifts(shiftsResponse.results);
      }

      const branchesResponse = await getBranchList();
      if (branchesResponse && branchesResponse.results) {
        setBranches(branchesResponse.results);
      }
    } catch (error) {
      console.error("Error fetching reference data:", error);
      toast.error("Failed to load reference data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoadingReferenceData(false);
    }
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

      // Call the API to upload employees data
      const response = await uploadEmployeesData(formData);

      // Handle successful response
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Employees imported successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsOpen(false);
        resetFileInput();
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
          "Failed to import employees. Please check the validation errors.",
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

        toast.error("Failed to import employees", {
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

      toast.error("Import failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {importEmployeesPermitted && <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary-dark"
        type="button"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Employees
      </Button>}

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
        {/* Modified DialogContent with maxHeight and overflow settings for scrollability */}
        <DialogContent className="sm:max-w-6xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Import Employees</DialogTitle>
            <DialogDescription className="text-sm text-gray-900">
              Upload a file to bulk import employee data. Make sure your data
              follows the required format.
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
                      For a successful import, the following fields require{" "}
                      <strong>specific IDs or values</strong>:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-blue-800 mb-1">
                          Foreign Key Fields (Use IDs):
                        </h4>

                        {isLoadingReferenceData ? (
                          <p className="text-xs text-blue-700 italic">
                            Loading reference data...
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                user_role:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {userRoles.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {userRoles.map((role) => (
                                      <li key={role.id}>
                                        "{role.name}" for {role.name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No role data available
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                department_name:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {departments.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {departments.map((dept) => (
                                      <li key={dept.id}>
                                        "{dept.name}" for {dept.name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No department data available
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                department_position:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {designations.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {designations.map((des) => (
                                      <li key={des.id}>
                                        "{des.name}" for {des.name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No designation data available
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                direct_report:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {managers.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {managers.map((mgr) => (
                                      <li key={mgr.id}>
                                        "{mgr.username}" for{" "}
                                        {mgr.first_name + " " + mgr.last_name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No manager data available
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                shift_assignment:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {shifts.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {shifts.map((shift) => (
                                      <li key={shift.id}>
                                        "{shift.name}" for {shift.name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No shift data available
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-700">
                                branch_name:
                              </p>
                              <div className="max-h-24 overflow-y-auto pl-2 text-xs">
                                {console.log(branches)}
                                {branches.length > 0 ? (
                                  <ul className="list-disc pl-3 text-xs text-blue-700">
                                    {branches.map((branch) => (
                                      <li key={branch.id}>
                                        "{branch.branch_name}" for{" "}
                                        {branch.branch_name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-blue-700 italic">
                                    No Branch data available
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-blue-800">
                          Enum Values (Use Exact Text):
                        </h4>
                        <ul className="list-disc pl-5 text-xs text-blue-700">
                          <li>
                            <strong>employee_work_type</strong>: REMOTE,
                            ON_SITE, Hybrid, Work_From_Home
                          </li>
                          <li>
                            <strong>employee_type</strong>: Intern, Part-Time,
                            Full-Time, Contract, Freelancer
                          </li>
                          <li>
                            <strong>employee_status</strong>: Active,
                            Terminated, Deceased, Resigned, Probation, Notice
                            Period, Exit, Absconded, Legal Case
                          </li>
                          <li>
                            <strong>blood_group</strong>: A+, A-, B+, B-, O+,
                            O-, AB+, AB-
                          </li>
                        </ul>
                        <h4 className="text-xs font-medium text-blue-800 mt-3">
                          Accepted Date Format:
                        </h4>
                        <p className="text-xs text-blue-700 pl-2">
                          All date fields must use: <strong>YYYY-MM-DD</strong>{" "}
                          format
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-blue-700 mt-2 italic">
                      Using incorrect IDs or values will result in validation
                      errors.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Employee Data</Label>
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

export default ImportEmployeesButton;
