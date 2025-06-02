import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getTimeAdjustmentData } from "app/hooks/attendance";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";

const TimeAdjustmentDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        console.log(data,'TimeAdjustmentDetailsTimeAdjustmentDetails');
        return (
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex flex-col gap-2">
              <EmployeeOverview
                id={data.employee_id}
                showId={true}
                showEmail={true}
              />
              <StatusLabel className="ml-10" status={data.status}>
                {data.status}
              </StatusLabel>
            </div>
          </div>
        );
      },
    },
    {
      title: "Adjustment Details",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"TA-"} />,
        },
        { key: "name", label: "Name" },
        {
          key: "date",
          label: "Attendance Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
    },
      {
      title: "Approval Details",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"TA-"} />,
        },
        { key: "name", label: "Name" },
        {
          key: "date",
          label: "Attendance Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
    },
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-end gap-2 mt-5">
            <Button variant="success">Approve</Button>
            <Button variant="destructive">Reject</Button>
          </div>
        );
      },
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getTimeAdjustmentData(id);
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
      title="Time Adjustment Details"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      allowEdit={false}
      allowDelete={false}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Grace Time"
      deleteTooltip="Delete Geace Time"
    >
      <DetailContent title="Adjustment Time Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default TimeAdjustmentDetails;
