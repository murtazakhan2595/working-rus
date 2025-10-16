import React from "react";
import { NavigationSheetComponent } from "components"; 
import { DetailContent } from "components";
import AddEvaluationTypeForm from "./AddEvaluationTypeForm";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getEvaluationTypeData } from "app/hooks/officeSetting";
const ViewEvaluationType = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Evaluation Type Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"EVT-"} />,
        },
        { key: "name", label: "Name" },
        {
          key: "description",
          label: "Description",
          formatter: (cell) => `${cell}min`,
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getEvaluationTypeData(id);
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
      title="Evaluation Type Details"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      editComponent={AddEvaluationTypeForm}
      apiEndpoint={"/evaluation-types/${id}/"}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Evaluation Type"
      deleteTooltip="Delete Evaluation Type"
    >
      <DetailContent title="Evaluation Type Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewEvaluationType;
