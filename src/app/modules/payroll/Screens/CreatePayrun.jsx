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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCancel,
  DialogAction,
} from "../../../../src/@/components/ui/dialog.jsx";
import { savePayrun } from "app/hooks/payroll";
import moment from "moment";
import { getPayun } from "app/hooks/payroll";
import { getEmpPayrolDetails } from "app/hooks/payroll";
import { PageLoader } from "components";

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
  const [payrunConfirmationDialog, setPayrunConfirmationDialog] = useState(false);
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
  const [payrunDraft, setPayrunDraft] = useState(null);
  console.log("payrun draft", payrunDraft);
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
      const response = await getEmpPayrolDetails({ options, filterData });
      // const response = await getEmployeePayroll({ options, filterData });
      if (response) {
        setEmployeeData(response);
      }

      const earnAndDeductions = await getEarnAndDeduction({
        filterData: { is_active: true },
      });
      if (earnAndDeductions) {
        setComponent(earnAndDeductions.results);
      }
      const payRunData = await getPayun({
        filterData: { date_range: `${currentMonthStart},${currentMonthEnd}` },
      });
      if (payRunData) {
        const payRun = payRunData?.results[0];
        setPayrunDraft(payRun);
        setWithheldRows(payRun?.excluded_employees || []);
        setPayrollData([
          {
            title: "Payroll Cost",
            value: payRun?.gross_amount,
          },
          {
            title: "Employees' Net Pay",
            value: payRun?.net_amount,
          },
          {
            title: "Total Employees'",
            value: payRun?.total_employees,
          },
        ]);
      } 
      if(payRunData?.count===0){
        const payrollSummary = await getPayrollSummary();
      if (payrollSummary) {
        const updatedPayrollData = [
          {
            title: "Payroll Cost",
            value: payrollSummary?.total_gross_salary,
          },
          {
            title: "Employees' Net Pay",
            value: payrollSummary?.total_net_salary,
          },
          {
            title: "Total Employees'",
            value: payrollSummary?.total_employees,
          },
        ];
        setPayrollData(updatedPayrollData);
         setPayrunDraft({
           total_amount: updatedPayrollData.find(
             (item) => item.title === "Payroll Cost"
           )?.value,
           start_date: currentMonthStart,
           end_date: currentMonthEnd,
           is_payroll_run: false,
           excluded_employees: withheldRows,
           gross_amount: updatedPayrollData.find(
             (item) => item.title === "Payroll Cost"
           ).value,
           net_amount: updatedPayrollData.find(
             (item) => item.title === "Employees' Net Pay"
           ).value,
           total_employees: updatedPayrollData.find(
             (item) => item.title === "Total Employees'"
           ).value,
         });
      }
    }
      setIsLoading(false);
    };

    fetchData();
  }, [options, filterData]);

  // Function to handle withholding salary
  const handleWithholdSalary = () => {

    const updatedWithheldEmployees = [...selectedRows, ...withheldRows];
    // Find employees in employeedata.results whose IDs are in updatedWithheldEmployees
    const withheldEmployeeData = updatedWithheldEmployees
      .map((withheldEmployeeId) => {
        return employeeData.find(
          (employee) => employee.id === withheldEmployeeId
        );
      })
      .filter((employee) => employee);
    // Calculate the total withheld salary
    const totalWithheldSalary = withheldEmployeeData.reduce(
      (total, employee) => {
        return total + parseFloat(employee.basic_salary || 0); // Ensure basic_salary is a number
      },
      0
    );
    const updatedPayrollData = payrollData.map((item) => {
      if (item.title === "Payroll Cost") {
        return { ...item, value: (item.value - totalWithheldSalary).toFixed(2) };
      }
      if(item.title === "Employees' Net Pay"){
        return { ...item, value: (item.value - totalWithheldSalary).toFixed(2) };
      }
      if(item.title === "Total Employees'"){
        return { ...item, value: (item.value *1) - selectedRows.length }; // Add the number of employees withheld
      }
    });
    setPayrollData(updatedPayrollData);
        console.log("UPDATED PAYROLL DATA", updatedPayrollData);

    setWithheldRows(updatedWithheldEmployees);
    setSelectedRows([]); 

    saveDraft(updatedWithheldEmployees, updatedPayrollData);
  };

  // Function to handle providing salary back for selected withheld rows
  const handleProvideSalary = () => {
    // Find employees in employeeData.results whose IDs are in selectedRows
    const providedEmployeeData = selectedRows
      .map((providedEmployeeId) => {
        return employeeData.find(
          (employee) => employee.id === providedEmployeeId
        );
      })
      .filter((employee) => employee);

    // Calculate the total salary to be provided back
    const totalProvidedSalary = providedEmployeeData.reduce(
      (total, employee) => {
        return total + parseFloat(employee.basic_salary || 0); // Ensure basic_salary is a number
      },
      0
    );
    // Update payroll data by adding back the provided salary
    const updatedPayrollData = payrollData.map((item) => {
      if (item.title === "Payroll Cost") {
        return { ...item, value: (((item.value *1) + totalProvidedSalary).toFixed(2)) }; // Add back to Payroll Cost
      }
      if (item.title === "Employees' Net Pay") {
        return { ...item, value: (((item.value *1) + totalProvidedSalary).toFixed(2)) }; // Add back to Net Pay
      }
      if(item.title === "Total Employees'"){
        return { ...item, value: (item.value *1) + selectedRows.length }; // Subtract the number of employees provided salary back
      }
    });
    console.log("UPDATED PAYROLL DATA", updatedPayrollData);
    setPayrollData(updatedPayrollData);

    // Remove selected withheld rows from withheldRows state
    const updatedWithheldEmployees = withheldRows.filter(
      (id) => !selectedRows.includes(id)
    );

    setWithheldRows(updatedWithheldEmployees);
    setSelectedRows([]); 
    saveDraft(updatedWithheldEmployees, updatedPayrollData);
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

  const handleSubmit = async () => {
    setPayrunConfirmationDialog(true);

  };
  const handleConfirmSubmit = async () => {
    console.log("IN HANDLE CONFIRM SUBMIT", payrunDraft);
    const reponse = await savePayrun({
      ...payrunDraft,
      is_payroll_run: true,
    });
    if (reponse) {
      setPayrunConfirmationDialog(false);
      setPayrunSubmitDialog(true);
      setTimeout(() => {
        navigate("/pay-run");
      }, 2000);
    }
  }

  const saveDraft = async (updatedWithheldEmployees, updatedPayrollData) => {
    console.log("IN SAVE DRAFT", payrollData);
    if (payrunDraft) {
      const response = await savePayrun({
        ...payrunDraft,
        excluded_employees: updatedWithheldEmployees,
        gross_amount: updatedPayrollData.find((item) => item.title === "Payroll Cost")
          .value,
        net_amount: updatedPayrollData.find(
          (item) => item.title === "Employees' Net Pay"
        ).value,
        total_employees: updatedPayrollData.find(
          (item) => item.title === "Total Employees'"
        ).value,
      });
      console.log("SAVE DRAFT", response);
      if (!response) {
        toast.error("Something went wrong!");
      } else {
        setPayrunDraft(response);
      }
    } else {
      console.log("IN ELSE");
      const payRunDraftData = {
        total_amount: updatedPayrollData.find((item) => item.title === "Payroll Cost")
          ?.value,
        start_date: currentMonthStart,
        end_date: currentMonthEnd,
        is_payroll_run: false,
        excluded_employees: updatedWithheldEmployees,
        gross_amount: updatedPayrollData.find((item) => item.title === "Payroll Cost")
          .value,
        net_amount: updatedPayrollData.find(
          (item) => item.title === "Employees' Net Pay"
        ).value,
        total_employees: updatedPayrollData.find(
          (item) => item.title === "Total Employees'"
        ).value,
      };
      const response = await savePayrun(payRunDraftData);
      if (!response) {
        toast.error("Something went wrong!");
      } else {
        setPayrunDraft(response);
      }
    }
  };
  const handleCloseConfirmationDialog = () => {
    setPayrunConfirmationDialog(false);
  };


  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <SuccessNotification
            isOpen={payrunSubmitDialog}
            onClose={setPayrunSubmitDialog}
            date={moment(payrunDraft?.start_date).format("MMMM YYYY")}
          />
          <PayRunSubmitDialog
            isOpen={payrunConfirmationDialog}
            onClose={handleCloseConfirmationDialog}
            onConfirm={handleConfirmSubmit}
            payrunDraft={payrunDraft}
          />
          <div className="flex flex-wrap gap-10 justify-between items-center h-11">
            <div className="flex items-center gap-4">
              <button
                className="w-[27px] h-[27px] bg-white rounded-3xl border border-[#e8e8ec] justify-center items-center gap-1 inline-flex"
                onClick={handleBack}
              >
                <ArrowLeft size={14} color="#000" />
              </button>
              <div>
                <span className="text-neutral-1200 text-xl font-semibold  leading-tight">
                  Pay Run for{" "}
                </span>
                <span className="text-neutral-1200 text-xl font-bold  leading-tight">
                  {moment(payrunDraft?.start_date).format("MMMM YYYY")}
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
                    <div className="text-center text-neutral-1200 text-sm font-medium">
                      Withhold Salary
                    </div>
                  </Button>
                )}
                {showProvideButton && !showWithholdButton && (
                  <Button
                    className="px-3 py-1.5 bg-[#f9f9fb] rounded-3xl justify-center items-center gap-1 inline-flex"
                    onClick={handleProvideSalary}
                  >
                    <div className="text-center text-neutral-1200 text-sm font-medium">
                      Provide Salary Back
                    </div>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CustomTable
                data={employeeData || []}
                columns={createPayrunColumns(component)}
                pagination={true}
                dataTotalSize={employeeData?.length || 0}
                tableOptions={tableOptions}
                selectable={true}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                disabledRows={withheldRows}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

const SuccessNotification = ({ isOpen, onClose, date }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-3 items-start text-sm leading-tight text-teal-600 bg-white rounded-xl">
          <CircleCheckBig size={16} color="#0d9488" />
          <div className="flex flex-col min-w-[240px]">
            <div className="font-bold">Success!</div>
            <div className="mt-1">
              Your pay run for <span className="font-semibold">{date}</span> was
              successfully added
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function PayRunSubmitDialog({ isOpen, onClose, onConfirm, payrunDraft }) {
   const date = moment(payrunDraft?.start_date); 
  const monthName = date.format("MMMM");
  const year = date.format("YYYY");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex overflow-hidden flex-col gap-2 justify-center p-6 text-sm bg-white rounded-xl border border-gray-100 border-solid shadow-lg max-w-[594px] max-md:px-5">
        <DialogHeader>
          <DialogTitle className="font-semibold text-neutral-800">
            {`Submit Pay Run for ${monthName} ${year}?`}
          </DialogTitle>
          <p className="mt-2 leading-4 opacity-90 text-neutral-400">
            {`Are you sure you want to submit the pay run for ${monthName} ${year}.`}
          </p>
        </DialogHeader>
        <div className="flex gap-2 items-center justify-end font-medium  text-center whitespace-nowrap min-w-[240px]">
          <Button
            variant="outline"
            className="gap-2 self-stretch px-3 py-2.5 my-auto bg-white rounded-3xl border border-gray-200 border-solid min-h-[36px] min-w-[120px] text-neutral-800"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            className="gap-2 self-stretch px-3 py-2.5 my-auto text-white rounded-3xl bg-neutral-800 min-h-[36px] min-w-[120px]"
            onClick={onConfirm}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CreatePayRun;


