import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import moment from "moment";
import { useNavigate } from "react-router-dom"; 



function CardValues({ values }) {
  console.log("IN CARD VALUES", values);
  const items = [
    {
      label: "Employee's Net Pay",
      value: values?.employeesNetPay || values?.net_amount ? `AED ${values?.net_amount || values?.employeesNetPay}` : "Yet to process",
    },
    {
      label: "Payment Date",
      value: values?.paymentDate || values?.run_date || "Yet to process",
    },
    {
      label: "No. of Employees",
      value:
        values?.numberofEmployees ||
        Math.round(values.total_employees) ||
        "Yet to process",
    },
  ];
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between flex-wrap w-[60%] gap-4">
      {items.map(({ label, value }, idx) => (
        <div key={idx} className="flex flex-col">
          <div className="text-gray-900">{label}</div>
          <div className="text-black">{value}</div>
        </div>
      ))}
    </div>
  );
}
function PaySlipCard({ cardData }) {
  console.log("IN PAYSLIP CARD CARD DATA", cardData)
  const currentMonthStart = moment().startOf("month");
  const currentMonthEnd = moment().endOf("month");
  const navigate = useNavigate();

  function processCardData(data) {
    console.log("DATA IN PROCESSSCARD DATA", data);
    const runDate = moment(data.run_date); 
    const monthName = runDate.format("MMMM"); 
    const year = runDate.format("YYYY");

    const title = `Process Pay Run for ${monthName} ${year}`;
    if (data?.is_payroll_run) {
      return {
        ...data,

        title: `Payslips for ${monthName} ${year}`,

        buttonLabel: "View Details",
        onBtnClick: () => navigate(`/payroll/pay-slip-details/${data.id}`),
      };
    }
    return {
      ...data,
      title,
    };
  } 
  return (
    <>
      {cardData?.results?.map((data, index) => {
        const processedData = processCardData(data);
        console.log("PROCESSED DATA", processedData);
        return (
          <Card className="mb-4" key={index}>
            <CardHeader>
              <CardTitle className="text-plum-900 text-lg sm:text-2xl">
                {processedData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap justify-between w-full items-start gap-4 pt-6">
              <CardValues values={processedData} />
              {processedData.buttonLabel && (
                <div className="flex">
                  <Button
                    className="bg-black"
                    onClick={processedData.onBtnClick}
                  >
                    {processedData.buttonLabel}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

export default PaySlipCard;