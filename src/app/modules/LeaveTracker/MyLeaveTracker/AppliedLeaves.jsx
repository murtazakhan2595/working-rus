import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { MyLeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import {
  getLeaveListData,
  getEligibleLeaveTypeDurations,
} from "app/hooks/leaveTracker";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { GlobalStatusOptions } from "data/Data";

export default function AppliedLeaves({reload}) {
  const [isLoading, setIsLoading] = useState(false);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [Leaves, setLeaves] = useState({});
  const [LeaveType, setLeaveType] = useState([]);
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

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering('-id');
    fetchData(true)
    return () => {
      isMounted = false;
    };
  }, [reload]);

  const fetchLeaveType = async (isMounted) => {
    try {
      const response = await getEligibleLeaveTypeDurations({});
      if (isMounted && response) {
        setLeaveType(response || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchLeaveType(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
         if (filterName === "status")
          updatedFilters[filterName] = filterValue.toLowerCase();
        else updatedFilters[filterName] = filterValue;
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
                type: "select",
                options: LeaveType,
                name: "leave_type",
                placeholder: "Leave Type",
              },
              {
                type: "date-range",
                name: "date_range",
                placeholder: "Start Date",
              },
              {
                type: "select",
                options: GlobalStatusOptions(),
                name: "status",
                placeholder: "Status",
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
