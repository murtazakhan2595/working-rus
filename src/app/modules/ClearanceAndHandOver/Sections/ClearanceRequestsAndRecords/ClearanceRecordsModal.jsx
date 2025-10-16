import React from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  EmployeeOverview,
  StatusLabel,
  TableCustom,
} from "components";
import { toast } from "react-toastify";
import { getClearanceActionLogs } from "app/hooks/clearanceAndHandover";
import { renderDate } from "utils/renderValues";
import { ActionLogsColumns } from "./ClearanceRecordsColumns";

const ClearanceRecordsModal = ({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRecord,
  reload = () => {},
  clearanceTypes = [],
  clearanceRecords = [], // For navigation
}) => {
  const getClearanceTypeName = (typeId) => {
    if (!Array.isArray(clearanceTypes)) return "N/A";
    const type = clearanceTypes.find((t) => t.id === typeId);
    return type?.name || "N/A";
  };

  // This function will be called by NavigationSheetComponent
  const fetchCurrentRecordDetails = async (id, isMounted) => {
    try {
      // Find the record from the list first
      let record = clearanceRecords.find((r) => r.id === id) || clearanceRecord;

      // Fetch action logs and attach them to the record
      const payload = {
        filterData: { checklist_request: id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "-timestamp",
      };

      const logsResponse = await getClearanceActionLogs(payload);

      // Attach action logs to the record for use in fields
      record = {
        ...record,
        actionLogs: logsResponse?.results || [],
      };

      if (isMounted) {
        return record;
      }
    } catch (error) {
      console.error("Error fetching clearance record details:", error);
      if (isMounted) {
        toast.error("Failed to load clearance details");
      }
      return clearanceRecord; // Fallback to original record
    }
  };

  // Define the fields to display - this works with your existing DetailContent
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <EmployeeOverview
              id={data?.employee}
              showId={true}
              showEmail={true}
              showDepartment={true}
              showPosition={true}
              showBranchName={true}
              avatarSize={16}
            />
            <StatusLabel status="Completed" variant="success">
              Completed
            </StatusLabel>
          </div>
        );
      },
    },
    {
      title: "Clearance Details",
      footerTitle: "Request Completed At",
      footerField: "completion_date",
      field: [
        {
          key: "clearance_type",
          label: "Clearance Type",
          formatter: (cell) => getClearanceTypeName(cell),
        },
        {
          key: "start_date",
          label: "Start Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "completion_date",
          label: "Completion Date",
          formatter: (cell) => renderDate(cell) || "N/A",
        },
      ],
    },
    {
      title: "Action Logs Audit Trail",
      customContent: true,
      renderContent: (data) => {
        const actionLogs = data?.actionLogs || [];

        if (!actionLogs || actionLogs.length === 0) {
          return (
            <div className="text-center py-8 text-muted-900">
              <p>No action logs found for this clearance request.</p>
              <p className="text-sm mt-2">
                This may indicate the clearance was processed before audit
                logging was enabled.
              </p>
            </div>
          );
        }

        return (
          <div className="mt-4">
            <TableCustom
              columns={ActionLogsColumns()}
              data={actionLogs}
              tableOptions={{
                page: 1,
                sizePerPage: 100,
                onPageChange: () => {}, // No pagination needed for action logs
                onSortChange: () => {}, // No sorting needed for action logs
              }}
              dataTotalSize={actionLogs.length}
              pagination={false} // Disable pagination for action logs
              fallbackText="No action logs available"
              className="border-0"
            />
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
    reload();
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="Clearance Record Details"
      currentItem_Id={clearanceRecord?.id}
      dataList={clearanceRecords}
      reloadData={reload}
      allowEdit={false} // Records are read-only
      allowDelete={false} // Records are read-only
      fetchCurrentItemDetails={fetchCurrentRecordDetails}
      deleteItemName="employee_name"
      editTooltip="Edit Clearance Record"
      deleteTooltip="Delete Clearance Record"
    >
      <DetailContent title="Clearance Record Information" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ClearanceRecordsModal;
