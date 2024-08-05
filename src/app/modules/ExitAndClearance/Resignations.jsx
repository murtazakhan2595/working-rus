import { updateExitData } from "app/hooks/employee";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState } from "react";

const Resignations = ({ userProfile, exitData, reload }) => {
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

  return (
    <div>
      <Table
        data={exitData?.data.results.result || []}
        columns={ExitRequestColumns(handleOptionSelect, reload)}
        pagination={true}
        dataTotalSize={exitData?.count || 0}
        tableOptions={tableOptions}
      />
    </div>
  );
};

export default Resignations;  