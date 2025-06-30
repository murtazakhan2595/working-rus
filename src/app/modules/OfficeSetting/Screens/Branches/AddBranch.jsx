import { SheetCardExtension } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import React, { useState } from "react";
import AddBranchForm from "app/modules/OfficeSetting/Screens/Branches/AddBranchForm";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const AddBranch = ({ reloadData = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const permissions = useOfficeSettingPermissions();

  const formSheetData = {
    triggerText: "Add New Branch",
    title: "Add New Branch",
    description: null,
    footer: null,
  };

  if (!permissions.branches.canCreate) {
    return null;
  }

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="600px"
    >
      <AddBranchForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reloadData={reloadData}
      />
    </SheetComponent>
  );
};

export default AddBranch;
