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

const ShiftActions = ({ data }) => {
  const [view, setView] = useState(null);
  const [deleteShift, setDeleteShift] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Department",
    description: null,
    footer: null,
  };

  const handleView = (data) => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = (data) => {
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = (data) => {
    setDeleteShift({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(
        `/shift/${deleteShift?.data?.id}`,
        deleteShift?.data?.name
      );
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(data)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleView(data)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(data)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            edit={edit}
            setEdit={setEdit}
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
