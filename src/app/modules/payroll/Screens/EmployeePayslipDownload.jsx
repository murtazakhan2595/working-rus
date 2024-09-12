import React from 'react'
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../src/@/components/ui/table"
import { usePDF } from 'react-to-pdf'

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

const earningsData = [
  { type: 'Basic', amount: 250.90 },
  { type: 'House Allowance', amount: 250.90 },
  { type: 'Transport Allowance', amount: 250.90 },
  { type: 'Food Allowance', amount: 250.90 },
  { type: 'Other Allowances', amount: 250.90 },
  { type: 'Reimbursements or Claims', amount: 250.90 },
]

const deductionsData = [
  { type: 'Professional Tax', amount: 250.90 },
  { type: 'Leaves', amount: 250.90 },
]

export default function Payslip() {
  const { toPDF, targetRef } = usePDF({filename: 'payslip.pdf',
    page: { margin: 5 },
  });

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductionsData.reduce((sum, item) => sum + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  return (
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
        <CardContent className="space-y-6">
          <h2 className="mt-4 text-xl font-semibold text-plum-900">Payslip for the month of {employeeData.payPeriod}</h2>
          
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
                      <TableCell>{employeeData.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{employeeData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Designation</TableCell>
                      <TableCell>{employeeData.designation}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date of Joining</TableCell>
                      <TableCell>{employeeData.dateOfJoining}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pay Period</TableCell>
                      <TableCell>{employeeData.payPeriod}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pay Date</TableCell>
                      <TableCell>{employeeData.payDate}</TableCell>
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
                <div className="text-4xl font-bold text-plum-900">{employeeData.costToCompany} AED</div>
                <p className="mt-2 text-sm text-gray-600">Three Thousand Eight Hundred And Seventy AED</p>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="font-semibold">{employeeData.daysOfWork} Days</p>
                    <p className="text-sm text-gray-600">of work</p>
                  </div>
                  <div>
                    <p className="font-semibold">{employeeData.absentDays} Days</p>
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
                    {earningsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">AED {item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total in AED</TableCell>
                      <TableCell className="text-right">AED {totalEarnings.toFixed(2)}</TableCell>
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
                    {deductionsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">AED {item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total in AED</TableCell>
                      <TableCell className="text-right">AED {totalDeductions.toFixed(2)}</TableCell>
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
                    <TableCell className="text-right">AED {totalEarnings.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Deductions</TableCell>
                    <TableCell className="text-right">(-) AED {totalDeductions.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>Total in AED</TableCell>
                    <TableCell className="text-right">AED {netPay.toFixed(2)}</TableCell>
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
        <CardFooter className="flex justify-end">
          <Button onClick={() => toPDF()}>Download PDF</Button>
        </CardFooter>
      </Card>
    </div>
  )
}