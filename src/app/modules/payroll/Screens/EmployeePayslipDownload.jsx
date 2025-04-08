import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { usePDF } from "react-to-pdf";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getPayslip } from "app/hooks/payroll";
// import RevisedSalarySheet from "./RevisedSalarySheet";
import {
  DesignationName,
  EmployeeID,
  // getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader } from "components";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
import { getPayslip } from "app/hooks/payroll";
import { getPayslipByID } from "app/hooks/payroll";
import { getFinalSettlement } from "app/hooks/payroll";
import Newlogo from "../../../../assets/images/NewLogo";
import "../styles/payslip.css";

// Dummy Earnings Data
const dummyEarningsData = [
  { description: "Basic Salary", amount: 2000 },
  { description: "House Allowance", amount: 500 },
  { description: "Transport Allowance", amount: 300 },
  { description: "Medical Allowance", amount: 200 },
  { description: "Other Allowances", amount: 150 },
];

// Dummy Deductions Data
const dummyDeductionsData = [
  { description: "Tax", amount: 200 },
  { description: "Insurance", amount: 100 },
];

export default function Payslip() {
  const [employeeData, setEmployeeData] = React.useState({});
  const [filterData, setFilterData] = React.useState({});
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [eosData, setEosData] = React.useState([]);
  const [finalSettlement, setFinalSettlement] = React.useState(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const employeeID = new URLSearchParams(location.search).get("employeeID");
  const isEos = location.pathname.startsWith("/payslip-eos");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, payslipData] = await Promise.all([
        getEmployeeData(employeeID),
        getPayslipByID(id),
      ]);

      if (empData) setEmployeeData(empData);
      if (payslipData) setPayslip(payslipData);

      if (isEos && payslipData) {
        const finalSettlement = await getFinalSettlement({
          filterData: { employee_payroll: payslipData.employee_payroll },
        });

        if (finalSettlement?.results?.[0]) {
          const finalSettlementData = finalSettlement.results[0];
          const eosData = [
            {
              description: "Earned Leave Encashment",
              amount: finalSettlementData.earned_leave_encashment,
            },
            {
              description: "Gratuity",
              amount: finalSettlementData.gratuity_amount,
            },
            {
              description: "Total Deductions",
              amount: finalSettlementData.total_deductions,
            },
            {
              description: "Remaining Salary",
              amount: finalSettlementData.remaining_salary,
            },
          ];
          setEosData(eosData);
          setFinalSettlement(finalSettlementData);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, employeeID, isEos]);

  const { toPDF, targetRef } = usePDF({
    filename: "payslip.pdf",
    page: {
      format: "A4",
      orientation: "portrait",
      margin: 10,
    },
    scale: 0.95,
  });

  const downloadPDF = () => {
    const noPrintElements = document.querySelectorAll(".no-print");

    // Hide no-print elements before generating the PDF
    noPrintElements.forEach((el) => (el.style.display = "none"));

    // Generate the PDF
    toPDF().then(() => {
      // Show no-print elements after PDF is generated
      noPrintElements.forEach((el) => (el.style.display = ""));
    });
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 text-lg text-balance"
        >
          <ArrowLeft className="w-4 h-4 mr-2 bg-white rounded-lg shadow-sm" />
          Payroll Detail
        </Button>
      </div>

      <Card
        ref={targetRef}
        className="w-full mx-auto rounded-none payslip-card"
      >
        <CardHeader className="py-2 text-white bg-plum-400">
          <div className="flex items-center justify-between">
            <Newlogo />
          </div>
        </CardHeader>

        <div className="p-2 space-y-4">
          {loading ? (
            <PageLoader />
          ) : !payslip ? (
            <div className="p-4 mt-4 text-center rounded-lg bg-plum-400 text-slate-1200">
              No Payslip Data Found
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Main Content */}
              <h2 className="pb-2 text-xl font-semibold border-b text-slate-1200">
                Payslip for the month of{" "}
                <span className="text-plum-900">
                  {moment(payslip?.generated_at).format("MMMM YYYY")}
                </span>
              </h2>

              {/* Employee Summary and Cost to Company Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Employee Pay Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-1200 text-balance">
                    Employee Pay Summary
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "ID", value: <EmployeeID value={employeeID} /> },
                      {
                        label: "Name",
                        value: `${employeeData?.first_name} ${employeeData?.last_name}`,
                      },
                      {
                        label: "Designation",
                        value: (
                          <DesignationName
                            value={employeeData?.department_position}
                          />
                        ),
                      },
                      {
                        label: "Date of Joining",
                        value: moment(employeeData?.joining_date).format(
                          "DD/MM/YYYY"
                        ),
                      },
                      {
                        label: "Pay Period",
                        value: moment(payslip?.generated_at).format(
                          "MMMM YYYY"
                        ),
                      },
                      {
                        label: "Pay Date",
                        value: moment(payslip?.generated_at).format(
                          "DD/MM/YYYY"
                        ),
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-1 border-0"
                      >
                        <span className="text-gray-900">{item.label}</span>
                        <span className="text-slate-1100">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost to Company Card */}
                <Card className="flex flex-col justify-between border rounded-lg shadow-none border-color-[#D0CDD7]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <h3 className="mb-4 text-lg font-medium text-slate-1200">
                      Cost to Company
                    </h3>
                    <div className="mb-2 text-4xl font-bold text-plum-900">
                      {payslip?.net_salary} AED
                    </div>
                    <p className="mb-6 text-sm text-center text-gray-900">
                      {numberToWords(Number(payslip?.net_salary))}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-between w-full bg-[#FEFCFF] border-t p-0 rounded-b-lg">
                    <div className="flex flex-row items-center justify-center flex-1 gap-1 p-2">
                      <p className="font-semibold text-normal text-slate-1200">
                        20
                      </p>
                      {/* {employeeData.daysOfWork} */}
                      {/* <p className="font-semibold text-normal text-slate-1200"> {employeeData.daysOfWork}</p> */}
                      <p className="text-normal text-slate-1000">
                        Days of work
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-center flex-1 gap-1 p-2">
                      <p className="font-semibold text-normal text-slate-1200">
                        11
                      </p>
                      {/* {employeeData.absentDays} */}
                      {/* <p className="font-semibold text-normal text-slate-1000"> {employeeData.absentDays}</p> */}
                      <p className="text-normal text-slate-1000">Absent days</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Earnings and Deductions */}
              <Card className="border-color-[#D0CDD7]">
                <CardContent className="grid grid-cols-2 gap-6 p-6">
                  {/* Employee Earnings */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                      Employee Earnings
                    </h3>
                    <div className="flex flex-col min-h-[260px]">
                      {/* Header - Always visible */}
                      <div className="flex justify-between p-4 border-b">
                        <div className="font-medium text-slate-1000">
                          Earning types
                        </div>
                        <div className="font-medium text-right text-slate-1000">
                          Amount
                        </div>
                      </div>

                      {/* Body - Flexible space */}
                      <div className="flex-1">
                        {payslip?.total_earning_types?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between px-4 border-b last:border-b-0"
                          >
                            <div className="py-3 capitalize">
                              {item.description}
                            </div>
                            <div className="py-3">
                              AED {Number(item.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer - Always at bottom */}
                      <div className="flex justify-between p-4 mt-auto bg-plum-200">
                        <div className="text-lg font-bold">Total in AED</div>
                        <div className="text-lg font-bold">
                          AED {Number(payslip?.gross_salary || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-center text-slate-1100">
                      A list of your earnings in AED
                    </div>
                  </div>

                  {/* Employee Deductions */}
                  <div className="">
                    <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                      Employee Deductions
                    </h3>
                    <div className="flex flex-col min-h-[260px]">
                      {/* Header - Always visible */}
                      <div className="flex justify-between p-4 border-b">
                        <div className="font-medium text-slate-1000">
                          Deduction types
                        </div>
                        <div className="font-medium text-right text-slate-1000">
                          Amount
                        </div>
                      </div>

                      {/* Body - Flexible space */}
                      <div className="flex-1">
                        {payslip?.total_deduction_types?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between px-4 border-b last:border-b-0"
                          >
                            <div className="py-3 capitalize">
                              {item.description}
                            </div>
                            <div className="py-3">
                              AED {Number(item.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer - Always at bottom */}
                      <div className="flex justify-between p-4 mt-auto bg-plum-200">
                        <div className="text-lg font-bold">Total in AED</div>
                        <div className="text-lg font-bold">
                          AED{" "}
                          {Number(
                            payslip?.gross_salary - payslip?.net_salary || 0
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-center text-slate-1100">
                      A list of your deductions in AED
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* End of Service */}
              {isEos && (
                <Card className="border-color-[#D0CDD7]">
                  <CardHeader>
                    <CardTitle>
                      {" "}
                      <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                        End Of Service
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full">
                      {/* Header */}
                      <div className="flex justify-between pb-2 border-b">
                        <div className="text-slate-1000">Earning types</div>
                        <div className="text-right text-slate-1000">Amount</div>
                      </div>

                      {/* Body */}
                      <div className="max-h-[320px] overflow-auto">
                        {eosData?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between border-b last:border-b-0"
                          >
                            <div className="py-4 capitalize">
                              {item.description}
                            </div>
                            <div className="py-4 text-right">
                              AED {Number(item.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between border-b">
                          <div className="py-4">Total in AED</div>
                          <div className="py-4 text-right">
                            AED{" "}
                            {Number(finalSettlement?.final_amount).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between p-4 mt-auto bg-plum-200">
                        <div className="py-4 text-lg font-bold">
                          Total in AED
                        </div>
                        <div className="py-4 text-lg font-bold text-right">
                          AED {Number(finalSettlement?.final_amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-color-[#D0CDD7]">
                <CardHeader>
                  <CardTitle>
                    {" "}
                    <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                      Net Pay
                    </h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full">
                    {/* Header */}
                    <div className="flex justify-between pb-2 border-b">
                      <div className="text-slate-1000">Earnings</div>
                      <div className="text-slate-1000">Deductions</div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[320px] overflow-auto">
                      <div className="flex justify-between border-b last:border-b-0">
                        <div className="py-4">Earnings</div>
                        <div className="py-4 text-right">
                          AED {Number(payslip?.gross_salary)?.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex justify-between border-b">
                        <div className="py-4">Deductions</div>
                        <div className="py-4 text-right">
                          (-) AED{" "}
                          {Number(
                            payslip?.gross_salary - payslip?.net_salary
                          )?.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between p-4 mt-auto bg-plum-200">
                      <div className="py-4 text-lg font-bold">Total in AED</div>
                      <div className="py-4 text-lg font-bold text-right">
                        AED {Number(payslip?.net_salary).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-0 rounded-lg shadow-none border  border-color-[#D0CDD7]">
                <Card className="border-0 rounded-lg  p-2 shadow-none border-r border-color-[#D0CDD7] rounded-r-none">
                  <CardHeader className="p-0">
                    <CardTitle>
                      {" "}
                      <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                        Comments
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className=""></div>
                  </CardContent>
                </Card>
                <Card className="p-2 border-0 rounded-lg rounded-l-none shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle>
                      {" "}
                      <h3 className="mb-4 text-lg font-semibold text-slate-1200">
                        Signature
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className=""></div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end mt-4">
                <p className="text-sm italic text-slate-800">
                  This pay slip is computer-generated and does not require a
                  physical signature. All information contained within this
                  document is accurate to the best of our knowledge at the time
                  of generation. However, it is provided “as is” without any
                  warranties, express or implied. The employer assumes no
                  responsibility for any errors or omissions. For any
                  discrepancies or questions, please contact the HR department
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      {payslip && (
        <CardFooter className="flex justify-end py-2 no-print">
          <Button onClick={downloadPDF} className="px-3 py-1">
            Download PDF
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
