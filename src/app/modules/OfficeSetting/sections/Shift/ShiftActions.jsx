import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import SheetComponent from "components/ui/SheetComponent";
import ViewShift from "./ViewShift";
import AddShiftForm from "./AddShiftForm";
import DropdownActionMenu from "components/DropdownActionMenu";

const ShiftActions = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [deleteShift, setDeleteShift] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Shift Details",
    description: null,
    footer: null,
  };

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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        <SheetComponent
          {...formSheetData}
          isOpen={edit?.open}
          setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
          width="568px"
        >
          <AddShiftForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            shiftData={edit.data}
            setEdit={setEdit}
            reload={reload}
          />
        </SheetComponent>
      )}

      {view?.visible && (
        <ViewShift
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
        />
      )}
    </>
  );
};

export default ShiftActions;
