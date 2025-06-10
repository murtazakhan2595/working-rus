import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/@/components/ui/table";
import { MyLeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { getLeaveListData } from "app/hooks/leaveTracker";
import { connect } from "react-redux";
import moment from "moment";
import ViewLeaveSheet from "../LeaveTracker/ViewLeaveDetails";
import { FilterInput } from "components/FormControl";
import { getLeavestats } from "app/hooks/leaveTracker";
import { getLeaveTransaction } from "app/hooks/leaveTracker";
import { getLeaveComponentsWithUsed } from "app/hooks/leaveTracker";
import { PageLoader, TableCustom } from "components";
import { LeaveTrackerOptions } from "data/Data";
import { HasAccess } from "utils/PermissionUtils";

export default function AppliedLeaves({
  componentsWithUsed,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [ordering, setOrdering] = useState("id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [Leaves, setLeaves] = useState({});
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const fetchData = async (isMounted) => {
    try {
      const response = await getLeaveListData({
        filterData,
        ordering,
        options,
      });
      if (isMounted && response) {
        setLeaves(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

   const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };
  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle className="text-primary">Applied Leaves</CardTitle>
        <CardDescription>Here you view all teh leave applied.</CardDescription>
      </CardHeader>
      <CardContent className="scrollable table-container">
        <div>
          <FilterInput
            filters={[
              {
                type: "select-one",
                option: LeaveTrackerOptions,
                name: "status",
                placeholder: "Status",
              },
              {
                type: "select-two",
                option: componentsWithUsed.map((leave) => ({
                  value: leave.leaveComponentId,
                  label: leave.name,
                })),
                name: "leave_component_id",
                placeholder: "Leave Type",
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end mb-4"
          />
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={Leaves?.results || []}
            columns={MyLeaveAplicationColumns(fetchData)}
            pagination={true}
            dataTotalSize={Leaves?.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </Card>
  );
}
