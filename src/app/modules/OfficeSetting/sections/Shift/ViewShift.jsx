import React, { useState } from "react";
import { ViewDetailSheetCardExtension, PageLoader } from "components";    
import { DetailContent } from "components";
import AddShiftForm from "./AddShiftForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getShiftById } from "app/hooks/general";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const ViewShift = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Define the fields to display
  const fields = [
    {
      title: "Shift Details",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell) => <FormatID value={cell} prefix={"SH-"} />,
        },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        {
          key: "starttime",
          label: "Start Time",
          formatter: (cell) => formatTime(cell),
        },
        {
          key: "endtime",
          label: "End Time",
          formatter: (cell) => formatTime(cell),
        },
        { 
          key: "weekdays", 
          label: "Week Days",
          formatter: (cell) => {
            if (!cell) return "--";
            try {
              const days = JSON.parse(cell);
              return days.join(", ");
            } catch (e) {
              return cell;
            }
          }
        },
      ],
    },
  ];

  const fetchData = async () => {
    console.log("Fetching shift with ID:", currentId);
    try {
      setIsLoading(true);
      const response = await getShiftById(currentId);  
      console.log("API response:", response);
      setCurrentItem(response);
    } catch (error) {
      console.error("Error fetching shift:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentId) {
      fetchData();
    }
  }, [currentId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/shift/${currentId}/`, currentItem?.name);
      setIsOpen(false);
      reloadData(true);
    } catch (error) {
      console.error("Failed to delete shift:", error);
    }
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Shift Details"
        handlePrevious={() => {}}
        handleNext={() => {}}
      >
        {isLoading ? (
          <PageLoader height={"100vh"} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end mt-4 space-x-2">
              <CircularActionButtons
                onEdit={handleEdit}
                onDelete={handleDelete}
                editTooltip="Edit Shift"
                deleteTooltip="Delete Shift"
              />
            </div>

            <DetailContent 
              title="Shift Details" 
              fields={fields} 
              currentItem={currentItem}
            />
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

      {editMode && (
        <AddShiftForm
          isOpen={editMode}
          setIsOpen={() => {
            setEditMode(false);
            fetchData(); // Refresh data after edit
          }}
          id={currentId}
        />
      )}
    </>
  );
};

export default ViewShift;
