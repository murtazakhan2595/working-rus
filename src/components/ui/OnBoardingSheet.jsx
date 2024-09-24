import React, { useRef, useState } from 'react';
import SheetComponent from './SheetComponent';
import EmployeeForm from 'app/modules/Employees/Screens/Sections/EmployeeForm';

const OnBoardingSheet = () => {
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    work_email: '',
  });

  const handleSubmit = (values, resetForm) => {
    console.log(values);
    setFormData(values); 
    resetForm();
  };

  const validationEmployeeInfoFormSchema = (values, isEditMode) => {
    const errors = {};
    // Add your validation logic here
    return errors;
  };

  const validateUsername = (value) => {
    // Add your username validation logic here
  };

  const formSheetData = {
    triggerText: 'Add New Employee',
    title: 'Add New Employee',
    description: 'Please fill out the form below to add a new employee.',
    footer: null,
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        onSubmit={handleSubmit}
        width="860px"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
      >
        <EmployeeForm
          formData={formData}
          formRef={formRef}
          handleSubmit={handleSubmit}
          validationEmployeeInfoFormSchema={validationEmployeeInfoFormSchema}
          isEditMode={false}
          emailAlreadyExist={false}
          usernameAlreadyExist={false}
          empId="12345"
          validateUsername={validateUsername}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </SheetComponent>
    </div>
  );
};

export default OnBoardingSheet;