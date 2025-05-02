import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEmployeePayrollDetailByEmpId } from "app/hooks/payroll";
import { SalaryTypeOptions } from "data/Data";
import { PageLoader, SheetUI } from "components";
import { PayrollAdjustmentTable } from "app/modules/Payroll/Sections";
import { EmployeeSalaryRevisions } from "app/modules/Payroll/Screens/SalarySetup/EmployeesSalarySetup";
import {
  NumberInput,
  SelectInputComponent,
  RadioGroupInput,
} from "components/FormControl";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { validateEmployeeSalarySetupForm } from "app/utils/FormSchema/payrollFormSchema";
import {
  mapPayrollAdjustmentList,
  mapEmployeeSalarySetupData,
} from "app/utils/MappingObjects/mapPayrollData";
import { EmployeeSalary } from "app/utils/Types/Payroll";
import { toast } from "react-toastify";
import { EmployeeOverview } from "components";
import { DetailBox, SheetCardExtension } from "components/SheetCardExtension";
import { EmployeeDetailUI } from "components";

const EmployeeSalarySetup = () => {
  const [payrollForm, setPayrollForm] = useState(EmployeeSalary);
  const [payrollID, setPayrollID] = useState(null);
  const [lastIncrementDate, setLastIncrementDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [payrollFormData, setPayrollFormData] = useState({});
  const [CTC, setCTC] = useState(null);
  const [earnings, setEarnings] = React.useState([]);
  const [deductions, setDeductions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const isEos = pathname.startsWith("/payroll/salary-setup-eos");

  const fetchData = async (isMounted) => {
    setLoading(true);
    const response = await getEmployeePayrollDetailByEmpId(id);
    if (response && isMounted) {
      setPayrollForm(mapEmployeeSalarySetupData(response));
      setPayrollID(response.id);
      setLastIncrementDate(response.latest_effective_date);
      setCTC(response.ctc);
      const earnings = await mapPayrollAdjustmentList([
        ...(response.earning_types || []),
        ...(response.earnings || []),
      ]);
      setEarnings(earnings);
      const deductions = await mapPayrollAdjustmentList([
        ...(response.deduction_types || []),
        ...(response.deductions || []),
      ]);
      setDeductions(deductions);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
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
    payload.employee = parseInt(id);
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
      fetchData(true);
      setEditMode(false);
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
  const AmountSymbol =
    payrollForm?.salary_breakdown_type === "fixed" ? " AED" : "%";
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
                id={id}
                showId={true}
                showDepartment={true}
                showEmail={true}
                avatarSize={"16"}
              />
              {/* {isEos && payslips && (
                <Button
                  className="bg-[#1c2024] text-white align-bottom self-end	"
                  onClick={() => {
                    navigate(`/payslip-eos/${payslips.id}?employeeID=${id}`);
                  }}
                >
                  Download EOS
                </Button>
              )} */}
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-plum-900 flex justify-between">
                <div> {isEos ? "EOS Calculation" : "Salary"}</div>
                {!editMode && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4 space-x-4">
              {editMode ? (
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
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
                    <EmployeeDetailUI
                      id={id}
                      InformationKeys={["id", "name", "position", "department"]}
                      variant="FormView"
                    />
                  </div>
                </SheetUI>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 w-full">
                  {/* <EmployeeDetailUI
                    id={id}
                    InformationKeys={["id", "name", "position", "department"]}
                  /> */}
                  <DetailBox
                    orientation="horizontal"
                    label={"Gross Salary"}
                    value={`${payrollForm.gross_salary || 0} AED`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Salary Type"}
                    value={
                      SalaryTypeOptions.find(
                        (obj) => obj.value === payrollForm.salary_type
                      )?.label || payrollForm.salary_type
                    }
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"CTC"}
                    value={`${payrollForm.ctc || 0} AED`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Amount Type"}
                    className={"text-capitalize mt-3"}
                    value={payrollForm.salary_breakdown_type}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Basic Salary"}
                    value={`${payrollForm.basic_salary || 0}${AmountSymbol}`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Medical Allowance"}
                    value={`${
                      payrollForm.medical_allowance || 0
                    }${AmountSymbol}`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Transport Allowance"}
                    value={`${
                      payrollForm.transport_allowance || 0
                    }${AmountSymbol}`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"House Allowance"}
                    value={`${payrollForm.house_allowance || 0}${AmountSymbol}`}
                    fallbackText={"N/A"}
                  />
                  <DetailBox
                    orientation="horizontal"
                    label={"Other Allowance"}
                    value={`${payrollForm.other_allowance || 0}${AmountSymbol}`}
                    fallbackText={"N/A"}
                  />
                </div>
              )}
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
              AdjustmentRecord={{
                results: deductions,
                count: deductions.length,
              }}
              fallbackText={"No allowance is applicable"}
            />
          </div>
          <EmployeeSalaryRevisions
            employee_Id={id}
            editMode={true}
            payrollId={payrollID}
            previousCTC={payrollForm.ctc}
            payrollData={payrollForm}
            reloadData={fetchData}
            lastIncrementDate={lastIncrementDate}
          />
        </>
      )}
    </div>
  );
};

export default EmployeeSalarySetup;
