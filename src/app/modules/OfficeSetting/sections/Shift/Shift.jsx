import SheetComponent from 'components/ui/SheetComponent';
import React, { useState } from 'react'
import AddShiftForm from './AddShiftForm';

const Shift = () => {
    const [isOpen, setIsOpen] = useState(false)

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
        <AddShiftForm isOpen={isOpen} setIsOpen={setIsOpen}/>
    </SheetComponent>
  )
}

export default Shift
