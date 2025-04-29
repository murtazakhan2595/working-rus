import React, { useEffect, useState } from "react";
import { DetailBox } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { SalaryTypeOptions } from "data/Data";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CalendarIcon,
  Filter,
} from "lucide-react";
import { EmployeePayslipDetails } from "app/modules/Payroll/Sections";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { format } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getSalaryRevision,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import {
  calculateEarningsAndDeductions,
  calculateAmounts,
} from "app/modules/Payroll/Sections/CalculationsHelperFunctions";
import moment from "moment";

export default function SalaryBreakDown({ payrollDetails }) {
  const [earnings, setEarnings] = useState([]);
  const [deductions, setDeduction] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);

  const fetchSalaryDetails = async (isMounted) => {
    if (payrollDetails && isMounted) {
      if (payrollDetails?.earnings && payrollDetails?.earnings.length > 0) {
        const { amountsBreakdown, totalAmounts } = calculateAmounts(
          payrollDetails?.basic_salary,
          payrollDetails?.earnings || []
        );
        setEarnings(amountsBreakdown);
        setTotalEarnings(totalAmounts);
      }
      if (payrollDetails?.deductions && payrollDetails?.deductions.length > 0) {
        const { amountsBreakdown, totalAmounts } = calculateAmounts(
          payrollDetails?.basic_salary,
          payrollDetails?.deductions || []
        );
        setDeduction(amountsBreakdown);
        setTotalDeduction(totalAmounts);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchSalaryDetails(isMounted);
    return () => {
      isMounted = false;
    };
  }, [payrollDetails]);
  const AmountSymbol = " AED";
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-plum-900">Salary BreakUp</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <h3 className="mb-4 text-lg font-semibold text-black">
          CTC Components
        </h3> */}
        {/* <div className="flex flex-col gap-2">
          <div className="flex flex-row font-bold">
            <div className="flex flex-row font-bold text-left">
              Gross Salary
            </div>
            <div className="flex-1 text-right">{payrollDetails?.ctc}{AmountSymbol}</div>
          </div> */}
          <div className="grid grid-cols-2 gap-4 w-full">
           
          <DetailBox
              orientation="horizontal"
              label={"Gross Salary"}
              value={`${payrollDetails.ctc||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
            <DetailBox
              orientation="horizontal"
              label={"Salary Type"}
              value={
                SalaryTypeOptions.find(
                  (obj) => obj.value === payrollDetails.salary_type
                )?.label || payrollDetails.salary_type
              }
              fallbackText={"N/A"}
            />
           
            <DetailBox
              orientation="horizontal"
              label={"Basic Salary"}
              value={`${payrollDetails.basic_salary||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
            <DetailBox
              orientation="horizontal"
              label={"Medical Allowance"}
              value={`${payrollDetails.medical_allowance||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
            <DetailBox
              orientation="horizontal"
              label={"Transport Allowance"}
              value={`${payrollDetails.transport_allowance||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
            <DetailBox
              orientation="horizontal"
              label={"House Allowance"}
              value={`${payrollDetails.house_allowance||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
            <DetailBox
              orientation="horizontal"
              label={"Other Allowance"}
              value={`${payrollDetails.other_allowance||'0.00'}${AmountSymbol}`}
              fallbackText={"N/A"}
            />
          </div>
          {/* {totalEarnings > 0 && (
            <SalaryComponent
              componentName="Earnings"
              componentList={earnings || []}
              totalValue={totalEarnings}
            />
          )}
          {totalDeduction > 0 && (
            <SalaryComponent
              componentName="Deductions"
              componentList={deductions || []}
              totalValue={totalDeduction}
            />
          )} */}
        {/* </div> */}
      </CardContent>
    </Card>
  );
}

const SalaryComponent = ({ componentName, componentList = [], totalValue }) => {
  return (
    <>
      <div className="flex flex-row font-bold">
        <div className="flex flex-row font-bold text-left">{componentName}</div>
        <div className="flex-1 text-right">AED {totalValue}</div>
      </div>
      {componentList?.map((item, index) => (
        <div className="flex flex-row gap-4 ml-3" key={index}>
          <div className="flex-1">{item.type_name}</div>
          <div className="flex-1">
            {item.amount}
            {item.amount_type === "fixed" ? "AED" : "%"}
          </div>
          <div className="flex-1 text-right">AED {item.calculated_amount}</div>
        </div>
      ))}
    </>
  );
};
