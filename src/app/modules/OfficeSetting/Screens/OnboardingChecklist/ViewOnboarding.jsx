import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddOnboardingForm from "./AddOnboardingForm";
import axios from "axios";
import { ViewDetailSheetCardExtension } from "components";

const ViewOnboarding = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  OnboardingList = []
}) => {
  console.log("📋 ViewOnboarding render - isOpen:", isOpen);
  
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDocument, setEditDocument] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(data);
  const [currentDocumentId, setCurrentDocumentId] = useState(data?.id);

  // Track when main setIsOpen might be called
  const wrappedSetIsOpen = (value) => {
    console.log("📋 Main ViewOnboarding setIsOpen called with:", value);
    setIsOpen(value);
  };

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentDocument(data);
      setCurrentDocumentId(data.id);
    }
  }, [isOpen]);

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

  const handleNext = () => {
    // Ensure OnboardingList is an array
    const validList = Array.isArray(OnboardingList) ? OnboardingList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDocumentId
    );
    if (currentIndex < validList.length - 1) {
      const nextDocument = validList[currentIndex + 1];
      setCurrentDocumentId(nextDocument?.id);
      setCurrentDocument(nextDocument);
    } else {
      // Loop to first item
      const firstDocument = validList[0];
      setCurrentDocumentId(firstDocument?.id);
      setCurrentDocument(firstDocument);
    }
  };

  const handlePrevious = () => {
    // Ensure OnboardingList is an array
    const validList = Array.isArray(OnboardingList) ? OnboardingList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDocumentId
    );
    if (currentIndex > 0) {
      const prevDocument = validList[currentIndex - 1];
      setCurrentDocumentId(prevDocument?.id);
      setCurrentDocument(prevDocument);
    } else {
      // Loop to last item
      const lastDocument = validList[validList.length - 1];
      setCurrentDocumentId(lastDocument?.id);
      setCurrentDocument(lastDocument);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/onboarding-document/${currentDocument?.id}`, currentDocument?.name);
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
      const response = await axios.get(`/onboarding-document/${currentDocumentId}`);
      if (response.data) {
        setCurrentDocument(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated document data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    console.log("📋 handleEditClose called with updated:", updated);
    console.log("📋 Before: editDocument =", editDocument, "isOpen =", isOpen);
    
    setEditDocument(false);
    console.log("📋 Edit sheet closed, editDocument set to false");
    
    if (updated) {
      console.log("📋 Update detected, refreshing data...");
      await refreshData();
      console.log("📋 Data refreshed");
      
      // Also reload the table
      if (typeof reload === 'function') {
        console.log("📋 Calling reload(true)...");
        reload(true);
        console.log("📋 Reload called");
      }
      console.log("📋 View sheet should remain open");
    }
    
    console.log("📋 handleEditClose completed");
  };

  const handleFormUpdate = async (formData) => {
    // This function will be called after successful form submission
    setCurrentDocument({
      ...currentDocument,
      ...formData
    });
    return true;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={wrappedSetIsOpen}
        title="Document Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Document"
              deleteTooltip="Delete Document"
            />
          </div>

          <DetailCard detailCardTitle="Document Details" date={currentDocument?.created_at}>
            <DetailBox label="Document Name" value={currentDocument?.name} />
          </DetailCard>
        </div>
      </ViewDetailSheetCardExtension>

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
        <ViewDetailSheetCardExtension
          isOpen={editDocument}
          setIsOpen={handleEditClose}
          title="Update Document"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddOnboardingForm
            isOpen={editDocument}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: currentDocument }}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}
    </>
  );
};

export default ViewOnboarding;
