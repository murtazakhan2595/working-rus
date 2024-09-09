import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import { ExitTerminatedColumns } from "app/utils/Types/TableColumns";
import { FilterInput } from "components/form-control";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import TableCustom from "components/CustomTable";
import { Card, CardContent } from "../../../components/ui/card.jsx";

const Terminated = ({ userProfile, departments, filterData }) => {
  const [loading, setLoading] = useState(true);
  const [Terminated, setTerminated] = useState(null);
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
      setTerminated(response);
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
              data={Terminated?.results || []}
              columns={ExitTerminatedColumns}
              hideTableHeader={true}
              pagination={true}
              dataTotalSize={Terminated?.count || 0}
              tableOptions={tableOptions}
              dataStyle={{ backgroundColor: "white" }}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(Terminated);
