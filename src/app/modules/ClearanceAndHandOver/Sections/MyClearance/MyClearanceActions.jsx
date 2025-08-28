import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { MyClearanceDetailsModal } from "./MyClearanceDetailsModal";
import ClearanceCertificateModal from "../ClearanceCertificates/ClearanceCertificateModal";
import { toast } from "react-toastify";
import {
  getClearanceCertificateByRequest,
  getClearanceRequestItems,
} from "app/hooks/clearanceAndHandover";

export const MyClearanceActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewDetails, setViewDetails] = useState(false);
  const [viewCertificate, setViewCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [clearanceRequestItems, setClearanceRequestItems] = useState([]);
  const [isLoadingCertificate, setIsLoadingCertificate] = useState(false);

  // Handle opening the details view
  const handleViewDetails = () => {
    setViewDetails(true);
  };

  // Handle certificate viewing (only for completed requests)
  const handleViewCertificate = async () => {
    if (!data?.id) {
      toast.error("Clearance request data not found");
      return;
    }

    setIsLoadingCertificate(true);
    try {
      // Check if certificate exists for this request
      const existingCertificate = await getClearanceCertificateByRequest(
        data.id
      );

      if (existingCertificate) {
        setCertificateData(existingCertificate);

        // Fetch clearance request items for certificate display
        const clearanceRequestItems = await getClearanceRequestItems({
          filterData: { request: data.id },
        });
        setClearanceRequestItems(clearanceRequestItems?.results || []);

        setViewCertificate(true);
      } else {
        toast.info("Certificate not yet generated for this clearance request");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      toast.error("Failed to load certificate");
    } finally {
      setIsLoadingCertificate(false);
    }
  };

  // Show different actions based on status
  const isCompleted = data?.status === "COMPLETED";

  return (
    <>
      <DropdownActionMenu
        onView={handleViewDetails}
        onCustom={isCompleted ? handleViewCertificate : null}
        viewText="View Details"
        customText={
          isCompleted
            ? isLoadingCertificate
              ? "Loading..."
              : "View Certificate"
            : null
        }
        menuTooltip="My Clearance Actions"
        hideEdit={true}
        hideDelete={true}
      />

      {/* View Details Modal */}
      {viewDetails && (
        <MyClearanceDetailsModal
          isOpen={viewDetails}
          setIsOpen={setViewDetails}
          clearanceRequest={data}
          reload={reloadData}
          clearanceTypes={clearanceTypes}
        />
      )}

      {/* View Certificate Modal */}
      {viewCertificate && certificateData && (
        <ClearanceCertificateModal
          isOpen={viewCertificate}
          setIsOpen={setViewCertificate}
          certificateData={certificateData}
          clearanceRequest={data}
          onCertificateUpdate={() => {}}
          clearanceRequestItems={clearanceRequestItems}
          isMyCertificate={true}
        />
      )}
    </>
  );
};
