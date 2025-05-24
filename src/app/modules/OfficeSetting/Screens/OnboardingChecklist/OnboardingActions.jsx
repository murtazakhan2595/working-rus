import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import ViewOnboarding from "./ViewOnboarding";
import AddOnboardingForm from "./AddOnboardingForm";
import { deleteOnboardingDocument } from "app/hooks/officeSetting";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewDetailSheetCardExtension } from "components";

const OnboardingActions = ({ data, reload, OnboardingList = [] }) => {
  const [view, setView] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Document",
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
        `/onboarding-document/${deleteDept?.data?.id}`,
        deleteDept?.data?.name
      );
      reload();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleFormUpdate = async (formData) => {
    console.log("Document updated with data:", formData);
    return true;
  };

  return (
    <>
      <DropdownActionMenu 
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Document"
        editText="Edit Document"
        deleteText="Delete Document"
        menuTooltip="Document Actions"
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
          title="Update Document"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddOnboardingForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            edit={edit}
            setEdit={setEdit}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}

      {view?.visible && (
        <ViewOnboarding
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          OnboardingList={OnboardingList}
        />
      )}
    </>
  );
};

export default OnboardingActions;
