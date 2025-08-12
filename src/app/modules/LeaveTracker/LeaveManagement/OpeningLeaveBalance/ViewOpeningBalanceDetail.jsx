import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
  EmployeeOverview, // Add this import
} from "components";
import { getLeaveOpeningBalanceById } from "app/hooks/leaveTracker";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getLeaveTypes } from "app/hooks/leaveTracker";
import AddUpdateLeaveBalance from "./AddUpdateLeaveBalance";

const ViewOpeningBalanceDetail = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  // Define the fields to display
  const fields = [
    {
      title: "Leave Opening Balance Details",
      footerTitle: "Created At",
      footerField: "created_at",
      field: [
        // Map leave type options to field
        {
          key: "leave_type",
          label: "Leave Type",
          formatter: (value) => {
            const leaveType = leaveTypeOptions.find(
              (type) => type.id === value
            );
            return leaveType?.name || "N/A";
          },
        },
        {
          key: "total_allotted",
          label: "Total Allotted",
        },
        {
          key: "consumed",
          label: "Consumed",
        },
        {
          key: "remaining",
          label: "Remaining",
        },
        {
          key: "remarks",
          label: "Remarks",
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getLeaveOpeningBalanceById(id);
      if (isMounted) {
        setCurrentItem(response); // Store the fetched data
        return response;
      }
    } catch (error) {
      console.error("Error fetching leave opening balance:", error);
    }
  };

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await getLeaveTypes({});
        console.log("Leave Types Response:", response);
        if (response?.results) {
          setLeaveTypeOptions(
            response.results.map((type) => ({
              value: type.id,
              label: type.name,
              leave_count: type.leave_count,
              ...type,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Leave Opening Balance Details"
      currentItem_Id={currentId}
      dataList={DataList}
      editComponent={AddUpdateLeaveBalance}
      apiEndpoint={`/leave-openingbalance/${currentId}/`}
      reloadData={reloadData}
      fetchCurrentItemDetails={fetchData}
      editTooltip="Edit Leave Opening Balance"
      allowDelete={false}
    >
      <div className="space-y-6">
        {/* Employee Overview */}
        {currentItem?.employee && (
          <div className="flex items-center justify-between w-full gap-4 ">
            <EmployeeOverview
              id={currentItem?.employee?.id || currentItem?.employee}
              showEmail={true}
              showDepartment={true}
              showPosition={true}
              showId={true}
              showBranchName={true}
            />
          </div>
        )}

        {/* Leave Opening Balance Details */}
        <DetailContent currentItem={currentItem} fields={fields} />
      </div>
    </NavigationSheetComponent>
  );
};

export default ViewOpeningBalanceDetail;
