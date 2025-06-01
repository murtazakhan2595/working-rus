import React, { useState, useEffect } from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import { AddUpdateDelegateLevels } from "app/modules/ApprovalHierarchy";
import {
  getDelegateLevelData,
  getHierarchyLevelData,
} from "app/hooks/approvalHierarchy";
import {
  FormatID,
  EmployeeUsername,
  DesignationName,
  BranchName,
  DepartmentName,
  EmployeeName,
} from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { StatusLabel } from "components";

const DelegateDetails = ({
  isOpen,
  setIsOpen,
  current_id,
  reloadData = () => {},
  LevelDelegateList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Level Details",
      field: [
        {
          key: "initiative_designation",
          label: "Request Initiator",
          formatter: (cell) => {
            if (!cell || !Array.isArray(cell) || cell.length === 0) return "--";
            return (
              <div className="flex flex-wrap gap-2">
                {cell.map((designation) => (
                  <StatusLabel variant="info">
                    <DesignationName value={designation} />
                  </StatusLabel>
                ))}
              </div>
            );
          },
        },
        { key: "level_number", label: "Level Number" },
        {
          key: "designation",
          label: "Designation",
          formatter: (cell) => <DesignationName value={cell} />,
        },
        {
          key: "auto_forward_enabled",
          label: "Auto-Farword",
          formatter: (cell) => (cell ? "Enabled" : "Disabled"),
        },
      ],
    },
    {
      title: "Delegate Details",
      field: [
        {
          key: "branch",
          label: "Branch",
          formatter: (cell) => <BranchName value={cell} />,
        },
        {
          key: "department",
          label: "Department",
          formatter: (cell) => <DepartmentName value={cell} />,
        },
        {
          key: "delegate",
          label: "Delegate User",
          formatter: (cell) => <EmployeeName value={cell} />,
        },
        {
          key: "start_date",
          label: "Start Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "end_date",
          label: "End Date",
          formatter: (cell) => renderDate(cell),
        },
        { key: "reason", label: "Reason" },
      ],
    },
     
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getDelegateLevelData(id);
      if (isMounted) {
        if (response.level) {
          const responseLevel = await getHierarchyLevelData(response.level);
          const delegationdata = { ...responseLevel, ...response };
          return delegationdata;
        } else {
          return response;
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      return {};
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delegate Detail"
      dataList={LevelDelegateList}
      reloadData={reloadData}
      editComponent={AddUpdateDelegateLevels}
      currentItem_Id={current_id}
      apiEndpoint={`/delegations/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="Delegate"
      editTooltip="Edit Delegate"
      deleteTooltip="Delete Delegate"
      //   additionalEditProps={{
      //     editMode: true,
      //     branchData: data,
      //   }}
    >
      <DetailContent title="Delegate Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default DelegateDetails;
