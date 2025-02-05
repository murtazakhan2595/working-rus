import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import {
  EmployeeID,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "../../../../utils/getValuesFromTables";
import moment from "moment";
import { OverviewCard } from "components";
import { PageLoader } from "../../../../components";
import JobsActions from "./JobsActions";
import ViewJobDetails from "./ViewJobDetails";
import { JobStatusLabel } from "../../../../components/StatusLabel";
import TableCustom from "../../../../components/CustomTable";

export default function JobListingsTable({
  posts,
  loading,
  fetchJobPosts,
  tableOptions,
}) {
  const [selectedJob, setSelectedJob] = useState(null);

  const columns = [
    {
      dataField: "id",
      text: "ID",
      formatter: (cell, row) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setSelectedJob({
              isOpen: true,
              jobId: row,
            });
          }}
        >
          <EmployeeID value={row.serial_number} />
        </div>
      ),
    },
    {
      dataField: "Job_Title",
      text: "Job Title",
      formatter: (cell, row) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setSelectedJob({
              isOpen: true,
              jobId: row,
            });
          }}
        >
          <OverviewCard
            title={row.Job_Title}
            avatarProps={{
              fallbackText: row.Job_Title?.charAt(0)?.toUpperCase(),
              text: row.Job_Title,
            }}
            showBadge={true}
            badgeLabel={row?.total_applications}
          />
        </div>
      ),
    },
    {
      dataField: "dateRange",
      text: "Date",
      formatter: (cell, row) =>
        `${moment(row.updated_at).format("DD-MM-YYYY")}`,
    },
    {
      dataField: "Work_type",
      text: "Work Type",
      formatter: (cell, row) => (
        <JobStatusLabel label={getWorkType(row.Work_type)} type="workType" />
      ),
    },
    {
      dataField: "Job_Type",
      text: "Job Type",
      formatter: (cell, row) => (
        <JobStatusLabel label={getJobType(row.Job_Type)} type="jobType" />
      ),
    },
    {
      dataField: "Employee_Type",
      text: "Employee Type",
      formatter: (cell, row) => (
        <JobStatusLabel
          label={getEmployeeType(row.Employee_Type)}
          type="employeeType"
        />
      ),
    },
    {
      dataField: "location",
      text: "Job Location",
      formatter: (cell, row) => <Badge variant="outline">{row.location}</Badge>,
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <JobsActions row={row} fetchJobPosts={fetchJobPosts} />
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={columns}
            data={posts.results || []}
            tableOptions={tableOptions}
            dataTotalSize={posts.count || 0}
            pagination={true}
            // itemsPerPage={10}
            className="job-listings-table"
          />
        )}
      </CardContent>
      {selectedJob?.isOpen && (
        <ViewJobDetails
          isOpen={selectedJob?.isOpen}
          setIsOpen={() => setSelectedJob(null)}
          job={selectedJob?.jobId}
          fetchJobPosts={fetchJobPosts}
          posts={posts}
        />
      )}
    </Card>
  );
}
