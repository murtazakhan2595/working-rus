import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Row, Col } from "reactstrap";
import { ExitResignedColumns } from "app/utils/Types/TableColumns";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import TableCustom from "components/CustomTable";

const Resigned = React.memo(({ userProfile, departments, filterData }) => {
  const [loading, setLoading] = useState(true);
  const [Resigned, setResigned] = useState(null);

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
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesResignations({ filterData, options });
      setResigned(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [options, filterData]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              data={Resigned?.results || []}
              columns={ExitResignedColumns}
              hideTableHeader={true}
              pagination={true}
              dataTotalSize={Resigned?.count || 0}
              tableOptions={tableOptions}
              dataStyle={{ backgroundColor: "white" }}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
});
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(Resigned);
