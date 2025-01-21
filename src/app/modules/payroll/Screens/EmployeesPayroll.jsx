import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../components/ui/card.jsx";
import { EmployeePayrollColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { getEmployeePayroll } from "app/hooks/payroll.jsx";
import { salaryTypeOptions } from "data/Data.js";
import { connect } from "react-redux";

const EmployeesPayroll = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      navigate(`/payroll/${row.id}?employeeID=${row.employee}`);
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getEmployeePayroll({ options, filterData });
      if (response) {
        setEmployeeData(response);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [options, filterData, selectedStatus]);

  // {"department":"IT"}

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    
    if (filterName === "department_name") {
      const department = departments.find(
        (option) => option.value === parseInt(filterValue)
      );
      filterValue = department?.label;
    }
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
    <div className="flex flex-col gap-4 profile-management">
      <Header></Header>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: departments,
                  name: "department_name",
                  placeholder: "Department",
                },
                {
                  type: "select-two",
                  option: salaryTypeOptions,
                  name: "salary_type",
                  placeholder: "Salary Type",
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
          <Card>
            <CardContent>
              <CustomTable
                data={employeeData?.results || 0}
                columns={EmployeePayrollColumns}
                pagination={true}
                dataTotalSize={employeeData.count || 0}
                tableOptions={tableOptions}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(EmployeesPayroll);
