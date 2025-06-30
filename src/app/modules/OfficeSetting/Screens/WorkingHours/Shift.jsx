import SheetComponent from 'components/ui/SheetComponent';
import React, { useState } from 'react'
import AddShiftForm from './AddShiftForm';
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const Shift = ({ reload, dataShift }) => {
  const [isOpen, setIsOpen] = useState(false);
  const permissions = useOfficeSettingPermissions();

  if (!permissions.shift.canCreate) {
    return null;
  }

  const formSheetData = {
    triggerText: "Add New Shift",
    title: "Add New Shift",
    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="568px"
    >
      <AddShiftForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reload={reload}
        existingShifts={dataShift || []}
      />
    </SheetComponent>
  );
};

export default Shift
