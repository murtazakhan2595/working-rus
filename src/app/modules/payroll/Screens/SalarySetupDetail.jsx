import React, { useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../src/@/components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CalendarIcon,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../src/@/components/ui/command";
import { format } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getSalaryRevision,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import RevisedSalarySheet from "./RevisedSalarySheet";
import {
  DesignationName,
  EmployeeID,
  getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader } from "components";
import {
  revisionLetterOptions,
  revisionStatusOptions,
} from "../../../../data/Data";
import {
  FilterInput,
  SelectComponent,
  TextInput,
} from "../../../../components/form-control";
import {
  getEarnAndDeduction,
  getEmployeePayroll,
  updateSalaryRevisionStatus,
} from "../../../hooks/payroll";
import AddAdditionalEarningSheet from "../Sections/AddAdditionalEarningSheet";

const payslip = {
  total_earnings: [
    { description: "Basic Salary", amount: 5000 },
    { description: "Housing Allowance", amount: 2000 },
    { description: "Transportation Allowance", amount: 500 },
  ],
  total_deductions: [
    { description: "Tax", amount: 300 },
    { description: "Health Insurance", amount: 200 },
  ],
  gross_salary: 7500, // Total of earnings
  net_salary: 7000, // Gross salary minus deductions
};

const SalarySetupDetail = () => {
  const [employeeData, setEmployeeData] = React.useState({});
  const [payrollId, setPayrollId] = React.useState(null);
  const [earnAndDeductionType, setEarnAndDeductionsType] = React.useState([]);
  const [earnAndDeductions, setEarnAndDeductions] = React.useState([]);
  const [monthlyGrossSalary, setMonthlyGrossSalary] = React.useState();
  const [earnings, setEarnings] = React.useState([]);
  const [deductions, setDeductions] = React.useState([]);
  const navigate = useNavigate();
  const { id } = useParams();


    useEffect(() => {
      const fetchData = async () => {
        const response = await getEmployeePayroll({
          filterData: { employee_id: id },
        });
        // 
        if (response) {
          setPayrollId(response?.results[0]?.id);
          console.log("RESPONSE", response?.results[0]);
          const earnAndDeductions = await getEmployeeEarnAndDeduction({
            filterData: { employee_payroll: response?.results[0]?.id },
          });
          console.log("EARNANDDEDUCTIONS", earnAndDeductions);
          if (earnAndDeductions) {
            // console.log(earnAndDeductions);
            setEarnAndDeductions(earnAndDeductions);
          }
        }
      };
      fetchData();
    }, [id]);
console.log("EARNANDDEDUCTIONS",earnAndDeductions)
  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeeData(id);

      if (response) {
        setEmployeeData(response);
      }

      const earnAndDeductionType = await getEarnAndDeduction()
      if (earnAndDeductionType) {
        setEarnAndDeductionsType(earnAndDeductionType.results);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  console.log("INFO", earnAndDeductionType);
  const handleSalaryCalculate = () =>{
    console.log("Monthly Gross Salary", monthlyGrossSalary);
    console.log("earnAndDeductionType", earnAndDeductionType);
    const basic = monthlyGrossSalary * 0.4;
    const houseAllowance = monthlyGrossSalary * 0.4;
    const foodAllowance = basic * 0.4;
    const otherAllowance =
      monthlyGrossSalary - (basic + houseAllowance + foodAllowance);

    const professionalTax = 250; 
    const earnings = [
      { name: "Basic", amounts: "Fixed, 40% of Gross", monthly_amount: basic },
      {
        name: "House Allowance",
        amounts: "Fixed, 40% of Gross",
        monthly_amount: houseAllowance,
      },
      {
        name: "Food Allowance",
        amounts: "Fixed, 40% of Basic",
        monthly_amount: foodAllowance,
      },
      {
        name: "Other Allowance",
        amounts: "Fixed flat",
        monthly_amount: otherAllowance,
      },
    ];
    setEarnings(earnings);
    setDeductions([{ name: "Professional Tax", amounts: "Fixed", monthly_amount: professionalTax }]);
  }
  return (
    <div className="container p-4 mx-auto">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-4 text-xl text-balance"
        >
          <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
          Detail
        </Button>
      </div>
      <Card className="mb-4">
        <CardContent className="flex items-center pt-6 space-x-4">
          <Avatar className="w-20 h-20 ">
            <AvatarImage
              src={employeeData?.avatar}
              alt={`${employeeData?.first_name} ${employeeData?.last_name}`}
            />
            <AvatarFallback className="bg-plum-400">
              {`${employeeData?.first_name} ${employeeData?.last_name}`
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base text-black">
              <EmployeeID value={id} />
            </p>
            <h2 className="text-2xl font-bold text-plum-900">
              {employeeData?.first_name} {employeeData?.last_name}
            </h2>
            <p className="text-base text-muted-foreground">
              <DesignationName value={employeeData?.department_position} />
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-plum-900">Salary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-start pt-6 space-x-4">
          <div className="text-lg font-semibold text-black">
            {" "}
            Monthly Gross Salary
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <TextInput
                name={"add_value"}
                value={monthlyGrossSalary || ""}
                label={"Add Value"}
                onChange={(name, value) => setMonthlyGrossSalary(value)}
              />
              <Button variant="primary" onClick={handleSalaryCalculate}>
                {" "}
                Calculate
              </Button>
            </div>
            <div class="text-[#8b8d98] text-sm">Hourly Rate : AED 0.00</div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Employee Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Components</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Monthly Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amounts}</TableCell>
                    <TableCell className="text-right">
                      {item.monthly_amount}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total in AED</TableCell>
                  <TableCell className="text-right">
                    AED {Number(payslip.gross_salary).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Components</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Monthly Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductions?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amounts}</TableCell>
                    <TableCell className="text-right">
                      {item.monthly_amount}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total in AED</TableCell>
                  <TableCell className="text-right">
                    AED{" "}
                    {Number(payslip.gross_salary - payslip.net_salary).toFixed(
                      2
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between w-full">
          <CardTitle>Additional Earnings and Deductions</CardTitle>
          <AddAdditionalEarningSheet />
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Component Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payable Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnAndDeductions?.earnings?.map((item, index) => (
                <TableRow key={index} className="cursor-pointer">
                  <TableCell>{item?.type_name}</TableCell>
                  <TableCell>{item?.income_type}</TableCell>
                  <TableCell>{item?.amount}</TableCell>
                  <TableCell>{item?.month}</TableCell>
                </TableRow>
              ))}
              {earnAndDeductions?.deductions?.map((item, index) => (
                <TableRow key={index} className="cursor-pointer">
                  <TableCell>{item?.type_name}</TableCell>
                  <TableCell>{item?.income_type}</TableCell>
                  <TableCell>{item?.amount}</TableCell>
                  <TableCell>{item?.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySetupDetail;
