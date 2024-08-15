import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeCustomList } from "app/hooks/general";
import { LeaveAllotmentColumns } from "app/utils/Types/TableColumns";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { ExitTerminatedColumns } from "app/utils/Types/TableColumns";

const Terminated = ({ terminated, reload }) => {

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

  return (
    <div className=" bg-[#F0F1F2]">
      <Row className="p-0 m-0">
        <Col lg={12} className="p-0 m-0 ">
          <Table
            data={terminated}
            columns={ExitTerminatedColumns(reload)}
            hideTableHeader={true}
            pagination={true}
            dataTotalSize={terminated.length || 0}
            tableOptions={tableOptions}
            dataStyle={{ backgroundColor: "white" }}
          />
        </Col>
      </Row>
    </div>
  );
};


export default Terminated;
