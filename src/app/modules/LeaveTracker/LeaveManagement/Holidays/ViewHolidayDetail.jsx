import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, EmployeeDetailUI } from "components";
import { getHolidayData } from "app/hooks/leaveTracker";
import { MultiStatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { BranchName } from "utils/getValuesFromTables";
import { toast } from "react-toastify";
import { AddUpdateHolidays } from "app/modules/LeaveTracker";
import { handleRequest } from "app/hooks/general";

const ViewHolidayDetail = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Holiday Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        {
          key: "name",
          label: "Holiday Name",
        },
        {
          key: "date",
          label: "Start Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "end_date",
          label: "End Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "country",
          label: "Countries",
          formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true}/>
        },
        {
          key: "branch_names",
          label: "Branches",
          formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true}/>
        },
        {
          key: "religion",
          label: "Religion",
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getHolidayData(id);
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
      title="Holiday Details"
      currentItem_Id={currentId}
      dataList={DataList}
      editComponent={AddUpdateHolidays}
      apiEndpoint={"/holidays/${id}/"}
      reloadData={reloadData}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="Public Holiday"
      editTooltip="Edit Holiday"
      deleteTooltip="Delete Holiday"
    >
      <DetailContent title="Holiday Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewHolidayDetail;
