import { SheetCardExtension } from 'components/SheetCardExtension';
import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'
import AddDepartmentForm from './AddDepartmentForm';

const AddDepartment = ({ reload }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formSheetData = {
    triggerText: "Add New Department",
    title: "Add New Department",
    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="600px"
    >
      <AddDepartmentForm isOpen={isOpen} setIsOpen={setIsOpen} reload={reload}/>
    </SheetComponent>
  );
};

export default AddDepartment
