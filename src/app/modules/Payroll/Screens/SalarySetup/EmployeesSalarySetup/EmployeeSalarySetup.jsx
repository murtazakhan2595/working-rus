import React, { useEffect, useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../src/@/components/ui/table";
import { ArrowLeft } from "lucide-react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getEmployeePayrollDetailByEmpId,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import RevisedSalarySheet from "./RevisedSalarySheet";
import { SalaryTypeOptions } from "data/Data";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader, SheetUI } from "components";
import { PayrollAdjustmentTable } from "app/modules/Payroll/Sections";
import { EmployeeSalaryRevisions } from "app/modules/Payroll/Screens/SalarySetup/EmployeesSalarySetup";
import {
  NumberInput,
  SelectInputComponent,
  TextInput,
  RadioGroupInput,
  TimePicker,
  DateInput,
} from "../../../../../../components/FormControl";
import {
  getEarnAndDeduction,
  getEmployeePayroll,
  getPayslip,
  saveEmployeePayroll,
  updateSalaryRevisionStatus,
} from "../../../../../hooks/payroll";
import { validateEmployeeSalarySetupForm } from "app/utils/FormSchema/payrollFormSchema";
import { toast } from "react-toastify";
import { calculateEarningsAndDeductions } from "../../../Sections/CalculationsHelperFunctions.jsx";
import { EmployeeOverview } from "components";

const EmployeeSalarySetup = () => {
  const formRef = React.createRef();
  const [employeeData, setEmployeeData] = React.useState({});
  const [payrollId, setPayrollId] = React.useState(null);
  const [payrollForm, setPayrollForm] = useState({});
  const [payrollFormData, setPayrollFormData] = useState({});
  const [CTC, setCTC] = useState(null);
  const [earnAndDeductionType, setEarnAndDeductionsType] = React.useState([]);
  const [earnAndDeductions, setEarnAndDeductions] = React.useState([]);
  const [monthlyGrossSalary, setMonthlyGrossSalary] = useState({});
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
    const response = await getEmployeePayrollDetailByEmpId(id);
    if (response) {
      setPayrollId(response.id);
      setPayrollForm(response);
      setCTC(response.ctc);
      const earnAndDeductions = await getEmployeeEarnAndDeduction({
        filterData: { employee_payroll: response?.id },
      });
      setPayrollType(response?.salary_type);
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
        response?.basic_salary
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
  const handleSubmit = async (values) => {
    debugger;
    const {
      basic_salary = 0,
      medical_allowance = 0,
      transport_allowance = 0,
      house_allowance = 0,
      other_allowance = 0,
      gross_salary = 0,
      salary_breakdown_type,
    } = values;
    const payload = values;
    payload.is_new = false;
    payload.ctc = CTC;
    if (salary_breakdown_type === "percentage") {
      payload.basic_salary =
        (parseFloat(basic_salary || 0) / 100) * parseFloat(gross_salary || 0);
      payload.medical_allowance =
        (parseFloat(medical_allowance || 0) / 100) *
        parseFloat(gross_salary || 0);
      payload.transport_allowance =
        (parseFloat(transport_allowance || 0) / 100) *
        parseFloat(gross_salary || 0);
      payload.house_allowance =
        (parseFloat(house_allowance || 0) / 100) *
        parseFloat(gross_salary || 0);
      payload.other_allowance =
        (parseFloat(other_allowance || 0) / 100) *
        parseFloat(gross_salary || 0);
    }

    const response = await saveEmployeePayroll(payload, values.id);
    if (response) {
      toast.success("Salary Saved Successfully");
    }
  };
  const calculateCTC = (FormData) => {
    const {
      basic_salary = 0,
      medical_allowance = 0,
      transport_allowance = 0,
      house_allowance = 0,
      other_allowance = 0,
      gross_salary = 0,
      salary_breakdown_type,
    } = FormData;
    const TotalAmount =
      parseFloat(basic_salary || 0) +
      parseFloat(house_allowance || 0) +
      parseFloat(other_allowance || 0) +
      parseFloat(medical_allowance || 0) +
      parseFloat(transport_allowance || 0);
    if (salary_breakdown_type === "fixed") {
      setCTC(TotalAmount);
    } else {
      const ctc_amount = (TotalAmount / 100) * (gross_salary || 0);
      setCTC(ctc_amount);
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
              <EmployeeOverview
                id={employeeData.id}
                showId={true}
                showDepartment={true}
                showEmail={true}
                avatarSize={"16"}
              />
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
            <CardContent className="flex flex-col items-start gap-4 space-x-4">
              <SheetUI
                isOpen={true}
                variant=""
                className="w-full"
                formConfig={{
                  initialValues: payrollForm,
                  enableReinitialize: true,
                  renderUpdatedFormValues: setPayrollFormData,
                  handleSubmit: handleSubmit,
                  validateFormSchema: validateEmployeeSalarySetupForm,
                  submitButtonText: "Save",
                  onFormChange: calculateCTC,
                  columns: 3,
                  formFiels: [
                    {
                      sheetCardExtension: false,
                      InputFiels: [
                        {
                          InputField: NumberInput,
                          name: "gross_salary",
                          required: true,
                          label: "Gross Salary",
                        },

                        {
                          InputField: SelectInputComponent,
                          name: "salary_type",
                          required: true,
                          label: "Salary Type",
                          options: SalaryTypeOptions,
                        },
                        {
                          InputField: NumberInput,
                          name: "ctc",
                          // required: true,
                          disabled: true,
                          label: "CTC",
                          value: CTC,
                        },
                        {
                          InputField: RadioGroupInput,
                          name: "salary_breakdown_type",
                          required: true,
                          disabled: false,
                          label: "Amount Type",
                          options: [
                            { value: "percentage", label: "Percentage" },
                            { value: "fixed", label: "Fixed" },
                          ],
                          colsSpan: 3,
                          variant: "stacked",
                        },
                        {
                          InputField: NumberInput,
                          name: "basic_salary",
                          required: true,
                          label: "Basic Salary",

                          min: 0,
                          max:
                            payrollFormData.salary_breakdown_type ===
                            "percentage"
                              ? 100
                              : null,
                        },
                        {
                          InputField: NumberInput,
                          name: "medical_allowance",
                          required: true,
                          label: "Medical Allowance",

                          min: 0,
                          max:
                            payrollFormData.salary_breakdown_type ===
                            "percentage"
                              ? 100
                              : null,
                        },
                        {
                          InputField: NumberInput,
                          name: "transport_allowance",
                          required: true,
                          label: "Transport Allowance",

                          min: 0,
                          max:
                            payrollFormData.salary_breakdown_type ===
                            "percentage"
                              ? 100
                              : null,
                        },
                        {
                          InputField: NumberInput,
                          name: "house_allowance",
                          required: true,
                          label: "House Allowance",

                          min: 0,
                          max:
                            payrollFormData.salary_breakdown_type ===
                            "percentage"
                              ? 100
                              : null,
                        },
                        {
                          InputField: NumberInput,
                          name: "other_allowance",
                          required: true,
                          label: "Other Allowance",

                          min: 0,
                          max:
                            payrollFormData.salary_breakdown_type ===
                            "percentage"
                              ? 100
                              : null,
                        },
                      ].filter(Boolean),
                    },
                  ],
                }}
              ></SheetUI>
              {/* <div className="text-lg font-semibold text-black">
                {" "}
                {isEos
                  ? "Gross Amount"
                  : payrollType === "hourly"
                  ? "Hourly Rate"
                  : "Monthly Gross Salary"}
              </div> */}
              {/* <div className="flex items-center w-full gap-6">
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
              </div> */}
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <PayrollAdjustmentTable
              AdjustmentTitle="Allowances"
              AdjustmentRecord={{ results: earnings, count: earnings.length }}
              fallbackText={"No allowance is applicable"}
            />
            <PayrollAdjustmentTable
              AdjustmentTitle="Deductions"
              AdjustmentRecord={{ results: earnings, count: earnings.length }}
              fallbackText={"No allowance is applicable"}
            />
          </div>
{console.log(payrollForm,"previousCTC")
}
          <EmployeeSalaryRevisions
            employee_Id={id}
            editMode={true}
            payrollId={payrollForm.id}
            previousCTC={payrollForm.ctc}
          />
        </>
      )}
    </div>
  );
};

export default EmployeeSalarySetup;
