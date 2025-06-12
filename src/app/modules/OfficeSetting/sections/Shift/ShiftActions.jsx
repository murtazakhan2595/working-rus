import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import ViewShift from "./ViewShift";
import AddShiftForm from "./AddShiftForm";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const ShiftActions = ({ data, reload, ShiftList = [] }) => {
  const [view, setView] = useState(null);
  const [deleteShift, setDeleteShift] = useState(null);
  const [edit, setEdit] = useState(null);
  const permissions = useOfficeSettingPermissions();

  const handleView = (event) => {
    event.preventDefault();
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = (event) => {
    event.preventDefault();
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    setDeleteShift({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteRecord(
        `/shift/${deleteShift?.data?.id}`,
        deleteShift?.data?.name
      );
      if (response) {
        reload();
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={permissions.shift.canView ? handleView : null}
        onEdit={permissions.shift.canUpdate ? handleEdit : null}
        onDelete={permissions.shift.canDelete ? handleDelete : null}
        viewText="View Shift"
        editText="Edit Shift"
        deleteText="Delete Shift"
        menuTooltip="Shift Actions"
      />
      
      {deleteShift?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteShift.open}
          setIsOpen={(isOpen) =>
            setDeleteShift((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteShift(null);
          }}
        />
      )}

      {edit?.open && (
        <AddShiftForm
          isOpen={edit.open}
          setIsOpen={() => {
            reload(true);
            setEdit(null);
          }}
          id={data.id}
        />
      )}

      {view?.visible && (
        <ViewShift
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          currentId={view?.data?.id}
          reloadData={reload}
          DataList={ShiftList}
        />
      )}
    </>
  );
};

export default ShiftActions;
