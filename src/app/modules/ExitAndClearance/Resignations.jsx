import { updateExitData } from "app/hooks/employee";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState } from "react";
import ExitDetailsCard from "./ExitDetailsCard";

const Resignations = ({ userProfile, exitData, reload }) => {
  const exitDataList = exitData?.data.results.result || [];
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [selectedResignationIndex, setSelectedResignationIndex] = useState(null);

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
        const response = await updateExitData(
          selectedResignation
        );
        if(response){
          reload()
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const closeModal = () => {
    setSelectedResignationIndex(null);
  };

  const handleNext = () => {
    if (selectedResignationIndex < exitDataList.length - 1) {
      setSelectedResignationIndex(selectedResignationIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (selectedResignationIndex > 0) {
      setSelectedResignationIndex(selectedResignationIndex - 1);
    }
  };

  const handleRowClicked = (index, data, row) => {
    setSelectedResignationIndex(index);
  }

  console.log("selectedResignationIndex", selectedResignationIndex);

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
      {selectedResignationIndex !== null && (
        <ExitDetailsCard
          resignation={exitDataList[selectedResignationIndex]}
          onClose={closeModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          disableNext={selectedResignationIndex >= exitDataList.length - 1}
          disablePrevious={selectedResignationIndex <= 0}
          handleOptionSelect={handleOptionSelect}
          reload
        />
      )}
    </div>
  );
};

export default Resignations;  