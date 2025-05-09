import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import moment from "moment"; // Ensure moment is installed and imported
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddShiftForm from "./AddShiftForm";
import axios from "axios";

const ViewShift = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editShift, setEditShift] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

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

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/shift/${viewData?.id}`, viewData?.name);
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
      const response = await axios.get(`/shift/${viewData.id}`);
      if (response.data) {
        setViewData(response.data);
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
            editTooltip="Edit Shift"
            deleteTooltip="Delete Shift"
          />
        </div>
        <DetailCard detailCardTitle="Shift Details" date={viewData?.created_at}>
          <DetailBox label="Name" value={viewData?.name} />
          <DetailBox label="Shift Type" value={viewData?.type} />
          <DetailBox label="Start Time" value={formatTime(viewData?.starttime)} />
          <DetailBox label="End Time" value={formatTime(viewData?.endtime)} />
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

      {editShift && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editShift}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddShiftForm
            isOpen={editShift}
            setIsOpen={handleEditClose}
            shiftData={viewData}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewShift;
