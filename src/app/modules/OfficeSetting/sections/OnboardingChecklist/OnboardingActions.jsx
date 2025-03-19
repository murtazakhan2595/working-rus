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

const OnboardingActions = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [deleteDocument, setDeleteDocument] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Document Details",
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
    setDeleteDocument({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await deleteRecord(
        `/onboarding-document/${deleteDocument?.data?.id}`,
        deleteDocument?.data?.name
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

      {deleteDocument?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this document will be lost."
          isOpen={deleteDocument.open}
          setIsOpen={(isOpen) =>
            setDeleteDocument((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteDocument(null);
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
