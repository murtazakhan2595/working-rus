import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddRatingScaleSetupForm from "./AddRatingScaleSetupForm";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getRatingScaleSetupData } from "app/hooks/officeSetting";
const ViewRatingScaleSetup = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => { },
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Rating Scale Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"RSS-"} />,
        },
        { key: "name", label: "Name" },
        {
          key: "scale_type",
          label: "Scale Type",
          formatter: (cell) => <div className="text-capitalize">{cell}</div>,
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getRatingScaleSetupData(id);
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
      title="Rating Scale Details"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      editComponent={AddRatingScaleSetupForm}
      apiEndpoint={"/RatingScale/${id}/"}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Rating Scale"
      deleteTooltip="Delete Rating Scale"
    >
      <DetailContent fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewRatingScaleSetup;
