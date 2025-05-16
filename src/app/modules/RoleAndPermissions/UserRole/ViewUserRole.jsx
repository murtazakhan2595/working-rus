import { DetailBox } from "components/SheetCardExtension";
import { DetailCard, SheetCardExtension } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import {
  deleteRole,
  getRolePermissions,
  getUserRoleData,
} from "app/hooks/rolesPermisions";
import { useNavigate } from "react-router-dom";
import { ViewDetailSheetCardExtension } from "components";
const ViewUserRole = ({
  isOpen,
  setIsOpen,
  reload = () => {},
  roleID = null,
  UserRoleList = [],
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [currentRole, setCurrentRole] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(roleID);
  const navigate = useNavigate();

  const fetchData = async (isMounted, roleId) => {
    try {
      const response = await getUserRoleData(roleId);
      if (isMounted && response) {
        setCurrentRole(response);
        setCurrentRoleId(roleId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (currentRoleId) {
      fetchData(isMounted, currentRoleId);
    }
    return () => {
      isMounted = false;
    };
  }, [currentRoleId]);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/office-settings/role-permission/user-role/edit`, {
      state: { id: currentRole?.id },
    });
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleNext = () => {
    const currentIndex = UserRoleList.findIndex(
      (item) => item.id === currentRoleId
    );
    if (currentIndex < UserRoleList.length - 1) {
      const currentRole = UserRoleList[currentIndex + 1];
      setCurrentRoleId(currentRole?.id);
    } else {
      const currentRole = UserRoleList[0];
      setCurrentRoleId(currentRole?.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = UserRoleList.findIndex(
      (item) => item.id === currentRoleId
    );
    if (currentIndex > 0) {
      const currentRole = UserRoleList[currentIndex - 1];
      setCurrentRoleId(currentRole?.id);
    } else {
      const currentRole = UserRoleList[UserRoleList.length - 1];
      setCurrentRoleId(currentRole?.id);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRole(currentRole?.id);
      setIsOpen(false);
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
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
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Role Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mt-4 space-x-2">
            <CircularActionButtons
              onEdit={handleEdit}
              onDelete={handleDelete}
              editTooltip="Edit Role"
              deleteTooltip="Delete Role"
            />
          </div>
          <SheetCardExtension title={"Role Details"} className="mb-4 gap-y-0">
            <DetailBox label="Name" value={currentRole?.name} />
            <DetailBox label="Description" value={currentRole?.description} />
            <DetailBox label="Status" value={currentRole?.status || "Active"} />
          </SheetCardExtension>

          <SheetCardExtension title={"Permissions"}>
            {renderPermissions()}
          </SheetCardExtension>
        </div>
      </ViewDetailSheetCardExtension>

      {openDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with the role "${currentRole?.name}" will be lost.`}
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDelete}
        />
      )}
    </>
  );
};

export default ViewUserRole;
