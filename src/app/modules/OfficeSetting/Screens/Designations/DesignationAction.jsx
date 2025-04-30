import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../../src/@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDesignationForm from "./AddDesignationForm";
import SheetComponent from "components/ui/SheetComponent";
import ViewDepartment from "../Departments/ViewDepartment";
import ViewDesignation from "./ViewDesignation";
import ActionButtons from "components/ActionButtons";

const DesignationAction = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteDesignation, setDeleteDesignation] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Designation",
    description: null,
    footer: null,
  };

  const handleEdit = (data) => {
    console.log("Edit button clicked for designation:", data);
    // Make sure we have all required fields, especially the ID
    if (!data.id) {
      console.error("Cannot edit: Missing ID in the data", data);
      return;
    }
    
    // Ensure we create a clean object with all needed properties
    setEdit({
      open: true,
      data: {
        id: data.id,
        name: data.name || "",
        description: data.description || "",
        organization: data.organization,
        created_at: data.created_at,
        updated_at: data.updated_at
      },
    });
  };

  const handleView = (data) => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleDelete = (data) => {
    setDeleteDesignation({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(
        `/designation/${deleteDesignation?.data?.id}`,
        deleteDesignation?.data?.name
      );
      if (typeof reload === 'function') {
        reload();
      } else {
        console.error("Reload is not a function:", reload);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <>
      <ActionButtons 
        onView={() => handleView(data)}
        onEdit={() => handleEdit(data)}
        onDelete={() => handleDelete(data)}
        viewTooltip="View Designation Details"
        editTooltip="Edit Designation"
        deleteTooltip="Delete Designation"
      />
      {deleteDesignation?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteDesignation?.open}
          setIsOpen={(isOpen) =>
            setDeleteDesignation((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteDesignation(null);
          }}
        />
      )}

      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit?.open}
          setIsOpen={(isOpen) => {
            console.log("Setting edit sheet open state to:", isOpen);
            setEdit((prev) => ({ ...prev, open: isOpen }));
          }}
          width="568px"
        >
          <AddDesignationForm
            isOpen={edit.open}
            setIsOpen={(isOpen) => {
              console.log("Setting form open state to:", isOpen);
              setEdit((prev) => ({ ...prev, open: isOpen }));
            }}
            edit={edit}
            setEdit={setEdit}
            reload={reload}
          />
        </SheetComponent>
      )}
      {view?.visible && (
        <ViewDesignation
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

export default DesignationAction;
