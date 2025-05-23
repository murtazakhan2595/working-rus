import React, { useState, useMemo ,useEffect} from "react";
import {
  ViewApprovalHierarchy,
  ApprovalHierarchyHistory,
} from "app/modules/ApprovalHierarchy";
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
import { AddUpdateApprovalHierarchy } from "app/modules/ApprovalHierarchy";

export default function ApprovalHierarchy({active = "Approval Hierarchy"}) {
  const navigate = useNavigate();
  const isViewUserRolePermitted = HasAccess("VIEW_USER_ROLE");
  const [activeApprovalHierarchyTab, setActiveApprovalHierarchyTab] =
    useState(active);
  const [reloadData, setReloadData] = useState(false);
  const [openHierarchyForm, setopenHierarchyForm] = useState(false);
  const ApprovalHierarchyTab = useMemo(() => {
    return [
      ...(isViewUserRolePermitted ? ["Approval Hierarchy"] : []),
      ...(isViewUserRolePermitted ? ["History & Logs"] : []),
    ];
  }, [isViewUserRolePermitted]);
  useEffect(() => {
    let isMounted = true;
    setActiveApprovalHierarchyTab(active);
    return () => {
      isMounted = false;
    };
  }, [active]);
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <>
            {activeApprovalHierarchyTab === "Approval Hierarchy" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (activeApprovalHierarchyTab === "Approval Hierarchy")
                    setopenHierarchyForm(true);
                }}
              >
                Add Approval Hierarchy
              </Button>
            )}
          </>
        }
      />
      <Tabs
        defaultValue="Approval Hierarchy"
        className="w-full"
        onValueChange={(tab) => {
          setActiveApprovalHierarchyTab(tab);
        }}
        value={activeApprovalHierarchyTab}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
          <div className="w-full sm:w-auto overflow-hidden mb-4">
            <TabsList className="flex flex-nowrap w-full gap-4 overflow-x-auto overflow-y-hidden sm:overflow-visible">
              {ApprovalHierarchyTab.map((tab) => (
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
            <TabsContent value="Approval Hierarchy">
              <ViewApprovalHierarchy reload={reloadData} />
            </TabsContent>
            <TabsContent value="History & Logs">
              <ApprovalHierarchyHistory />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      {openHierarchyForm && (
        <AddUpdateApprovalHierarchy
          setReloadData={() => {
            setReloadData(!reloadData);
            setopenHierarchyForm(false);
          }}
          isOpen={openHierarchyForm}
        />
      )}
    </div>
  );
}
