import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import AssignRoleForm from "./AssignRoleForm";
import { deleteAssignedRole } from "app/hooks/rolesPermisions";
import { DepartmentName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";

const ViewAssignedRole = ({ isOpen, setIsOpen,roles, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editAssignment, setEditAssignment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewData, setViewData] = useState(data);
  console.log("ViewAssignedRole data", data);
  console.log("ViewAssignedRole roles", roles);
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

  const getAssignedRoles = () => {
    const roleIds = viewData?.user_role;

    if (!roleIds || roleIds.length === 0) {
      return [];
    }

    // Get the role objects based on IDs
    const roleObjects = roleIds
      .map((roleId) => {
        const role = roles.find((r) => r.id === roleId);
        return role ? role : null;
      })
      .filter((role) => role !== null);

    return roleObjects;
  };

  const assignedRoles = getAssignedRoles();
  return (
    <>
      <SheetComponent
        triggerText={null}
        title="View Role Assignment"
        description={null}
        footer={null}
        isOpen={isOpen}
        setIsOpen={handleViewClose}
        width="568px"
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
            value={viewData?.first_name + viewData?.last_name || "N/A"}
          />
          <DetailBox
            label="Employee ID"
            value={viewData?.serial_number || "N/A"}
          />
          <DetailBox
            label="Department"
            value={<DepartmentName value={viewData?.department_name} />}
          />
          <DetailBox
            label="Branch"
            value={<BranchName value={viewData?.branch_name} />}
          />
          <DetailBox label="Email" value={viewData?.work_email || "N/A"} />
        </DetailCard>

        {/* Assigned Roles Card */}
        <DetailCard detailCardTitle="Assigned Roles" className="mt-4">
          <DetailBox label="Total Roles" value={assignedRoles.length || "0"} />
          {assignedRoles.length > 0 ? (
            assignedRoles.map((role) => (
              <DetailBox
                key={role.id}
                label={role.name}
                value={role.description || "No description available"}
              />
            ))
          ) : (
            <DetailBox label="Roles" value="No roles assigned" />
          )}
        </DetailCard>
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
