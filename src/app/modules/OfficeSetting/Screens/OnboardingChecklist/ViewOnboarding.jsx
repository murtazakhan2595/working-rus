import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddOnboardingForm from "./AddOnboardingForm";

const ViewOnboarding = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  OnboardingList = []
}) => {
  // Define the fields to display
  const fields = [
    { key: "name", label: "Document Name" }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Document Detail"
      data={data}
      dataList={OnboardingList}
      reload={reload}
      editComponent={AddOnboardingForm}
      deleteEndpoint={`/onboarding-document/${data?.id}`}
      refreshEndpoint="/onboarding-document"
      deleteItemName="name"
      editTooltip="Edit Document"
      deleteTooltip="Delete Document"
    >
      <DetailContent
        title="Document Details"
        fields={fields}
        dateField="created_at"
        dateTitle="Created At"
      />
    </NavigationSheetComponent>
  );
};

export default ViewOnboarding;
