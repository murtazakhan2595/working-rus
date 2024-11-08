import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import CustomTable from "../../../../components/CustomTable";
import { Button } from "../../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../src/@/components/ui/sheet";
import { Badge } from "../../../../components/ui/badge";
import { Link } from "react-router-dom";
import {
  EmployeeID,
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
} from "../../../../utils/getValuesFromTables";
import moment from "moment";
import EmployeeNameInfo from "../../../../components/EmployeeNameInfo";
import { PageLoader } from "../../../../components";
import JobsActions from "./JobsActions";

export default function JobListingsTable({ posts, loading }) {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  // const getPosts = async () => {
  //   setLoading(true)
  //   try {
  //     const data = await fetchJobPosts(filterData, sortData)
  //     setPosts(data)
  //   } catch (error) {
  //     console.error("Error fetching posts:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   getPosts()
  // }, [filterData, sortData])

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
  //   if (filterName === "sort_by_date") {
  //     setSortData(filterCheckStatus ? filterValue : "dsc")
  //   }
  //   setFilterData((prevFilters) => {
  //     const updatedFilters = { ...prevFilters }
  //     if (!filterValue || filterCheckStatus === false) {
  //       delete updatedFilters[filterName]
  //     } else {
  //       updatedFilters[filterName] = filterCheckStatus === false ? "" : filterValue
  //     }
  //     return updatedFilters
  //   })
  // }

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      formatter: (cell, row) => <EmployeeID value={row.id} />,
    },
    {
      dataField: "Job_Title",
      text: "Job Title",
      formatter: (cell, row) => (
          <EmployeeNameInfo
            className="relative"
            name={row.Job_Title}
            department={getEmployeeType(row.Employee_Type)}
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
      dataField: "location",
      text: "Job Location",
      formatter: (cell, row) => (
        <Badge variant="outline">{getWorkLocation(row.location)}</Badge>
      ),
    },
    {
      text:"Action",
      formatter: (cell, row)=>(
        <JobsActions row={row}/>
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
    </Card>
  );
}
