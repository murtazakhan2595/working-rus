import React, { useRef, useState } from 'react';
import SheetComponent from 'components/ui/SheetComponent';
import ProjectForm from 'app/modules/TaskManagment/Projects/ProjectForm';

const CreateEditProject = () => {
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
    triggerText: 'Add New Project',
    title: 'Add New Project',
    description: null,
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
        <ProjectForm
           isOpen={isOpen}
           setIsOpen={setIsOpen}
        />
      </SheetComponent>
    </div>
  );
};

export default CreateEditProject;