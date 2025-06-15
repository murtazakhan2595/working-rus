import React, { useState, useEffect } from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import AddUpdateAsset from "./AddUpdateAsset";
import AttachmentUI from "components/ui/AttachmentUI";
import { deleteAsset } from "app/hooks/assets";

const ViewAsset = ({ isOpen, setIsOpen, data, reload = () => {}, canEdit = true, canDelete = true }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editAsset, setEditAsset] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewData, setViewData] = useState(data);

  useEffect(() => {
    setViewData(data);
  }, [data]);

  const formSheetData = {
    triggerText: null,
    title: "View Asset",
    description: null,
    footer: null,
  };

  // Format currency
  const formatCurrency = (value) => {
    return value ? `AED ${parseFloat(value).toFixed(2)}` : "N/A";
  };

  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  // Handle opening edit form
  const handleEdit = () => {
    setEditAsset(true);
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
      const success = await deleteAsset(viewData.id);
      if (success.hasOwnProperty('status') && success.status == false) {
        toast.error(success.msg);  
        setOpenDeleteAlert(false);
      } else {
        toast.success(`Asset "${viewData.asset_name}" deleted successfully`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Close all dialogs
        setOpenDeleteAlert(false);
        setIsOpen(false);

        // Reload the table
        if (typeof reload === "function") {
          reload(true);
        }
      }
    } catch (error) {
      console.error("Error deleting asset:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete asset";

      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit form close
  const handleEditClose = async (updated = false) => {
    setEditAsset(false);

    if (updated) {
      // If the asset was updated, reload the table
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

  // Helper function to extract filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return "Attachment";
    const parts = url.split("/");
    return parts[parts.length - 1];
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
              editTooltip="Edit Asset"
              deleteTooltip="Delete Asset"
              disabled={isDeleting}
              showEdit={canEdit}
              showDelete={canDelete}
            />
          </div>
        )}

        {/* Basic Asset Information */}
        <DetailCard
          detailCardTitle="Basic Information"
          date={viewData?.created_at}
          dateTitle="Created At"
        >
          <DetailBox label="Asset Name" value={viewData?.asset_name || "N/A"} />
          <DetailBox
            label="Category"
            value={viewData?.asset_type?.name || "N/A"}
          />
          <DetailBox
            label="Status"
            value={
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  viewData?.asset_status === "Available"
                    ? "bg-green-100 text-green-800"
                    : viewData?.asset_status === "Assigned"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {viewData?.asset_status || "N/A"}
              </span>
            }
          />
          <DetailBox
            label="Initial Condition"
            value={viewData?.asset_initial_condition || "N/A"}
          />
        </DetailCard>

        {/* Dynamic Fields */}
        {viewData?.dynamic_field_values &&
          Object.keys(viewData.dynamic_field_values).length > 0 && (
            <DetailCard detailCardTitle="Additional Details" className="mt-4">
              {Object.entries(viewData.dynamic_field_values).map(
                ([fieldName, fieldValue]) => (
                  <DetailBox
                    key={fieldName}
                    label={fieldName}
                    value={fieldValue || "N/A"}
                  />
                )
              )}
            </DetailCard>
          )}

        {/* Purchase Information */}
        <DetailCard detailCardTitle="Purchase Information" className="mt-4">
          <DetailBox
            label="Purchase Date"
            value={formatDate(viewData?.asset_purchase_date)}
          />
          <DetailBox
            label="Purchase Price"
            value={formatCurrency(viewData?.asset_purchase_price)}
          />
          <DetailBox
            label="Warranty"
            value={viewData?.asset_warranty || "N/A"}
          />
          {viewData?.asset_warranty_expiry && (
            <DetailBox
              label="Warranty Expiry"
              value={formatDate(viewData.asset_warranty_expiry)}
            />
          )}
        </DetailCard>

        {/* Location Information */}
        {(viewData?.asset_location || viewData?.asset_location_name) && (
          <DetailCard detailCardTitle="Location Information" className="mt-4">
            <DetailBox
              label="Location"
              value={
                typeof viewData.asset_location === "object"
                  ? viewData.asset_location?.name
                  : viewData.asset_location_name ||
                    `Location ${viewData.asset_location}` ||
                    "N/A"
              }
            />
          </DetailCard>
        )}

        {/* Notes */}
        {viewData?.asset_notes && (
          <DetailCard detailCardTitle="Notes" className="mt-4">
            <DetailBox label="Notes" value={viewData.asset_notes} />
          </DetailCard>
        )}

        {/* Attachments */}
        {viewData?.attachments && viewData.attachments.length > 0 && (
          <DetailCard detailCardTitle="Attachments" className="mt-4">
            <div className="space-y-2">
              {viewData.attachments.map((attachmentItem, index) => (
                <AttachmentUI
                  key={attachmentItem.id || index}
                  id={attachmentItem.id}
                  attachment={attachmentItem.attachment}
                  name={getFilenameFromUrl(attachmentItem.attachment)}
                  viewOnly={true}
                  removeFile={() => {}} // Empty function since it's view only
                />
              ))}
            </div>
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
                This action will permanently delete the asset{" "}
                <strong>"{viewData?.asset_name}"</strong>.
              </p>
              <p className="text-red-600 font-medium">
                This action cannot be undone. All information associated with
                this asset will be permanently removed.
              </p>
            </div>
          }
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
          continueText={isDeleting ? "Deleting..." : "Delete Asset"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeleting}
        />
      )}

      {editAsset && (
        <AddUpdateAsset
          isOpen={editAsset}
          setIsOpen={()=>{
            handleEditClose(true)
            handleViewClose(true)
          }}
          assetToEdit={viewData}
          reload={reload}
        />
      )}
    </>
  );
};

export default ViewAsset;
