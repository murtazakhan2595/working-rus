import React, { useState } from "react";
import AddEvaluationTypeForm from "app/modules/OfficeSetting/Screens/EvaluationType/AddEvaluationTypeForm";
import { Button } from "components/ui/button";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const AddEvaluationType = ({ reloadData = () => {} }) => {
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
      <Button onClick={handleClick}>Add New Evaluation Type</Button>
      {isOpen && (
        <AddEvaluationTypeForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default AddEvaluationType;
