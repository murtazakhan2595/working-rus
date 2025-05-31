import React, { useState, useEffect } from "react";
import { FilterInput } from "components/FormControl";
import { getTimeAdjustmentListData } from "app/hooks/attendance";
import { TimeAdjustmentLogsColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { CardDescription, CardTitle, CardContent } from "components/ui/card";
import { PageLoader, TableCustom } from "components";

const TimeAdjustmentsHistory = ({}) => {
  const [TimeAdjustmentLogsList, setTimeAdjustmentLogsList] = useState({
    results: [],
    count: 0,
  });
  const [isloading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDelegatedIndex, setSelectedDelegatedIndex] = useState("");
  const [selectedAutoFowardIndex, setSelectedAutoFowardIndex] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("");

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);

      const response = await getTimeAdjustmentListData({
        filterData,
        options,
        ordering,
      });

      if (isMounted && response) {
        setTimeAdjustmentLogsList(response);
      }
    } catch (error) {
      console.error("Error fetching Approval Hierarchy:", error);
    } finally {
      setIsLoading(false);
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
    if (filterName === "request_type") setSelectedRequestType(filterValue);
    if (filterName === "status") setSelectedStatus(filterValue);
    if (filterName === "has_auto_forward")
      setSelectedAutoFowardIndex(filterValue);
    if (filterName === "has_delegation") setSelectedDelegatedIndex(filterValue);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-4 px-6">
      <CardTitle className="text-primary pt-6">
        Time Adjustments History & Logs
      </CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can manage time adjustments. View, reject, or approve as
        needed.
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search by ID",
            name: "emp_serial_no",
          },
        ]}
        onChange={handleFilterChange}
        className="justify-end"
      />
      <CardContent className="px-0">
        {isloading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={TimeAdjustmentLogsColumns}
            data={TimeAdjustmentLogsList.results || []}
            pagination={true}
            dataTotalSize={TimeAdjustmentLogsList?.count || 0}
            className="TimeAdjustmentLogsList-table"
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </div>
  );
};

export default TimeAdjustmentsHistory;
