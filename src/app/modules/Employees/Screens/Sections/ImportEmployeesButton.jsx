import React, { useState } from "react";
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
import { Download, Upload } from "lucide-react";

// Import API services (you'll need to implement these)
import {
    getDownloadTemplate,
  uploadEmployeesData,
} from "app/hooks/employee";

const ImportEmployeesButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
      // Handle other response formats if needed
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

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Call the API to upload employees data
      const response = await uploadEmployeesData(formData);
      if(response){
        toast.success("Employees imported successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
  
        setIsOpen(false);
        setFile(null);
      }
      else{
        toast.error("Failed to import employees", {
          position: toast.POSITION.TOP_RIGHT,
        });
        
      }
    } catch (error) {
      console.error("Error uploading employees:", error);

      // Display more specific error message if available
      const errorMessage =
        error.response?.data?.message || "Failed to import employees";
      toast.error(errorMessage, {
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
        Import Employees
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Employees</DialogTitle>
            <DialogDescription className="text-sm text-gray-900">
              Upload a file to bulk import employee data. Make sure your data
              follows the required format.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
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

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Employee Data</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </div>
              {file && (
                <p className="text-sm text-gray-500">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFile(null);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading} type="button">
              {isUploading ? "Uploading..." : "Upload & Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportEmployeesButton;
