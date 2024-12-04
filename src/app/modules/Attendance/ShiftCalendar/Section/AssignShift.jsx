import SheetComponent from 'components/ui/SheetComponent'
import React, { useState } from 'react'

const AssignShift = () => {
    const [isOpen, setIsOpen] = useState(false)

    const formSheetData = {
        triggerText: "Assign Shift",
        title: "Assign Shift",
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
        Hello
    </SheetComponent>
  )
}

export default AssignShift
