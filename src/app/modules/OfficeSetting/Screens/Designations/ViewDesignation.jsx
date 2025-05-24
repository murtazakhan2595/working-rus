import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDesignationForm from "./AddDesignationForm";
import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { ViewDetailSheetCardExtension } from "components";

const baseUrl = initialState.baseUrl;

const ViewDesignation = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  DesignationList = []
}) => {
  console.log("🏠 ViewDesignation render - isOpen:", isOpen);
  
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDesignation, setEditDesignation] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState(data);
  const [currentDesignationId, setCurrentDesignationId] = useState(data?.id);

  // Track when main setIsOpen might be called
  const wrappedSetIsOpen = (value) => {
    console.log("🏠 Main ViewDesignation setIsOpen called with:", value);
    setIsOpen(value);
  };

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentDesignation(data);
      setCurrentDesignationId(data.id);
    }
  }, [isOpen]);

  const formSheetData = {
    triggerText: null,
    title: "View Designation",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Designation",
    description: null,
    footer: null,
  };

  const handleEdit = async () => {
    try {
      // Fetch fresh data before opening edit form
      const response = await axios.get(`${baseUrl}/designation/${currentDesignationId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.data) {
        setCurrentDesignation(response.data);
      }
    } catch (error) {
      console.warn("Failed to fetch fresh designation data, using cached data:", error);
      // Continue with cached data instead of blocking the edit
    }
    
    setEditDesignation(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleNext = () => {
    // Ensure DesignationList is an array
    const validList = Array.isArray(DesignationList) ? DesignationList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDesignationId
    );
    if (currentIndex < validList.length - 1) {
      const nextDesignation = validList[currentIndex + 1];
      setCurrentDesignationId(nextDesignation?.id);
      setCurrentDesignation(nextDesignation);
    } else {
      // Loop to first item
      const firstDesignation = validList[0];
      setCurrentDesignationId(firstDesignation?.id);
      setCurrentDesignation(firstDesignation);
    }
  };

  const handlePrevious = () => {
    // Ensure DesignationList is an array
    const validList = Array.isArray(DesignationList) ? DesignationList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDesignationId
    );
    if (currentIndex > 0) {
      const prevDesignation = validList[currentIndex - 1];
      setCurrentDesignationId(prevDesignation?.id);
      setCurrentDesignation(prevDesignation);
    } else {
      // Loop to last item
      const lastDesignation = validList[validList.length - 1];
      setCurrentDesignationId(lastDesignation?.id);
      setCurrentDesignation(lastDesignation);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/designation/${currentDesignation?.id}`, currentDesignation?.name);
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
      const response = await axios.get(`${baseUrl}/designation/${currentDesignationId}`);
      if (response.data) {
        setCurrentDesignation(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated designation data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    console.log("🔍 handleEditClose called with updated:", updated);
    console.log("🔍 Before: editDesignation =", editDesignation, "isOpen =", isOpen);
    
    setEditDesignation(false);
    console.log("🔍 Edit sheet closed, editDesignation set to false");
    
    if (updated) {
      console.log("🔍 Update detected, refreshing data...");
      await refreshData();
      console.log("🔍 Data refreshed");
  
      // Also reload the table
      if (typeof reload === 'function') {
        console.log("🔍 Calling reload(true)...");
        reload(true);
        console.log("🔍 Reload called");
      }
      // Keep view sheet open after successful update
      console.log("🔍 View sheet should remain open");
    }
    
    console.log("🔍 handleEditClose completed");
  };

  const handleFormUpdate = async (formData) => {
    // This function will be called after successful form submission
    // Ensure organization field is preserved
    setCurrentDesignation({
      ...currentDesignation,
      ...formData,
      organization: formData.organization || currentDesignation.organization
    });
    return true;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={wrappedSetIsOpen}
        title="Designation Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Designation"
              deleteTooltip="Delete Designation"
            />
          </div>

          <DetailCard detailCardTitle="Designation Details" date={currentDesignation?.created_at} dateTitle="Created At">
            <DetailBox label="Name" value={currentDesignation?.name} />
            <DetailBox label="Description" value={currentDesignation?.description} />
            {DesignationList.length > 0 && (
              <DetailBox 
                label="Position" 
                value={`${(Array.isArray(DesignationList) ? DesignationList.findIndex(item => item.id === currentDesignationId) : -1) + 1} of ${Array.isArray(DesignationList) ? DesignationList.length : 0}`} 
              />
            )}
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

      {editDesignation && (
        <ViewDetailSheetCardExtension
          isOpen={editDesignation}
          setIsOpen={handleEditClose}
          title="Update Designation"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddDesignationForm
            isOpen={editDesignation}
            setIsOpen={handleEditClose}
            edit={currentDesignation}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}
    </>
  );
};

export default ViewDesignation;
