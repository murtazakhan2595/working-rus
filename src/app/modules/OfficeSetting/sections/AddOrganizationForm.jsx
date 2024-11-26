import SheetComponent from 'components/ui/CustomSheet'
import React, { useState } from 'react'

const AddOrganizationForm = () => {
    const [isOpen, setIsOpen] = useState(false)

    const formSheetData = {
        triggerText: "Add Organization",
        title: "Add Organization",
    
        description: null,
        footer: null,
      };

  return (
    <SheetComponent
    {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    >
        Hello
        </SheetComponent>
  )
}

export default AddOrganizationForm
