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

const SalaryComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [component, setComponent] = useState([]);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getEarnAndDeduction({ options, filterData });
      if (response) {
        setComponent(response.results);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [options, filterData]);

    const handleFilterChange = (filterName, filterValue) => {
      onPageChange("page", 1);
      // if (filterName === "department_name") {
      //   const department = departments.find(
      //     (option) => option.value === parseInt(filterValue)
      //   );
      //   filterValue = department?.label;
      // }
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

    console.log("INFO component", component);
  return (
    <div className="flex flex-col gap-4 profile-management">
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
              columns={SalaryComponentColumns}
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
