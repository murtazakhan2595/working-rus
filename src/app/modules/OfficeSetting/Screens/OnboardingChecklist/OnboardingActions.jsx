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
import ViewOnboarding from "./ViewOnboarding";
import AddOnboardingForm from "./AddOnboardingForm";
import { deleteOnboardingDocument } from "app/hooks/officeSetting";
import ActionButtons from "components/ActionButtons";

const OnboardingActions = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Department",
    description: null,
    footer: null,
  };

  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = () => {
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = () => {
    setDeleteDept({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(
        `/department/${deleteDept?.data?.id}`,
        deleteDept?.data?.name
      );
      reload();
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
        viewTooltip="View Document Details"
        editTooltip="Edit Document"
        deleteTooltip="Delete Document"
      />

      {deleteDept?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteDept.open}
          setIsOpen={(isOpen) =>
            setDeleteDept((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteDept(null);
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
          <AddOnboardingForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            edit={edit}
            setEdit={setEdit}
            reload={reload}
          />
        </SheetComponent>
      )}

      {view?.visible && (
        <ViewOnboarding
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

export default OnboardingActions;
