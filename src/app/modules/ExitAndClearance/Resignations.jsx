import { updateExitData } from "app/hooks/employee";
import { EmployeeResignationsColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";
import { connect } from "react-redux";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { ResignationStatusOptions } from "data/Data";
import { FilterInput } from "components/form-control";
import { PageLoader } from "components";
import { Col, Row } from "reactstrap";

const Resignations = ({ resignations, reload, userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [selectedResignationId, setSelectedResignationId] = useState(null);
  const [Resignations, setResignations] = useState(null);
  const [filterData, setFilterData] = useState({
    exit_category: "resignation",
    ...(userProfile.role === 2 ? { report_to: userProfile.id } : {}),
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
    if (
      selectedResignationId &&
      !resignations.find((item) => item.id === selectedResignationId)
    ) {
      setSelectedResignationId(null);
    }
  }, [resignations]);

  const handleOptionSelect = async (selectedResignation, option) => {
    try {
      if (selectedResignation) {
        selectedResignation = {
          ...selectedResignation,
          status_resignation: option,
        };
        const response = await updateExitData(selectedResignation);
        if (response) {
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const closeModal = () => {
    setSelectedResignationId(null);
  };

  const handleNext = () => {
    const currentIndex = resignations.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex < resignations.length - 1) {
      setSelectedResignationId(resignations[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = resignations.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex > 0) {
      setSelectedResignationId(resignations[currentIndex - 1].id);
    }
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
      <div className="py-3 px-3 bg-white">
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
          <Row className="mt-4">
            <Col lg={12}>
              <div>
                <Table
                  data={Resignations?.results || []}
                  columns={EmployeeResignationsColumns(
                    handleRowClicked,
                    (reload = () => {
                      fetchData();
                    })
                  )}
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
          resignation={resignations.find(
            (item) => item.id === selectedResignationId
          )}
          onClose={closeModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          disableNext={
            resignations.findIndex(
              (item) => item.id === selectedResignationId
            ) >=
            resignations.length - 1
          }
          disablePrevious={
            resignations.findIndex(
              (item) => item.id === selectedResignationId
            ) <= 0
          }
          handleOptionSelect={handleOptionSelect}
          reload
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

export default connect(mapStateToProps)(Resignations);
