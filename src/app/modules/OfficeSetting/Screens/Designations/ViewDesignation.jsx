import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddDesignationForm from "./AddDesignationForm";
import { initialState } from "state/slices/UserSlice";
import { getDesignationById } from "app/hooks/general";

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

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getDesignationById(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching designation:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Designation Detail"
      data={data}
      dataList={DesignationList}
      reload={reload}
      editComponent={AddDesignationForm}
      apiEndpoint={`/designation/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
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
