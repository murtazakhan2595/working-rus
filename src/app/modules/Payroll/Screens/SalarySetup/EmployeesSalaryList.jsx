import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../components/ui/card.jsx";
import CustomTable from "components/CustomTable";
import Header from "../../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { getEmployeePayroll } from "app/hooks/payroll.jsx";
import { SalaryTypeOptions } from "data/Data";
import { connect } from "react-redux";
import { SalarySetupColumns } from "app/modules/Payroll/Sections/PayrollTableColumns";
import SalaryComponent from "../../Sections/SalaryComponent.jsx";
import { getEmployeeCustomList } from "app/hooks/general";
import AddComponentSheet from "../../Sections/AddComponentSheet.jsx";

const EmployeesSalaryList = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({is_new:true});
  const [componentFilterData, setComponentFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [EmployeesList, setEmployeesList] = useState([]);
  const navigate = useNavigate();

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      if (row.is_eos_applicable) {
        navigate(`/payroll/salary-setup-eos/${row.id}`);
      } else navigate(`/payroll/salary-setup/${row.id}`);
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getEmployeeCustomList({ options, filterData });
      if (data) {
        setEmployeesList(data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [options, filterData]);

  // Separate handler for Salary filters
  const handleSalaryFilterChange = (filterName, filterValue) => {
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

  // Separate handler for Component filters
  const handleComponentFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    const updatedFilters = { ...componentFilterData };
    if (filterValue === "") {
      delete updatedFilters[filterName];
    } else {
      updatedFilters[filterName] = filterValue;
    }
    setComponentFilterData(updatedFilters); // Update component filters
  };

  const tabsData = [
    { value: "salary", label: "Salary" },
    { value: "components", label: "Components" },
  ];

  return (
    <>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex-col justify-center items-start inline-flex">
            <div className="self-stretch text-[#ab4aba] text-2xl font-medium  leading-normal">
              {"Employee Salaries"}
            </div>
            <div className="self-stretch text-[#8b8d98] text-sm font-normal  leading-[16.80px]">
              {"Payrolls of all employees are listed below"}
            </div>
          </div>
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
                option: SalaryTypeOptions,
                name: "salary_type",
                placeholder: "Salary Type",
              },
            ]}
            onChange={handleSalaryFilterChange} // Dynamic filter handler
          />
        </div>
      </CardHeader>

      {isLoading ? (
        <PageLoader />
      ) : (
        <CustomTable
          data={EmployeesList.results || []}
          columns={SalarySetupColumns}
          pagination={true}
          dataTotalSize={EmployeesList?.count || 0}
          tableOptions={tableOptions}
        />
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(EmployeesSalaryList);
