import React, { useState, useEffect } from "react";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { PageLoader } from "components";
import { ExitRequestColumns } from "app/modules/ExitAndClearance/Sections";

import TableCustom from "components/CustomTable";

const Terminations = ({ filterData, reload }) => {
  const [loading, setLoading] = useState(true);
  const [ExitTerminations, setTerminations] = useState(null);
  const [ordering, setOrdering] = useState("-exit_date");
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
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
      setLoading(true);
      const response = await getEmployeesResignations({
        filterData,
        options,
        ordering,
      });
      if (isMounted) setTerminations(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering("-exit_date");
    fetchData(true);
    return () => {
      isMounted = false;
    };
  }, [reload]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          data={ExitTerminations?.results || []}
          columns={ExitRequestColumns(fetchData)}
          pagination={true}
          dataTotalSize={ExitTerminations?.count || 0}
          tableOptions={tableOptions}
        />
      )}
    </>
  );
};

export default Terminations;
