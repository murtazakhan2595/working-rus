import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDepartmentForm from "./AddDepartmentForm";
import ViewDepartment from "./ViewDepartment";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewDetailSheetCardExtension } from "components";
import useUserOrganization from "app/hooks/useUserOrganization";

const DepartmentAction = ({ data, reload, DepartmentList = [] }) => {
  const [view, setView] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [edit, setEdit] = useState(null);
  const userOrganization = useUserOrganization();

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
      
      // Ensure table is reloaded by calling reload function
      if (typeof reload === 'function') {
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
        viewText="View Department"
        editText="Edit Department"
        deleteText="Delete Department"
        menuTooltip="Department Actions"
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
        <ViewDetailSheetCardExtension
          isOpen={edit?.open}
          setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
          title="Update Department"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddDepartmentForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            edit={edit}
            setEdit={setEdit}
            reload={reload}
            userOrganization={userOrganization}
          />
        </ViewDetailSheetCardExtension>
      )}

      {view?.visible && (
        <ViewDepartment
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          DepartmentList={DepartmentList}
        />
      )}
    </>
  );
};

export default DepartmentAction;
