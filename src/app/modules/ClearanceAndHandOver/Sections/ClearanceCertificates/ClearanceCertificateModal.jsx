import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "components/ui/card";
import { Badge } from "components/ui/badge";
import { renderDate } from "utils/renderValues";
import moment from "moment";
import "./style.css"; // Reuse existing styles
import Newlogo from "assets/images/NewLogo";
import { usePDF } from "react-to-pdf";
import { toast } from "react-toastify";
import {
  uploadClearanceCertificate,
  sendClearanceCertificate,
} from "app/hooks/clearanceAndHandover";
import { FileUp, Send, Download, X } from "lucide-react";
import {
  EmployeeID,
  EmployeeName,
  DepartmentName,
  DesignationName,
} from "utils/getValuesFromTables";

const ClearanceCertificateModal = ({
  isOpen = false,
  setIsOpen = () => {},
  certificateData = null,
  clearanceRequest = null,
  onCertificateUpdate = () => {},
  clearanceRequestItems = [],
  isMyCertificate = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  console.log("clearanceRequest:", clearanceRequest);
  console.log("certificateData:", certificateData);
  console.log("clearanceRequestItems:", clearanceRequestItems);

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

  // Calculate completion duration
  const calculateDuration = () => {
    if (!clearanceRequest?.start_date || !certificateData?.generated_on) {
      return "N/A";
    }
    const start = moment(clearanceRequest.start_date);
    const end = moment(certificateData.generated_on);
    const days = end.diff(start, "days");
    return `${days} days`;
  };

  // Convert PDF blob to File for upload (without triggering download)
  const convertPDFToFile = async () => {
    return new Promise(async (resolve) => {
      const noPrintElements = document.querySelectorAll(".no-print");

      try {
        // Hide no-print elements
        noPrintElements.forEach((el) => (el.style.display = "none"));

        // Get the PDF element
        const element = pdfTargetRef.current;

        if (!element) {
          throw new Error("PDF target ref not found");
        }

        console.log("Attempting to generate PDF using html2canvas + jspdf...");

        // Use html2canvas and jsPDF directly (more reliable approach)
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        // Generate canvas from HTML
        const canvas = await html2canvas(element, {
          scale: 0.8,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        // Create PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Calculate dimensions to fit A4
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add image to PDF
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Get PDF as blob
        const pdfBlob = pdf.output("blob");

        console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");

        // Convert blob to File
        const file = new File(
          [pdfBlob],
          `clearance-certificate-${certificateData?.id}.pdf`,
          {
            type: "application/pdf",
          }
        );

        resolve(file);
      } catch (error) {
        console.error("Error generating PDF with html2canvas + jsPDF:", error);

        try {
          // Fallback: try with html2pdf if available
          console.log("Trying html2pdf as fallback...");
          const html2pdf = (await import("html2pdf.js")).default;

          const opt = {
            margin: 10,
            filename: `clearance-certificate-${certificateData?.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 0.8 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };

          const element = pdfTargetRef.current;
          const pdfBlob = await html2pdf()
            .set(opt)
            .from(element)
            .outputPdf("blob");

          const file = new File(
            [pdfBlob],
            `clearance-certificate-${certificateData?.id}.pdf`,
            {
              type: "application/pdf",
            }
          );

          console.log(
            "PDF generated with html2pdf fallback, size:",
            pdfBlob.size,
            "bytes"
          );
          resolve(file);
        } catch (fallbackError) {
          console.error("Both PDF generation methods failed:", fallbackError);

          // Don't create a fake PDF file - instead reject the promise
          throw new Error(
            "PDF generation failed. Please install html2canvas and jspdf: npm install html2canvas jspdf"
          );
        }
      } finally {
        // Show no-print elements again
        noPrintElements.forEach((el) => (el.style.display = ""));
      }
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

      console.log("Uploading certificate with FormData:", {
        generated_by: certificateData.generated_by || 1,
        request: certificateData.request || clearanceRequest?.id,
        file: pdfFile,
      });

      // Upload to server
      const response = await uploadClearanceCertificate(
        certificateData.id,
        formData
      );

      console.log("Upload response:", response);

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold">
            Clearance Certificate Preview
          </DialogTitle>
        </DialogHeader>

        {/* Certificate Preview */}
        <div className="p-6">
          <Card className="mb-6">
            <div ref={pdfTargetRef}>
              {/* Certificate Template Content */}
              <div className="w-full mx-auto rounded-none certificate-container bg-white">
                {/* Header - Using exact same styling as payslip */}
                <div className="py-2 text-white bg-plum-400">
                  <div className="flex items-center justify-center">
                    <Newlogo />
                  </div>
                </div>

                <div className="p-2 space-y-4">
                  <div className="p-4 space-y-6">
                    {/* Certificate Title */}
                    <h2 className="pb-2 text-xl font-semibold border-b text-slate-1200 text-center">
                      CLEARANCE CERTIFICATE
                    </h2>

                    {/* Certificate ID */}
                    <div className="text-center">
                      <p className="text-sm text-slate-800">
                        Certificate ID: CERT-{certificateData?.id || "XXXX"}
                      </p>
                    </div>

                    {/* Employee Details Section - Using same grid structure as payslip */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Employee Summary */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-1200">
                          Employee Details
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-slate-1000">
                              Employee Name:
                            </span>
                            <p className="text-sm font-semibold text-slate-1200">
                              {certificateData?.employee_name ||
                                clearanceRequest?.employee_name ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-1000">
                              Employee ID:
                            </span>
                            <p className="text-sm font-semibold text-slate-1200">
                              <EmployeeID value={clearanceRequest?.employee} />
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-1000">
                              Department:
                            </span>
                            <p className="text-sm font-semibold text-slate-1200">
                              <DepartmentName
                                value={clearanceRequest?.department}
                              />
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-1000">
                              Designation:
                            </span>
                            <p className="text-sm font-semibold text-slate-1200">
                              <DesignationName
                                value={clearanceRequest?.designation}
                              />
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-1000">
                              Date of Joining:
                            </span>
                            <p className="text-sm font-semibold text-slate-1200">
                              {renderDate(certificateData?.joining_date) ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Summary Card - Using same styling as Cost to Company card */}
                      <Card className="flex flex-col justify-between border rounded-lg shadow-none border-color-[#D0CDD7]">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <h3 className="mb-4 text-lg font-medium text-slate-1200">
                            Clearance Status
                          </h3>
                          <div className="mb-2 text-2xl font-bold text-plum-900">
                            {clearanceRequest?.status || "COMPLETED"}
                          </div>
                          <p className="mb-2 text-sm text-center text-slate-800">
                            {certificateData?.clearance_type ||
                              clearanceRequest?.clearance_type_name ||
                              "N/A"}
                          </p>
                          <p className="text-xs text-center text-slate-800">
                            Duration: {calculateDuration()}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Clearance Summary Section */}
                    <Card className="border-color-[#D0CDD7]">
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                          Clearance Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Clearance Start Date:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {renderDate(clearanceRequest?.start_date) ||
                                  "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Final Clearance Date:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {renderDate(certificateData?.generated_on) ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Last Working Day:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {certificateData?.last_working_day ===
                                "Currently Working"
                                  ? "Currently Working"
                                  : renderDate(
                                      certificateData?.last_working_day
                                    ) || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Completion Duration:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {calculateDuration()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Approval Details Section - Using REAL clearanceRequestItems data */}
                    <Card className="border-color-[#D0CDD7]">
                      <CardHeader>
                        <CardTitle>
                          <h3 className="text-lg font-semibold text-slate-1200">
                            Clearance Checklist Details
                          </h3>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full">
                          {/* Header */}
                          <div className="flex justify-between pb-2 border-b">
                            <div className="text-slate-1000">
                              Checklist Item
                            </div>
                            <div className="text-slate-1000">Status</div>
                            <div className="text-slate-1000">Updated At</div>
                            <div className="text-slate-1000">Remarks</div>
                          </div>

                          {/* Body - Using real clearanceRequestItems */}
                          <div className="max-h-[320px] overflow-auto">
                            {clearanceRequestItems &&
                            clearanceRequestItems.length > 0 ? (
                              clearanceRequestItems.map((item, index) => (
                                <div
                                  key={item.id || index}
                                  className="flex justify-between border-b last:border-b-0"
                                >
                                  <div className="py-4">
                                    <div className="font-medium text-slate-1200 capitalize">
                                      {item.checklist_name || "N/A"}
                                    </div>
                                    <div className="text-xs text-slate-1000">
                                      Scope: {item.assignment_scope || "N/A"}
                                    </div>
                                  </div>
                                  <div className="py-4">
                                    <div className="text-plum-900 font-semibold">
                                      {item.status || "N/A"}
                                    </div>
                                    {item.e_signature_status && (
                                      <div className="text-xs text-slate-1000">
                                        E-Sig: {item.e_signature_status}
                                      </div>
                                    )}
                                  </div>
                                  <div className="py-4 text-slate-1000">
                                    {renderDate(item.updated_at) ||
                                      renderDate(item.completed_at) ||
                                      "N/A"}
                                  </div>
                                  <div className="py-4 text-slate-1200 max-w-xs">
                                    <div
                                      className="text-sm truncate"
                                      title={item.remarks}
                                    >
                                      {item.remarks || "No remarks"}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-8 text-center text-slate-1000">
                                No checklist items found
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certificate Metadata */}
                    <Card className="border-color-[#D0CDD7]">
                      <CardHeader>
                        <CardTitle>
                          <h3 className="text-lg font-semibold text-slate-1200">
                            Certificate Information
                          </h3>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Certificate Generated Date:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {renderDate(certificateData?.generated_on) ||
                                  renderDate(new Date())}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Generated By:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                <EmployeeName
                                  value={certificateData?.generated_by}
                                />
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                System Generated ID:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                CERT-{moment().format("YYYY")}-
                                {String(
                                  certificateData?.id ||
                                    Math.floor(Math.random() * 1000)
                                ).padStart(4, "0")}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-1000">
                                Certificate Status:
                              </span>
                              <p className="text-sm font-semibold text-slate-1200">
                                {certificateData?.status || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Signature Section - Using same grid structure as payslip */}
                    <div className="grid grid-cols-2 gap-0 rounded-lg shadow-none border border-color-[#D0CDD7]">
                      <Card className="border-0 rounded-lg p-2 shadow-none border-r border-color-[#D0CDD7] rounded-r-none">
                        <CardHeader className="p-0">
                          <CardTitle>
                            <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                              Employee Signature
                            </h3>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-12"></div>
                          <p className="text-xs text-slate-800">
                            {certificateData?.employee_name ||
                              clearanceRequest?.employee_name ||
                              "Employee Name"}
                          </p>
                          <p className="text-xs text-slate-1000">Employee</p>
                        </CardContent>
                      </Card>
                      <Card className="p-2 border-0 rounded-lg rounded-l-none shadow-none">
                        <CardHeader className="p-0">
                          <CardTitle>
                            <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                              HR Representative
                            </h3>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-12"></div>
                          <p className="text-xs text-slate-800">
                            <EmployeeName
                              value={certificateData?.generated_by}
                            />
                          </p>
                          <p className="text-xs text-slate-1000">
                            Human Resources
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Footer Disclaimer - Using same styling as payslip disclaimer */}
                    <div className="flex justify-end mt-4">
                      <p className="text-sm italic text-slate-800">
                        This clearance certificate is digitally generated and
                        serves as official confirmation that all required
                        clearance procedures have been completed successfully.
                        This document is valid for official purposes and
                        maintains digital audit trails for compliance
                        verification. For verification of authenticity, please
                        contact the Human Resources department. Generated on{" "}
                        {moment().format("MMMM DD, YYYY [at] HH:mm")}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {!isMyCertificate &&<Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-1200 mb-2">
                    Certificate Actions
                  </h3>
                  <p className="text-sm text-slate-1000 mb-6">
                    You can download, upload to system, or send the certificate
                    to employee and HR
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
                  <div className="mt-6 p-4 bg-plum-200 border border-plum-400 rounded-lg">
                    <div className="space-y-2">
                      {uploadSuccess && (
                        <div className="flex items-center text-plum-900 text-sm">
                          <FileUp className="h-4 w-4 mr-2" />
                          Certificate has been uploaded to the system
                          successfully
                        </div>
                      )}
                      {sendSuccess && (
                        <div className="flex items-center text-plum-900 text-sm">
                          <Send className="h-4 w-4 mr-2" />
                          Certificate has been sent to employee and HR via email
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Information Note */}
                <div className="mt-6 p-4 bg-slate-100 border border-slate-300 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-1200 mb-1">
                    Information:
                  </h4>
                  <ul className="text-xs text-slate-1000 space-y-1">
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
          </Card>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClearanceCertificateModal;
