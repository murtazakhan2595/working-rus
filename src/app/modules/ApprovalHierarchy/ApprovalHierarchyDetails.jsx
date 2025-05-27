import { getApprovalHierarchyData } from "app/hooks/approvalHierarchy";
import { ApprovalHierarchy } from "app/utils/Types/ApprovalHierarchy";
import {
  AddEditApprovalHierarchyLevels,
  LevelDelegations,
  Levels,
} from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState } from "react";
import { Header,StatusLabel } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useLocation } from "react-router-dom";
import { Button } from "components/ui/button";
import { DetailBox } from "components/SheetCardExtension";
import { CardDescription, CardTitle } from "components/ui/card";
import { ApprovalHierarchyRequestTypeName ,EmployeeUsername} from "utils/getValuesFromTables";
import { HasAccess } from "utils/PermissionUtils";

const ApprovalHierarchyDetails = ({}) => {
  const isAddHierarchyPermitted = HasAccess("ADD_APPROVAL_HIERARCHY");
  const isViewDelegatePermitted = HasAccess("VIEW_LEVEL_DELEGATE");
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [reloadData, setReloadData] = useState(false);
  const [addLevelsForm, setAddLevelsForm] = useState(false);
  const [RequestInitiatorListToEdit, setRequestInitiatorListToEdit] =
    useState(null);
  const [Hierarchy, setHierarchy] = useState(ApprovalHierarchy);

  const fetchData = async (isMounted) => {
    try {
      const response = await getApprovalHierarchyData(id);
      if (isMounted) {
        setHierarchy(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        showBackButton={true}
        navigationLink={GOTO_URLS || "/office-settings/approval-hierarchy"}
        content={
          isAddHierarchyPermitted && (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setAddLevelsForm(true);
              }}
            >
              Add Hierarchy Level by Initiator
            </Button>
          )
        }
      />
      <Card>
        <CardTitle className="text-primary p-6">Hierarchy Details</CardTitle>
        <CardDescription></CardDescription>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            <DetailBox
              value={Hierarchy?.name}
              label="Name"
              orientation="horizontal"
            />
            <DetailBox
              orientation="horizontal"
              value={
                <ApprovalHierarchyRequestTypeName
                  value={Hierarchy?.request_type}
                />
              }
              label="Request Type"
            />
            <DetailBox
              orientation="horizontal"
              value={<EmployeeUsername value={Hierarchy?.created_by} />}
              label="Created By"
            />
            <DetailBox
              orientation="horizontal"
              value={`${Hierarchy?.no_of_levels || 0}`}
              label="No. of Levels"
            />
            <DetailBox
              orientation="horizontal"
              value={`${Hierarchy?.has_delegation ? "Yes" : "NO"}`}
              label="Delegated"
            />
            <DetailBox
              orientation="horizontal"
              value={
                <StatusLabel variant="info">
                  {Hierarchy?.has_auto_forward ? "Enabled" : "Disabled"}
                </StatusLabel>
              }
              label="Auto Forward"
            />
            <DetailBox
              orientation="horizontal"
              value={
                <StatusLabel variant={Hierarchy?.status ? "success" : "error"}>
                  {Hierarchy?.status ? "Active" : "Inactive"}
                </StatusLabel>
              }
              label="Status"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardTitle className="text-primary p-6">Hierarchy Levels</CardTitle>
        <CardDescription></CardDescription>
        <CardContent className="">
          <Levels
            HierarchyDetails={Hierarchy}
            fetchData={fetchData}
            hierarchy_id={id}
            viewMode={false}
            setReloadData={() => {
              setReloadData(!reloadData);
            }}
          />
        </CardContent>
      </Card>
      {isViewDelegatePermitted && (
        <LevelDelegations heirarchy_id={id} reloadData={reloadData} />
      )}
      {addLevelsForm && (
        <AddEditApprovalHierarchyLevels
          isOpen={addLevelsForm}
          setReloadData={() => {
            setRequestInitiatorListToEdit(null);
            setAddLevelsForm(false);
            setReloadData(!reloadData);
            fetchData(true);
          }}
          id={id}
          request_initiative={RequestInitiatorListToEdit}
        />
      )}
    </div>
  );
};

export default ApprovalHierarchyDetails;
