import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import SheetComponent from "components/ui/SheetComponent";
import ViewShift from "./ViewShift";
import AddShiftForm from "./AddShiftForm";
import ActionButtons from "components/ActionButtons";

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
      <ActionButtons 
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewTooltip="View Shift Details"
        editTooltip="Edit Shift"
        deleteTooltip="Delete Shift"
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
