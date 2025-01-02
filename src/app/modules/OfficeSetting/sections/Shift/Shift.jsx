import SheetComponent from 'components/ui/SheetComponent';
import React, { useState } from 'react'
import AddShiftForm from './AddShiftForm';

const Shift = ({ reload }) => {
console.log("Reload in Shift Component:", reload);
  const [isOpen, setIsOpen] = useState(false);

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
      <AddShiftForm isOpen={isOpen} setIsOpen={setIsOpen} reload={reload} />
    </SheetComponent>
  );
};

export default Shift
