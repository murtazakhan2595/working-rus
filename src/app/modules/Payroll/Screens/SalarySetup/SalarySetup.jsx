import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../components/ui/card.jsx";
import { SalarySetupColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import Header from "../../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import {
  EmployeesSalaryList,
  SalaryComponents,
} from "app/modules/Payroll/Screens/SalarySetup";
import { SalaryTypeOptions } from "data/Data.js";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { getSalarySetupData } from "app/hooks/payroll.jsx";
import AddComponentSheet from "../../Sections/AddComponentSheet.jsx";

const SalarySetup = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [componentFilterData, setComponentFilterData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [activeTab, setActiveTab] = useState("salary");
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
      if (row.is_eos_applicable) {
        navigate(`/payroll/salary-setup-eos/${row.id}`);
      } else navigate(`/payroll/salary-setup/${row.id}`);
    },
  };

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
            option: SalaryTypeOptions,
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
            option: [
              { value: "earning", label: "Earning" },
              { value: "deduction", label: "Deduction" },
            ],
            name: "income_type",
            placeholder: "Component Type",
          },
          {
            type: "select-two",
            option: [
              { value: true, label: "Active" },
              { value: false, label: "Inactive" },
            ],
            name: "is_active",
            placeholder: "Active",
          },
        ];

  return (
    <div className="flex flex-col gap-4 salary-startup">
      <Header
        content={
          activeTab === "components" && (
            <AddComponentSheet isOpen={isOpen} setIsOpen={setIsOpen} />
          )
        }
      />

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
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <CardContent>
            <TabsContent value="salary">
              <EmployeesSalaryList />
            </TabsContent>
            <TabsContent value="components">
              <SalaryComponents componentFilterData={componentFilterData} />
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
