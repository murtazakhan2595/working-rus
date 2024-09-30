import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card.jsx";
import { SalaryComponentColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/form-control.jsx";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { getEarnAndDeduction } from "app/hooks/payroll.jsx";
import { saveEarnAndDeduction } from "app/hooks/payroll.jsx";
import AddComponentSheet from "./AddComponentSheet.jsx";

const SalaryComponent = ({ componentFilterData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [component, setComponent] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      console.log("Row clicked:", row);
      setSelectedComponent(row);
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getEarnAndDeduction({
      options,
      filterData:{...componentFilterData},
    });
    if (response) {
      setComponent(response.results);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [options, componentFilterData]);


  const onCheckedChange = async (value, component) => {
    console.log("INFO", value, component);
    const updatedComponent = { ...component, is_active: value };
    const response = await saveEarnAndDeduction(updatedComponent);
    if (response) {
      setComponent((prevState) =>
        prevState.map((item) =>
          item.id === updatedComponent.id ? updatedComponent : item
        )
      );
    }
  };

  console.log("INFO component", component);
  return (
    <div className="flex flex-col gap-4 profile-management">
      {selectedComponent && (
        <AddComponentSheet
          component={selectedComponent}
          openSheet={true}
          reload={fetchData}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
            <CustomTable
              data={component}
              columns={SalaryComponentColumns(onCheckedChange)}
              pagination={true}
              dataTotalSize={0}
              tableOptions={tableOptions}
            />
      )}
    </div>
  );
};

export default SalaryComponent;
