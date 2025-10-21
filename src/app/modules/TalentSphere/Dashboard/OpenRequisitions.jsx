import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { TableCustom, StatusLabel } from "components";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DepartmentName, FormatID } from "utils/getValuesFromTables";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewRequisitionRequest, AddUpdateVacancyForm } from "app/modules/TalentSphere";

const OpenRequisitions = ({ data, loading }) => {
  const navigate = useNavigate();
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);

  // Filter for open requisitions (approved or pending)
  const openRequisitions = data;

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handlePublishVacancy = (row) => {
    setSelectedRow(row);
    setPublishOpen(true);
  };

  // Note: view vacancy action is handled via navigation in other flows if needed

  const handleViewApplicants = (row) => {
    navigate(
      `/talent-sphere/requisition-applicants?recruitment_requisition=${row.id}`
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "Requisition ID",
      formatter: (cell) => FormatID({ value: cell, prefix: "RR-" }),
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
      dataField: "approved_on",
      text: "Approved On",
      formatter: (cell) => (cell ? moment(cell).format("DD-MMM-YYYY") : "N/A"),
      style: { width: "120px" },
    },
    {
      dataField: "is_publish",
      text: "Published",
      formatter: (cell, row) => {
        const published = Boolean(cell) || row?.status === "published";
        return (
          <Badge variant={published ? "default" : "secondary"} className="text-xs">
            {published ? "Yes" : "No"}
          </Badge>
        );
      },
      style: { width: "80px" },
    },
    {
      dataField: "total_applicants",
      text: "Total Applicants",
      formatter: (cell, row) => {
        const count = row?.total_applicants ?? row?.total_applications ?? 0;
        return count;
      },
      style: { width: "120px" },
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => {
        const effective = cell === "published" ? "approved" : cell;
        return (
          <StatusLabel status={effective}>
            {effective.charAt(0).toUpperCase() + effective.slice(1)}
          </StatusLabel>
        );
      },
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
        {viewOpen && (
          <ViewRequisitionRequest
            isOpen={viewOpen}
            setIsOpen={() => setViewOpen(false)}
            reloadData={() => setViewOpen(false)}
            currentId={selectedRow?.id}
            DataList={openRequisitions}
            isTeamView={false}
          />
        )}
        {publishOpen && (
          <AddUpdateVacancyForm
            isOpen={publishOpen}
            setIsOpen={() => setPublishOpen(false)}
            reloadData={() => setPublishOpen(false)}
            requisition_id={selectedRow?.id}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OpenRequisitions;
