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

const OnboardingActions = ({ data, reload }) => {
  console.log("DATA", data);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Document Details",
    description: null,
    footer: null,
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
      const response = await deleteOnboardingDocument(deleteDocument.data.id);
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
          <DropdownMenuItem onClick={() => setIsEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsView(true)}>
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

      {isEdit && <AddOnboardingForm isOpen={isEdit} setIsOpen={setIsEdit} onboardingItem={data}/>}

      {isView && (
        <ViewOnboarding
          isOpen={isView}
          setIsOpen={setIsView
          }
          data={data}
        />
      )}
    </>
  );
};

export default OnboardingActions;
