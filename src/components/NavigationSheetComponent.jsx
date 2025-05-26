import React, { useState, useEffect } from "react";
import { ViewDetailSheetCardExtension } from "components";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import axios from "axios";

const NavigationSheetComponent = ({
  // Main sheet props
  isOpen,
  setIsOpen,
  title,
  data,
  currentItemDetails,
  dataList = [],
  reloadData = () => {},
  loading = false,

  // Content and actions
  children,
  editComponent: EditComponent,

  // API endpoints
  apiEndpoint,
  refreshEndpoint,

  // Data functions
  fetchCurrentItemDetails = () => {},

  // Labels and text
  deleteItemName = "item",
  editTooltip = "Edit Item",
  deleteTooltip = "Delete Item",

  // Callbacks
  onUpdateSuccess = null,
  additionalEditProps = {},
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(currentItemDetails);
  const [currentItemId, setCurrentItemId] = useState(currentItemDetails?.id);
  console.log(currentItem, "currentItemDetailscurrentItemDetails");
  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && currentItemDetails) {
      setCurrentItem(currentItemDetails);
      setCurrentItemId(currentItemDetails.id);
      // if (DataList && Array.isArray(DataList) && DataList.length) {
      //   const updatedList = DataList.map((item) =>
      //     item.id === currentItemDetails.id ? currentItemDetails : item
      //   );
      //   setDataList(updatedList)
      // }
    }
  }, [isOpen, currentItemDetails]);

  const handleEdit = async () => {
    // Fetch fresh data before opening edit form if refresh endpoint provided
    if (refreshEndpoint) {
      try {
        const response = await axios.get(
          `${refreshEndpoint}/${currentItemId}`,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setCurrentItem(response.data);
        }
      } catch (error) {
        console.warn("Failed to fetch fresh data, using cached data:", error);
      }
    }

    setEditMode(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

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
      setCurrentItem(nextItem);
    } else {
      // Loop to first item
      const firstItem = validList[0];
      setCurrentItemId(firstItem?.id);
      setCurrentItem(firstItem);
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
      setCurrentItem(prevItem);
    } else {
      // Loop to last item
      const lastItem = validList[validList.length - 1];
      setCurrentItemId(lastItem?.id);
      setCurrentItem(lastItem);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(
        `${apiEndpoint}${currentItem.id}`,
        currentItem?.[deleteItemName] || deleteItemName
      );
      setIsOpen(false);
      if (typeof reloadData === "function") {
        reloadData(true);
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const refreshData = async () => {
    if (!refreshEndpoint) return;

    try {
      const response = await axios.get(`${refreshEndpoint}/${currentItemId}`);
      if (response.data) {
        setCurrentItem(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditMode(false);
    if (updated) {
      await refreshData();
      // Note: No reloadData() call for edit operations to prevent parent component refresh
    }
  };

  const handleDataListUpdate = async (formData) => {};

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
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip={editTooltip}
              deleteTooltip={deleteTooltip}
            />
          </div>

          {/* Render children with current item data (removed positionIndicator) */}
          {React.cloneElement(children, {
            currentItem,
          })}
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

      {editMode && EditComponent && (
        <EditComponent
          isOpen={editMode}
          setIsOpen={handleEditClose}
          reloadData={() => {
            fetchCurrentItemDetails(currentItemId, true);
          }}
          id={currentItemId}
          edit={{ open: true, data: currentItem }}
          setEdit={() => {}}
          onUpdateSuccess={handleDataListUpdate}
          // Special handling for different form prop patterns
          editMode={true}
          branchData={currentItem}
          shiftData={currentItem}
          {...additionalEditProps}
        />
      )}
    </>
  );
};

export default NavigationSheetComponent;
