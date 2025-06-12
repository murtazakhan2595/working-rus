import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddDesignationForm from "./AddDesignationForm";
import useUserOrganization from "app/hooks/useUserOrganization";
import { getDesignationById } from "app/hooks/general"; // Adjust path as needed

const ViewDesignation = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  DesignationList = []
}) => {
  const userOrganization = useUserOrganization();

  // Define the fields to display
  const fields = [
    {
      title: "Designation Details",
      field: [
        { key: "id", label: "ID" },
        { key: "name", label: "Designation Name" },
        { key: "description", label: "Description" },
        // Add more fields as needed
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    console.log("Fetching department with ID:", id); // Debug
    try {
      const response = await getDesignationById(id);
      console.log("API response:", response); // Debug
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Designation Detail"
      currentItem_Id={data?.id}
      dataList={DesignationList}
      reloadData={reload}
      editComponent={AddDesignationForm}
      apiEndpoint={`/designation/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Designation"   
      deleteTooltip="Delete Designation"
      additionalEditProps={{ userOrganization }}
    >
      <DetailContent
        title="Designation Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewDesignation;      
