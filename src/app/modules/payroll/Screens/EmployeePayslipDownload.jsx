import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../src/@/components/ui/table"
import { usePDF } from 'react-to-pdf'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getPayslip } from "app/hooks/payroll";
import RevisedSalarySheet from "./RevisedSalarySheet";
import {
  DesignationName,
  EmployeeID,
  getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader } from "components";
import { ArrowLeft } from "lucide-react";
import moment from "moment";


const employeeData = {
  id: 'TXB-245',
  name: 'Farhan Hyder',
  designation: 'Hr Manager',
  dateOfJoining: '10/12/2024',
  payPeriod: 'December 2024',
  payDate: '10/12/2024',
  costToCompany: '548.60',
  daysOfWork: 20,
  absentDays: 11,
}

// Dummy Earnings Data
const dummyEarningsData = [
  { description: 'Basic Salary', amount: 2000 },
  { description: 'House Allowance', amount: 500 },
  { description: 'Transport Allowance', amount: 300 },
  { description: 'Medical Allowance', amount: 200 },
  { description: 'Other Allowances', amount: 150 },
];

// Dummy Deductions Data
const dummyDeductionsData = [
  { description: 'Tax', amount: 200 },
  { description: 'Insurance', amount: 100 },
];
export default function Payslip() {

  const [employeeData, setEmployeeData] = React.useState({});
  const [filterData, setFilterData] = React.useState({});
    const [payslip, setPayslip] = useState({
      generated_at: new Date(),
      total_earnings: dummyEarningsData,
      total_deductions: dummyDeductionsData,
      gross_salary: dummyEarningsData.reduce(
        (acc, item) => acc + item.amount,
        0
      ),
      net_salary:
        dummyEarningsData.reduce((acc, item) => acc + item.amount, 0) -
        dummyDeductionsData.reduce((acc, item) => acc + item.amount, 0),
    });
    const [loading, setLoading] = React.useState(true);

    React.useState({});
    const { id } = useParams();
    const location = useLocation();
    const employeeID = new URLSearchParams(location.search).get("employeeID");

  const fetchData = async () => {
    setLoading(true);
    const empData = await getEmployeeData(employeeID);
    if (empData) {
      setEmployeeData(empData);
    }

  //   const payslip = await getPayslip({ filterData });
  //   if (payslip) {
  //     console.log("payslip", payslip);
  //     setPaySlip(payslip?.results[0]);
  //   }
    setLoading(false);
  };
  useEffect(() => {
    filterData?.employee_payroll && fetchData();
  }, [filterData]);

  useEffect(() => {
    if (employeeID) {
      setFilterData({ employee_payroll: id });
    }
  }, [id]);



  const { toPDF, targetRef } = usePDF({filename: 'payslip.pdf',
    page: { margin: 5 },
  });

    const totalEarnings = payslip.total_earnings.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalDeductions = payslip.total_deductions.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const netPay = totalEarnings - totalDeductions;

  console.log("payslip", payslip);

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={()=>{navigate(-1)}}
          className="p-4 text-xl text-balance"
        >
          <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
          Payroll Detail
        </Button>
      </div>
    <div className="container p-4 mx-auto">
      <Card ref={targetRef} className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-white bg-plum-600">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">PlumPro</CardTitle>
              <p>Karachi, Pakistan</p>
            </div>
            <p>www.plumpro.com</p>
          </div>
        </CardHeader>
        {loading ? (
          <PageLoader />
        ) : (
          <CardContent className="space-y-6">
            <h2 className="mt-4 text-xl font-semibold text-plum-900">
              Payslip for the month of{" "}
              {moment(payslip?.generated_at).format("MMMM YYYY")}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Pay Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                          {" "}
                          <EmployeeID value={employeeID} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{`${employeeData?.first_name} ${employeeData?.last_name}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Designation</TableCell>
                        <TableCell>
                          <DesignationName
                            value={employeeData?.department_position}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Date of Joining</TableCell>
                        <TableCell>{employeeData?.joining_date}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pay Period</TableCell>
                        <TableCell>{moment(payslip?.generated_at).format('MMMM YYYY')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pay Date</TableCell>
                        <TableCell>
                          {moment(payslip?.generated_at).format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cost to Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-plum-900">
                    {payslip?.basic_salary} AED
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {numberToWords(Number(payslip?.basic_salary))}
                  </p>
                  <div className="flex justify-between mt-4">
                    <div>
                      <p className="font-semibold">
                        {employeeData.daysOfWork} Days
                      </p>
                      <p className="text-sm text-gray-600">of work</p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {employeeData.absentDays} Days
                      </p>
                      <p className="text-sm text-gray-600">Absent days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      {payslip?.total_earnings?.map((item, index) => (
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
                          AED {Number(payslip?.gross_salary).toFixed(2)}
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
                      {payslip?.total_deductions?.map((item, index) => (
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
                          {Number(
                            payslip?.gross_salary - payslip?.net_salary
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Net Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Earnings</TableCell>
                      <TableCell className="text-right">
                        AED {Number(payslip?.gross_salary)?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Deductions</TableCell>
                      <TableCell className="text-right">
                        (-) AED{" "}
                        {Number(
                          payslip?.gross_salary - payslip?.net_salary
                        )?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total in AED</TableCell>
                      <TableCell className="text-right">
                        AED {Number(payslip?.net_salary).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 border rounded"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Signature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 border rounded"></div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-end">
          <Button onClick={() => toPDF()}>Download PDF</Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}