import SheetComponent from "components/ui/SheetComponent";
import React, { useState } from "react";
import AddOnboardingForm from "./AddOnboardingForm";

const OnboardingTab = ({ reload }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formSheetData = {
    triggerText: "Add New Document",
    title: "Add New Document",
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
      <AddOnboardingForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reload={reload}
      />
    </SheetComponent>
  );
};

export default OnboardingTab;
