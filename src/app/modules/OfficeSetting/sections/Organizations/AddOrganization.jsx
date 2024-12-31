import SheetComponent from "components/ui/SheetComponent";
import React, { useEffect, useRef, useState } from "react";
import AddOrganizationForm from "./AddOrganizationForm";
import { saveOrganization } from "app/hooks/officeSetting";
import { toast } from "react-toastify";

const AddOrganization = ({ reload, editData, setEditData, edit, setEdit}) => {
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(edit??false);



  useEffect(() => {
    if((!isOpen && edit)){
      setEdit(false);
      setEditData({});
    }
  }, [isOpen]);

  const formSheetData = {
    triggerText: edit? "":null,
    title: edit?"Edit Organization":"Add New Organization",
    description: null,
    footer: null,
  };



  const handleSubmit = async (formData, resetForm) => {
    console.log("Form submitted:", formData);
  
    const preparedFormData = new FormData();
  
    // Loop through formData and append keys and values to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "logo") {
        if (value instanceof File)
          // Handle file fields
          preparedFormData.append(key, value);
      } else {
        // Handle non-file fields
        preparedFormData.append(key, value);
      }
    });
  
    // Pass the FormData to saveOrganization
    const response = await saveOrganization(formData?.id , preparedFormData);
    if (response) {
      resetForm();
      setIsOpen(false);
      toast.success("Organization saved successfully");
      reload();
    } else {
      resetForm();
      toast.error("Error saving organization");
    }
  };
  


  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="600px"
    >
      <AddOrganizationForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSubmit={handleSubmit}
        editData={editData}
        edit={edit}
      />
    </SheetComponent>
  );
};

export default AddOrganization;
