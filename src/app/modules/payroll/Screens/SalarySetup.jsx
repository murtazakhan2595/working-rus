
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card.jsx";
import { SalarySetupColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/form-control.jsx";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { getEmployeePayroll } from "app/hooks/payroll.jsx";
import { salaryTypeOptions } from "data/Data.js";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../src/@/components/ui/tabs";
import SalaryComponent from "../Sections/SalaryComponent";
import { getSalarySetupData } from "app/hooks/payroll.jsx";
import AddComponentSheet from "../Sections/AddComponentSheet.jsx";


const SalarySetup = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
   const [activeTab, setActiveTab] = useState("components");
   const [salarySetupData, setSalarySetupData] = useState([]);
  const navigate = useNavigate();

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      console.log("Row clicked:", row);
      navigate(`/payroll/salary-setup/${row.id}`);
    },
  };

   useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(true);
      const data =await getSalarySetupData({options,filterData});
      if(data){
setSalarySetupData(data)
      }
      setIsLoading(false);
    }
    fetchData();
  },[options,filterData])

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
      {" "}
      <Header content={activeTab === "components" && <AddComponentSheet/>}/>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=""
        defaultValue="salary"
      >
        <TabsList className="flex items-center w-fit text-sm font-medium leading-tight min-h-[40px] bg-white rounded-xl border border-gray-100 border-solid p-1">
          <TabsTrigger
            value="salary"
            className="flex-1 px-3 py-2 rounded-md min-h-[32px]"
          >
            Salary
          </TabsTrigger>
          <TabsTrigger
            value="components"
            className="flex-1 px-3 py-2 rounded-md min-h-[32px]"
          >
            Components
          </TabsTrigger>
        </TabsList>
        <TabsContent value="salary">
          <div className="flex flex-col justify-end gap-4 items-end mb-4">
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
          {isLoading ? (
            <PageLoader />
          ) : (
            <Card>
              <CardContent>
                <CustomTable
                  data={salarySetupData || []}
                  columns={SalarySetupColumns}
                  pagination={true}
                  dataTotalSize={salarySetupData?.length}
                  tableOptions={tableOptions}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="components">
          <SalaryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(SalarySetup);


