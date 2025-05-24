import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDesignationForm from "./AddDesignationForm";
import axios from "axios";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

const ViewDesignation = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDesignation, setEditDesignation] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

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
      const response = await axios.get(`${baseUrl}/designation/${viewData.id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.data) {
        setViewData(response.data);
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

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/designation/${viewData?.id}`, viewData?.name);
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
      const response = await axios.get(`${baseUrl}/designation/${viewData.id}`);
      if (response.data) {
        console.log("Fetched updated designation data:", response.data);
        setViewData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated designation data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditDesignation(false);
    
    if (updated) {
      await refreshData();
      // Also reload the table
      if (typeof reload === 'function') {
        reload(true);
      }
      // Keep view sheet open after successful update
    }
  };

  const handleFormUpdate = async (formData) => {
    // This function will be called after successful form submission
    console.log("Designation updated with data:", formData);
    // Ensure organization field is preserved
    setViewData({
      ...viewData,
      ...formData,
      organization: formData.organization || viewData.organization
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
        <div className="flex items-center justify-end pb-4 mb-4 border-b border-gray-200">
        
          <CircularActionButtons 
            onEdit={handleEdit}
            onDelete={handleDelete}
            editTooltip="Edit Designation"
            deleteTooltip="Delete Designation"
          />
        </div>

        <DetailCard detailCardTitle="Designation Details" date={viewData?.created_at} dateTitle="Created At">
          <DetailBox label="Name" value={viewData?.name} />
          <DetailBox label="Description" value={viewData?.description} />
          {/* <DetailBox label="Organization" value={viewData?.organization} /> */}
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

      {editDesignation && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editDesignation}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddDesignationForm
            isOpen={editDesignation}
            setIsOpen={handleEditClose}
            edit={viewData}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewDesignation;
