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
import { validateHierarchyLevelFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import { AddEditApprovalHierarchyLevels } from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { StatusLabel, SplitViewDetail, TableCustom } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { NumberInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { FilterInput } from "components/FormControl";
import { CardTitle } from "reactstrap";
import { CardDescription } from "components/ui/card";
import { getLabelByValue } from "utils/getValuesFromTables";

const Levels = React.memo(
  ({
    HierarchyDetails = {},
    fetchData = () => {},
    hierarchy_id,
    viewMode = false,
  }) => {
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
                {!viewMode && (
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
