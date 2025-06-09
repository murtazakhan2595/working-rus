import { DetailBox } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { useState } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewDetailSheetCardExtension } from "components";
import SheetComponent from "components/ui/SheetComponent";
import AddUpdateLeaveDuration from "./AddUpdateLeaveDuration";
import { deleteLeaveDuration } from "app/hooks/leaveTracker";

const ViewLeaveDuration = ({
  data,
  isOpen,
  setIsOpen,
  reload,
  leaveDurationList = [],
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(data);
  const [editMode, setEditMode] = useState(false);

  if (!currentDuration) return null;

  const formSheetData = {
    triggerText: null,
    title: "Update Leave Duration",
    description: null,
    footer: null,
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEditMode(true);
  };

  const handleEditClose = (isEditOpen, updated = false) => {
    setEditMode(isEditOpen);
    if (updated && typeof reload === "function") {
      reload();
      setIsOpen(false); 
    }
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleNext = () => {
    const currentIndex = leaveDurationList.findIndex(
      (item) => item.id === currentDuration.id
    );
    if (currentIndex < leaveDurationList.length - 1) {
      const nextDuration = leaveDurationList[currentIndex + 1];
      setCurrentDuration(nextDuration);
    } else {
      const firstDuration = leaveDurationList[0];
      setCurrentDuration(firstDuration);
    }
  };

  const handlePrevious = () => {
    const currentIndex = leaveDurationList.findIndex(
      (item) => item.id === currentDuration.id
    );
    if (currentIndex > 0) {
      const previousDuration = leaveDurationList[currentIndex - 1];
      setCurrentDuration(previousDuration);
    } else {
      const lastDuration = leaveDurationList[leaveDurationList.length - 1];
      setCurrentDuration(lastDuration);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveDuration(currentDuration?.id);
      setIsOpen(false);
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const renderNationalities = () => {
    if (
      !currentDuration.nationalities ||
      currentDuration.nationalities.length === 0
    ) {
      return "All Nationalities";
    }
    return currentDuration.nationalities.join(", ");
  };

  const renderBranches = () => {
    if (!currentDuration.branches || currentDuration.branches.length === 0) {
      return "All Branches";
    }
    return currentDuration.branches
      .map((branch) => branch.branch_name)
      .join(", ");
  };

  const renderDepartments = () => {
    if (
      !currentDuration.departments ||
      currentDuration.departments.length === 0
    ) {
      return "All Departments";
    }
    return currentDuration.departments.map((dept) => dept.name).join(", ");
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Leave Duration Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Duration"
              deleteTooltip="Delete Duration"
            />
          </div>

          <SheetCardExtension
            title={"Duration Details"}
            className="mb-4 gap-y-0"
          >
            <DetailBox
              label="Duration Name"
              value={currentDuration?.duration_name}
            />
            <DetailBox
              label="Duration Hours"
              value={currentDuration?.duration_hours}
            />
          </SheetCardExtension>

          <SheetCardExtension title={"Assignment Details"}>
            <DetailBox label="Nationalities" value={renderNationalities()} />
            <DetailBox label="Branches" value={renderBranches()} />
            <DetailBox label="Departments" value={renderDepartments()} />
          </SheetCardExtension>
        </div>
      </ViewDetailSheetCardExtension>

      {/* Edit Duration Sheet */}
      {editMode && (
        <SheetComponent
          {...formSheetData}
          isOpen={editMode}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddUpdateLeaveDuration
            isOpen={editMode}
            setIsOpen={(isEditOpen) => handleEditClose(isEditOpen, true)}
            data={currentDuration}
            reload={reload}
          />
        </SheetComponent>
      )}

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with the duration "${currentDuration?.duration_name}" will be lost.`}
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
        />
      )}
    </>
  );
};

export default ViewLeaveDuration;
