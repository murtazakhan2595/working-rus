import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddDepartmentForm from "./AddDepartmentForm";
import useUserOrganization from "app/hooks/useUserOrganization";
import { getDepartmentById } from "app/hooks/general"; // Adjust path as needed

const ViewDepartment = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  DepartmentList = []
}) => {
  const userOrganization = useUserOrganization();

  // Define the fields to display
  const fields = [
    {
      title: "Department Details",
      field: [
        { key: "id", label: "ID" },
        { key: "name", label: "Department Name" },
        { key: "description", label: "Description" },
        // Add more fields as needed
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    console.log("Fetching department with ID:", id); // Debug
    try {
      const response = await getDepartmentById(id);
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
      title="Department Detail"
      currentItem_Id={data?.id}
      dataList={DepartmentList}
      reloadData={reload}
      editComponent={AddDepartmentForm}
      apiEndpoint={`/department/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Department"
      deleteTooltip="Delete Department"
      additionalEditProps={{ userOrganization }}
    >
      <DetailContent
        title="Department Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewDepartment;
