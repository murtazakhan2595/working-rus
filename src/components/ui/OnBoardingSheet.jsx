import React, { useRef, useState } from "react";
import SheetComponent from "./SheetComponent";
import EmployeeForm from "app/modules/Employees/Screens/EmployeeForm";

const OnBoardingSheet = ({ reloadData = () => {} }) => {
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const validationEmployeeInfoFormSchema = (values, isEditMode) => {
    const errors = {};
    // Add your validation logic here
    return errors;
  };

  const validateUsername = (value) => {
    // Add your username validation logic here
  };

  const formSheetData = {
    triggerText: "Add New Employee",
    title: "Add New Employee",
    description: null,
    footer: null,
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
      >
        <EmployeeForm
          formRef={formRef}
          validationEmployeeInfoFormSchema={validationEmployeeInfoFormSchema}
          isEditMode={false}
          emailAlreadyExist={false}
          usernameAlreadyExist={false}
          validateUsername={validateUsername}
          isOpen={isOpen}
          setIsOpen={() => {
            
            setIsOpen(false);
            reloadData(true);
          }}
        />
      </SheetComponent>
    </div>
  );
};

export default OnBoardingSheet;
