import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { DateInput } from "components/form-control";
import CustomTable from "components/CustomTable";
import { createPayrunColumns } from "app/utils/Types/TableColumns";
import { getEmployeePayroll } from "app/hooks/payroll";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";


const CreatePayRun = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [component, setComponent] = useState([]);
  const [withheldRows, setWithheldRows] = useState([]);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      console.log("Row clicked:", row);
      // setSelectedComponent(row);
    },
  };
  const [selectedRows, setSelectedRows] = useState([]);
  const payrollData = [
    { title: "Payroll Cost", value: "56,60,936.69 AED" },
    { title: "Employees' Net Pay", value: "36,58,484.00 AED" },
    { title: "Total Employees'", value: "200" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getEmployeePayroll({ options, filterData });
      if (response) {
        setEmployeeData(response);
      }

      const earnAndDeductions = await getEarnAndDeduction({
        filterData: { is_active: true },
      });
      if (earnAndDeductions) {
        setComponent(earnAndDeductions.results);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [options, filterData]);



  // Function to handle withholding salary
  const handleWithholdSalary = () => {
    setWithheldRows((prev) => [...selectedRows, ...prev]);
    setSelectedRows([]); // Reset selected rows after withholding
  };

  // Function to handle providing salary back for selected withheld rows
  const handleProvideSalary = () => {
    // Remove selected withheld rows from withheldRows state
    setWithheldRows((prev) => prev.filter((id) => !selectedRows.includes(id)));
    setSelectedRows([]); // Reset selected rows after providing salary back
  };
  // Determine the selected row types
  const normalSelectedRows = selectedRows.filter(
    (row) => !withheldRows.includes(row)
  );
  const withheldSelectedRows = selectedRows.filter((row) =>
    withheldRows.includes(row)
  );

  const showWithholdButton = normalSelectedRows.length > 0;
  const showProvideButton = withheldSelectedRows.length > 0;
  console.log("SHOWWITHHOLDBUTTON", showWithholdButton);
  console.log("SHOWPROVIDEBUTTON", showProvideButton);

    useEffect(() => {
      if(showWithholdButton && showProvideButton)
      {
        toast.error("You can't select both Withhold and Provide Salary Back at the same time");
      }
    }, [showWithholdButton, showProvideButton]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-10 justify-between items-center h-11">
        <div className="flex items-center gap-4">
          <button className="w-[27px] h-[27px] bg-white rounded-3xl border border-[#e8e8ec] justify-center items-center gap-1 inline-flex">
            <ArrowLeft size={14} />
          </button>
          <div>
            <span className="text-[#1c2024] text-xl font-semibold  leading-tight">
              Pay Run for{" "}
            </span>
            <span className="text-[#1c2024] text-xl font-bold  leading-tight">
              September 2024
            </span>
          </div>
        </div>
        <Button className="bg-[#1c2024] text-white min-w-[120px]">
          Submit
        </Button>
      </div>
      <div className="p-6">
        <section className="flex flex-wrap gap-4 items-center">
          {payrollData.map((item, index) => (
            <React.Fragment key={item.title}>
              <div className="flex-1 shrink min-w-[240px]">
                <div className="pb-2">
                  <h2 className="text-sm font-medium tracking-tight leading-none text-neutral-800">
                    {item.title}
                  </h2>
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight text-fuchsia-700">
                    {item.value}
                  </p>
                </div>
              </div>
              {index < payrollData.length - 1 && (
                <div className="relative">
                  <div className="w-[70px] h-[1px]  rotate-90 border border-[#deade2] absolute top-0 right-[55px]"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </section>
      </div>
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div className="text-[#ab4aba] text-2xl font-medium ">
            Payment Date
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-[47px] flex-col justify-center items-start inline-flex">
              <div className="flex-col justify-start items-start flex">
                <div className="self-stretch text-[#ab4aba] text-2xl font-medium  ">
                  Employees Summary
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm  ">
                    Employee payroll runs generated are here
                  </div>
                </div>
              </div>
            </div>
            {showWithholdButton && !showProvideButton && (
              <Button
                className="px-3 py-1.5 bg-[#f9f9fb] rounded-3xl justify-center items-center gap-1 inline-flex"
                onClick={handleWithholdSalary}
              >
                <div className="text-center text-[#1c2024] text-sm font-medium">
                  Withhold Salary
                </div>
              </Button>
            )}
            {showProvideButton && !showWithholdButton && (
              <Button
                className="px-3 py-1.5 bg-[#f9f9fb] rounded-3xl justify-center items-center gap-1 inline-flex"
                onClick={handleProvideSalary}
              >
                <div className="text-center text-[#1c2024] text-sm font-medium">
                  Provide Salary Back
                </div>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={employeeData?.results || []}
            columns={createPayrunColumns(component)}
            pagination={true}
            dataTotalSize={employeeData.count || 0}
            tableOptions={tableOptions}
            selectable={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            disabledRows={withheldRows}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePayRun;
