import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { ImportOpeningBalance } from "app/modules/LeaveTracker";
import { GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import { OpeningLeaveBalanceColumn } from "app/modules/LeaveTracker/Sections";
import { getHolidaysListData } from "app/hooks/leaveTracker";
import { CardHeader } from "components/ui/card";
import {
  getLeaveOpeningBalance,
  getOpeningBalanceSummary,
} from "app/hooks/leaveTracker";

export default function OpeningLeaveBalance({ reload = false }) {
  const Branches = GetDispatchStateList("branches", "common") || [];
  const [filterData, setFilterData] = useState({});
  const [isloading, setIsLoading] = useState(true);
  // const [PublicHodidays, setPublicHodidays] = useState({});
  const [openiningBalance, setOpeningBalance] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("serial_number");

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
    setIsLoading(true);
    const response = await getOpeningBalanceSummary({
      filterData,
      options,
      ordering,
    });
    if (response && isMounted) {
      setOpeningBalance(response);
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
      setOrdering("serial_number");
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
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col">
      <CardHeader className="flex flex-row flex-wrap justify-between gap-2 items-center">
        <div>
          <CardTitle className="text-primary">Opening Leave Balance</CardTitle>
          <CardDescription className="text-neutral-1100">
            {`Here you can add, edit, delete and view the opening leave balance for employees.`}
          </CardDescription>
        </div>
        <ImportOpeningBalance reloadData={fetchData} />
      </CardHeader>
      <CardContent>
        {isloading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={openiningBalance?.results || []}
            columns={OpeningLeaveBalanceColumn(fetchData)}
            pagination={true}
            dataTotalSize={openiningBalance?.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </div>
  );
}
