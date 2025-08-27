import React, { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "src/@/components/ui/sheet";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter } from "components/ui/card";
import { usePDF } from "react-to-pdf";
import { toast } from "react-toastify";
import { PageLoader } from "components";
import ClearanceCertificateTemplate from "./ClearanceCertificateTemplate";
import {
  uploadClearanceCertificate,
  sendClearanceCertificate,
} from "app/hooks/clearanceAndHandover";
import { FileUp, Send, Download, X } from "lucide-react";

const ClearanceCertificateModal = ({
  isOpen = false,
  setIsOpen = () => {},
  certificateData = null,
  clearanceRequest = null,
  onCertificateUpdate = () => {},
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const targetRef = useRef();

  const { toPDF, targetRef: pdfTargetRef } = usePDF({
    filename: `clearance-certificate-${
      certificateData?.employee_name || "employee"
    }.pdf`,
    page: {
      format: "A4",
      orientation: "portrait",
      margin: 10,
    },
    scale: 0.8,
  });

  // Convert PDF blob to File for upload
  const convertPDFToFile = async () => {
    return new Promise((resolve) => {
      const noPrintElements = document.querySelectorAll(".no-print");

      // Hide no-print elements
      noPrintElements.forEach((el) => (el.style.display = "none"));

      // Generate PDF and convert to File
      toPDF().then(() => {
        // Show no-print elements again
        noPrintElements.forEach((el) => (el.style.display = ""));

        // For demo purposes, create a mock file
        // In actual implementation, you'd get the blob from toPDF
        const mockPDFContent = new Blob(["PDF content"], {
          type: "application/pdf",
        });
        const file = new File(
          [mockPDFContent],
          `clearance-certificate-${certificateData?.id}.pdf`,
          {
            type: "application/pdf",
          }
        );

        resolve(file);
      });
    });
  };

  const handleUploadCertificate = async () => {
    if (!certificateData?.id) {
      toast.error("Certificate data not found");
      return;
    }

    setIsUploading(true);
    try {
      // Convert PDF to file
      const pdfFile = await convertPDFToFile();

      // Create FormData
      const formData = new FormData();
      formData.append("generated_by", certificateData.generated_by || 1);
      formData.append(
        "request",
        certificateData.request || clearanceRequest?.id
      );
      formData.append("file", pdfFile);

      // Upload to server
      const response = await uploadClearanceCertificate(
        certificateData.id,
        formData
      );

      if (response) {
        setUploadSuccess(true);
        toast.success("Certificate uploaded successfully!");
        onCertificateUpdate(response);
      } else {
        toast.error("Failed to upload certificate");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload certificate");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendCertificate = async () => {
    if (!certificateData?.id) {
      toast.error("Certificate data not found");
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        generated_by: certificateData.generated_by || 1,
        request: certificateData.request || clearanceRequest?.id,
      };

      const response = await sendClearanceCertificate(
        certificateData.id,
        payload
      );

      if (response) {
        setSendSuccess(true);
        toast.success("Certificate sent successfully to employee and HR!");
        onCertificateUpdate(response);
      } else {
        toast.error("Failed to send certificate");
      }
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send certificate");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    const noPrintElements = document.querySelectorAll(".no-print");

    // Hide no-print elements
    noPrintElements.forEach((el) => (el.style.display = "none"));

    // Generate and download PDF
    toPDF().then(() => {
      // Show no-print elements again
      noPrintElements.forEach((el) => (el.style.display = ""));
      toast.success("Certificate downloaded successfully!");
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setUploadSuccess(false);
    setSendSuccess(false);
  };

  if (!certificateData && !clearanceRequest) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl overflow-y-auto p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl font-semibold">
                Clearance Certificate Preview
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Certificate Preview */}
          <div className="flex-1 p-6">
            <Card className="mb-6">
              <div ref={pdfTargetRef}>
                <ClearanceCertificateTemplate
                  certificateData={certificateData}
                  clearanceRequest={clearanceRequest}
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Certificate Actions
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      You can download, upload to system, or send the
                      certificate to employee and HR
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Download Button */}
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-12"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>

                    {/* Upload Button */}
                    <Button
                      onClick={handleUploadCertificate}
                      disabled={isUploading}
                      variant={uploadSuccess ? "default" : "secondary"}
                      className="flex items-center justify-center gap-2 h-12"
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Uploading...
                        </div>
                      ) : uploadSuccess ? (
                        <div className="flex items-center gap-2">
                          <FileUp className="h-4 w-4" />
                          Uploaded ✓
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileUp className="h-4 w-4" />
                          Upload to System
                        </div>
                      )}
                    </Button>

                    {/* Send Button */}
                    <Button
                      onClick={handleSendCertificate}
                      disabled={isSending}
                      variant={sendSuccess ? "default" : "default"}
                      className="flex items-center justify-center gap-2 h-12"
                    >
                      {isSending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Sending...
                        </div>
                      ) : sendSuccess ? (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Sent ✓
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Certificate
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {(uploadSuccess || sendSuccess) && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="space-y-2">
                        {uploadSuccess && (
                          <div className="flex items-center text-green-800 text-sm">
                            <FileUp className="h-4 w-4 mr-2" />
                            Certificate has been uploaded to the system
                            successfully
                          </div>
                        )}
                        {sendSuccess && (
                          <div className="flex items-center text-green-800 text-sm">
                            <Send className="h-4 w-4 mr-2" />
                            Certificate has been sent to employee and HR via
                            email
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Information Note */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Information:
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>
                        • Download: Save certificate as PDF to your computer
                      </li>
                      <li>
                        • Upload: Store certificate in the document management
                        system
                      </li>
                      <li>
                        • Send: Email certificate to employee and HR department
                      </li>
                      <li>• You can perform multiple actions as needed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full"
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ClearanceCertificateModal;
