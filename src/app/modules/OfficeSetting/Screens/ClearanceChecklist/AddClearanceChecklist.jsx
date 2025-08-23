// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/AddClearanceChecklist.jsx
import React, { useState } from "react";
import AddClearanceChecklistForm from "app/modules/OfficeSetting/Screens/ClearanceChecklist/AddClearanceChecklistForm";
import { Button } from "components/ui/button";

const AddClearanceChecklist = ({ reloadData = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>Add Checklist</Button>
      {isOpen && (
        <AddClearanceChecklistForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default AddClearanceChecklist;
