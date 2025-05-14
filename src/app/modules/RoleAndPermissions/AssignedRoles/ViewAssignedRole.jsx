import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import AssignRoleForm from "./AssignRoleForm";
import { deleteAssignedRole } from "app/hooks/rolesPermisions";

const ViewAssignedRole = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editAssignment, setEditAssignment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewData, setViewData] = useState(data);

  const formSheetData = {
    triggerText: null,
    title: "Update Role Assignment",
    description: null,
    footer: null,
  };

  // Handle opening edit form
  const handleEdit = () => {
    setEditAssignment(true);
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
      await deleteAssignedRole(viewData.id);

      toast.success(
        `Role assignments for "${viewData.employee?.name}" removed successfully`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );

      // Close all dialogs
      setOpenDeleteAlert(false);
      setIsOpen(false);

      // Reload the table
      if (typeof reload === "function") {
        reload(true);
      }
    } catch (error) {
      console.error("Error deleting assigned role:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to remove role assignments";

      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit form close
  const handleEditClose = (updated = false) => {
    setEditAssignment(false);

    if (updated) {
      // If the assignment was updated, reload the table
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get role count and names
  const getRolesSummary = () => {
    if (!viewData?.roles || viewData.roles.length === 0) {
      return { count: 0, names: "None" };
    }

    const count = viewData.roles.length;
    const names = viewData.roles.map((role) => role.name).join(", ");

    return { count, names };
  };

  const rolesSummary = getRolesSummary();

  return (
    <>
      <SheetComponent
        triggerText={null}
        title="View Role Assignment"
        description={null}
        footer={null}
        isOpen={isOpen}
        setIsOpen={handleViewClose}
        width="700px"
      >
        {/* Action Buttons */}
        <div className="flex justify-end mb-4 space-x-2">
          <CircularActionButtons
            onEdit={handleEdit}
            onDelete={handleDelete}
            editTooltip="Edit Role Assignment"
            deleteTooltip="Remove All Role Assignments"
            disabled={isDeleting}
          />
        </div>

        {/* Employee Details Card */}
        <DetailCard
          detailCardTitle="Employee Information"
          date={viewData?.created_at}
          dateTitle="Assigned On"
        >
          <DetailBox
            label="Employee Name"
            value={viewData?.employee?.name || "N/A"}
          />
          <DetailBox
            label="Employee ID"
            value={viewData?.employee?.employeeId || "N/A"}
          />
          <DetailBox
            label="Department"
            value={viewData?.employee?.department || "N/A"}
          />
          <DetailBox
            label="Branch"
            value={viewData?.employee?.branch || "N/A"}
          />
          <DetailBox label="Email" value={viewData?.employee?.email || "N/A"} />
        </DetailCard>

        {/* Assignment Summary Card */}
        <DetailCard detailCardTitle="Assignment Summary" className="mt-4">
          <DetailBox
            label="Total Roles Assigned"
            value={rolesSummary.count.toString()}
          />
          <DetailBox
            label="Assignment Date"
            value={formatDate(viewData?.created_at)}
          />
          <DetailBox
            label="Last Updated"
            value={formatDate(viewData?.updated_at)}
          />
        </DetailCard>

        {/* Assigned Roles Card */}
        <DetailCard detailCardTitle="Assigned Roles" className="mt-4">
          <div className="space-y-4">
            {viewData?.roles && viewData.roles.length > 0 ? (
              viewData.roles.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-base text-gray-900 mb-2">
                        {role.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {role.description || "No description available"}
                      </p>

                      {/* Role Permissions Preview */}
                      {role.permissions &&
                        Object.keys(role.permissions).length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-blue-600 font-medium">
                              {Object.keys(role.permissions).length} permissions
                              assigned
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Role Status Badge */}
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👤</div>
                <div className="text-lg font-medium mb-1">
                  No Roles Assigned
                </div>
                <div className="text-sm">
                  This employee has no roles assigned yet
                </div>
              </div>
            )}
          </div>
        </DetailCard>

        {/* Permission Summary (if roles exist) */}
        {viewData?.roles && viewData.roles.length > 0 && (
          <DetailCard detailCardTitle="Permission Summary" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {viewData.roles.reduce((total, role) => {
                    return (
                      total +
                      (role.permissions
                        ? Object.keys(role.permissions).length
                        : 0)
                    );
                  }, 0)}
                </div>
                <div className="text-sm text-blue-700">Total Permissions</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {viewData.roles.length}
                </div>
                <div className="text-sm text-green-700">Active Roles</div>
              </div>
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
                This action will remove all role assignments for{" "}
                <strong>{viewData?.employee?.name}</strong>.
              </p>

              {viewData?.roles && viewData.roles.length > 0 && (
                <div>
                  <p className="font-medium">
                    The following roles will be removed:
                  </p>
                  <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                    {viewData.roles.map((role) => (
                      <li key={role.id} className="text-sm text-gray-700">
                        {role.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-red-600 font-medium">
                This action cannot be undone. The employee will lose access to
                all assigned permissions.
              </p>
            </div>
          }
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
          continueText={isDeleting ? "Removing..." : "Remove All Assignments"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeleting}
        />
      )}

      {/* Edit Assignment Sheet */}
      {editAssignment && (
        <SheetComponent
          {...formSheetData}
          isOpen={editAssignment}
          setIsOpen={handleEditClose}
          width="800px"
        >
          <AssignRoleForm
            isOpen={editAssignment}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: viewData }}
            reload={reload}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewAssignedRole;
