import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddOnboardingForm from "./AddOnboardingForm";
import useUserOrganization from "app/hooks/useUserOrganization";
import { getOnboardingDocumentById } from "app/hooks/officeSetting"; // Adjust path as needed

const ViewOnboarding = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  OnboardingList = []
}) => {
  const userOrganization = useUserOrganization();

  // Define the fields to display
  const fields = [
    {
      title: "Onboarding Details", 
      field: [
        { key: "id", label: "ID" },
        { key: "name", label: "Onboarding Name" },
        
        // Add more fields as needed
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    console.log("Fetching department with ID:", id); // Debug
    try {
      const response = await getOnboardingDocumentById(id);
      console.log("API response:", response); // Debug
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  console.log("this m data reload ", reload);

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Onboarding Detail"
      currentItem_Id={data?.id}
      dataList={OnboardingList}
      reloadData={reload}
      editComponent={AddOnboardingForm}
      apiEndpoint={`/onboardingdoc/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Onboarding"
      deleteTooltip="Delete Onboarding"
      additionalEditProps={{ userOrganization }}
    >
      <DetailContent title="Onboarding Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewOnboarding;      
