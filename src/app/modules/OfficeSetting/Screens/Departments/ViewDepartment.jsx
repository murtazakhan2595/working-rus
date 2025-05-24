import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDepartmentForm from "./AddDepartmentForm";
import axios from "axios";
import { ViewDetailSheetCardExtension } from "components";

const ViewDepartment = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  DepartmentList = []
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDepartment, setEditDepartment] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(data);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(data?.id);

  // Reset to original data when sheet opens
  useEffect(() => {
    if (isOpen && data) {
      setCurrentDepartment(data);
      setCurrentDepartmentId(data.id);
    }
  }, [isOpen]);

  const formSheetData = {
    triggerText: null,
    title: "View Department",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Department",
    description: null,
    footer: null,
  };

  const handleEdit = () => {
    setEditDepartment(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleNext = () => {
    // Ensure DepartmentList is an array
    const validList = Array.isArray(DepartmentList) ? DepartmentList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDepartmentId
    );
    if (currentIndex < validList.length - 1) {
      const nextDepartment = validList[currentIndex + 1];
      setCurrentDepartmentId(nextDepartment?.id);
      setCurrentDepartment(nextDepartment);
    } else {
      // Loop to first item
      const firstDepartment = validList[0];
      setCurrentDepartmentId(firstDepartment?.id);
      setCurrentDepartment(firstDepartment);
    }
  };

  const handlePrevious = () => {
    // Ensure DepartmentList is an array
    const validList = Array.isArray(DepartmentList) ? DepartmentList : [];
    if (validList.length === 0) return;
    
    const currentIndex = validList.findIndex(
      (item) => item.id === currentDepartmentId
    );
    if (currentIndex > 0) {
      const prevDepartment = validList[currentIndex - 1];
      setCurrentDepartmentId(prevDepartment?.id);
      setCurrentDepartment(prevDepartment);
    } else {
      // Loop to last item
      const lastDepartment = validList[validList.length - 1];
      setCurrentDepartmentId(lastDepartment?.id);
      setCurrentDepartment(lastDepartment);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/department/${currentDepartment?.id}`, currentDepartment?.name);
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
      const response = await axios.get(`/department/${currentDepartmentId}`);
      if (response.data) {
        setCurrentDepartment(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch updated department data:", error);
    }
  };

  const handleEditClose = async (updated = false) => {
    setEditDepartment(false);
    
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
    setCurrentDepartment({
      ...currentDepartment,
      ...formData
    });
    return true;
  };

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Department Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Department"
              deleteTooltip="Delete Department"
            />
          </div>

          <DetailCard detailCardTitle="Department Details" date={currentDepartment?.created_at} dateTitle="Created At">
            <DetailBox label="Name" value={currentDepartment?.name} />
            <DetailBox label="Description" value={currentDepartment?.description} />
            {DepartmentList.length > 0 && (
              <DetailBox 
                label="Position" 
                value={`${(Array.isArray(DepartmentList) ? DepartmentList.findIndex(item => item.id === currentDepartmentId) : -1) + 1} of ${Array.isArray(DepartmentList) ? DepartmentList.length : 0}`} 
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

      {editDepartment && (
        <ViewDetailSheetCardExtension
          isOpen={editDepartment}
          setIsOpen={handleEditClose}
          title="Update Department"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddDepartmentForm
            isOpen={editDepartment}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: currentDepartment }}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}
    </>
  );
};

export default ViewDepartment;
