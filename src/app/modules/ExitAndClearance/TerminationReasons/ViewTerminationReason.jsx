import React from "react";
import { DetailBox, SheetCardExtension } from "components/SheetCardExtension";
import NavigationSheetComponent from "components/NavigationSheetComponent";
import { AddUpdateTerminationReasons } from ".";
import { getTerminationReasonById } from "app/hooks/employeeExitAndClearance";

// Content component for termination reason details
const TerminationReasonContent = ({ currentItem }) => {
  if (!currentItem) return null;

  return (
    <SheetCardExtension
      title={"Termination Reason Details"}
      className="mb-4 gap-y-0"
    >
      <DetailBox label="Reason Name" value={currentItem?.name} />
    </SheetCardExtension>
  );
};

const ViewTerminationReason = ({
  data,
  isOpen,
  setIsOpen,
  reload,
  dataList = [],
}) => {
  const fetchTerminationReasonDetails = async (id) => {
    try {
      const response = await getTerminationReasonById(id);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching termination reason:", error);
      throw error;
    }
  };

  return (
    <NavigationSheetComponent
      // Main sheet props
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Termination Reason Detail"
      currentItem_Id={data?.id}
      dataList={dataList}
      reloadData={reload}
      allowEdit={true}
      allowDelete={true}
      // Content component
      editComponent={AddUpdateTerminationReasons}
      // API endpoints
      apiEndpoint="/terminationreason/${id}"
      // Data functions
      fetchCurrentItemDetails={fetchTerminationReasonDetails}
      // Labels and text
      deleteItemName="name"
      editTooltip="Edit Termination Reason"
      deleteTooltip="Delete Termination Reason"
      // Additional props for edit component
      additionalEditProps={{
        reload: reload,
      }}
    >
      <TerminationReasonContent />
    </NavigationSheetComponent>
  );
};

export default ViewTerminationReason;
