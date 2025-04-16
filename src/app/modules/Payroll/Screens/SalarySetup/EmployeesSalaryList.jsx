import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { PendingSetups } from "app/modules/Payroll/Screens/SalarySetup/EmployeesSalarySetup";
import { SalaryTypeOptions } from "data/Data";
import { connect } from "react-redux";
import { SalarySetupColumns } from "app/modules/Payroll/Sections/PayrollTableColumns";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { getEmployeeCustomList } from "app/hooks/general";

const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";

const EmployeesSalaryList = ({ departments }) => {
  const [activeTab, setActiveTab] = useState("Salary Setup");
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({ is_new: true });
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
      console.log("Fetching with filters:", filterData); // Debug log
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

  return (
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList className="flex items-center justify-center mb-4">
          {["Salary Setup"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className={innerTabClassName}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Employee Name",
              name: "name",
              onChange: (value) => {
                handleSalaryFilterChange("name", value);
              }
            },
            // ... existing code ...
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
      <TabsContent value="Salary Setup">
        <PendingSetups filterData={filterData} />
        {console.log("Passing filterData to PendingSetups:", filterData)}
      </TabsContent>
    </Tabs>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(EmployeesSalaryList);
