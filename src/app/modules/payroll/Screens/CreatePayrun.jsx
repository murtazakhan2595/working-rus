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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPayrollSummary } from "app/hooks/payroll";
import { CircleCheckBig } from "lucide-react";

import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  DialogFooter,
  // DialogCancel,
  // DialogAction,
} from "../../../../src/@/components/ui/dialog.jsx";
import { savePayrun } from "app/hooks/payroll";

const CreatePayRun = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [component, setComponent] = useState([]);
  const [withheldRows, setWithheldRows] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [payrunSubmitDialog, setPayrunSubmitDialog] = useState(false);


  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      // setSelectedComponent(row);
    },
  };
  const [selectedRows, setSelectedRows] = useState([]);
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
      
      const payrollSummary = await getPayrollSummary();
      if (payrollSummary) {
       setPayrollData([
         { title: "Payroll Cost", value: payrollSummary?.total_gross_salary },
         {
           title: "Employees' Net Pay",
           value: payrollSummary?.total_net_salary,
         },
         { title: "Total Employees'", value: payrollSummary?.total_employees },
       ]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [options, filterData]);

  // Function to handle withholding salary
  const handleWithholdSalary = () => {
    const updatedWithheldEmployees = [...selectedRows, ...withheldRows];
    setWithheldRows(updatedWithheldEmployees);
    setSelectedRows([]); // Reset selected rows after withholding

    saveDraft(updatedWithheldEmployees);
  };

  // Function to handle providing salary back for selected withheld rows
  const handleProvideSalary = () => {
    // Remove selected withheld rows from withheldRows state
    const updatedWithheldEmployees = withheldRows.filter((id) => !selectedRows.includes(id));

    setWithheldRows(updatedWithheldEmployees);
    setSelectedRows([]); // Reset selected rows after providing salary back
    saveDraft(updatedWithheldEmployees);
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

  useEffect(() => {
    if (showWithholdButton && showProvideButton) {
      toast.error(
        "You can't select both Withhold and Provide Salary Back at the same time"
      );
    }
  }, [showWithholdButton, showProvideButton]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async()=>{
    const reponse = true;
    if(reponse){
      setPayrunSubmitDialog(true)
    }
  }
  const saveDraft = async (updatedWithheldEmployees) => {
    const payRunDraftData = {
      total_amount: payrollData.find((item) => item.title === "Payroll Cost")
        ?.value,
      start_date: "2024-09-01", // Hardcoded for now; replace with actual date
      end_date: "2024-09-30", // Hardcoded for now; replace with actual date
      is_payroll_run: false, 
      excluded_employees: updatedWithheldEmployees, 
    };
    const response =  await savePayrun(payRunDraftData);
    if(!response){
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <SuccessNotification isOpen={payrunSubmitDialog} onClose={setPayrunSubmitDialog} />
      <div className="flex flex-wrap gap-10 justify-between items-center h-11">
        <div className="flex items-center gap-4">
          <button
            className="w-[27px] h-[27px] bg-white rounded-3xl border border-[#e8e8ec] justify-center items-center gap-1 inline-flex"
            onClick={handleBack}
          >
            <ArrowLeft size={14} color="#000" />
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
        <Button
          className="bg-[#1c2024] text-white min-w-[120px]"
          onClick={handleSubmit}
        >
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


const SuccessNotification = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-3 items-start text-sm leading-tight text-teal-600 bg-white rounded-xl">
          <CircleCheckBig size={16} color="#0d9488" />
          <div className="flex flex-col min-w-[240px]">
            <div className="font-bold">Success!</div>
            <div className="mt-1">
              Your pay run for{" "}
              <span className="font-semibold">September 2024</span> was
              successfully added
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePayRun;
