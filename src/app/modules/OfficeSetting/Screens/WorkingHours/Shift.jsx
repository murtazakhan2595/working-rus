import React, { useState } from "react";
import AddShiftForm from "./AddShiftForm";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";
import { Button } from "components/ui/button";

const Shift = ({ reloadData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const permissions = useOfficeSettingPermissions();

  if (!permissions.shift.canCreate) {
    return null;
  }

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>Add New Shift</Button>
      {isOpen && (
        <AddShiftForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default Shift;
