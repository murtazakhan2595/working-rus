import React, { useState, useMemo } from "react";
import {
  UserRoles,
  AssignedRoles,
  RoleAssignmentHistoryLogs,
} from "app/modules/RoleAndPermissions";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import { Header } from "components";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

function RoleAndPermissions() {
  const navigate = useNavigate();
  const isViewUserRolePermitted = HasAccess("VIEW_USER_ROLE");
  const [activeHRDocumentsTab, setActiveHRDocumentsTab] =
    useState("Role Management");
  const [openAssignRoleForm, setOpenAssignRoleForm] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const RoleAndPermissionsTab = useMemo(() => {
    return [
      ...(isViewUserRolePermitted ? ["Role Management"] : []),
      "Assigned Roles",
      "Role Assignment History & Logs",
    ];
  }, [isViewUserRolePermitted]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <>
            {activeHRDocumentsTab === "Role Management" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (activeHRDocumentsTab === "Role Management")
                    navigate("/office-settings/role-permission/user-role/add");
                }}
              >
                Add User Role
              </Button>
            )}
            {activeHRDocumentsTab === "Assigned Roles" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenAssignRoleForm(true);
                }}
              >
                Assign Roles
              </Button>
            )}
          </>
        }
      />
      <Tabs
        defaultValue="Role Management"
        className="w-full"
        onValueChange={(tab) => {
          setActiveHRDocumentsTab(tab);
        }}
        value={activeHRDocumentsTab}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
          <div className="w-full sm:w-auto overflow-hidden mb-4">
            <TabsList className="flex flex-nowrap w-full gap-4 overflow-x-auto overflow-y-hidden sm:overflow-visible">
              {RoleAndPermissionsTab.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="md:w-fit data-[state=active]:bg-primary-200 flex-1 sm:flex-initial whitespace-nowrap sm:w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <Card>
          <CardContent>
            <TabsContent value="Role Management">
              <UserRoles reload={reloadData} />
            </TabsContent>
            <TabsContent value="Assigned Roles">
              <AssignedRoles
                reload={reloadData}
                openAssignRoleForm={openAssignRoleForm}
                setOpenAssignRoleForm={setOpenAssignRoleForm}
              />
            </TabsContent>
            <TabsContent value="Role Assignment History & Logs">
              <RoleAssignmentHistoryLogs />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

export default RoleAndPermissions;
