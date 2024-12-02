import SheetComponent from "components/ui/SheetComponent";
import React, { useRef, useState } from "react";
import AddOrganizationForm from "./AddOrganizationForm";

const AddOrganization = () => {
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const formSheetData = {
    triggerText: "Add New Organization",
    title: "Add New Organization",
    description: null,
    footer: null,
  };

  const handleSubmit = (formData, resetForm) => {
    console.log('Form submitted:', formData);
    // Perform any API or state update logic here
    resetForm();
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="600px"
    >
      <AddOrganizationForm isOpen={isOpen} setIsOpen={setIsOpen} handleSubmit={handleSubmit}/>
    </SheetComponent>
  );
};

export default AddOrganization;
