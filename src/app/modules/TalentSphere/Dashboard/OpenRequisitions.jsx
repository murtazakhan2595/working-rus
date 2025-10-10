import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { TableCustom } from "components";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DepartmentName } from "utils/getValuesFromTables";
import DropdownActionMenu from "components/DropdownActionMenu";

const OpenRequisitions = ({ data, loading }) => {
  const navigate = useNavigate();

  // Helper function to get approved date from approval logs
  const getApprovedDate = (approval_logs) => {
    const approvalLog = approval_logs?.find(
      (log) => log.action_type === "APPROVED"
    );
    return approvalLog?.timestamp
      ? moment(approvalLog.timestamp).format("DD-MMM-YYYY")
      : "N/A";
  };

  // Filter for open requisitions (approved or pending)
  const openRequisitions = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(
      (req) => req.status === "approved" || req.status === "pending"
    );
  }, [data]);

  const handleViewDetails = (row) => {
    const targetTab =
      row.status === "pending"
        ? "requisition-requests"
        : "generate-requisition";

    navigate(`/talent-sphere/requisition-planning`, {
      state: {
        filterRequisition: row.id,
        tab: targetTab,
        requisitionData: row,
      },
    });
  };

  const handlePublishVacancy = (row) => {
    navigate(`/talent-sphere/requisition-planning`, {
      state: {
        filterRequisition: row.id,
        tab: "generate-requisition",
        action: "publish",
        requisitionData: row,
      },
    });
  };

  const handleViewVacancy = (row) => {
    navigate(`/talent-sphere/requisition-planning`, {
      state: {
        filterRequisition: row.id,
        tab: "published-vacancies",
        action: "view",
        requisitionData: row,
      },
    });
  };

  const handleViewApplicants = (row) => {
    navigate(
      `/talent-sphere/requisition-applicants?recruitment_requisition=${row.id}`
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "Requisition ID",
      formatter: (cell) => `REQ-${cell.toString().padStart(3, "0")}`,
      style: { width: "100px" },
    },
    {
      dataField: "job_title",
      text: "Job Title",
      style: { minWidth: "150px" },
    },
    {
      dataField: "department",
      text: "Department",
      formatter: (cell) => <DepartmentName value={cell} />,
      style: { width: "120px" },
    },
    {
      dataField: "number_of_positions",
      text: "No. of Positions",
      style: { width: "100px" },
    },
    {
      dataField: "approval_logs",
      text: "Approved On",
      formatter: (cell) => getApprovedDate(cell),
      style: { width: "100px" },
    },
    {
      dataField: "is_publish",
      text: "Published",
      formatter: (cell) => (
        <Badge variant={cell ? "default" : "secondary"} className="text-xs">
          {cell ? "Yes" : "No"}
        </Badge>
      ),
      style: { width: "80px" },
    },
    {
      dataField: "total_applicants",
      text: "Total Applicants",
      formatter: (cell) => cell || 0,
      style: { width: "120px" },
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => (
        <Badge
          variant={cell === "approved" ? "default" : "secondary"}
          className="text-xs"
        >
          {cell.charAt(0).toUpperCase() + cell.slice(1)}
        </Badge>
      ),
      style: { width: "100px" },
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => {
        // Build additional actions array based on row status
        const additionalActions = [];

        // Always show View Details
        additionalActions.push({
          text: "View Details",
          action: () => handleViewDetails(row),
        });

        // Show Publish Vacancy if approved and not published
        if (row.status === "approved" && !row.is_publish) {
          additionalActions.push({
            text: "Publish Vacancy",
            action: () => handlePublishVacancy(row),
          });
        }

        // Show View Applicants if published and has applicants
        if (row.is_publish && row.total_applicants > 0) {
          additionalActions.push({
            text: `View Applicants (${row.total_applicants})`,
            action: () => handleViewApplicants(row),
          });
        }

        return (
          <DropdownActionMenu
            menuTooltip="Requisition Actions"
            additionalOptionsConfig={additionalActions}
          />
        );
      },
      style: { width: "80px" },
    },
  ];

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Open Requisitions
          </CardTitle>
          <CardDescription>Requisitions awaiting action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-plum-900">
              Open Requisitions
            </CardTitle>
            <CardDescription>
              {openRequisitions.length} requisitions awaiting action
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/talent-sphere/requisition-planning")}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!openRequisitions || openRequisitions.length === 0 ? (
          <div className="text-center py-8 text-neutral-900">
            No open requisitions found
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <TableCustom
              columns={columns}
              data={openRequisitions}
              pagination={false}
              tableOptions={{
                page: 1,
                sizePerPage: 10,
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenRequisitions;
