import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddBranchForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
const ViewGraceTime = ({
  isOpen,
  setIsOpen,
  data,
  reload = () => {},
  BranchList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      key: "id",
      label: "Id",
      formatter: (cell, row) => <FormatID value={cell} prefix={"GT-"} />,
    },
    { key: "name", label: "Name" },
    {
      key: "grace_time_minutes",
      label: "Grace Time",
      formatter: (cell) => `${cell}min`,
    },
    {
      key: "branches",
      label: "Branches",
      formatter: (cell) => {
        if (!cell || cell.length === 0) {
          return "--";
        }
        return (
          <div className="flex flex-wrap gap-1">
            {cell.map((branch) => (
              <StatusLabel variant={"info"}>
                <BranchName value={branch} />
              </StatusLabel>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Grace Time"
      data={data}
      dataList={BranchList}
      reload={reload}
      editComponent={AddBranchForm}
      deleteEndpoint={`/branch/${data?.id}`}
      refreshEndpoint="/branch"
      deleteItemName="branch_name"
      editTooltip="Edit Branch"
      deleteTooltip="Delete Branch"
      additionalEditProps={{
        editMode: true,
        branchData: data,
      }}
    >
      <DetailContent title="Grace Time Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewGraceTime;
