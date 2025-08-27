import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceRecordsModal from "./ClearanceRecordsModal";
import ClearanceCertificateModal from "./ClearanceCertificates/ClearanceCertificateModal";
import { toast } from "react-toastify";
import {
  getClearanceCertificateByRequest,
  createClearanceCertificate,
  getClearanceRequestItems,
} from "app/hooks/clearanceAndHandover";

const ClearanceRecordsActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewDetails, setViewDetails] = useState(null);
  const [certificateModal, setCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clearanceRequestItems, setClearanceRequestItems] = useState([]);

  // Handle opening the details view
  const handleViewDetails = () => {
    setViewDetails(true);
  };

  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    if (!data?.id) {
      toast.error("Clearance request data not found");
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

  return (
    <>
      <DropdownActionMenu
        onView={handleViewDetails}
        onCustom={handleGenerateCertificate}
        viewText="View Clearance Details"
        customText={isGenerating ? "Generating..." : "Generate Certificate"}
        editText="Edit Clearance"
        deleteText="Delete Clearance"
        menuTooltip="Clearance Actions"
        hideEdit={true}
        hideDelete={true}
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
    </>
  );
};

export default ClearanceRecordsActions;
