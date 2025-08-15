import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewHolidayDetail } from "app/modules/LeaveTracker";
import { toast } from "react-toastify";
// import { deleteRecord } from "app/hooks/general";
import AddUpdateLeaveBalance from "./AddUpdateLeaveBalance";
import ViewOpeningBalanceDetail from "./ViewOpeningBalanceDetail";

const OpeningBalanceAction = ({
  data,
  reloadData = () => {},
  DataList = [],
}) => {
  console.log("OpeningBalanceAction Data", data);
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);

  // Handle opening the view dialog
  const handleView = () => {
    setView(true);
  };

  // Handle opening the edit form
  const handleEdit = () => {
    setEdit(true);
  };

  // Transform DataList to ensure consistent id field
  const transformedDataList = DataList.map((item) => ({
    ...item,
    id: item.id || item.serial_number, // Use existing id or serial_number
  }));

  // Transform current data item too
  const transformedData = {
    ...data,
    id: data.id || data.serial_number, // Ensure current item also has id
  };

  // Use the item's id (which could be serial_number) for currentId
  const currentId = transformedData.id;

  console.log("OpeningBalanceAction - currentId:", currentId);
  console.log(
    "OpeningBalanceAction - transformedDataList:",
    transformedDataList
  );

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        // onDelete={handleDelete}
        viewText="View Leave Opening Balance"
        editText="Edit Leave Opening Balance"
        deleteText="Delete Leave Opening Balance"
        menuTooltip="Leave Opening Balance Actions"
      />
      {/* Edit Duration Sheet */}
      {edit && (
        <AddUpdateLeaveBalance
          isOpen={edit}
          setIsOpen={setEdit}
          id={currentId}
          data={transformedData}
          reload={reloadData}
        />
      )}

      {view && (
        <ViewOpeningBalanceDetail
          isOpen={view}
          setIsOpen={setView}
          currentId={currentId}
          reloadData={reloadData}
          DataList={transformedDataList}
        />
      )}
    </>
  );
};

export default OpeningBalanceAction;
