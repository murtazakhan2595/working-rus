import { EmployeeResignationsColumns } from "app/modules/ExitAndClearance/Sections";

import React, { useState, useEffect } from "react";
import { ExitDetailsCard } from "app/modules/ExitAndClearance/ExitRequests";
import { connect } from "react-redux";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";

import { PageLoader } from "components";


import TableCustom from "components/CustomTable";

const Resignations = React.memo(({ filterData }) => {
  const [loading, setLoading] = useState(true);
  const [selectedResignationId, setSelectedResignationId] = useState(null);
  const [Resignations, setResignations] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
      setSelectedResignationId(null);
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
        <TableCustom
          data={Resignations?.results || []}
          columns={EmployeeResignationsColumns(handleRowClicked, () => {
            fetchData();
          })}
          pagination={true}
          dataTotalSize={Resignations?.count || 0}
          tableOptions={tableOptions}
        />
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
