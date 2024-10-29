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
  getPayslip,
  saveEmployeePayroll,
  updateSalaryRevisionStatus,
} from "../../../hooks/payroll";
import AddAdditionalEarningSheet from "../Sections/AddAdditionalEarningSheet";
import { toast } from "react-toastify";
import { calculateEarningsAndDeductions } from "../Sections/CalculationsHelperFunctions.jsx";

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
  const [loading, setLoading] = React.useState(true);
  const [payrollType, setPayrollType] = React.useState("");
  const [payslips, setPayslips] = React.useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const isEos = pathname.startsWith("/payroll/salary-setup-eos");

  const fetchData = async () => {
    setLoading(true);
    const response = await getEmployeePayroll({
      filterData: { employee_id: id },
    });
    //
    if (response) {
      setPayrollId(response?.results[0]?.id);
      if (response?.results[0]?.salary_type === "hourly") {
        setMonthlyGrossSalary(response?.results[0]?.hourly_rate);
      } else {
        setMonthlyGrossSalary(response?.results[0]?.basic_salary);
      }
      const earnAndDeductions = await getEmployeeEarnAndDeduction({
        filterData: { employee_payroll: response?.results[0]?.id },
      });
      setPayrollType(response?.results[0]?.salary_type);
      if (earnAndDeductions) {
        setEarnAndDeductions(earnAndDeductions);
      }
    }
    const empData = await getEmployeeData(id);

    if (empData) {
      setEmployeeData(empData);
    }

    const earnAndDeductionType = await getEarnAndDeduction();
    if (earnAndDeductionType) {
      setEarnAndDeductionsType(earnAndDeductionType.results);
      handleSalaryCalculate(
        earnAndDeductionType.results,
        response?.results[0]?.basic_salary
      );
    }

    if (isEos) {
      const payslips = await getPayslip({
        filterData: { employee_payroll: response?.results[0]?.id },
      });
      console.log("Payslips", payslips);
      if (payslips) {
        setPayslips(payslips.results[0]);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSalaryCalculate = (
    initialEarnAndDeductionType,
    monthlyGrossSalary
  ) => {
    // Check if the necessary values are present
    if (
      !monthlyGrossSalary ||
      !initialEarnAndDeductionType ||
      initialEarnAndDeductionType.length === 0
    ) {
      return;
    }
    const { earnings, deductions, totalEarnings, totalDeductions } =
      calculateEarningsAndDeductions(
        monthlyGrossSalary,
        initialEarnAndDeductionType
      );

    setEarnings(earnings);
    setDeductions(deductions);
    setTotalEarnings(totalEarnings);
    setTotalDeductions(totalDeductions);
  };
  const handleSalarySave = async () => {
    let payload = {};
    if (payrollType === "hourly") {
      payload = {
        id: payrollId,
        hourly_rate: monthlyGrossSalary,
        is_new: false,
      };
    } else {
      payload = {
        id: payrollId,
        basic_salary: monthlyGrossSalary,
        is_new: false,
      };
    }

    const response = await saveEmployeePayroll(payload);
    if (response) {
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
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Card className="mb-4">
            <CardContent className="flex justify-between pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 ">
                  <AvatarImage
                    src={employeeData?.avatar}
                    alt={`${employeeData?.first_name} ${employeeData?.last_name}`}
                  />
                  <AvatarFallback className="bg-plum-400">
                    {`${employeeData?.first_name} `
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base text-black">
                    <EmployeeID value={id} />
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-black">
                      {employeeData?.first_name} {employeeData?.last_name}
                    </h2>
                    {isEos && (
                      <div className=" px-3 py-[3px] rounded-full border border-[#f49fb4] justify-center items-center gap-1.5 inline-flex">
                        <div className="text-[#ce1644] text-xs font-semibold">
                          End of Service
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-base text-muted-foreground">
                    <DesignationName
                      value={employeeData?.department_position}
                    />
                  </p>
                </div>
              </div>
              {isEos && payslips && (
                <Button
                  className="bg-[#1c2024] text-white align-bottom self-end	"
                  onClick={() => {
                    navigate(`/payslip-eos/${payslips.id}?employeeID=${id}`);
                  }}
                >
                  Download EOS
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-plum-900">
                {isEos ? "EOS Calculation" : "Salary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4 pt-6 space-x-4">
              <div className="text-lg font-semibold text-black">
                {" "}
                {isEos
                  ? "Gross Amount"
                  : payrollType === "hourly"
                  ? "Hourly Rate"
                  : "Monthly Gross Salary"}
              </div>
              <div className="flex items-center w-full gap-6">
                <TextInput
                  name={"add_value"}
                  value={monthlyGrossSalary || ""}
                  onChange={(name, value) => setMonthlyGrossSalary(value)}
                />
                <Button
                  onClick={() => {
                    handleSalaryCalculate(
                      earnAndDeductionType,
                      monthlyGrossSalary
                    );
                  }}
                >
                  {" "}
                  Calculate
                </Button>
                {console.log("PAYROLL TYPE", payrollType)}
                {payrollType === "hourly" ? (
                  <div class="text-[#8b8d98] text-sm">
                    Monthly Salary : AED {monthlyGrossSalary * 80}
                  </div>
                ) : payrollType === "monthly" ? (
                  <div class="text-[#8b8d98] text-sm">
                    Hourly Rate : AED {monthlyGrossSalary / 160}
                  </div>
                ) : null}{" "}
                {!isEos && <Button onClick={handleSalarySave}>Save</Button>}
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
                      <TableHead className="text-left">
                        Monthly Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollType !== "hourly" &&
                      earnings?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.amounts}</TableCell>
                          <TableCell className="text-left">
                            AED {item.monthly_amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow className="font-bold">
                      <TableCell>Total in AED</TableCell>
                      <TableCell className="text-right">
                        AED{" "}
                        {payrollType !== "hourly"
                          ? Number(totalEarnings).toFixed(2)
                          : monthlyGrossSalary * 80}
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
                      <TableHead className="text-right">
                        Monthly Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollType !== "hourly" &&
                      deductions?.map((item, index) => (
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
                        {payrollType !== "hourly"
                          ? Number(totalDeductions).toFixed(2)
                          : 0}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between w-full">
              <CardTitle>
                {isEos
                  ? "EOS Earnings and Deductions"
                  : "Additional Earnings and Deductions"}
              </CardTitle>
              <AddAdditionalEarningSheet
                isEos={isEos}
                reload={fetchData}
                payrollId={payrollId}
              />
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
                      <TableCell className="capitalize">
                        {item?.income_type}
                      </TableCell>
                      <TableCell>
                        {item?.amount_type === "percentage"
                          ? `Variable ${item?.amount}%`
                          : `Fixed, Amt: AED ${item?.amount}`}
                      </TableCell>
                      <TableCell>{item?.month}</TableCell>
                    </TableRow>
                  ))}
                  {earnAndDeductions?.deductions?.map((item, index) => (
                    <TableRow key={index} className="cursor-pointer">
                      <TableCell>{item?.type_name}</TableCell>
                      <TableCell className="capitalize">
                        {item?.income_type}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {item?.amount_type === "percentage"
                          ? `Variable ${item?.amount}%`
                          : `Fixed, Amt: AED ${item?.amount}`}
                      </TableCell>
                      <TableCell>{item?.month}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SalarySetupDetail;
