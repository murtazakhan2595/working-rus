import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import { SalarySetupColumns } from "app/modules/Payroll/Sections/PayrollTableColumns";
import CustomTable from "components/CustomTable";
import Header from "components/Header.jsx";
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
import { getEmployeeCustomList } from "app/hooks/general";

const PendingSetups = ({ filterData }) => {
  const [activeTab, setActiveTab] = useState("Salary Setup");
  const [isLoading, setIsLoading] = useState(false);
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

export default connect(mapStateToProps)(PendingSetups);
