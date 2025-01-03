import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'
import AddDesignationForm from './AddDesignationForm';

const AddDesignation = ({reload}) => {
  const [isOpen, setIsOpen] = useState(false)

  console.log("reload in add desig", reload)

  const formSheetData = {
    triggerText: "Add New Designation",
    title: "Add New Designation",
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
      <AddDesignationForm isOpen={isOpen} setIsOpen={setIsOpen} reload={reload}/>
    </SheetComponent>
  );
}

export default AddDesignation
