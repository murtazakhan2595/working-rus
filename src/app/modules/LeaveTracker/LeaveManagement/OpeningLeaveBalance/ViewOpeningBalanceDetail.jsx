import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
  EmployeeOverview,
} from "components";
import { getLeaveOpeningBalanceById } from "app/hooks/leaveTracker";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getLeaveTypes } from "app/hooks/leaveTracker";
import AddUpdateLeaveBalance from "./AddUpdateLeaveBalance";
import { getOpeningBalanceSummaryByEmpSerialNumber } from "app/hooks/leaveTracker";
import { EmployeeID } from "utils/getValuesFromTables";

const ViewOpeningBalanceDetail = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const [currentItem, setCurrentItem] = useState(null);

  // Transform DataList to ensure each item has an id field
  const transformedDataList = DataList.map((item) => ({
    ...item,
    id: item.id || item.serial_number,
  }));

  // Add debugging
  console.log("ViewOpeningBalanceDetail - currentId:", currentId);
  console.log("ViewOpeningBalanceDetail - DataList length:", DataList.length);

  // Define the fields to display
  const fields = [
    {
      title: "Leave Opening Balance Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        {
          key: "serial_number",
          label: "Employee ID",
          formatter: (cell) => <EmployeeID value={cell} />,
        },
        {
          key: "employee",
          label: "Employee",
        },
        {
          key: "leave_balances",
          label: "Leave Balances",
          formatter: (cell) => (
            <div className="flex flex-col gap-1">
              {cell && cell.length > 0 ? (
                cell.map((balance, index) => (
                  <div key={index}>
                    <span className="text-sm">{balance.leave_type}: </span>
                    <span className="text-blue-600 text-sm">
                      Alloted: {balance.total_allotted}, Consumed:{" "}
                      {balance.consumed}, Remaining: {balance.remaining}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No leave balances</span>
              )}
            </div>
          ),
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getOpeningBalanceSummaryByEmpSerialNumber(id);

      if (isMounted) {
        // Handle the response format - could be array or object
        let transformedResponse ={
          ...response[0],
          id: response[0]?.serial_number
        }
        setCurrentItem(transformedResponse);
        console.log("Transformed response:", transformedResponse);
        return transformedResponse;
      }
    } catch (error) {
      return null;
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Leave Opening Balance Details"
      currentItem_Id={currentId}
      dataList={transformedDataList}
      editComponent={AddUpdateLeaveBalance}
      apiEndpoint={`/leave-openingbalance/${currentId}/`}
      reloadData={reloadData}
      fetchCurrentItemDetails={fetchData}
      editTooltip="Edit Leave Opening Balance"
      allowDelete={false}
    >
      <div className="">
        {/* Leave Opening Balance Details */}
        <DetailContent currentItem={currentItem} fields={fields} />
      </div>
    </NavigationSheetComponent>
  );
};

export default ViewOpeningBalanceDetail;
