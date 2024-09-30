import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../components/ui/card.jsx";
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
  const [componentFilterData, setComponentFilterData] = useState({});

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

  console.log("FILTER DATA", filterData, componentFilterData);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getSalarySetupData({ options, filterData });
      if (data) {
        setSalarySetupData(data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [options, filterData]);

  // Separate handler for Salary filters
  const handleSalaryFilterChange = (filterName, filterValue) => {
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
  const filters =
    activeTab === "salary"
      ? [
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
        ]
      : [
          {
            type: "search",
            placeholder: "Component Name",
            name: "name",
          },
          {
            type: "select-one",
            option: [{ value:"earning", label:"Earning"}, { value:"deduction", label:"Deduction"}],
            name: "income_type",
            placeholder: "Component Type",
          },
          {
            type: "select-two",
            option: [{ value: true, label: "Active" }, { value: false, label: "Inactive" }],
            name: "is_active",
            placeholder: "Active",
          },
        ];

        console.log("ACTIVE TAB", activeTab);
  return (
    <div className="flex flex-col gap-4 salary-startup">
      <Header content={activeTab === "components" && <AddComponentSheet />} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="salary"
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* <div className="flex justify-end">
            <FilterInput
              filters={filters}
              onChange={
                activeTab === "salary"
                  ? handleSalaryFilterChange
                  : handleComponentFilterChange
              } // Dynamic filter handler
            />
          </div> */}
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-[47px] flex-col justify-center items-start inline-flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ab4aba] text-2xl font-medium font-['Inter'] leading-normal">
                    {activeTab === "components"
                      ? "Components"
                      : "Employee Salaries"}
                  </div>
                </div>
                <div className="pt-1.5 flex-col justify-start items-start flex">
                  <div className="flex-col justify-start items-start flex">
                    <div className="self-stretch text-[#8b8d98] text-sm font-normal font-['Inter'] leading-[16.80px]">
                      {activeTab === "components"
                        ? "Types details are listed here"
                        : "Payrolls of all employees are listed below"}
                    </div>
                  </div>
                </div>
              </div>
              <FilterInput
                filters={filters}
                onChange={
                  activeTab === "salary"
                    ? handleSalaryFilterChange
                    : handleComponentFilterChange
                } // Dynamic filter handler
              />
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="salary">
              {isLoading ? (
                <PageLoader />
              ) : (
                <CustomTable
                  data={salarySetupData?.results || []}
                  columns={SalarySetupColumns}
                  pagination={true}
                  dataTotalSize={salarySetupData?.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
            <TabsContent value="components">
              <SalaryComponent componentFilterData={componentFilterData} />
            </TabsContent>
          </CardContent>
        </Card>
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
