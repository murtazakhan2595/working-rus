import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceRecordsModal from "./ClearanceRecordsModal";
import { toast } from "react-toastify";
import { HasAccess } from "utils/PermissionUtils";
import {
  getClearanceCertificateByRequest,
  createClearanceCertificate,
  getClearanceRequestItems,
} from "app/hooks/clearanceAndHandover";
import ClearanceHoldModal from "../OnHold/ClearanceHoldModal";
import ClearanceCertificateModal from "../ClearanceCertificates/ClearanceCertificateModal";

const ClearanceRecordsActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewDetails, setViewDetails] = useState(null);
  const [certificateModal, setCertificateModal] = useState(false);
  const [holdModal, setHoldModal] = useState({ isOpen: false, mode: "view" });
  const [certificateData, setCertificateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clearanceRequestItems, setClearanceRequestItems] = useState([]);

  // Permission checks
  const canManageHolds = HasAccess("ONHOLD_CLEARANCE");
  const isOnHold = data?.status === "ONHOLD";

  // Handle opening the details view
  const handleViewDetails = () => {
    setViewDetails(true);
  };

  // Handle hold management
  const handleViewHoldDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoldModal({ isOpen: true, mode: "view" });
  };

  const handleRemoveHold = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoldModal({ isOpen: true, mode: "remove" });
  };

  // Handle certificate generation
  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data?.id) {
      toast.error("Clearance request data not found");
      return;
    }

    // Block certificate generation if on hold
    if (isOnHold) {
      toast.error(
        "Cannot generate certificate while clearance is on hold due to a legal/disciplinary investigation."
      );
      return;
    }

    setIsGenerating(true);
    try {
      // Check if certificate already exists
      const existingCertificate = await getClearanceCertificateByRequest(
        data.id
      );

      if (existingCertificate) {
        // Use existing certificate
        setCertificateData(existingCertificate);
        setCertificateModal(true);
        toast.success("Using existing certificate");
      } else {
        // Create new certificate
        const newCertificatePayload = {
          generated_by: 1, // Current user ID - you may need to get this from context
          request: data.id,
        };

        const newCertificate = await createClearanceCertificate(
          newCertificatePayload
        );

        if (newCertificate) {
          setCertificateData(newCertificate);
          setCertificateModal(true);
          toast.success("Certificate generated successfully!");
        } else {
          toast.error("Failed to generate certificate");
        }
      }

      const clearanceRequestItems = await getClearanceRequestItems({
        filterData: { request: data.id },
      });
      setClearanceRequestItems(clearanceRequestItems?.results || []);
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle certificate update callback
  const handleCertificateUpdate = (updatedCertificate) => {
    setCertificateData(updatedCertificate);
    // Optionally reload the main data
    reloadData();
  };

  // Prepare additional options for hold management and certificate generation
  const additionalOptions = [];

  // Certificate generation option (but blocked if on hold)
  if (!isOnHold) {
    additionalOptions.push({
      text: isGenerating ? "Generating..." : "Generate Certificate",
      action: handleGenerateCertificate,
    });
  } else {
    // Show disabled certificate option when on hold
    additionalOptions.push({
      text: "Certificate Blocked (On Hold)",
      action: (e) => {
        e.preventDefault();
        e.stopPropagation();
        toast.error(
          "Cannot generate certificate while clearance is on hold due to a legal/disciplinary investigation."
        );
      },
    });
  }

  // Add hold-related actions
  if (isOnHold) {
    // Always show view hold details for transparency
    additionalOptions.push({
      text: "View Hold Details",
      action: handleViewHoldDetails,
    });

    // Only show remove hold for authorized users
    if (canManageHolds) {
      additionalOptions.push({
        text: "Remove Hold",
        action: handleRemoveHold,
      });
    }
  }

  return (
    <>
      <DropdownActionMenu
        onView={handleViewDetails}
        viewText="View Clearance Details"
        menuTooltip="Clearance Actions"
        additionalOptionsConfig={additionalOptions}
      />

      {/* View Details Modal */}
      {viewDetails && (
        <ClearanceRecordsModal
          isOpen={viewDetails}
          setIsOpen={setViewDetails}
          clearanceRecord={data}
          reload={reloadData}
          clearanceTypes={clearanceTypes}
        />
      )}

      {/* Certificate Modal */}
      {certificateModal && certificateData && (
        <ClearanceCertificateModal
          isOpen={certificateModal}
          setIsOpen={setCertificateModal}
          certificateData={certificateData}
          clearanceRequest={data}
          onCertificateUpdate={handleCertificateUpdate}
          clearanceRequestItems={clearanceRequestItems}
        />
      )}

      {/* Hold Management Modal */}
      {holdModal.isOpen && (
        <ClearanceHoldModal
          isOpen={holdModal.isOpen}
          setIsOpen={(isOpen) => setHoldModal({ ...holdModal, isOpen })}
          clearanceRequest={data}
          reload={reloadData}
          mode={holdModal.mode}
        />
      )}
    </>
  );
};

export default ClearanceRecordsActions;
