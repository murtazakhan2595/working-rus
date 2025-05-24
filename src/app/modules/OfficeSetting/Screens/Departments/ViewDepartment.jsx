import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddDepartmentForm from "./AddDepartmentForm";
import useUserOrganization from "app/hooks/useUserOrganization";

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
    { key: "name", label: "Name" },
    { key: "description", label: "Description" }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Department Detail"
      data={data}
      dataList={DepartmentList}
      reload={reload}
      editComponent={AddDepartmentForm}
      deleteEndpoint={`/department/${data?.id}`}
      refreshEndpoint="/department"
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
