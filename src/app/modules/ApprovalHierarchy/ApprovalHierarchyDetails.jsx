import {
  getApprovalHierarchyList,
  saveUpdateApprovalHierarchy,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  ApprovalHierarchy,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { validateApprovalHierarchyFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import { AddEditApprovalHierarchyLevels } from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI, TableCustom } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { NumberInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { CardDescription, CardTitle } from "components/ui/card";
import { ApprovalHierarchyRequestTypeName } from "utils/getValuesFromTables";
const ApprovalHierarchyDetails = ({
  isOpen = true,
  setReloadData = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [addLevelsForm, setAddLevelsForm] = useState(false);
  const [Hierarchy, setHierarchy] = useState(ApprovalHierarchy);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getApprovalHierarchyData(id);
      if (isMounted) {
        setHierarchy(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchData(isMounted, id);
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
          <Button
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setAddLevelsForm(true);
            }}
          >
            Add Levels
          </Button>
        }
      />
      <Card>
        <CardTitle className="text-primary p-6">Hierarchy Details</CardTitle>
        <CardDescription></CardDescription>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg-grid-cols-5">
            <DetailBox value={Hierarchy.name} label="name" />
            <DetailBox
              value={
                <ApprovalHierarchyRequestTypeName
                  value={Hierarchy.request_type}
                />
              }
              label="Request Type"
            />
            <DetailBox
              value={`${Hierarchy.auto_forward_threshold}hr`}
              label="Auto Forward Thershold"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <TableCustom
            columns={HierarchyLevelsColumn(fetchData)}
            data={Hierarchy?.levels || []}
            dataTotalSize={Hierarchy?.levels?.length || 0}
            pagination={false}
            className="ApprovalHierarchiesLevels-table"
          />
        </CardContent>
      </Card>
      {addLevelsForm && (
        <AddEditApprovalHierarchyLevels
          isOpen={addLevelsForm}
          setReloadData={() => {
            setAddLevelsForm(false);
            fetchData(true);
          }}
          id={id}
        />
      )}
    </div>
  );
};

export default ApprovalHierarchyDetails;
