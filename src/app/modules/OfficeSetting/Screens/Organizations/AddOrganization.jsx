import SheetComponent from "components/ui/SheetComponent";
import React, { useEffect, useState } from "react";
import AddOrganizationForm from "./AddOrganizationForm";
import { saveOrganization } from "app/hooks/officeSetting";
import { toast } from "react-toastify";
import AlertDialogue from "components/ui/AlertDialogue";

const AddOrganization = ({ 
  reload, 
  editData, 
  setEditData, 
  edit, 
  setEdit, 
  countryData, 
  stateData, 
  cityData 
}) => {
  const [isOpen, setIsOpen] = useState(edit??false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [resetFormFn, setResetFormFn] = useState(null);

  useEffect(() => {
    if((!isOpen && edit)){
      setEdit(false);
      setEditData({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const formSheetData = {
    triggerText: edit? "":null,
    title: edit?"Edit Organization":"Add New Organization",
    description: null,
    footer: null,
  };

  const handleFormSubmit = (data, resetForm) => {
    setFormData(data);
    setResetFormFn(() => resetForm);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    console.log("Form submitted:", formData);
  
    const preparedFormData = new FormData();
  
    // Loop through formData and append keys and values to FormData
    Object.entries(formData).forEach(([key, value]) => {
      // Skip the location name properties which are only for display
      if (['country_name', 'state_name', 'city_name'].includes(key)) {
        return;
      }
      
      if (key === "logo") {
        if (value instanceof File)
          // Handle file fields
          preparedFormData.append(key, value);
      } else {
        // Handle non-file fields
        preparedFormData.append(key, value);
      }
    });
  
    // Set confirmation dialog to false first
    setShowConfirmation(false);
    
    // Pass the FormData to saveOrganization
    const response = await saveOrganization(formData?.id, preparedFormData);
    if (response) {
      resetFormFn();
      // Close the sheet
      setIsOpen(false);
      // After the sheet is closed, trigger the reload
      setTimeout(() => {
        toast.success("Organization saved successfully");
        reload();
      }, 100);
    } else {
      toast.error("Error saving organization");
    }
  };
  
  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="600px"
      >
        <AddOrganizationForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSubmit={handleFormSubmit}
          editData={editData}
          edit={edit}
          countryData={countryData}
          stateData={stateData}
          cityData={cityData}
        />
      </SheetComponent>

      <AlertDialogue
        isOpen={showConfirmation}
        setIsOpen={setShowConfirmation}
        title="Confirm Update"
        description="Are you sure you want to save these changes?"
        handleContinue={handleConfirmSubmit}
        continueText="Save"
        cancelText="Cancel"
        buttonType="custom"
        className="font-medium text-primary-1100"
        customStyles={{
          continueButton: "bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-full font-medium",
          cancelButton: "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-full font-medium"
        }}
      />
    </>
  );
};

export default AddOrganization;
