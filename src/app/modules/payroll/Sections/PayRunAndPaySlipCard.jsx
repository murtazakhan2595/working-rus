import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

function CardValues({ values }) {
  const items = [
    {
      label: "Employee's Net Pay",
      value: values.employeesNetPay
        ? `AED ${values.employeesNetPay}`
        : "Yet to process",
    },
    { label: "Payment Date", value: values.paymentDate || "Yet to process" },
    {
      label: "No. of Employees",
      value: values.numberofEmployees || "Yet to process",
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

function PayRunAndPaySlipCard({ cardData }) {
  return (
    <>
      {cardData.map((data) => (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-plum-900 text-lg sm:text-2xl">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap justify-between w-full items-start gap-4 pt-6">
            <CardValues values={data} />
            {data.buttonLabel && (
              <div className="flex">
                <Button className="bg-black" onClick={data.onBtnClick}>
                  {data.buttonLabel}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default PayRunAndPaySlipCard;
