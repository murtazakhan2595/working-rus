import { DetailBox } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { useState, useEffect } from "react";
import CircularActionButtons from "components/CircularActionButtons";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRole, getUserRoleData } from "app/hooks/rolesPermisions";
import { useNavigate } from "react-router-dom";
import { ViewDetailSheetCardExtension } from "components";
import { useSelector } from "react-redux";
import ViewTreeUI from "components/ViewTreeUI";

const ViewUserRole = ({
  isOpen,
  setIsOpen,
  reload = () => {},
  roleID = null,
  UserRoleList = [],
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [currentRole, setCurrentRole] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(roleID);
  const ModuleTree = useSelector((state) => state.roles_permissions.modules);
  const navigate = useNavigate();

  const fetchData = async (isMounted, roleId) => {
    setIsLoadingPermissions(true);
    try {
      const response = await getUserRoleData(roleId, ModuleTree);
      if (isMounted && response) {
        setCurrentRole(response);
        setCurrentRoleId(roleId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (
      currentRoleId &&
      ModuleTree &&
      Array.isArray(ModuleTree) &&
      ModuleTree.length > 0
    ) {
      fetchData(isMounted, currentRoleId);
    }
    return () => {
      isMounted = false;
    };
  }, [currentRoleId, ModuleTree]);

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

  const renderPermissions = () => {
    if (isLoadingPermissions) {
      return <div className="text-gray-500">Loading permissions...</div>;
    }
    const moduleTreePermitted = currentRole.module_permitted;
    if (
      !moduleTreePermitted ||
      !Array.isArray(moduleTreePermitted) ||
      moduleTreePermitted.length === 0
    ) {
      return (
        <DetailBox label="Permissions" value={"No permission granted yet"} />
      );
    }
    return (
      <div className="space-y-2">
        <div className="text-neutral-900 mb-2">
          All permissions granted are listed below
        </div>
        <ViewTreeUI list={moduleTreePermitted} searchFeature={true} />{" "}
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
