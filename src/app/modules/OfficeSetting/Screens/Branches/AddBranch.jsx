import { SheetCardExtension } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import React, { useState } from "react";
import AddBranchForm from "app/modules/OfficeSetting/Screens/Branches/AddBranchForm";

const AddBranch = ({ reload = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formSheetData = {
    triggerText: "Add New Branch",
    title: "Add New Branch",
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
      <AddBranchForm isOpen={isOpen} setIsOpen={setIsOpen} reload={reload} />
    </SheetComponent>
  );
};

export default AddBranch;
