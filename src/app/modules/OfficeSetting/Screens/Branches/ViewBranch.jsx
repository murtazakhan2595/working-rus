import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddBranchForm from "./AddBranchForm";    
import useUserOrganization from "app/hooks/useUserOrganization";
import { getBranchById } from "app/hooks/general"; // Adjust path as needed

const ViewBranch = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  BranchList = []
}) => {
  const userOrganization = useUserOrganization();

  // Define the fields to display
  const fields = [
    {
      title: "Branch Details",
      field: [
        { key: "id", label: "ID" },
        { key: "branch_name", label: "Branch Name" },
        { key: "branch_number", label: "Branch Number" },
        { key: "branch_address", label: "Address" },
        { key: "branch_status", label: "Status" },
        
      
        // Add more fields as needed
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    try {
      const response = await getBranchById(id);
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
      title="Branch Detail"
      currentItem_Id={data?.id}
      dataList={BranchList}
      reloadData={reload}
      editComponent={AddBranchForm}
      apiEndpoint={`/branch/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Branch"   
      deleteTooltip="Delete Branch"
      additionalEditProps={{ userOrganization }}
    >
      <DetailContent
        title="Branch Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewBranch;      
