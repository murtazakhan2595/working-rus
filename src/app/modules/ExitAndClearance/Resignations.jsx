import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Table } from "components";
import { useState } from "react";

const Resignations = ({ userProfile, exitData }) => {
  console.log("exitData.results", exitData?.data.results.result);
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

  return (
    <div>
      <Table
        data={exitData?.data.results.result || []}
        columns={ExitRequestColumns}
        pagination={true}
        dataTotalSize={exitData?.count || 0}
        tableOptions={tableOptions}
      />
    </div>
  );
};

export default Resignations;  