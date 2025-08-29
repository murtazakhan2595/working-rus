import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { renderDate } from "utils/renderValues";
import { Badge } from "components/ui/badge";
import moment from "moment";
import "./style.css"; 
import Newlogo from "assets/images/NewLogo";

const ClearanceCertificateTemplate = ({
  certificateData,
  clearanceRequest,
}) => {
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

  // Mock approval stages data (you may need to fetch this from actual APIs)
  const approvalStages = [
    {
      department: "IT Department",
      approver: "John Smith",
      designation: "IT Manager",
      approvalDate: "2025-01-15",
      status: "APPROVED",
    },
    {
      department: "Admin Department",
      approver: "Sarah Johnson",
      designation: "Admin Officer",
      approvalDate: "2025-01-16",
      status: "APPROVED",
    },
    {
      department: "Finance Department",
      approver: "Mike Wilson",
      designation: "Finance Manager",
      approvalDate: "2025-01-17",
      status: "APPROVED",
    },
    {
      department: "HR Department",
      approver: "Lisa Brown",
      designation: "HR Manager",
      approvalDate: "2025-01-18",
      status: "APPROVED",
    },
  ];

  return (
    <div className="w-full mx-auto rounded-none certificate-container bg-white">
      {/* Header */}
      <div className="py-4 text-white bg-plum-400">
        <div className="flex items-center justify-center">
          <Newlogo />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Certificate Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-plum-900 mb-2">
            CLEARANCE CERTIFICATE
          </h1>
          <p className="text-sm text-gray-600">
            This certifies that all clearance requirements have been completed
          </p>
        </div>

        {/* Certificate ID */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Certificate ID: CERT-{certificateData?.id || "XXXX"}
          </p>
        </div>

        {/* Employee Details Section */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">
              Employee Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Employee Name:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {certificateData?.employee_name ||
                      clearanceRequest?.employee_name ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Employee ID:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {clearanceRequest?.employee || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Department:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {certificateData?.department ||
                      clearanceRequest?.department ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Date of Joining:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {renderDate(certificateData?.joining_date) || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Last Working Day:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {renderDate(certificateData?.last_working_day) || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Clearance Type:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {certificateData?.clearance_type ||
                      clearanceRequest?.clearance_type ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clearance Summary Section */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">
              Clearance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Final Clearance Date:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {renderDate(certificateData?.generated_on) ||
                      renderDate(clearanceRequest?.completion_date) ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <Badge variant="success" className="ml-2">
                    {certificateData?.status || "COMPLETED"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Initiated By:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {clearanceRequest?.initiated_by || "System"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Completion Duration:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {calculateDuration()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Details Section */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">
              Approval Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-4">
                All clearance stages have been completed and approved by
                authorized personnel
              </div>

              {/* Approval Stages Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 grid grid-cols-4 gap-4 p-3 text-xs font-semibold text-gray-700 border-b">
                  <div>Department</div>
                  <div>Approver</div>
                  <div>Approval Date</div>
                  <div className="text-center">Status</div>
                </div>

                {/* Body */}
                <div className="divide-y divide-gray-100">
                  {approvalStages.map((stage, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-3 text-xs"
                    >
                      <div>
                        <div className="font-medium text-slate-800">
                          {stage.department}
                        </div>
                        <div className="text-gray-500">{stage.designation}</div>
                      </div>
                      <div className="font-medium text-slate-800">
                        {stage.approver}
                      </div>
                      <div className="text-slate-600">
                        {renderDate(stage.approvalDate)}
                      </div>
                      <div className="text-center">
                        <Badge variant="success" className="text-xs">
                          {stage.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Metadata */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">
              Certificate Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Certificate Generated Date:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {renderDate(certificateData?.generated_on) ||
                      renderDate(new Date())}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Generated By:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {certificateData?.generated_by || "HR System"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    System Generated ID:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    CERT-{moment().format("YYYY")}-
                    {String(
                      certificateData?.id || Math.floor(Math.random() * 1000)
                    ).padStart(4, "0")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-6 border border-gray-200 rounded-lg p-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-8">
              Employee Signature
            </h3>
            <div className="border-t border-gray-400 pt-2">
              <p className="text-xs text-gray-500">
                {certificateData?.employee_name ||
                  clearanceRequest?.employee_name ||
                  "Employee Name"}
              </p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-8">
              HR Representative
            </h3>
            <div className="border-t border-gray-400 pt-2">
              <p className="text-xs text-gray-500">
                {certificateData?.generated_by || "HR Manager"}
              </p>
              <p className="text-xs text-gray-500">Human Resources</p>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center">
          <p className="text-xs italic text-gray-500 leading-relaxed">
            This clearance certificate is digitally generated and serves as
            official confirmation that all required clearance procedures have
            been completed successfully. This document is valid for official
            purposes and maintains digital audit trails for compliance
            verification. For verification of authenticity, please contact the
            Human Resources department.
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-400">
              Generated on {moment().format("MMMM DD, YYYY [at] HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceCertificateTemplate;
