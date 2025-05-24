import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import moment from "moment"; // Ensure moment is installed and imported
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddShiftForm from "./AddShiftForm";
import axios from "axios";
import { ViewDetailSheetCardExtension } from "components";

const ViewShift = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {}, 
  ShiftList = [] 
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editShift, setEditShift] = useState(false);
  const [currentShift, setCurrentShift] = useState(data);
  const [currentShiftId, setCurrentShiftId] = useState(data?.id);

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentShift(data);
      setCurrentShiftId(data.id);
    }
  }, [isOpen]);

  const formSheetData = {
    triggerText: null,
    title: "View Shift Details",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Shift Details",
    description: null,
    footer: null,
  };

  // Helper function to format time
  const formatTime = (utcTime) => {
    return utcTime ? moment.utc(utcTime).local().format("hh:mm A") : "N/A";
  };

  const handleEdit = () => {
    setEditShift(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleNext = () => {
    // Ensure ShiftList is an array
    const validList = Array.isArray(ShiftList) ? ShiftList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentShiftId
    );
    
    if (currentIndex < validList.length - 1) {
      const nextShift = validList[currentIndex + 1];
      setCurrentShiftId(nextShift?.id);
      setCurrentShift(nextShift);
    } else {
      // Loop to first item
      const firstShift = validList[0];
      setCurrentShiftId(firstShift?.id);
      setCurrentShift(firstShift);
    }
  };

  const handlePrevious = () => {
    // Ensure ShiftList is an array
    const validList = Array.isArray(ShiftList) ? ShiftList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentShiftId
    );
    if (currentIndex > 0) {
      const prevShift = validList[currentIndex - 1];
      setCurrentShiftId(prevShift?.id);
      setCurrentShift(prevShift);
    } else {
      // Loop to last item
      const lastShift = validList[validList.length - 1];
      setCurrentShiftId(lastShift?.id);
      setCurrentShift(lastShift);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/shift/${currentShift?.id}`, currentShift?.name);
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
      const response = await axios.get(`/shift/${currentShiftId}`);
      if (response.data) {
        setCurrentShift(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated shift data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditShift(false);
    
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
    setCurrentShift({
      ...currentShift,
      ...formData
    });
    return true;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Shift Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Shift"
              deleteTooltip="Delete Shift"
            />
          </div>

          <DetailCard detailCardTitle="Shift Details" date={currentShift?.created_at} dateTitle="Created At">
            <DetailBox label="Name" value={currentShift?.name} />
            <DetailBox label="Shift Type" value={currentShift?.type} />
            <DetailBox label="Start Time" value={formatTime(currentShift?.starttime)} />
            <DetailBox label="End Time" value={formatTime(currentShift?.endtime)} />
            {ShiftList.length > 0 && (
              <DetailBox 
                label="Position" 
                value={`${(Array.isArray(ShiftList) ? ShiftList.findIndex(item => item.id === currentShiftId) : -1) + 1} of ${Array.isArray(ShiftList) ? ShiftList.length : 0}`} 
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

      {editShift && (
        <ViewDetailSheetCardExtension
          isOpen={editShift}
          setIsOpen={handleEditClose}
          title="Update Shift"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddShiftForm
            isOpen={editShift}
            setIsOpen={handleEditClose}
            shiftData={currentShift}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}
    </>
  );
};

export default ViewShift;
