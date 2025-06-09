import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { LeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { LeaveTrackerOptions } from "data/Data";
import { GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import { PublicHolidaydsColumn } from "app/modules/LeaveTracker/Sections";
import { getHolidaysListData } from "app/hooks/leaveTracker";

export default function Holidays({ reload = false }) {
  const Branches = GetDispatchStateList("branches", "common") || [];
  const [filterData, setFilterData] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const [PublicHodidays, setPublicHodidays] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

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

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getHolidaysListData({
      filterData,
      options,
      ordering,
    });
    if (response) {
      setPublicHodidays(response);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options, ordering]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setOrdering("-id");
      onPageChange("page", 1);
      setFilterData({});
      fetchData(true);
    }
    return () => {
      isMounted = false;
    };
  }, [reload]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterName === "status") {
        // Add both action_hr and action_manager
        if (filterValue === "") {
          // If filterValue is empty, remove both keys
          delete updatedFilters["action_hr"];
          delete updatedFilters["action_manager"];
        } else {
          // Set both action_hr and action_manager to the filterValue
          updatedFilters["action_hr"] = filterValue;
          updatedFilters["action_manager"] = filterValue;
        }
      } else {
        // Handle other filters normally
        if (filterValue === "") {
          delete updatedFilters[filterName];
        } else {
          updatedFilters[filterName] = filterValue;
        }
      }

      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-4 px-6">
      <CardTitle className="text-primary pt-6">Public Holidays</CardTitle>
      <CardDescription className="text-neutral-1100">
        {`Here you can add, edit, delete and view public holidays`}
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            name: "name",
            placeholder: "Serach by name",
          },
          {
            type: "select",
            options: Branches,
            name: "branch",
            placeholder: "Branch",
          },
          {
            type: "select",
            options: countriesList,
            name: "country",
            placeholder: "Country",
          },
          {
            type: "select",
            options: [],
            name: "religion",
            placeholder: "Religion",
          },
          {
            type: "date-range",
            options: Branches,
            name: "date_range",
            placeholder: "Start Date",
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
            data={PublicHodidays?.results || []}
            columns={PublicHolidaydsColumn(fetchData)}
            pagination={true}
            dataTotalSize={PublicHodidays?.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </div>
  );
}
