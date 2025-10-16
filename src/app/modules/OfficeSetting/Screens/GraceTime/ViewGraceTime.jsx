import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getGraceTimeData } from "app/hooks/officeSetting";
const ViewGraceTime = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => { },
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Grace Time Details",
      field: [
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
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getGraceTimeData(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Grace Time Details"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      editComponent={AddGraceTimeForm}
      apiEndpoint={"/grace-times/${id}/"}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Grace Time"
      deleteTooltip="Delete Grace Time"
    >
      <DetailContent fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewGraceTime;
