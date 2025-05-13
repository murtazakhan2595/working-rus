import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import {AddUpdateUserRoleForm} from "app/modules/RoleAndPermissions/UserRole";
import { toast } from "react-toastify";

const ViewUserRole = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [viewData, setViewData] = useState(data);

  const formSheetData = {
    triggerText: null,
    title: "View Role",
    description: null,
    footer: null,
  };

  const updateSheetData = {
    triggerText: null,
    title: "Update Role",
    description: null,
    footer: null,
  };

  const handleEdit = () => {
    setEditRole(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      // Mock deletion for now
      toast.success(`Role "${viewData?.name}" deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsOpen(false);
      if (typeof reload === 'function') {
        reload(true);
      }
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to delete role", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleEditClose = (updated = false) => {
    setEditRole(false);
    
    if (updated) {
      // Also reload the table
      if (typeof reload === 'function') {
        reload(true);
      }
    }
  };

  // Function to format permissions for display
  const formatPermissions = (permissions) => {
    if (!permissions || Object.keys(permissions).length === 0) {
      return "No permissions assigned";
    }

    // Create a formatted list of permissions
    const formattedList = Object.entries(permissions).map(([featureKey, permissionTypes]) => {
      const featureName = featureKey.split('.').pop(); // Extract the feature name from the key
      const permissionsText = permissionTypes.join(', ');
      return `${featureName}: ${permissionsText}`;
    });

    return formattedList.join('; ');
  };

  // Group permissions by module for better display
  const groupPermissionsByModule = (permissions) => {
    if (!permissions || Object.keys(permissions).length === 0) {
      return {};
    }

    const grouped = {};
    
    Object.entries(permissions).forEach(([featureKey, permissionTypes]) => {
      const [module, subModule, feature] = featureKey.split('.');
      
      if (!grouped[module]) {
        grouped[module] = {};
      }
      
      if (subModule && subModule !== feature) {
        if (!grouped[module][subModule]) {
          grouped[module][subModule] = {};
        }
        grouped[module][subModule][feature] = permissionTypes;
      } else {
        grouped[module][feature] = permissionTypes;
      }
    });
    
    return grouped;
  };

  // Check if a permission object is empty
  const isEmptyPermissions = (obj) => {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  };

  // Render grouped permissions in a hierarchical view
  const renderPermissions = () => {
    const grouped = groupPermissionsByModule(viewData?.permissions);
    
    if (isEmptyPermissions(grouped)) {
      return <div className="text-gray-500">No permissions assigned</div>;
    }
    
    return (
      <div className="space-y-4">
        {Object.entries(grouped).map(([module, moduleData]) => (
          <div key={module} className="border-b pb-3">
            <h4 className="font-medium text-base mb-2">{module}</h4>
            <div className="pl-4 space-y-2">
              {Object.entries(moduleData).map(([key, value]) => {
                if (typeof value === 'object') {
                  // This is a submodule
                  return (
                    <div key={key} className="mb-2">
                      <h5 className="font-medium text-sm">{key}</h5>
                      <div className="pl-4">
                        {Object.entries(value).map(([feature, permissions]) => (
                          <div key={feature} className="text-sm py-1">
                            <span className="font-medium">{feature}:</span>{" "}
                            <span className="text-gray-700">{permissions.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  // This is a feature directly under the module
                  return (
                    <div key={key} className="text-sm py-1">
                      <span className="font-medium">{key}:</span>{" "}
                      <span className="text-gray-700">{value.join(', ')}</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    );
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
        width="700px"
      >
        <div className="flex justify-end mb-4 space-x-2">
          <CircularActionButtons 
            onEdit={handleEdit}
            onDelete={handleDelete}
            editTooltip="Edit Role"
            deleteTooltip="Delete Role"
          />
        </div>
        <DetailCard detailCardTitle="Role Details" date={viewData?.created_at} dateTitle="Created At">
          <DetailBox label="Name" value={viewData?.name} />
          <DetailBox label="Description" value={viewData?.description} />
        </DetailCard>

        <DetailCard detailCardTitle="Permissions" className="mt-4">
          <div className="p-4">
            {renderPermissions()}
          </div>
        </DetailCard>
      </SheetComponent>

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this role will be lost."
          isOpen={openDeleteAlert}
          setIsOpen={(isOpen) => setOpenDeleteAlert(isOpen)}
          handleContinue={() => {
            confirmDelete();
            setOpenDeleteAlert(false);
          }}
        />
      )}

      {editRole && (
        <SheetComponent
          {...updateSheetData}
          isOpen={editRole}
          setIsOpen={handleEditClose}
          width="700px"
        >
          <AddUpdateUserRoleForm
            isOpen={editRole}
            setIsOpen={handleEditClose}
            edit={{ open: true, data: viewData }}
            reload={reload}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default ViewUserRole; 