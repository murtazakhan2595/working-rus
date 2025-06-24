import React, { useState, useEffect } from "react";
import { FilterInput } from "components/FormControl";
import { getAttendanceAdjustmentListData } from "app/hooks/attendance";
import {
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
} from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getTerminationReason } from "app/hooks/employeeExitAndClearance";
import TerminationReasonsAction from "./TerminationReasonsAction";

const TerminationReasons = ({ reload }) => {
  const [terminationReasons, setTerminationReasons] = useState({
    results: [],
    count: 0,
  });
  const [isloading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadTrigger, setReloadTrigger] = useState(0); // Add internal reload trigger

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

  const fetchData = async (isMounted = true) => {
    try {
      setIsLoading(true);

      const response = await getTerminationReason({
        filterData,
        options,
        ordering,
      });
      console.log("Termination Reasons Response:", response);

      if (isMounted && response) {
        setTerminationReasons(response);
      }
    } catch (error) {
      console.error("Error fetching Termination Reasons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Internal reload function that can be called by child components
  const handleReload = (forceReload = false) => {
    if (forceReload) {
      setReloadTrigger((prev) => prev + 1);
    }
    fetchData(true);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options, reloadTrigger]); // Add reloadTrigger to dependencies

  // External reload trigger (from parent component)
  useEffect(() => {
    if (reload) {
      console.log("External reload triggered");
      setReloadTrigger((prev) => prev + 1); // Trigger internal reload
    }
  }, [reload]);

  const TerminationReasonsColumn = [
    {
      text: "Termination Reason Name",
      dataField: "name",
    },
    {
      text: "",
      dataField: "",
      formatter: (cell, row) => (
        <TerminationReasonsAction
          data={row}
          reload={handleReload} // Pass internal reload function
          dataList={terminationReasons.results || []}
        />
      ),
    },
  ];

  return (
    <>
      <CardHeader>
        <CardTitle>Termination Reasons</CardTitle>
        <CardDescription>
          Here you can manage termination reasons. View, update as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isloading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={TerminationReasonsColumn}
            data={terminationReasons.results || []}
            pagination={true}
            dataTotalSize={terminationReasons?.count || 0}
            className="TerminationReasons-table"
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </>
  );
};

export default TerminationReasons;
