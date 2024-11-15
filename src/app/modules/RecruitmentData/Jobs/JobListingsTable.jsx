import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import CustomTable from "../../../../components/CustomTable";

import { Badge } from "../../../../components/ui/badge";
import {
  EmployeeID,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "../../../../utils/getValuesFromTables";
import moment from "moment";
import EmployeeNameInfo from "../../../../components/EmployeeNameInfo";
import { PageLoader } from "../../../../components";
import JobsActions from "./JobsActions";
import ViewJobDetails from "./ViewJobDetails";

export default function JobListingsTable({ posts, loading ,fetchJobPosts }) {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedJob, setSelectedJob] = useState(null)


  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };



  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setSelectedJob({
        isOpen: true,
        JobId: row
      })
      // setIsSelectedLeaveSheet(true);
      // setSelectedLeave(row);
    },
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      formatter: (cell, row) => <EmployeeID value={row.serial_number} />,
    },
    {
      dataField: "Job_Title",
      text: "Job Title",
      formatter: (cell, row) => (
          <EmployeeNameInfo
            className="relative"
            name={row.Job_Title}
            department={false}
            position={getJobType(row.Job_Type)}
            showBadge={true}
            row={row}
          />
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
        <Badge
          variant="secondary"
          className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full"
        >
          {getWorkType(row.Work_type)}
        </Badge>
      ),
    },
    {
      dataField: "Job_Type",
      text: "Job Type",
      formatter: (cell, row) => (
        <Badge
          variant="secondary"
          className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full"
        >
          {getJobType(row.Job_Type)}
        </Badge>
      ),
    },
    {
      dataField: "Employee_Type",
      text: "Employee Type",
      formatter: (cell, row) => (
        <Badge
          variant="secondary"
          className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full"
        >
          {getEmployeeType(row.Employee_Type)}
        </Badge>
      ),
    },
    {
      dataField: "location",
      text: "Job Location",
      formatter: (cell, row) => (
        <Badge variant="outline">{row.location}</Badge>
      ),
    },
    {
      text:"Action",
      formatter: (cell, row)=>(
        <JobsActions row={row} fetchJobPosts={fetchJobPosts}/>
      )
    }
  ];

  return (
    <Card>
      <CardContent>
        {loading ? (
          <PageLoader />
        ) : (
          <CustomTable
            columns={columns}
            data={posts.results || []}
            tableOptions={tableOptions}
            dataTotalSize={posts.count || 0}
            pagination={true}
            itemsPerPage={10}
            className="job-listings-table"
          />
        )}
      </CardContent>
      {
        selectedJob?.isOpen && (
          <ViewJobDetails
            isOpen={selectedJob?.isOpen}
            setIsOpen={()=> setSelectedJob(null)}
            job={selectedJob?.JobId}
            fetchJobPosts={fetchJobPosts}
            posts={posts}
          />
        )
      }
    </Card>
  );
}
