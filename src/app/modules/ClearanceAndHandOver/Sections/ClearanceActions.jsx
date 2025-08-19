import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import ClearanceChecklistModal from "./ClearanceChecklistModal";

const ClearanceActions = ({
  data,
  reloadData = () => {},
  clearanceList = [],
}) => {
  const [viewChecklist, setViewChecklist] = useState(null);

  // Handle opening the checklist view
  const handleViewChecklist = () => {
    setViewChecklist(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleViewChecklist}
        viewText="View Clearance Checklist"
        editText="Edit Clearance"
        deleteText="Delete Clearance"
        menuTooltip="Clearance Actions"
        hideEdit={true}
        hideDelete={true}
      />

      {/* View Clearance Checklist */}
      {viewChecklist && (
        <ClearanceChecklistModal
          isOpen={viewChecklist}
          setIsOpen={setViewChecklist}
          clearanceRequest={data}
          reload={reloadData}
        />
      )}
    </>
  );
};

export default ClearanceActions;
