import React, { useState } from "react";
import AddRatingScaleSetupForm from "app/modules/OfficeSetting/Screens/RatingScaleSetup/AddRatingScaleSetupForm";
import { Button } from "components/ui/button";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const AddRatingScaleSetup = ({ reloadData = () => {} }) => {
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
      <Button onClick={handleClick}>Add New Rating Scale</Button>
      {isOpen && (
        <AddRatingScaleSetupForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default AddRatingScaleSetup;
