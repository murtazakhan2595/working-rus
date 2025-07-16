import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import { AddEditApprovalHierarchyLevels } from "app/modules/ApprovalHierarchy";
import React, { useState } from "react";
import { SplitViewDetail, TableCustom, MultiStatusLabel } from "components";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";
import _ from "lodash";

const Levels = React.memo(
  ({
    HierarchyDetails = {},
    fetchData = () => {},
    hierarchy_id,
    viewMode = false,
    setReloadData = () => {},
  }) => {
    const isEditHierarchyPermitted = HasAccess("EDIT_APPROVAL_HIERARCHY");
    const [LevelGroupToEdit, setLevelGroupToEdit] = useState(null);
    const Designations = useSelector((state) => state.common.designations);
    const [addLevelsForm, setAddLevelsForm] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState("");
    const LevelsGroups = React.useMemo(() => {
      if (
        !HierarchyDetails ||
        !Array.isArray(HierarchyDetails.request_initiative) ||
        !Array.isArray(HierarchyDetails.level_groups)
      )
        return [];
      const HierarchyLevels = Array.isArray(HierarchyDetails.levels)
        ? HierarchyDetails.levels
        : [];

      const FilteredHierarchyLevels = selectedDesignation
        ? HierarchyLevels.filter((item) =>
            item.initiative_designation.includes(selectedDesignation)
          )
        : HierarchyLevels;

      const filteredLevelGroups = _.uniq(
        FilteredHierarchyLevels.map((level) => level.group_name) || []
      );

      if (
        !Array.isArray(filteredLevelGroups) ||
        filteredLevelGroups.length === 0
      )
        return [];

      const initiatorsWithData = filteredLevelGroups.map((level_group) => {
        const levels = FilteredHierarchyLevels.filter(
          (level) => level.group_name === level_group
        );
        const request_initiator_designation =
          levels && Array.isArray(levels) && levels.length > 0
            ? levels[0].initiative_designation_names || []
            : [];
        return {
          id: level_group,
          title:
            level_group || `Group ${request_initiator_designation.join(",")}`,
          content: (
            <div key={`level-${level_group}`}>
              <div className="flex-row flex justify-between mb-2">
                <div className="font-[inter] text-neutral-1200 flex-inline flex items-center gap-2">
                  <MultiStatusLabel
                    statusList={request_initiator_designation}
                    variant="info"
                    displayCount={7}
                  />
                </div>
                {!viewMode && isEditHierarchyPermitted && (
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setLevelGroupToEdit(level_group);
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
              type: "select",
              placeholder: "Designation",
              name: "designation",
              options: Designations,
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
          data={LevelsGroups || []}
        />
        {addLevelsForm && (
          <AddEditApprovalHierarchyLevels
            isOpen={addLevelsForm}
            setReloadData={() => {
              setLevelGroupToEdit(null);
              setAddLevelsForm(false);
              fetchData(true);
              setReloadData();
            }}
            id={hierarchy_id}
            level_group={LevelGroupToEdit}
          />
        )}
      </div>
    );
  }
);

export default Levels;
