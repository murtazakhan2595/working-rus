import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceRecordsModal from "./ClearanceRecordsModal";

const ClearanceRecordsActions = ({
  data,
  reloadData = () => {},
  clearanceTypes = [],
}) => {
  const [viewDetails, setViewDetails] = useState(null);

  // Handle opening the details view
  const handleViewDetails = () => {
    setViewDetails(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleViewDetails}
        viewText="View Clearance Checklist"
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
    </>
  );
};

export default ClearanceRecordsActions;
