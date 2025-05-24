import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import { useState, useEffect } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddBranchForm from "./AddBranchForm";
import CircularActionButtons from "components/CircularActionButtons";
import axios from "axios";
import { ViewDetailSheetCardExtension } from "components";

const ViewBranch = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  BranchList = []
}) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [EditBranch, setEditBranch] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(data);
  const [currentBranchId, setCurrentBranchId] = useState(data?.id);

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentBranch(data);
      setCurrentBranchId(data.id);
    }
  }, [isOpen]);

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

  const handleNext = () => {
    // Ensure BranchList is an array
    const validList = Array.isArray(BranchList) ? BranchList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentBranchId
    );
    if (currentIndex < validList.length - 1) {
      const nextBranch = validList[currentIndex + 1];
      setCurrentBranchId(nextBranch?.id);
      setCurrentBranch(nextBranch);
    } else {
      // Loop to first item
      const firstBranch = validList[0];
      setCurrentBranchId(firstBranch?.id);
      setCurrentBranch(firstBranch);
    }
  };

  const handlePrevious = () => {
    // Ensure BranchList is an array
    const validList = Array.isArray(BranchList) ? BranchList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentBranchId
    );
    if (currentIndex > 0) {
      const prevBranch = validList[currentIndex - 1];
      setCurrentBranchId(prevBranch?.id);
      setCurrentBranch(prevBranch);
    } else {
      // Loop to last item
      const lastBranch = validList[validList.length - 1];
      setCurrentBranchId(lastBranch?.id);
      setCurrentBranch(lastBranch);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/branch/${currentBranch?.id}`, currentBranch?.branch_name);
      setIsOpen(false);
      reload(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(`/branch/${currentBranchId}`);
      if (response.data) {
        setCurrentBranch(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated branch data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditBranch(false);
    
    if (updated) {
      await refreshData();
      // Also reload the table
      if (typeof reload === 'function') {
        reload(true);
      }
    }
  };

  const handleFormUpdate = async (formData) => {
    // This function will be called after successful form submission
    setCurrentBranch({
      ...currentBranch,
      ...formData
    });
    return true;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Branch Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Branch"
              deleteTooltip="Delete Branch"
            />
          </div>

          <DetailCard detailCardTitle="Branch Details" date={currentBranch?.created_at} dateTitle="Created At">
            <DetailBox label="Id" value={currentBranch?.id} />
            <DetailBox label="Name" value={currentBranch?.branch_name} />
            <DetailBox label="Branch Number" value={currentBranch?.branch_number} />
            <DetailBox label="Address" value={currentBranch?.branch_address} />
          </DetailCard>
        </div>
      </ViewDetailSheetCardExtension>

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
        <ViewDetailSheetCardExtension
          isOpen={EditBranch}
          setIsOpen={handleEditClose}
          title="Update Branch"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddBranchForm
            setIsOpen={handleEditClose}
            editMode={true}
            reload={reload}
            branchData={currentBranch}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}
    </>
  );
};

export default ViewBranch;
