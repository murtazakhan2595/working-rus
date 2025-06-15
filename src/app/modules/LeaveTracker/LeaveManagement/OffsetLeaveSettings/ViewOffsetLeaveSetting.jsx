import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, EmployeeDetailUI } from "components";
import { getLeaveOffsetSettingData } from "app/hooks/leaveTracker";
import { MultiStatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { BranchName } from "utils/getValuesFromTables";
import { toast } from "react-toastify";
import { AddUpdateOffsetLeave } from "app/modules/LeaveTracker";
import { handleRequest } from "app/hooks/general";

const ViewOffsetLeaveSetting = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Eligibility Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        {
          key: "nationalities",
          label: "Nationalities",
          formatter: (cell) => (
            <MultiStatusLabel
              statusList={cell}
              variant="info"
              fallBackText="All Nationalities"
              displayAll={true}
            />
          ),
        },
        {
          key: "branches_name",
          label: "Branches",
          formatter: (cell) => (
            <MultiStatusLabel
              statusList={cell}
              variant="info"
              fallBackText="All Branches"
              displayAll={true}
            />
          ),
        },
        {
          key: "departments_name",
          label: "Departments",
          formatter: (cell) => (
            <MultiStatusLabel
              statusList={cell}
              variant="info"
              fallBackText="All Departments"
              displayAll={true}
            />
          ),
        },
        {
          key: "grades_name",
          label: "Job Grades / Designations",
          formatter: (cell) => (
            <MultiStatusLabel
              fallBackText="All Job Grades / Designations"
              statusList={cell}
              variant="info"
              displayAll={true}
            />
          ),
        },
        {
          key: "marital_statuses",
          label: "Marital Statuses",
          formatter: (cell) => (
            <MultiStatusLabel
              statusList={cell}
              fallBackText="All"
              variant="info"
              displayAll={true}
            />
          ),
        },
        {
          key: "genders",
          label: "Genders",
          formatter: (cell) => (
            <MultiStatusLabel
              statusList={cell}
              fallBackText="All Genders"
              variant="info"
              displayAll={true}
            />
          ),
        },
      ],
    },
    {
      title: "Conversion Rule",
      field: [
        {
          key: "conversion_ratio_hours",
          label: "Conversion Hours",
          formatter: (cell) => (
            <div className="flex gap-1 flex-row">
              <span>{cell}hr </span>
              <span className="text-neutral-800">
                ({`1 Offset Leave = ${cell} Overtime Hours`})
              </span>
            </div>
          ),
        },
      ],
    },
    {
      title: "Validity Details",
      field: [
        {
          key: "validity_months",
          label: "Validity Months",
          formatter: (cell) => <span>{cell} Months</span>,
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getLeaveOffsetSettingData(id);
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
      title="Offset Setting Details"
      currentItem_Id={currentId}
      dataList={DataList}
      editComponent={AddUpdateOffsetLeave}
      apiEndpoint={"/leave-offset-settings/${id}/"}
      reloadData={reloadData}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="Offset Setting"
      editTooltip="Edit Offset Setting"
      deleteTooltip="Delete Offset Setting"
    >
      <DetailContent fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewOffsetLeaveSetting;
