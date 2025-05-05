import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddOnboardingForm from "./AddOnboardingForm";
import axios from "axios";

const ViewOnboarding = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDocument, setEditDocument] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

  const formSheetData = {
    triggerText: null,
    title: "View Document Details",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Document",
    description: null,
    footer: null,
  };

  const handleEdit = () => {
    setEditDocument(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/onboarding-document/${viewData?.id}`, viewData?.name);
      setIsOpen(false);
      if (typeof reload === 'function') {
        reload(true);
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(`/onboarding-document/${viewData.id}`);
      if (response.data) {
        console.log("Fetched updated document data:", response.data);
        setViewData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated document data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditDocument(false);
    
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
    console.log("Document updated with data:", formData);
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
            editTooltip="Edit Document"
            deleteTooltip="Delete Document"
          />
        </div>
        <DetailCard detailCardTitle="Document Details" date={viewData?.created_at}>
          <DetailBox label="Document Name" value={viewData?.name} />
        </DetailCard>
      </SheetComponent>

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={openDeleteAlert}
          setIsOpen={(isOpen) => setOpenDeleteAlert(isOpen)}
          handleContinue={() => {
            confirmDelete();
            setOpenDeleteAlert(false);
          }}
        />
      )}

      {editDocument && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editDocument}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddOnboardingForm
            isOpen={editDocument}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: viewData }}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewOnboarding;
