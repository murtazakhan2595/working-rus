import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddBranchForm from "./AddBranchForm";

const ViewBranch = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  BranchList = []
}) => {
  // Define the fields to display
  const fields = [
    { key: "id", label: "Id" },
    { key: "branch_name", label: "Name" },
    { key: "branch_number", label: "Branch Number" },
    { key: "branch_address", label: "Address" }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Branch Detail"
      data={data}
      dataList={BranchList}
      reload={reload}
      editComponent={AddBranchForm}
      deleteEndpoint={`/branch/${data?.id}`}
      refreshEndpoint="/branch"
      deleteItemName="branch_name"
      editTooltip="Edit Branch"
      deleteTooltip="Delete Branch"
      additionalEditProps={{ 
        editMode: true, 
        branchData: data 
      }}
    >
      <DetailContent
        title="Branch Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewBranch;
