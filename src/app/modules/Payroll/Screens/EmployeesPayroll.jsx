import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../components/ui/card.jsx";
import { EmployeePayrollColumns } from "app/modules/Payroll/Sections";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { getEmployeePayroll } from "app/hooks/payroll.jsx";
import { salaryTypeOptions } from "data/Data.js";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const EmployeesPayroll = () => {
  const Departments = useSelector((state) => state.common.departments);
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState(
    userRole === 2 ? { direct_report: userID } : {}
  );
  const [selectedSalaryType, setSelectedSalaryType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
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
  }, [options, filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);

    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "salary_type") setSelectedSalaryType(filterValue);
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
      <div>
        <div className="flex justify-end mb-4">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID",
                name: "serial_number",
              },
              {
                type: "search",
                placeholder: "Search by Name",
                name: "name",
              },
              {
                type: "select-one",
                option: Departments,
                name: "department_name",
                placeholder: "Department",
                values: selectedDepartment,
              },
              {
                type: "select-two",
                option: salaryTypeOptions,
                name: "salary_type",
                placeholder: "Salary Type",
                values: selectedSalaryType,
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <Card>
          <CardContent>
            {isLoading ? (
              <PageLoader />
            ) : (
              <CustomTable
                data={employeeData?.results || 0}
                columns={EmployeePayrollColumns}
                pagination={true}
                dataTotalSize={employeeData.count || 0}
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    Departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(EmployeesPayroll);
