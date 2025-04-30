import { SheetCardExtension } from 'components/SheetCardExtension';
import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'
import DesignationForm from './AddDesignationForm';
import useUserOrganization from 'app/hooks/useUserOrganization';

const AddDesignation = ({reload}) => {
  const [isOpen, setIsOpen] = useState(false)

  console.log("reload in add desig", reload)

  const userOrganization = useUserOrganization();

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
      <DesignationForm 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        reload={reload}
        userOrganization={userOrganization}
      />
    </SheetComponent>
  );
}

export default AddDesignation
