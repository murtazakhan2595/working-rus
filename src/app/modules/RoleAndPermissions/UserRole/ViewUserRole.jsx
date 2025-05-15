import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRole, getRolePermissions } from "app/hooks/rolesPermisions";
import { useNavigate } from "react-router-dom";

const ViewUserRole = ({ isOpen, setIsOpen, data, reload = () => {} }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [viewData, setViewData] = useState(data);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const navigate = useNavigate();
  const formSheetData = {
    triggerText: null,
    title: "View Role",
    description: null,
    footer: null,
  };

  // Load role permissions
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (!viewData?.id) return;

      setIsLoadingPermissions(true);
      try {
        const response = await getRolePermissions({
          filterData: { role: viewData.id },
        });
        console.log("Role Permissions Response", response);
        if (response?.results) {
          setRolePermissions(response.results);
        }
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchRolePermissions();
  }, [viewData?.id]);

  // Update viewData when data prop changes
  useEffect(() => {
    setViewData(data);
  }, [data]);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/office-settings/role-permission/user-role/add/${viewData?.id}`, );
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRole(viewData?.id);
      setIsOpen(false);
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const handleEditClose = (updated = false) => {
    if (updated && typeof reload === "function") {
      reload();
    }
  };

  // Extract all features from rolePermissions
  const getAllFeatures = () => {
    const allFeatures = [];

    rolePermissions.forEach((permission) => {
      if (permission.feature && Array.isArray(permission.feature)) {
        allFeatures.push(...permission.feature);
      }
    });

    return allFeatures;
  };

  const renderPermissions = () => {
    if (isLoadingPermissions) {
      return <div className="text-gray-500">Loading permissions...</div>;
    }

    const features = getAllFeatures();

    if (features.length === 0) {
      return <div className="text-gray-500">No permissions assigned</div>;
    }

    return (
      <div className="space-y-2">
        {features.map((feature, index) => (
          <DetailBox
            key={index}
            label={feature.name}
            value={feature.description || feature.code_name}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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

        <DetailCard
          detailCardTitle="Role Details"
          date={viewData?.created_at}
          dateTitle="Created At"
        >
          <DetailBox label="Name" value={viewData?.name} />
          <DetailBox label="Description" value={viewData?.description} />
          <DetailBox label="Status" value={viewData?.status || "Active"} />
        </DetailCard>

        <DetailCard detailCardTitle="Permissions" className="mt-4">
          {renderPermissions()}
        </DetailCard>
      </SheetComponent>

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with the role "${viewData?.name}" will be lost.`}
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
        />
      )}
    </>
  );
};

export default ViewUserRole;
