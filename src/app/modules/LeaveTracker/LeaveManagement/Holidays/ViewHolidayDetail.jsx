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
import { EmployeeOverview } from "components";
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
          formatter: (cell) => {
            if (!cell || cell?.length === 0) {
              return <span className="">All</span>;
            }
            return (
              <div className="flex flex-wrap gap-1">
                {cell.map((nationality) => (
                  <span
                    key={nationality}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {nationality}
                  </span>
                ))}
              </div>
            );
          },
        },
        {
          key: "branches",
          label: "Branches",
          formatter: (cell) => {
            if (!cell || cell?.length === 0) {
              return <span className="">All</span>;
            }
            return (
              <div className="flex flex-wrap gap-1">
                {cell.map((branch) => (
                  <StatusLabel variant="info">
                    <BranchName value={branch} />
                  </StatusLabel>
                ))}
              </div>
            );
          },
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
