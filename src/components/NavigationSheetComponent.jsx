import React, { useState, useEffect } from "react";
import { ViewDetailSheetCardExtension, PageLoader } from "components";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import axios from "axios";

const NavigationSheetComponent = ({
  // Main sheet props
  isOpen,
  setIsOpen,
  title,
  currentItem_Id,
  dataList = [],
  reloadData = () => {},
  allowEdit = true,
  allowDelete = true,
  ForceItemLoad = false, //forceLoad  the Item in case of updation

  // Content and actions
  children,
  editComponent: EditComponent,

  // API endpoints
  apiEndpoint,

  // Data functions
  fetchCurrentItemDetails = async () => {},

  // Labels and text
  deleteItemName = "item",
  editTooltip = "Edit Item",
  deleteTooltip = "Delete Item",

  // Callbacks
  additionalEditProps = {},
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [currentItemId, setCurrentItemId] = useState(currentItem_Id);
  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && currentItemId) {
      setCurrentItemId(currentItemId);
    }
  }, [isOpen, currentItemId]);

  useEffect(() => {
    let isMounted = true;
    if (currentItemId) {
      ReloadCurrentItemDetails(currentItemId, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [currentItemId, ForceItemLoad]);

  const handleNext = () => {
    // Ensure dataList is an array
    const validList = Array.isArray(dataList) ? dataList : [];
    if (validList.length === 0) return;

    const currentIndex = validList.findIndex(
      (item) => item.id === currentItemId
    );

    if (currentIndex < validList.length - 1) {
      const nextItem = validList[currentIndex + 1];
      setCurrentItemId(nextItem?.id);
    } else {
      // Loop to first item
      const firstItem = validList[0];
      setCurrentItemId(firstItem?.id);
    }
  };

  const handlePrevious = () => {
    // Ensure dataList is an array
    const validList = Array.isArray(dataList) ? dataList : [];
    if (validList.length === 0) return;

    const currentIndex = validList.findIndex(
      (item) => item.id === currentItemId
    );

    if (currentIndex > 0) {
      const prevItem = validList[currentIndex - 1];
      setCurrentItemId(prevItem?.id);
    } else {
      // Loop to last item
      const lastItem = validList[validList.length - 1];
      setCurrentItemId(lastItem?.id);
    }
  };

  const ReloadCurrentItemDetails = async (id, isMounted = true) => {
    try {
      setIsLoading(true);
      const currentItem = await fetchCurrentItemDetails(id, isMounted);
      setCurrentItem(currentItem);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      // Check if required values exist
      if (!apiEndpoint || !currentItemId) {
        console.warn(
          "Missing required data: API endpoint or item ID is not defined."
        );
        return;
      }
      const deleteAPI = apiEndpoint.replace("${id}", currentItemId);
      // Check if deleteAPI is still valid after replacement
      if (!deleteAPI.includes(currentItemId)) {
        console.error("Invalid API endpoint after replacement.");
        return;
      }
      const itemName =
        currentItem?.[deleteItemName] || deleteItemName || "Item";
      // Call the delete function
      await deleteRecord(deleteAPI, itemName);
      // Close the modal
      setIsOpen(false);
      // Refresh data if applicable
      if (typeof reloadData === "function") {
        reloadData(true);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Generate position indicator
  const getPositionIndicator = () => {
    if (!Array.isArray(dataList) || dataList.length === 0) return null;

    const currentIndex = dataList.findIndex(
      (item) => item.id === currentItemId
    );
    return `${currentIndex + 1} of ${dataList.length}`;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        positionIndicator={getPositionIndicator()}
      >
        {isLoading ? (
          <PageLoader height={"100vh"} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end mt-4 space-x-2">
              <CircularActionButtons
                onEdit={allowEdit ? handleEdit : null}
                onDelete={allowDelete ? handleDelete : null}
                editTooltip={allowEdit ? editTooltip : null}
                deleteTooltip={allowDelete ? deleteTooltip : null}
              />
            </div>

            {/* Render children with current item data (removed positionIndicator) */}
            {React.cloneElement(children, {
              currentItem,
            })}
          </div>
        )}
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

      {editMode && EditComponent && (
        <EditComponent
          isOpen={editMode}
          setIsOpen={() => {
            setEditMode(false);
            ReloadCurrentItemDetails(currentItemId, true);
          }}
          reloadData={() => {
            ReloadCurrentItemDetails(currentItemId, true);
          }}
          id={currentItemId}
          {...additionalEditProps}
        />
      )}
    </>
  );
};

export default NavigationSheetComponent;
