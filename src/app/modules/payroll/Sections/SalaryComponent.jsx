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

const SalaryComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
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
    const response = await getEarnAndDeduction({ options, filterData });
    if (response) {
      setComponent(response.results);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, [options, filterData]);

    const handleFilterChange = (filterName, filterValue) => {
      onPageChange("page", 1);
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

    const onCheckedChange = async (value, component)=>{
      console.log("INFO", value, component);
      const updatedComponent = {...component, is_active: value}
      const response = await saveEarnAndDeduction(updatedComponent);
      if(response){
        setComponent((prevState) =>
          prevState.map((item) =>
            item.id === updatedComponent.id ? updatedComponent : item
          )
        );
      }
    }

    console.log("INFO component", component);
  return (
    <div className="flex flex-col gap-4 profile-management">
      {selectedComponent && (
        <AddComponentSheet component={selectedComponent} openSheet={true} reload={fetchData} />
      )}
      <div className="flex justify-end">
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "id_and_first_name",
            },
            {
              type: "select-one",
              option: [],
              name: "department_name",
              placeholder: "Department",
            },
            {
              type: "select-two",
              option: [],
              name: "department_position",
              placeholder: "Designation",
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>
      {isLoading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <CustomTable
              data={component}
              columns={SalaryComponentColumns(onCheckedChange)}
              pagination={true}
              dataTotalSize={0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalaryComponent;
