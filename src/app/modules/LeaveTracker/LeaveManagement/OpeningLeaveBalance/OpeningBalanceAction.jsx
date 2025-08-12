import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewHolidayDetail } from "app/modules/LeaveTracker";
import { toast } from "react-toastify";
// import { deleteRecord } from "app/hooks/general";
import AddUpdateLeaveBalance from "./AddUpdateLeaveBalance";
import ViewOpeningBalanceDetail from "./ViewOpeningBalanceDetail";

const OpeningBalanceAction = ({ data, reloadData = () => {}, DataList = [] }) => {
  console.log("OpeningBalanceAction Data", data);
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  // const [deleteDurationState, setDeleteDurationState] = useState(null);

  // Handle opening the view dialog
  const handleView = () => {
    setView(true);
  };

  // Handle opening the edit form
  const handleEdit = () => {
    setEdit(true);
  };

  // Handle delete
  // const handleDelete = () => {
  //   setDeleteDurationState({
  //     open: true,
  //     data: data,
  //   });
  // };

  // const confirmDelete = async () => {
  //   try {
  //     await deleteRecord(`/leave-openingbalance/${data.id}`, `${data.name} Leave Opening Balance`);
  //     setDeleteDurationState(null);
  //     // Ensure table is reloaded by calling reload function
  //     reloadData(true);
  //   } catch (error) {
  //     console.error("ERROR", error);
  //   }
  // };

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

      {/* {deleteDurationState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with this leave opening balance will be lost.`}
          isOpen={deleteDurationState.open}
          setIsOpen={(isOpen) =>
            setDeleteDurationState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )} */}

      {/* Edit Duration Sheet */}
      {edit && (
        <AddUpdateLeaveBalance
          isOpen={edit}
          setIsOpen={setEdit}
          id={data.id}
          data={data}
          reload={reloadData}
        />
      )}

      {view && (
        <ViewOpeningBalanceDetail
          isOpen={view}
          setIsOpen={setView}
          currentId={data.id}
          reloadData={reloadData}
          DataList={DataList}
        />
      )}
    </>
  );
};

export default OpeningBalanceAction;
