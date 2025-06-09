import { DetailBox } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { useState } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewDetailSheetCardExtension } from "components";
import SheetComponent from "components/ui/SheetComponent";
import {AddUpdateLeaveType} from "app/modules/LeaveTracker";
import { deleteLeaveType } from "app/hooks/leaveTracker";

const ViewLeaveType = ({
  data,
  isOpen,
  setIsOpen,
  reload,
  leaveTypeList = [],
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [currentType, setCurrentType] = useState(data);
  const [editMode, setEditMode] = useState(false);

  if (!currentType) return null;

  const formSheetData = {
    triggerText: null,
    title: "Update Leave Type",
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
    const currentIndex = leaveTypeList.findIndex(
      (item) => item.id === currentType.id
    );
    if (currentIndex < leaveTypeList.length - 1) {
      const nextType = leaveTypeList[currentIndex + 1];
      setCurrentType(nextType);
    } else {
      const firstType = leaveTypeList[0];
      setCurrentType(firstType);
    }
  };

  const handlePrevious = () => {
    const currentIndex = leaveTypeList.findIndex(
      (item) => item.id === currentType.id
    );
    if (currentIndex > 0) {
      const previousType = leaveTypeList[currentIndex - 1];
      setCurrentType(previousType);
    } else {
      const lastType = leaveTypeList[leaveTypeList.length - 1];
      setCurrentType(lastType);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveType(currentType?.id);
      setIsOpen(false);
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const renderNationalities = () => {
    if (!currentType.nationalities || currentType.nationalities.length === 0) {
      return <span className="">All Nationalities</span>;
    }
    return currentType.nationalities.join(", ");
  };

  const renderBranches = () => {
    if (!currentType.branches || currentType.branches.length === 0) {
      return <span className="">All Branches</span>;
    }
    return currentType.branches.map((branch) => branch.branch_name).join(", ");
  };

  const renderDepartments = () => {
    if (!currentType.departments || currentType.departments.length === 0) {
      return <span className="">All Departments</span>;
    }
    return currentType.departments.map((dept) => dept.name).join(", ");
  };

  const renderGenders = () => {
    if (!currentType.genders || currentType.genders.length === 0) {
      return <span className="">All Genders</span>;
    }
    return currentType.genders.join(", ");
  };

  const renderMaritalStatuses = () => {
    if (
      !currentType.marital_statuses ||
      currentType.marital_statuses.length === 0
    ) {
      return <span className="">All Marital Statuses</span>;
    }
    return currentType.marital_statuses.join(", ");
  };

  const renderGrades = () => {
    if (!currentType.grades || currentType.grades.length === 0) {
      return <span className="">All Grades</span>;
    }
    return currentType.grades.join(", ");
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Leave Type Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Leave Type"
              deleteTooltip="Delete Leave Type"
            />
          </div>

          <SheetCardExtension title={"Basic Details"} className="mb-4 gap-y-0">
            <DetailBox label="Leave Type Name" value={currentType?.name} />
            <DetailBox label="Short Code" value={currentType?.short_code} />
            <DetailBox label="Annual Quota" value={currentType?.leave_count} />
            <DetailBox
              label="Day Count Type"
              value={
                currentType?.day_count_type === "work_days"
                  ? "Work Days"
                  : "Calendar Days"
              }
            />
            <DetailBox
              label="Max Consecutive Days"
              value={currentType?.max_consecutive_days}
            />
            <DetailBox
              label="Status"
              value={currentType?.status ? "Active" : "Inactive"}
            />
          </SheetCardExtension>

          <SheetCardExtension title={"Policy Details"}>
            <DetailBox
              label="Carry Forward Allowed"
              value={currentType?.is_carry_forward_allowed ? "Yes" : "No"}
            />
            {currentType?.is_carry_forward_allowed && (
              <DetailBox
                label="Max Carry Forward Limit"
                value={currentType?.max_carry_forward_limit || "Not specified"}
              />
            )}
            <DetailBox
              label="Encashable"
              value={currentType?.is_encashable ? "Yes" : "No"}
            />
            <DetailBox
              label="Requires Attachment"
              value={currentType?.requires_attachment ? "Yes" : "No"}
            />
            <DetailBox
              label="Min Days Notice Required"
              value={currentType?.min_days_notice || "0"}
            />
            <DetailBox
              label="Probation Restriction"
              value={currentType?.probation_restriction ? "Yes" : "No"}
            />
            <DetailBox
              label="All Paid"
              value={currentType?.is_all_paid ? "Yes" : "No"}
            />
            {!currentType?.is_all_paid && (
              <>
                <DetailBox
                  label="Full Paid Days"
                  value={currentType?.full_paid_days || "0"}
                />
                <DetailBox
                  label="Half Paid Days"
                  value={currentType?.half_paid_days || "0"}
                />
              </>
            )}
          </SheetCardExtension>

          <SheetCardExtension title={"Assignment Details"}>
            <DetailBox label="Nationalities" value={renderNationalities()} />
            <DetailBox label="Branches" value={renderBranches()} />
            <DetailBox label="Departments" value={renderDepartments()} />
            <DetailBox label="Genders" value={renderGenders()} />
            <DetailBox
              label="Marital Statuses"
              value={renderMaritalStatuses()}
            />
            <DetailBox label="Grades" value={renderGrades()} />
          </SheetCardExtension>

          {currentType?.tooltip_info && (
            <SheetCardExtension title={"Additional Information"}>
              <DetailBox
                label="Tooltip Information"
                value={currentType?.tooltip_info}
              />
            </SheetCardExtension>
          )}
        </div>
      </ViewDetailSheetCardExtension>

      {/* Edit Leave Type Sheet */}
      {editMode && (
        <AddUpdateLeaveType
          isOpen={editMode}
          setIsOpen={(isEditOpen) => handleEditClose(isEditOpen, true)}
          data={currentType}
          reload={reload}
        />
      )}

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with the leave type "${currentType?.name}" will be lost.`}
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
        />
      )}
    </>
  );
};

export default ViewLeaveType;
