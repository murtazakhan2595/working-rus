import { EmployeeResignationsColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import React, { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";
import { connect } from "react-redux";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { ResignationStatusOptions } from "data/Data";
import { FilterInput } from "components/form-control";
import { PageLoader } from "components";
import { Col, Row } from "reactstrap";
import { Card, CardContent } from "../../../components/ui/card.jsx";

import { StatusList } from "./Sections";
import TableCustom from "components/CustomTable";

const Resignations = React.memo(({ filterData }) => {
  const [loading, setLoading] = useState(true);
  const [selectedResignationId, setSelectedResignationId] = useState(null);
  const [Resignations, setResignations] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
      console.log("response", response);
      setResignations(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("calling");
    fetchData();
  }, [options, filterData]);

  useEffect(() => {
    // When resignations changes, ensure the selected resignation is still valid
    const resignations = Resignations?.results;
    const selectedResignation =
      resignations &&
      resignations.find((item) => item.id === selectedResignationId);
    if (selectedResignationId && !selectedResignation) {
      setSelectedResignationId(null);
      setIsOpen(false);
    }
  }, [Resignations]);

  const closeModal = () => {
    setSelectedResignationId(null);
    setIsOpen(false);
    fetchData();
  };

  const handleRowClicked = (index, data, row) => {
    setSelectedResignationId(row.id);
    setIsOpen(true);
  };
  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              data={Resignations?.results || []}
              columns={EmployeeResignationsColumns(handleRowClicked, () => {
                fetchData();
              })}
              pagination={true}
              dataTotalSize={Resignations?.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
      {selectedResignationId !== null && (
        <ExitDetailsCard
          resignationId={selectedResignationId}
          onClose={closeModal}
          resignationsList={Resignations?.results}
          reload={fetchData}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
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
