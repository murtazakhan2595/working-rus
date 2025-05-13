import SheetComponent from 'components/ui/SheetComponent';
import React, { useState } from 'react';
import AddRoleForm from './AddRoleForm';

const AddRole = ({ reload }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formSheetData = {
    triggerText: "Add New Role",
    title: "Add New Role",
    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="700px"
    >
      <AddRoleForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reload={reload}
      />
    </SheetComponent>
  );
};

export default AddRole;
