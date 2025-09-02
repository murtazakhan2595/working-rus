import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceCertificateModal from "./ClearanceCertificateModal";
import { toast } from "react-toastify";
import {
  sendClearanceCertificate,
  getClearanceRequestById,
  getClearanceRequestItems,
} from "app/hooks/clearanceAndHandover";

const ClearanceCertificateActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewCertificate, setViewCertificate] = useState(false);
  const [clearanceRequest, setClearanceRequest] = useState(null);
  const [clearanceRequestItems, setClearanceRequestItems] = useState([]);
  const [isResending, setIsResending] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  // Handle viewing the certificate
  const handleViewCertificate = () => {
    handleLoadCertificate();
  };

  const handleLoadCertificate = async () => {
    setIsLoadingRequest(true);
    try {
      // Fetch the associated clearance request data
      const requestData = await getClearanceRequestById(data.request);
      setClearanceRequest(requestData);

      // AC2: Check if clearance is on hold and block certificate actions
      if (requestData?.status === "ONHOLD") {
        toast.error(
          "Clearance is currently on hold due to a legal/disciplinary investigation."
        );
        setIsLoadingRequest(false);
        return;
      }

      // Fetch clearance request items
      const clearanceRequestItems = await getClearanceRequestItems({
        filterData: { request: data.request },
      });
      setClearanceRequestItems(clearanceRequestItems?.results || []);

      setViewCertificate(true);
    } catch (error) {
      console.error("Error fetching clearance request:", error);
      toast.error("Failed to load certificate details");
    } finally {
      setIsLoadingRequest(false);
    }
  };

  // Handle resending certificate
  const handleResendCertificate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data?.id) {
      toast.error("Certificate data not found");
      return;
    }

    // Check if associated clearance request is on hold before resending
    try {
      const requestData = await getClearanceRequestById(data.request);

      // AC2: Block resending if clearance is on hold
      if (requestData?.status === "ONHOLD") {
        toast.error(
          "Clearance is currently on hold due to a legal/disciplinary investigation."
        );
        return;
      }
    } catch (error) {
      console.error("Error checking clearance status:", error);
      toast.error("Failed to verify clearance status");
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

  // Prepare additional options - you can add more certificate-related actions here
  const additionalOptions = [
    {
      text: isResending ? "Resending..." : "Resend Certificate",
      action: handleResendCertificate,
    },
  ];

  return (
    <>
      <DropdownActionMenu
        onView={handleViewCertificate}
        viewText={isLoadingRequest ? "Loading..." : "View Certificate"}
        menuTooltip="Certificate Actions"
        additionalOptionsConfig={additionalOptions}
      />

      {/* View Certificate Modal */}
      {viewCertificate && (
        <ClearanceCertificateModal
          isOpen={viewCertificate}
          setIsOpen={setViewCertificate}
          certificateData={data}
          clearanceRequest={clearanceRequest}
          onCertificateUpdate={handleCertificateUpdate}
          clearanceRequestItems={clearanceRequestItems}
        />
      )}
    </>
  );
};

export default ClearanceCertificateActions;
