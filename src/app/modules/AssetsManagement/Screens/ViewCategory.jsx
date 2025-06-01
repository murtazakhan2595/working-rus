import React, { useState, useEffect } from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import AddUpdateAssetCategory from "./AddUpdateAssetCategory";
import { deleteRecord } from "app/hooks/general";

const ViewCategory = ({ isOpen, setIsOpen, data, reload = () => {}, canEdit = true, canDelete = true }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

  const formSheetData = {
    triggerText: null,
    title: "View Category",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Category",
    description: null,
    footer: null,
  };

  // Handle opening edit form
  const handleEdit = () => {
    setEditCategory(true);
  };

  // Handle opening delete confirmation
  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!viewData?.id) return;

    setIsDeleting(true);

    try {
      await deleteRecord(`/asset-categories/${viewData.id}`, viewData.name);

      toast.success(`Category "${viewData.name}" deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Close all dialogs
      setOpenDeleteAlert(false);
      setIsOpen(false);

      // Reload the table
      if (typeof reload === "function") {
        reload(true);
      }
    } catch (error) {
      console.error("Error deleting category:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete category";

      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit form close
  const handleEditClose = async (updated = false) => {
    setEditCategory(false);

    if (updated) {
      // If the category was updated, reload the table
      if (typeof reload === "function") {
        reload(true);
      }
    }
  };

  // Handle view sheet close
  const handleViewClose = (open) => {
    setIsOpen(open);
    if (!open && typeof reload === "function") {
      reload(true);
    }
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={handleViewClose}
        width="568px"
      >
        {/* Action Buttons */}
        {(canEdit || canDelete) && (
          <div className="flex justify-end mb-4 space-x-2">
            <CircularActionButtons
              onEdit={canEdit ? handleEdit : null}
              onDelete={canDelete ? handleDelete : null}
              editTooltip="Edit Category"
              deleteTooltip="Delete Category"
              disabled={isDeleting}
              showEdit={canEdit}
              showDelete={canDelete}
            />
          </div>
        )}

        {/* Category Details Card */}
        <DetailCard
          detailCardTitle="Category Details"
          date={viewData?.created_at}
          dateTitle="Created At"
        >
          <DetailBox label="Name" value={viewData?.name || "N/A"} />
          <DetailBox
            label="Description"
            value={viewData?.description || "No description available"}
          />
          <DetailBox
            label="Status"
            value={
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  viewData?.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {viewData?.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </DetailCard>

        {/* Dynamic Fields Card */}
        {viewData?.dynamic_fields && viewData.dynamic_fields.length > 0 && (
          <DetailCard detailCardTitle="Dynamic Fields" className="mt-4">
            <DetailBox
              label="Total Fields"
              value={viewData.dynamic_fields.length || "0"}
            />
            {viewData.dynamic_fields.map((field, index) => (
              <DetailBox
                key={index}
                label={field.field_name || "Unnamed Field"}
                value={
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {field.field_type || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Required:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          field.is_required
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {field.is_required ? "Yes" : "No"}
                      </span>
                    </div>
                    {field.placeholder && (
                      <div>
                        <span className="font-medium">Placeholder:</span>{" "}
                        {field.placeholder}
                      </div>
                    )}
                  </div>
                }
              />
            ))}
          </DetailCard>
        )}
      </SheetComponent>

      {/* Delete Confirmation Dialog */}
      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description={
            <div className="space-y-3">
              <p>
                This action will permanently delete the category{" "}
                <strong>"{viewData?.name}"</strong>.
              </p>
              <p className="text-red-600 font-medium">
                This action cannot be undone. All assets associated with this
                category may be affected.
              </p>
            </div>
          }
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
          continueText={isDeleting ? "Deleting..." : "Delete Category"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeleting}
        />
      )}

      {/* Edit Category Sheet */}
      {editCategory && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editCategory}
          setIsOpen={handleEditClose}
          width="568px"
        >
          <AddUpdateAssetCategory
            isOpen={editCategory}
            setIsOpen={handleEditClose}
            categoryToEdit={viewData}
            reload={reload}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewCategory;
