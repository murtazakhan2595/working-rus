import React, { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";
import { connect } from "react-redux";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { TerminationStatusOptions } from "data/Data";
import { FilterInput } from "components/form-control";
import { PageLoader, Table } from "components";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { StatusList } from "./Sections";
import TableCustom from "components/CustomTable";

const Terminations = ({ userProfile, filterData }) => {
  const [loading, setLoading] = useState(true);
  const [selectedResignationId, setSelectedResignationId] = useState(null);
  const [Terminations, setTerminations] = useState(null);
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
      setTerminations(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [options, filterData]);

  useEffect(() => {
    // When termination changes, ensure the selected resignation is still valid
    const termination = Terminations?.results;
    const selectedResignation =
      termination &&
      termination.find((item) => item.id === selectedResignationId);
    if (selectedResignationId && !selectedResignation) {
      setSelectedResignationId(null);
      setIsOpen(false);
    }
  }, [Terminations]);
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
              data={Terminations?.results || []}
              columns={ExitRequestColumns(
                handleRowClicked,
                () => {
                  fetchData();
                },
                userProfile.role === 2
              )}
              pagination={true}
              dataTotalSize={Terminations?.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
      {console.log(selectedResignationId)}
      {selectedResignationId !== null && (
        <ExitDetailsCard
          resignationId={selectedResignationId}
          onClose={closeModal}
          resignationsList={Terminations?.results}
          reload={fetchData}
          isResignation={false}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Terminations);
