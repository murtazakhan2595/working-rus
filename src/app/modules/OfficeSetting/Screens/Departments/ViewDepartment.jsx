import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddDepartmentForm from "./AddDepartmentForm";
import axios from "axios";

const ViewDepartment = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editDepartment, setEditDepartment] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

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

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/department/${viewData?.id}`, viewData?.name);
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
      const response = await axios.get(`/department/${viewData.id}`);
      if (response.data) {
        console.log("Fetched updated department data:", response.data);
        setViewData(response.data);
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
    console.log("Department updated with data:", formData);
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
            editTooltip="Edit Department"
            deleteTooltip="Delete Department"
          />
        </div>
        <DetailCard detailCardTitle="Department Details" date={viewData?.created_at} dateTitle="Created At">
          <DetailBox label="Name" value={viewData?.name} />
          <DetailBox label="Description" value={viewData?.description} />
          <DetailBox label="Organization" value={viewData?.organization} />
          <DetailBox label="Parent Department" value={viewData?.parent_department} />
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

      {editDepartment && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editDepartment}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddDepartmentForm
            isOpen={editDepartment}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: viewData }}
            setEdit={() => {}}
            reload={reload}
            onUpdateSuccess={handleFormUpdate}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewDepartment;
