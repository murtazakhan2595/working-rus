import { getApprovalHierarchyData } from "app/hooks/approvalHierarchy";
import { ApprovalHierarchy } from "app/utils/Types/ApprovalHierarchy";
import {
  AddEditApprovalHierarchyLevels,
  LevelDelegations,
  Levels,
} from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState } from "react";
import { Header } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useLocation } from "react-router-dom";
import { Button } from "components/ui/button";
import { DetailBox } from "components/SheetCardExtension";
import { CardDescription, CardTitle } from "components/ui/card";
import { ApprovalHierarchyRequestTypeName } from "utils/getValuesFromTables";
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg-grid-cols-3">
            <DetailBox value={Hierarchy.name} label="Name" />
            <DetailBox
              value={
                <ApprovalHierarchyRequestTypeName
                  value={Hierarchy.request_type}
                />
              }
              label="Request Type"
            />
            {Hierarchy.auto_forward_enabled && (
              <DetailBox
                value={`${Hierarchy.auto_forward_threshold}hr`}
                label="Auto Forward Thershold"
              />
            )}
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
