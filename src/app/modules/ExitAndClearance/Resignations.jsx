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

const Resignations = React.memo(({ userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [selectedResignationId, setSelectedResignationId] = useState(null);
  const [Resignations, setResignations] = useState(null);
  const [filterData, setFilterData] = useState({
    exit_category: "resignation",
    // status_resignation: "exit interview",
    ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),
  });
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
      setResignations(response);
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
    // When resignations changes, ensure the selected resignation is still valid
    const resignations = Resignations?.results;
    const selectedResignation =
      resignations &&
      resignations.find((item) => item.id === selectedResignationId);
    if (selectedResignationId && !selectedResignation) {
      setSelectedResignationId(null);
    }
  }, [Resignations]);

  const closeModal = () => {
    setSelectedResignationId(null);
    fetchData();
  };

  const handleRowClicked = (index, data, row) => {
    setSelectedResignationId(row.id);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <>
      <div className="py-4 px-3 bg-white  flex flex-col gap-5">
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by id",
              name: "employee_id",
            },
            {
              type: "select",
              option: ResignationStatusOptions,
              name: "status_resignation",
              placeholder: "Status",
            },
          ]}
          onChange={handleFilterChange}
        />
        {loading ? (
          <PageLoader />
        ) : (
          <Row>
            <Col lg={12}>
              <div>
                <Table
                  data={Resignations?.results || []}
                  columns={EmployeeResignationsColumns(handleRowClicked, () => {
                    fetchData();
                  })}
                  pagination={true}
                  dataTotalSize={Resignations?.count || 0}
                  tableOptions={tableOptions}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>

      {selectedResignationId !== null && (
        <ExitDetailsCard
          resignationId={selectedResignationId}
          onClose={closeModal}
          resignationsList={Resignations?.results}
          reload={fetchData}
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
