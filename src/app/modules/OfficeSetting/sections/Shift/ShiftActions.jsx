import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import ViewShift from "./ViewShift";
import AddShiftForm from "./AddShiftForm";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewDetailSheetCardExtension } from "components";

const ShiftActions = ({ data, reload, ShiftList = [] }) => {
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

  const handleFormUpdate = async (formData) => {
    console.log("Shift updated with data:", formData);
    return true;
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
        <ViewDetailSheetCardExtension
          isOpen={edit?.open}
          setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
          title="Update Shift"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddShiftForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            shiftData={edit.data}
            setEdit={setEdit}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}

      {view?.visible && (
        <ViewShift
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          ShiftList={ShiftList}
        />
      )}
    </>
  );
};

export default ShiftActions;
