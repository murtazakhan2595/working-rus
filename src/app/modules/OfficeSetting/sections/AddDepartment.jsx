import { SheetCardExtension } from 'components/SheetCardExtension';
import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'
import AddOrganizationForm from './AddOrganizationForm';
import AddDepartmentForm from './AddDepartmentForm';

const AddDepartment = () => {
  const [isOpen, setIsOpen] = useState(false)

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
        <AddDepartmentForm isOpen={isOpen} setIsOpen={setIsOpen}/>
    </SheetComponent>
  )
}

export default AddDepartment
