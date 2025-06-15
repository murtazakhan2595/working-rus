import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewOffsetLeaveSetting, AddUpdateOffsetLeave } from "app/modules/LeaveTracker";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";

const OffsetLeaveSettingAction = ({ data, reloadData = () => {}, DataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteDurationState, setDeleteDurationState] = useState(null);

  // Handle opening the view dialog
  const handleView = () => {
    setView(true);
  };

  // Handle opening the edit form
  const handleEdit = () => {
    setEdit(true);
  };

  // Handle delete
  const handleDelete = () => {
    setDeleteDurationState({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/holidays/${data.id}`, `${data.name} Holiday`);
      setDeleteDurationState(null);
      // Ensure table is reloaded by calling reload function
      reloadData(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Offset Setting"
        editText="Edit Offset Setting"
        deleteText="Delete Offset Setting"
        menuTooltip="Holiday Offset Setting"
      />

      {deleteDurationState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with "${data?.name}" holiday will be lost.`}
          isOpen={deleteDurationState.open}
          setIsOpen={(isOpen) =>
            setDeleteDurationState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {/* Edit Duration Sheet */}
      {edit && (
        <AddUpdateOffsetLeave
          isOpen={edit}
          setIsOpen={setEdit}
          id={data.id}
          reloadData={reloadData}
        />
      )}

      {/* View Duration - Direct component usage like ViewUserRole */}
      {view && (
        <ViewOffsetLeaveSetting
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

export default OffsetLeaveSettingAction;
