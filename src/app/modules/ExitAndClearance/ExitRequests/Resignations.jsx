import { ExitRequestColumns } from "app/modules/ExitAndClearance/Sections";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";

import { PageLoader } from "components";

import TableCustom from "components/CustomTable";

const Resignations = React.memo(({ filterData }) => {
  const [loading, setLoading] = useState(true);
  const [Resignations, setResignations] = useState(null);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesResignations({
        filterData,
        options,
        ordering,
      });
      setResignations(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [options, filterData, ordering]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          data={Resignations?.results || []}
          columns={ExitRequestColumns(fetchData)}
          pagination={true}
          dataTotalSize={Resignations?.count || 0}
          tableOptions={tableOptions}
        />
      )}
    </>
  );
});
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Resignations);
