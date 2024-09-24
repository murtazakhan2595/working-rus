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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/@/components/ui/table";
import { ArrowLeft } from "lucide-react";

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
  saveEmployeePayroll,
  updateSalaryRevisionStatus,
} from "../../../hooks/payroll";
import AddAdditionalEarningSheet from "../Sections/AddAdditionalEarningSheet";
import { toast } from "react-toastify";
import {
  
calculateEarningsAndDeductions
} from "../Sections/CalculationsHelperFunctions.jsx"

const SalarySetupDetail = () => {
  const [employeeData, setEmployeeData] = React.useState({});
  const [payrollId, setPayrollId] = React.useState(null);
  const [earnAndDeductionType, setEarnAndDeductionsType] = React.useState([]);
  const [earnAndDeductions, setEarnAndDeductions] = React.useState([]);
  const [monthlyGrossSalary, setMonthlyGrossSalary] = React.useState();
  const [earnings, setEarnings] = React.useState([]);
  const [deductions, setDeductions] = React.useState([]);
  const [totalEarnings, setTotalEarnings] = React.useState(0);
  const [totalDeductions, setTotalDeductions] = React.useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  console.log("payroll id", payrollId);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeePayroll({
        filterData: { employee_id: id },
      });
      //
      if (response) {
        setPayrollId(response?.results[0]?.id);
        const earnAndDeductions = await getEmployeeEarnAndDeduction({
          filterData: { employee_payroll: response?.results[0]?.id },
        });
        if (earnAndDeductions) {
          setEarnAndDeductions(earnAndDeductions);
        }
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeeData(id);

      if (response) {
        setEmployeeData(response);
      }

      const earnAndDeductionType = await getEarnAndDeduction();
      if (earnAndDeductionType) {
        setEarnAndDeductionsType(earnAndDeductionType.results);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };


const handleSalaryCalculate = () => {

  const { earnings, deductions, totalEarnings, totalDeductions } =
    calculateEarningsAndDeductions(monthlyGrossSalary, earnAndDeductionType);

  setEarnings(earnings);
  setDeductions(deductions);
  setTotalEarnings(totalEarnings);
  setTotalDeductions(totalDeductions);
};
  const handleSalarySave =async () => {
    const payload = {
      id: payrollId,
      basic_salary: monthlyGrossSalary,
      is_new: false
    };
    const response = await saveEmployeePayroll(payload);
    if(response){
      toast.success("Salary Saved Successfully");
    }
  };
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
        <CardContent className="flex flex-col items-start gap-4 pt-6 space-x-4">
          <div className="text-lg font-semibold text-black">
            {" "}
            Monthly Gross Salary
          </div>
          <div className="flex items-center gap-6 w-full">
            <TextInput
              name={"add_value"}
              value={monthlyGrossSalary || ""}
              onChange={(name, value) => setMonthlyGrossSalary(value)}
            />
            <Button variant="primary" onClick={handleSalaryCalculate}>
              {" "}
              Calculate
            </Button>
            <div class="text-[#8b8d98] text-sm">Hourly Rate : AED 0.00</div>
            <Button onClick={handleSalarySave}>Save</Button>
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
                    AED {Number(totalEarnings).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Deductions </CardTitle>
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
                    AED {Number(totalDeductions).toFixed(2)}
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
