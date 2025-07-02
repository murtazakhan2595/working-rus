import { SheetCardExtension } from 'components/SheetCardExtension';
import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'
import DesignationForm from './AddDesignationForm';
import useUserOrganization from 'app/hooks/useUserOrganization';
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const AddDesignation = ({reloadData}) => {
  const [isOpen, setIsOpen] = useState(false)
  const permissions = useOfficeSettingPermissions();
  const userOrganization = useUserOrganization();

  if (!permissions.designations.canCreate) {
    return null;
  }

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
        reloadData={reloadData}
        userOrganization={userOrganization}
      />
    </SheetComponent>
  );
}

export default AddDesignation
