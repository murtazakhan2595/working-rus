import React from "react";
import { Row, Col } from "reactstrap";
import { AllLeavesApplicationColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";

const RenderAllApplications = ({ applicationsList }) => {
  const Leave = applicationsList;

  return (
    <>
      <div className="m-2 bg-white px-2 py-4">
        <Row>
          <Col lg={12}>
            <div>
              <Table
                data={Leave?.results || []}
                columns={AllLeavesApplicationColumns}
                pagination={false}
                dataTotalSize={Leave?.count || 0}
                // tableOptions={tableOptions}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RenderAllApplications;
