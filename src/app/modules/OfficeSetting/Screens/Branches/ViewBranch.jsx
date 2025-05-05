import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddBranchForm from "./AddBranchForm";
import CircularActionButtons from "components/CircularActionButtons";
import axios from "axios";

const ViewBranch = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [EditBranch, setEditBranch] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

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
      await deleteRecord(`/branch/${viewData?.id}`, viewData?.branch_name);
      setIsOpen(false);
      reload(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(`/branch/${viewData.id}`);
      if (response.data) {
        console.log("Fetched updated branch data:", response.data);
        setViewData(response.data);
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
    console.log("Branch updated with data:", formData);
    setViewData({
      ...viewData,
      ...formData
    });
    return true;
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={(open) => {
          setIsOpen(open);
          if (!open && typeof reload === 'function') {
            reload(true); // Ensure table is reloaded when view is closed
          }
        }}
        width="568px"
      >
        <div className="flex justify-end mb-4 space-x-2">
          <CircularActionButtons 
            onEdit={handleEdit}
            onDelete={handleDelete}
            editTooltip="Edit Branch"
            deleteTooltip="Delete Branch"
          />
        </div>
        <DetailCard detailCardTitle="Branch Details" date={viewData?.created_at} dateTitle="Created At">
          <DetailBox label="Id" value={viewData?.id} />
          <DetailBox label="Name" value={viewData?.branch_name} />
          <DetailBox label="Branch Number" value={viewData?.branch_number} />
          <DetailBox label="Address" value={viewData?.branch_address} />
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
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddBranchForm
            setIsOpen={handleEditClose}
            editMode={true}
            reload={reload}
            branchData={viewData}
            onUpdateSuccess={handleFormUpdate}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewBranch;
