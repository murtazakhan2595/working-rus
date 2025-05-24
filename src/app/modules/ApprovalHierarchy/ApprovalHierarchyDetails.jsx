import {
  getApprovalHierarchyList,
  getDelegationList,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  ApprovalHierarchy,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { validateApprovalHierarchyFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import {
  HierarchyLevelsColumn,
  DelegateLevelsColumn,
} from "app/modules/ApprovalHierarchy/Sections";
import {
  AddEditApprovalHierarchyLevels,
  LevelDelegations,
} from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Header,
  SheetUI,
  TableCustom,
  StatusLabel,
  SplitViewDetail,
} from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { CardDescription, CardTitle } from "components/ui/card";
import { ApprovalHierarchyRequestTypeName } from "utils/getValuesFromTables";

const groupByInitiative = (list) => {
  const map = {};
  list.forEach((item) => {
    const key = JSON.stringify(item.initiative_designation.sort()); // Normalize array for consistent grouping
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
  });

  return Object.values(map);
};

const ApprovalHierarchyDetails = ({ setReloadData = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [addLevelsForm, setAddLevelsForm] = useState(false);
  const [RequestInitiatorListToEdit, setRequestInitiatorListToEdit] =
    useState(null);
  const [Hierarchy, setHierarchy] = useState(ApprovalHierarchy);
  const Designations = useSelector((state) => state.common.designations);
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const fetchData = async (isMounted) => {
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
    if (id) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const HierarchyLevels = React.useMemo(() => {
    const levels = Hierarchy?.levels || [];
    const filtered = selectedDesignation
      ? levels.filter((item) =>
          item.initiative_designation.includes(selectedDesignation)
        )
      : levels;
    return groupByInitiative(filtered);
  }, [Hierarchy?.levels, selectedDesignation]);

  const RequestInitiatorDesignations = React.useMemo(() => {
    const initiators = Hierarchy?.request_initiative;
    if (!initiators || !Array.isArray(initiators)) return [];
    return initiators;
  }, [Hierarchy]);

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
            Add New Request Initiator Level
          </Button>
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
        <CardContent className="flex flex-col gap-4 mt-6">
          {/* <SplitViewDetail items={RequestInitiatorDesignations || []} /> */}
          <FilterInput
            filters={[
              {
                type: "select-one",
                placeholder: "Designation",
                name: "designation",
                option: Designations,
                values: selectedDesignation,
              },
            ]}
            className="justify-end"
            onChange={(filterName, filterValue) => {
              if (filterName === "designation")
                setSelectedDesignation(filterValue);
            }}
          />
          {HierarchyLevels && Array.isArray(HierarchyLevels)
            ? HierarchyLevels?.map((levels) => {
                const request_initiator_designation =
                  levels && Array.isArray(levels) && levels.length > 0
                    ? levels[0].initiative_designation
                    : [];
                return (
                  <div className="flex flex-col gap-4">
                    <div className="flex-row flex justify-between">
                      <div className="font-[inter] text-neutral-1200 flex-inline flex items-center gap-2">
                        Approval Level for Request Initiator as :
                        {request_initiator_designation.map((designation) => (
                          <StatusLabel key={designation} variant={"info"}>
                            <DesignationName value={designation} />
                          </StatusLabel>
                        ))}
                      </div>
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setRequestInitiatorListToEdit(
                            request_initiator_designation
                          );
                          setAddLevelsForm(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <TableCustom
                      columns={HierarchyLevelsColumn(fetchData)}
                      data={levels || []}
                      dataTotalSize={levels?.length || 0}
                      pagination={false}
                      className="ApprovalHierarchiesLevels-table"
                    />
                  </div>
                );
              })
            : null}
        </CardContent>
      </Card>
      <LevelDelegations />
      {addLevelsForm && (
        <AddEditApprovalHierarchyLevels
          isOpen={addLevelsForm}
          setReloadData={() => {
            setRequestInitiatorListToEdit(null);
            setAddLevelsForm(false);
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
