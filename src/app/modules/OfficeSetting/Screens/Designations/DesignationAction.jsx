import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDesignationForm from "./AddDesignationForm";
import ViewDesignation from "./ViewDesignation";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const DesignationAction = ({ data, reload, DesignationList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteDesignation, setDeleteDesignation] = useState(null);
  const permissions = useOfficeSettingPermissions();

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
      <DropdownActionMenu 
        onView={permissions.designations.canView ? () => handleView(data) : null}
        onEdit={permissions.designations.canUpdate ? () => handleEdit(data) : null}
        onDelete={permissions.designations.canDelete ? () => handleDelete(data) : null}
        viewText="View Designation"
        editText="Edit Designation"
        deleteText="Delete Designation"
        menuTooltip="Designation Actions"
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
        <AddDesignationForm
          isOpen={edit.open}
          setIsOpen={(isOpen) => {
            console.log("Setting edit sheet open state to:", isOpen);
            setEdit((prev) => ({ ...prev, open: isOpen }));
          }}
          edit={edit}
          reloadData={reload}
        />
      )}
      
      {view?.visible && (
        <ViewDesignation
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          DesignationList={DesignationList}
        />
      )}
    </>
  );
};

export default DesignationAction;
