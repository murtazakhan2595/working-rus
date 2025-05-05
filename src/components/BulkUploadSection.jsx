import React, { useState, useRef } from "react";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import { Loader2, UploadCloud, Download } from "lucide-react";
import axios from "axios";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

/**
 * Reusable bulk upload component for different modules
 * @param {Object} props Component props
 * @param {string} props.title Title for the upload section
 * @param {string} props.module Module name (e.g., 'designation', 'department', 'branch')
 * @param {string} props.templateEndpoint API endpoint for template download
 * @param {string} props.uploadEndpoint API endpoint for uploading file
 * @param {Function} props.onUploadSuccess Callback function after successful upload
 * @param {number|string} props.organizationId Organization ID to include in the upload
 * @param {boolean} props.showDivider Whether to show the divider below the upload section
 */
const BulkUploadSection = ({
  title = "Bulk Upload",
  module = "item",
  templateEndpoint,
  uploadEndpoint,
  onUploadSuccess,
  organizationId,
  showDivider = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          selectedFile.type !== 'application/vnd.ms-excel' &&
          selectedFile.type !== 'text/csv') {
        toast.error("Please upload only Excel or CSV files", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Use the provided template endpoint or construct a default one
      const endpoint = templateEndpoint || `${baseUrl}/${module}/template/`;
      
      // Create a fallback template function
      const createFallbackTemplate = () => {
        let csvContent;
        
        // Create different templates based on module type
        switch(module) {
          case 'designation':
            csvContent = "name,description,organization\nSenior Developer,Senior software development role,\nHR Manager,Human Resources management role,\n";
            break;
          case 'department':
            csvContent = "name,description,organization\nEngineering,Engineering department,\nHuman Resources,HR department,\n";
            break;
          case 'branch':
            csvContent = "name,address,organization\nHeadquarters,123 Main Street,\nRemote Office,456 Remote Avenue,\n";
            break;
          default:
            csvContent = `name,description,organization\nSample ${module},Sample description,\n`;
        }
        
        // Create and download the blob
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${module}_template.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success(`${module} template downloaded successfully`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      };
      
      // Try to fetch from endpoint, fall back to generated template
      fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${window.localStorage.getItem("token")}`,
        }
      })
      .then(response => {
        if (response.ok) {
          // If endpoint works, open it in a new tab
          window.open(endpoint, '_blank');
        } else {
          // If endpoint fails (like 404), create a fallback template
          console.log(`Template endpoint returned ${response.status}, using fallback template`);
          createFallbackTemplate();
        }
      })
      .catch(error => {
        console.error("Error fetching template:", error);
        createFallbackTemplate();
      });
    } catch (error) {
      console.error("Error in template download:", error);
      toast.error("Failed to download template", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', file);
      
      // Add organization ID if available
      if (organizationId) {
        formData.append('organization', organizationId);
      }
      
      const token = window.localStorage.getItem("token");
      console.log(`Uploading ${module} with token:`, !!token);
      console.log(`Upload endpoint: ${uploadEndpoint}`);
      
      // Use the provided upload endpoint or construct a default one
      const endpoint = uploadEndpoint || `${baseUrl}/${module}/upload/`;
      
      try {
        const response = await axios.post(
          endpoint, 
          formData, 
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        
        console.log(`${module} bulk upload response:`, response);
        
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data?.message || `${module} uploaded successfully!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          
          // Reset file input
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          // Call the success callback if provided
          if (typeof onUploadSuccess === 'function') {
            onUploadSuccess();
          }
        } else {
          throw new Error("Upload failed with status: " + response.status);
        }
      } catch (error) {
        console.error(`API Error uploading ${module}:`, error);
        
        // If the endpoint doesn't exist (404) or has another issue,
        // try submitting each row from the CSV/Excel file individually
        if (error.response?.status === 404 || error.response?.status === 405) {
          await handleFallbackUpload();
        } else {
          throw error; // Re-throw for the outer catch block
        }
      }
    } catch (error) {
      console.error(`${module} bulk upload error:`, error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          `Failed to upload ${module}. Please try again.`;
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fallback upload method that parses CSV/Excel and submits rows individually
  const handleFallbackUpload = async () => {
    try {
      toast.info(`Processing ${module} data...`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      
      // Read the file contents
      const fileData = await readFileAsText(file);
      
      // Parse the CSV data (simple parsing)
      const rows = parseCSV(fileData);
      
      if (rows.length < 2) {
        throw new Error("Invalid file format or empty file");
      }
      
      // Extract header row
      const headers = rows[0];
      
      // Process each data row
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip empty rows
        if (row.every(cell => !cell.trim())) continue;
        
        // Create data object from headers and row
        const data = {};
        headers.forEach((header, index) => {
          if (header && row[index]) {
            data[header.trim()] = row[index].trim();
          }
        });
        
        // Add organization ID if available
        if (organizationId) {
          data.organization = organizationId;
        }
        
        try {
          // Determine the endpoint for the individual item creation
          const singleItemEndpoint = `${baseUrl}/${module}/`;
          
          // Submit the item
          const response = await axios.post(
            singleItemEndpoint,
            data,
            {
              headers: {
                "Authorization": `Bearer ${window.localStorage.getItem("token")}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.status === 200 || response.status === 201) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error creating ${module} item:`, error);
          errorCount++;
        }
      }
      
      // Show results
      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} ${module}(s)`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        
        // Call success callback
        if (typeof onUploadSuccess === 'function') {
          onUploadSuccess();
        }
      }
      
      if (errorCount > 0) {
        toast.warning(`Failed to create ${errorCount} ${module}(s)`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      
      // Reset file input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(`Fallback upload error:`, error);
      toast.error(`Failed to process ${module} data: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // Helper function to read file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // Simple CSV parser function
  const parseCSV = (text) => {
    const lines = text.split('\n');
    return lines.map(line => {
      // Handle quoted values that might contain commas
      const rows = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          rows.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Don't forget to push the last value
      rows.push(currentValue);
      
      return rows;
    });
  };

  return (
    <>
      <SheetCardExtension title={title}>
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">
            Upload multiple {module}s at once using an Excel or CSV file.
          </p>
          <div className="flex items-center mb-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4" /> 
              Download Template
            </Button>
          </div>
          <div className="p-4 text-center border-2 border-gray-300 border-dashed rounded-md">
            <input
              type="file"
              id={`${module}-file-upload`}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label 
              htmlFor={`${module}-file-upload`} 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {file ? file.name : "Click to upload or drag and drop"}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Excel or CSV file (max 5MB)
              </span>
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={handleBulkUpload} 
              disabled={!file || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> 
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetCardExtension>
      
      {showDivider && (
        <div className="my-4 text-center">
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-full h-px bg-gray-200" />
            <span className="absolute px-3 text-xs font-medium text-gray-500 -translate-x-1/2 bg-white left-1/2">
              OR
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUploadSection; 