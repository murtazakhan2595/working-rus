import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState } from "react";
import ActionButtons from "components/ActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddBranchForm from "./AddBranchForm";

const ViewBranch = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [EditBranch, setEditBranch] = useState(false);

  const formSheetData = {
    triggerText: null,
    title: "View Branch",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Branch",
    description: null,
    footer: null,
  };

  const handleEdit = () => {
    setEditBranch(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/branch/${data?.id}`, data?.branch_name);
      setIsOpen(false);
      reload(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="568px"
      >
        <div className="flex justify-end mb-4 space-x-2">
          <ActionButtons 
            onEdit={handleEdit}
            onDelete={handleDelete}
            hideView={true}
            editTooltip="Edit Branch"
            deleteTooltip="Delete Branch"
          />
        </div>
        <DetailCard detailCardTitle="Branch Details" date={data?.created_at} dateTitle="Created At">
          <DetailBox label="Id" value={data?.id} />
          <DetailBox label="Name" value={data?.branch_name} />
          <DetailBox label="Branch Number" value={data?.branch_number} />
          <DetailBox label="Address" value={data?.branch_address} />
          {/* <DetailBox label="Parent Department" value={data?.parent_department} /> */}
        </DetailCard>
      </SheetComponent>

      {OpenDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={OpenDeleteAlert}
          setIsOpen={(isOpen) => setOpenDeleteAlert(isOpen)}
          handleContinue={() => {
            confirmDelete();
            setOpenDeleteAlert(false);
          }}
        />
      )}

      {EditBranch && (
        <SheetComponent
          {...updateSheetData}
          isOpen={EditBranch}
          setIsOpen={setEditBranch}
          width="568px"
        >
          <AddBranchForm
            setIsOpen={setEditBranch}
            editMode={true}
            reload={reload}
            branchData={data}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewBranch;
