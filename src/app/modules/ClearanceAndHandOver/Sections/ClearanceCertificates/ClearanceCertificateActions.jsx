import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceCertificateModal from "./ClearanceCertificateModal";
import { toast } from "react-toastify";
import {
  sendClearanceCertificate,
  getClearanceRequestById,
} from "app/hooks/clearanceAndHandover";

const ClearanceCertificateActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewCertificate, setViewCertificate] = useState(false);
  const [clearanceRequest, setClearanceRequest] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  // Handle viewing the certificate
  const handleViewCertificate = async () => {
    setIsLoadingRequest(true);
    try {
      // Fetch the associated clearance request data
      const requestData = await getClearanceRequestById(data.request);
      setClearanceRequest(requestData);
      setViewCertificate(true);
    } catch (error) {
      console.error("Error fetching clearance request:", error);
      toast.error("Failed to load certificate details");
    } finally {
      setIsLoadingRequest(false);
    }
  };

  // Handle resending certificate
  const handleResendCertificate = async () => {
    if (!data?.id) {
      toast.error("Certificate data not found");
      return;
    }

    setIsResending(true);
    try {
      const payload = {
        generated_by: data.generated_by || 1,
        request: data.request,
      };

      const response = await sendClearanceCertificate(data.id, payload);

      if (response) {
        toast.success("Certificate resent successfully to employee and HR!");
        reloadData();
      } else {
        toast.error("Failed to resend certificate");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend certificate");
    } finally {
      setIsResending(false);
    }
  };

  // Handle certificate update callback
  const handleCertificateUpdate = (updatedCertificate) => {
    // Reload the main data
    reloadData();
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleViewCertificate}
        onCustom={handleResendCertificate}
        viewText={isLoadingRequest ? "Loading..." : "View Certificate"}
        customText={isResending ? "Resending..." : "Resend Certificate"}
        editText="Edit Certificate"
        deleteText="Delete Certificate"
        menuTooltip="Certificate Actions"
        hideEdit={true}
        hideDelete={true}
      />

      {/* View Certificate Modal */}
      {viewCertificate && (
        <ClearanceCertificateModal
          isOpen={viewCertificate}
          setIsOpen={setViewCertificate}
          certificateData={data}
          clearanceRequest={clearanceRequest}
          onCertificateUpdate={handleCertificateUpdate}
        />
      )}
    </>
  );
};

export default ClearanceCertificateActions;
