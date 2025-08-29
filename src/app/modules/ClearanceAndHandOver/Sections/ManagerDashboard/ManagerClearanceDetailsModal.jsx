// src/app/modules/ClearanceAndHandOver/Sections/ManagerDashboard/ManagerClearanceDetailsModal.jsx

import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  EmployeeOverview,
  StatusLabel,
  TableCustom,
} from "components";
import { toast } from "react-toastify";
import {
  getClearanceRequestItems,
  getClearanceActionLogs,
} from "app/hooks/clearanceAndHandover";
import { renderDate } from "utils/renderValues";
import { Badge } from "components/ui/badge";
import { Progress } from "src/@/components/ui/progress";
import { Button } from "components/ui/button";
import { Send, AlertTriangle, FileText } from "lucide-react";

// Reuse action logs columns from clearance records
const ActionLogsColumns = () => [
  {
    dataField: "checklist_item",
    text: "Item",
    sort: true,
    formatter: (cell) => `#${cell || "N/A"}`,
    width: "80px",
  },
  {
    dataField: "action",
    text: "Action",
    sort: true,
    formatter: (cell) => (
      <Badge
        variant={
          cell === "CLEAR" ? "success" : cell === "REJECT" ? "error" : "info"
        }
      >
        {cell || "N/A"}
      </Badge>
    ),
    width: "100px",
  },
  {
    dataField: "e_signature_status",
    text: "E-Signature",
    sort: true,
    formatter: (cell) => (
      <Badge variant={cell === "ACKNOWLEDGED" ? "success" : "warning"}>
        {cell?.replace("_", " ") || "N/A"}
      </Badge>
    ),
    width: "120px",
  },
  {
    dataField: "timestamp",
    text: "Date & Time",
    sort: true,
    formatter: (cell) => renderDate(cell, "--", "date-time") || "N/A",
    width: "150px",
  },
  {
    dataField: "notes",
    text: "Notes",
    sort: false,
    formatter: (cell) => (
      <div className="max-w-xs truncate" title={cell}>
        {cell || "-"}
      </div>
    ),
  },
];

// Checklist Items Table Columns
const ChecklistItemsColumns = (onSendReminder) => [
  {
    dataField: "checklist_name",
    text: "Item Name",
    sort: true,
    formatter: (cell) => (
      <div className="font-medium text-neutral-1200 capitalize">
        {cell || "Checklist Item"}
      </div>
    ),
  },
  {
    dataField: "assignment_scope",
    text: "Assignment Scope",
    sort: true,
    formatter: (cell) => (
      <Badge variant="info" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    formatter: (cell) => {
      const variants = {
        APPROVED: "success",
        REJECTED: "error",
        NOT_APPLICABLE: "neutral",
        PENDING: "warning",
      };

      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "PENDING"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "e_signature_status",
    text: "E-Signature",
    sort: true,
    formatter: (cell) => {
      if (cell === "NOT_REQUIRED")
        return <Badge variant="secondary">Not Required</Badge>;
      if (cell === "ACKNOWLEDGED")
        return <Badge variant="success">Acknowledged</Badge>;
      if (cell === "PENDING") return <Badge variant="warning">Pending</Badge>;
      return <Badge variant="secondary">-</Badge>;
    },
  },
  {
    dataField: "updated_at",
    text: "Last Updated",
    sort: true,
    formatter: (cell) => renderDate(cell) || "Never",
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    csvExport: false,
    formatter: (cell, row) => {
      const isPending = row.status === "PENDING";
      const isLocked = row.is_locked;

      return (
        <div className="flex gap-2">
          {isPending && !isLocked && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendReminder(row)}
              className="text-xs"
              title="Send reminder to responsible department"
            >
              <Send className="h-3 w-3 mr-1" />
              Remind
            </Button>
          )}
          {isLocked && (
            <Badge variant="error" className="text-xs">
              Locked
            </Badge>
          )}
        </div>
      );
    },
    style: {
      textAlign: "center",
    },
  },
];

const ManagerClearanceDetailsModal = ({
  isOpen = false,
  setIsOpen = () => {},
  clearanceRequest,
  reload = () => {},
  clearanceTypes = [],
  clearanceList = [], // For navigation
}) => {
  const [checklistItems, setChecklistItems] = useState([]);

  const getClearanceTypeName = (typeId) => {
    if (!Array.isArray(clearanceTypes)) return "N/A";
    const type = clearanceTypes.find((t) => t.id === typeId);
    return type?.name || "N/A";
  };

  // Calculate progress from checklist items
  const calculateProgress = () => {
    if (checklistItems.length === 0) return 0;
    const completedItems = checklistItems.filter(
      (item) => item.status === "APPROVED" || item.status === "NOT_APPLICABLE"
    ).length;
    return Math.round((completedItems / checklistItems.length) * 100);
  };

  // Handle sending reminder for specific checklist item
  const handleSendItemReminder = async (item) => {
    try {
      // TODO: Implement when backend provides specific item reminder API
      toast.success(
        `Reminder sent for "${item.checklist_name}" to responsible department`
      );
    } catch (error) {
      console.error("Error sending item reminder:", error);
      toast.error("Failed to send reminder");
    }
  };

  // This function will be called by NavigationSheetComponent
  const fetchCurrentRequestDetails = async (id, isMounted) => {
    try {
      // Find the request from the list first
      let request = clearanceList.find((r) => r.id === id) || clearanceRequest;

      // Fetch checklist items
      const itemsPayload = {
        filterData: { request: id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "id",
      };

      const itemsResponse = await getClearanceRequestItems(itemsPayload);
      const items = itemsResponse?.results || [];

      // Fetch action logs
      const logsPayload = {
        filterData: { checklist_request: id },
        options: { page: 1, sizePerPage: 100 },
        ordering: "-timestamp",
      };

      const logsResponse = await getClearanceActionLogs(logsPayload);

      if (isMounted) {
        setChecklistItems(items);

        // Attach data to request for use in fields
        request = {
          ...request,
          checklistItems: items,
          actionLogs: logsResponse?.results || [],
        };

        return request;
      }
    } catch (error) {
      console.error("Error fetching clearance request details:", error);
      if (isMounted) {
        toast.error("Failed to load clearance details");
      }
      return clearanceRequest; // Fallback to original request
    }
  };

  // Define the fields to display
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
            <div className="flex items-center gap-2">
              <StatusLabel
                status={data?.status}
                variant={
                  data?.status === "COMPLETED"
                    ? "success"
                    : data?.status === "IN_PROCESS"
                    ? "info"
                    : data?.status === "REJECTED"
                    ? "error"
                    : data?.status === "ONHOLD"
                    ? "error"
                    : "warning"
                }
              >
                {data?.status?.replace("_", " ") || "Unknown"}
              </StatusLabel>
              {data?.status === "ONHOLD" && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Clearance Details",
      footerTitle: "Request Started At",
      footerField: "start_date",
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
          formatter: (cell) => renderDate(cell) || "Not completed yet",
        },
      ],
    },
    // Hold Warning if on hold
    ...(clearanceRequest?.status === "ONHOLD"
      ? [
          {
            title: "Hold Information",
            customContent: true,
            renderContent: (data) => (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Clearance on Hold
                    </h4>
                    <p className="text-sm text-red-700 mb-2">
                      This clearance is currently on hold. All actions are
                      blocked until the hold is removed.
                    </p>
                    {data?.on_hold_reason && (
                      <div className="text-sm text-red-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {data.on_hold_reason}
                      </div>
                    )}
                    {data?.on_hold_attachment && (
                      <div className="flex items-center gap-1 mt-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <a
                          href={data.on_hold_attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-800 hover:underline font-medium"
                        >
                          View Hold Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      title: "Progress Overview",
      customContent: true,
      renderContent: (data) => {
        const progress = calculateProgress();
        return (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-sm font-medium text-neutral-1100">
                Overall Progress:
              </span>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-neutral-1200">
                    {progress}%
                  </span>
                </div>
                <span className="text-xs text-neutral-1000">
                  {
                    checklistItems.filter(
                      (item) =>
                        item.status === "APPROVED" ||
                        item.status === "NOT_APPLICABLE"
                    ).length
                  }{" "}
                  of {checklistItems.length} items completed
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-neutral-1100">
                Pending Items:
              </span>
              <div className="mt-2">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    checklistItems.filter((item) => item.status === "PENDING")
                      .length
                  }
                </div>
                <span className="text-xs text-neutral-1000">
                  Items awaiting action
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Checklist Items",
      customContent: true,
      renderContent: (data) => {
        const items = data?.checklistItems || checklistItems || [];

        if (!items || items.length === 0) {
          return (
            <div className="text-center py-8 text-neutral-1100">
              <p>No checklist items found for this clearance request.</p>
            </div>
          );
        }

        return (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-neutral-1100">
                Track individual checklist items and send targeted reminders
              </span>
              <Badge variant="info" className="text-xs">
                {items.length} Total Items
              </Badge>
            </div>
            <TableCustom
              columns={ChecklistItemsColumns(handleSendItemReminder)}
              data={items}
              tableOptions={{
                page: 1,
                sizePerPage: 100,
                onPageChange: () => {},
                onSortChange: () => {},
              }}
              dataTotalSize={items.length}
              pagination={false}
              fallbackText="No checklist items available"
              className="border-0"
            />
          </div>
        );
      },
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
                Logs will appear as departments take actions on checklist items.
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
                onPageChange: () => {},
                onSortChange: () => {},
              }}
              dataTotalSize={actionLogs.length}
              pagination={false}
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
      title="Team Member Clearance Details"
      currentItem_Id={clearanceRequest?.id}
      dataList={clearanceList}
      reloadData={reload}
      allowEdit={false} // Managers can't directly edit clearance
      allowDelete={false} // Managers can't delete clearance
      fetchCurrentItemDetails={fetchCurrentRequestDetails}
      deleteItemName="employee_name"
      editTooltip="Edit Clearance"
      deleteTooltip="Delete Clearance"
    >
      <DetailContent title="Clearance Information" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ManagerClearanceDetailsModal;
