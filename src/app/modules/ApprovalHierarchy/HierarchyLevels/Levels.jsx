import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import { AddEditApprovalHierarchyLevels } from "app/modules/ApprovalHierarchy";
import React, { useState } from "react";
import { StatusLabel, SplitViewDetail, TableCustom } from "components";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { DesignationName } from "utils/getValuesFromTables";
import { FilterInput } from "components/FormControl";
import { getLabelByValue } from "utils/getValuesFromTables";
import { HasAccess } from "utils/PermissionUtils";

const Levels = React.memo(
  ({
    HierarchyDetails = {},
    fetchData = () => {},
    hierarchy_id,
    viewMode = false,
    setReloadData = () => {},
  }) => {
    const isEditHierarchyPermitted = HasAccess("EDIT_APPROVAL_HIERARCHY");
    const [RequestInitiatorListToEdit, setRequestInitiatorListToEdit] =
      useState(null);
    const Designations = useSelector((state) => state.common.designations);
    const [addLevelsForm, setAddLevelsForm] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState("");
    const RequestInitiatorDesignations = React.useMemo(() => {
      if (
        !HierarchyDetails ||
        !Array.isArray(HierarchyDetails.request_initiative)
      )
        return [];

      const allInitiators = HierarchyDetails.request_initiative;
      const filteredInitiators = selectedDesignation
        ? allInitiators.filter((item) => item === selectedDesignation)
        : allInitiators;

      if (!Array.isArray(filteredInitiators) || filteredInitiators.length === 0)
        return [];

      const HierarchyLevels = Array.isArray(HierarchyDetails.levels)
        ? HierarchyDetails.levels
        : [];

      const initiatorsWithData = filteredInitiators.map((initiator) => {
        const levels = HierarchyLevels.filter(
          (level) =>
            Array.isArray(level.initiative_designation) &&
            level.initiative_designation.includes(initiator)
        );
        const request_initiator_designation =
          levels && Array.isArray(levels) && levels.length > 0
            ? levels[0].initiative_designation
            : [];
        return {
          id: initiator,
          title:
            getLabelByValue(initiator, Designations) ||
            `Designation ${initiator}`,
          content: (
            <div key={`level-${initiator}`}>
              <div className="flex-row flex justify-between mb-2">
                <div className="font-[inter] text-neutral-1200 flex-inline flex items-center gap-2">
                  {request_initiator_designation.map((designation) => (
                    <StatusLabel key={designation} variant={"info"}>
                      <DesignationName value={designation} />
                    </StatusLabel>
                  ))}
                </div>
                {!viewMode && !isEditHierarchyPermitted && (
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setRequestInitiatorListToEdit(
                        request_initiator_designation
                      );
                      setAddLevelsForm(true);
                    }}
                    variant="continue"
                  >
                    Edit
                  </Button>
                )}
              </div>
              <TableCustom
                columns={HierarchyLevelsColumn(fetchData, viewMode)}
                data={levels}
                dataTotalSize={levels.length}
                pagination={false}
                className="ApprovalHierarchiesLevels-table"
              />
            </div>
          ),
        };
      });

      return initiatorsWithData;
    }, [HierarchyDetails, selectedDesignation]);
    return (
      <div className="flex flex-col gap-4 ">
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
          className="justify-start"
          onChange={(filterName, filterValue) => {
            if (filterName === "designation")
              setSelectedDesignation(filterValue);
          }}
        />
        <SplitViewDetail
          dataConfig={{
            title: "Request Initiators",
            description: "",
            className: "min-w-[230px]",
          }}
          renderConfig={{
            title: "HierarchyDetails Levels",

            description:
              "Here you can manage and view the list of hierarchy levels against the selected request initiator",
          }}
          data={RequestInitiatorDesignations || []}
        />
        {addLevelsForm && (
          <AddEditApprovalHierarchyLevels
            isOpen={addLevelsForm}
            setReloadData={() => {
              setRequestInitiatorListToEdit(null);
              setAddLevelsForm(false);
              fetchData(true);
              setReloadData();
            }}
            id={hierarchy_id}
            request_initiative={RequestInitiatorListToEdit}
          />
        )}
      </div>
    );
  }
);

export default Levels;
