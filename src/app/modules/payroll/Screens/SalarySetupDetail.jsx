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
  const [earnAndDeduction, setEarnAndDeductions] = React.useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeeData(id);
      if (response) {
        setEmployeeData(response);
      }

    };
    fetchData();
  }, [id]);


  useEffect(()=>{
    const fetchData = async () => {
      const response = await getEmployeePayrollById(id);
      if (response) {
        setPayrollId(response.id);
        const earnAndDeductions = await getEmployeeEarnAndDeduction({
          filterData: { employee_payroll: response.id },
        });
        if (earnAndDeductions) {
          console.log(earnAndDeductions);
          setEarnAndDeductions(earnAndDeductions.results);
        }
      }
    };
    fetchData();
  },[id])
  const handleBack = () => {
    navigate(-1);
  };

  console.log("INFO", employeeData, payrollId, earnAndDeduction);
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
                label={"Add Value"}
                onChange={(name, value) => console.log(name, value)}
              />
              <Button variant="primary"> Calculate</Button>
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
                  <TableHead>Earning types</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslip.total_earnings?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      AED {Number(item.amount).toFixed(2)}
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
                  <TableHead>Deduction types</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslip.total_deductions?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      AED {Number(item.amount).toFixed(2)}
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
              {earnAndDeduction?.map((revision, index) => (
                <TableRow key={index} className="cursor-pointer">
                  <TableCell>AED</TableCell>
                  <TableCell>AED</TableCell>
                  <TableCell>sdfsd</TableCell>
                  <TableCell>sdfsdf</TableCell>
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
