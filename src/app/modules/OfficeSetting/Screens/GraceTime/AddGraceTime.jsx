import React, { useState } from "react";
import AddGraceTimeForm from "app/modules/OfficeSetting/Screens/GraceTime/AddGraceTimeForm";
import { Button } from "components/ui/button";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const AddGraceTime = ({ reloadData = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const permissions = useOfficeSettingPermissions();

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  if (!permissions.graceTime.canCreate) {
    return null;
  }

  return (
    <>
      <Button onClick={handleClick}>Add New Grace Time</Button>
      {isOpen && (
        <AddGraceTimeForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default AddGraceTime;
