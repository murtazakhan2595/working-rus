import React, { useState, useRef } from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { toast } from "react-toastify";
import { CheckCircle, Clock, AlertCircle, Eye, FileUp } from "lucide-react";
import { formDataHeader, baseUrl } from "app/hooks/general";
import axios from "axios";
import { AiOutlinePaperClip } from "react-icons/ai";

export const ESignatureComponent = ({
  item,
  onSignatureUpload,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [signatureFile, setSignatureFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  // Handle file selection with validation
  const handleFileSelection = (file) => {
    console.log("File selected:", file); // Debug log

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PNG, JPG, or PDF file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSignatureFile(file);
    console.log("File set successfully:", file.name); // Debug log
  };

  // Handle file removal
  const handleRemoveFile = () => {
    console.log("Removing file"); // Debug log
    setSignatureFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle upload button click
  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Upload button clicked - using dynamic input approach");

    // Create a temporary file input outside the modal
    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = ".pdf,.png,.jpg,.jpeg";
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    tempInput.style.opacity = "0";

    // Add to body temporarily
    document.body.appendChild(tempInput);

    // Set up the change handler
    tempInput.addEventListener("change", (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        console.log("File selected via dynamic input:", file.name);
        handleFileSelection(file);
      }
      // Clean up
      document.body.removeChild(tempInput);
    });

    // Trigger the file picker
    tempInput.click();
  };

  // Handle signature submission
  const handleSubmitSignature = async () => {
    console.log("SUBMIT BUTTON CLICKED - handleSubmitSignature called"); // Debug log
    console.log("Submit clicked, file:", signatureFile); // Debug log

    if (!signatureFile) {
      toast.error("Please select a signature file first");
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for item:", item.id); // Debug log

    try {
      const formData = new FormData();
      formData.append("e_signature", signatureFile);
      formData.append("e_signature_status", "ACKNOWLEDGED");

      console.log("FormData prepared, file:", formData.get("e_signature")); // Debug log

      const response = await axios.patch(
        `${baseUrl}/clearance-request-items/${item.id}/`,
        formData,
        {
          headers: formDataHeader(),
        }
      );

      console.log("Upload response:", response.status, response.data); // Debug log

      if (response.status === 200) {
        toast.success("E-signature uploaded successfully!");

        // Call the parent callback
        if (onSignatureUpload) {
          await onSignatureUpload(item.id, signatureFile);
        }

        // Clear the selected file
        setSignatureFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error uploading e-signature:", error);
      toast.error(
        "Failed to upload e-signature: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle view signature
  const handleViewSignature = () => {
    if (item.e_signature) {
      window.open(item.e_signature, "_blank");
    }
  };

  // Render based on e_signature_status
  switch (item.e_signature_status) {
    case "NOT_REQUIRED":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Not Required
          </Badge>
        </div>
      );

    case "ACKNOWLEDGED":
      return (
        <div className="space-y-2">
          <Badge variant="success" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Acknowledged
          </Badge>
          {item.e_signature && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewSignature}
              className="text-xs h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Signature
            </Button>
          )}
        </div>
      );

    case "PENDING":
      console.log("Rendering PENDING case, signatureFile:", signatureFile); // Debug log
      return (
        <div className="space-y-3">
          <Badge variant="warning" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Signature Required
          </Badge>

          {disabled ? (
            <div className="text-xs text-neutral-1100">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Signature upload disabled
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium text-neutral-1200">
                Upload Your E-Signature
              </div>

              {/* Remove the ref-based input completely for now */}

              {/* Custom file upload UI matching your AttachmentFileInput pattern */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border border-neutral-500 rounded-lg p-3 ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-neutral-500"
                }`}
              >
                <div className="flex items-center mb-2 justify-between">
                  <div className="flex items-center gap-2">
                    <AiOutlinePaperClip />
                    <div className="text-neutral-1200">
                      <span className="text-plum-1100 font-inter font-semibold">
                        Upload a file
                      </span>
                      <span className="font-inter"> or drag and drop</span>
                      <div className="text-sm font-inter">
                        PDF, PNG, JPG up to 5MB
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="continue"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    size="sm"
                  >
                    Upload
                  </Button>
                </div>
              </div>

              {/* Show selected file */}
              {signatureFile && (
                <div className="flex items-center justify-between p-3 border border-neutral-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AiOutlinePaperClip className="text-neutral-1100" />
                    <span className="text-sm text-neutral-1200">
                      {signatureFile.name}
                    </span>
                    <span className="text-xs text-neutral-1100">
                      ({Math.round(signatureFile.size / 1024)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Submit button - only show if file is selected */}
              {signatureFile && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSubmitSignature}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Uploading E-Signature...
                    </div>
                  ) : (
                    "Submit E-Signature"
                  )}
                </Button>
              )}

              <div className="text-xs text-neutral-1100">
                Accepted formats: PNG, JPG, PDF (max 5MB)
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <Badge variant="secondary" className="text-xs">
          Unknown Status: {item.e_signature_status}
        </Badge>
      );
  }
};
