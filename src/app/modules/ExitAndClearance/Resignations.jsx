import { updateExitData } from "app/hooks/employee";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";

const Resignations = ({ userProfile, resignations, reload }) => {
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [selectedResignationId, setSelectedResignationId] = useState(null);

  useEffect(() => {
    // When resignations changes, ensure the selected resignation is still valid
    if (
      selectedResignationId &&
      !resignations.find((item) => item.id === selectedResignationId)
    ) {
      setSelectedResignationId(null);
    }
  }, [resignations]);

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

  return (
    <div>
      <Table
        data={resignations || []}
        columns={ExitRequestColumns(
          handleOptionSelect,
          handleRowClicked,
          reload
        )}
        pagination={true}
        dataTotalSize={resignations.length || 0}
        tableOptions={tableOptions}
      />
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
    </div>
  );
};

export default Resignations;
