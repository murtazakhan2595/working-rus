import { updateExitData } from "app/hooks/employee";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";

const Resignations = ({ userProfile, exitData, reload }) => {
  const exitDataList = exitData?.data.results.result || [];
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [selectedResignationId, setSelectedResignationId] = useState(null);

  useEffect(() => {
    // When exitDataList changes, ensure the selected resignation is still valid
    if (
      selectedResignationId &&
      !exitDataList.find((item) => item.id === selectedResignationId)
    ) {
      setSelectedResignationId(null);
    }
  }, [exitDataList]);

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
    const currentIndex = exitDataList.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex < exitDataList.length - 1) {
      setSelectedResignationId(exitDataList[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = exitDataList.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex > 0) {
      setSelectedResignationId(exitDataList[currentIndex - 1].id);
    }
  };

  const handleRowClicked = (index, data, row) => {
    setSelectedResignationId(row.id);
  };


  return (
    <div>
      <Table
        data={exitDataList || []}
        columns={ExitRequestColumns(
          handleOptionSelect,
          handleRowClicked,
          reload
        )}
        pagination={true}
        dataTotalSize={exitData?.count || 0}
        tableOptions={tableOptions}
      />
      {selectedResignationId !== null && (
        <ExitDetailsCard
          resignation={exitDataList.find(
            (item) => item.id === selectedResignationId
          )}
          onClose={closeModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          disableNext={
            exitDataList.findIndex(
              (item) => item.id === selectedResignationId
            ) >=
            exitDataList.length - 1
          }
          disablePrevious={
            exitDataList.findIndex(
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
