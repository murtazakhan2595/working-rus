import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { StatusLabel, SheetUI, EmployeeDetailUI } from "components";
import { getEligibleLeaveTypeByEmployeeId } from "app/hooks/leaveTracker";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextAreaInput } from "components/FormControl";
import { handleRequest } from "app/hooks/general";

const FormSheetData = {
  triggerText: "Submit",
  title: "Reject Attendance Update Request",
  description: null,
  footer: null,
  className: "max-w-[478px] w-full h-[400px]",
};
const ViewEmployeeLeaveCount = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
 

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getEligibleLeaveTypeByEmployeeId(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Leave Details"
        currentItem_Id={currentId}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        deleteItemName="name"
        editTooltip="Edit Leave"
        deleteTooltip="Delete Leavr"
      >
        <AllocatedLeavesInfo />
      </NavigationSheetComponent>
    </>
  );
};

export default ViewEmployeeLeaveCount;

const AllocatedLeavesInfo = ({ currentItem, currentItemId }) => {
  if (!currentItem || !Array.isArray(currentItem) || currentItem.length === 0)
    return (
      <>
        <EmployeeInfo employee_id={currentItemId}></EmployeeInfo>
        <DetailCard detailCardTitle={"No Leaves Alloted"}>
          Currently no leave type is alloted to the current employee.
        </DetailCard>
      </>
    );

  return (
    <div>
      <EmployeeInfo employee_id={currentItemId}></EmployeeInfo>
      {currentItem.map(
        ({
          name: title,
          allotted_count = 0,
          balance_count,
          consumed_count,
          carry_forward,
          id,
        }) => {
          return(
          <DetailCard detailCardTitle={title}>
            <DetailBox label={"Alloted Leaves"} value={allotted_count || "0"} />
            <DetailBox
              label={"Remaining Leaves"}
              value={balance_count || "0"}
            />
            <DetailBox
              label={"Consumed Leaves"}
              value={consumed_count || "0"}
            />
            <DetailBox label={"Carry Forward"} value={carry_forward || "0"} />
          </DetailCard>
        )}
      )}
    </div>
  );
};

const EmployeeInfo = ({ employee_id }) => {
  return (
    <>
      <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
        <EmployeeOverview
          id={employee_id}
          showId={true}
          showEmail={true}
          avatarSize={16}
        />
      </div>
      <DetailCard detailCardTitle={"Employee Details"}>
        <EmployeeDetailUI
          id={employee_id}
          InformationKeys={[
            "name",
            "department",
            "position",
            "branch",
            "manager",
          ]}
          ViewVariant={"vertical"}
        />
      </DetailCard>
    </>
  );
};
