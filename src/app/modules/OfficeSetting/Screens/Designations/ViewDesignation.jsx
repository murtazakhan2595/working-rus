import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddDesignationForm from "./AddDesignationForm";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

const ViewDesignation = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  DesignationList = []
}) => {
  // Define the fields to display
  const fields = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Designation Detail"
      data={data}
      dataList={DesignationList}
      reload={reload}
      editComponent={AddDesignationForm}
      deleteEndpoint={`/designation/${data?.id}`}
      refreshEndpoint={`${baseUrl}/designation`}
      deleteItemName="name"
      editTooltip="Edit Designation"
      deleteTooltip="Delete Designation"
    >
      <DetailContent
        title="Designation Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewDesignation;
