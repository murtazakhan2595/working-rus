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
  const [filterData, setFilterData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSalaryType, setSelectedSalaryType] = useState(null);

  // Separate handler for Salary filters
  const handleSalaryFilterChange = (filterName, filterValue) => {
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
              name: "first_name",
            },
            // ... existing code ...
            {
              type: "select-one",
              option: departments,
              name: "department_name",
              placeholder: "Department",
              values: selectedDepartment,
            },
            {
              type: "select-two",
              option: SalaryTypeOptions,
              name: "salary_type",
              values: selectedSalaryType,
              placeholder: "Salary Type",
            },
          ]}
          onChange={handleSalaryFilterChange} // Dynamic filter handler
          resetButton={true}
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
