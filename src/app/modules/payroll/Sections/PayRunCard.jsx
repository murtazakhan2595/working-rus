import React, { useEffect, useState } from "react";
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
  const items = [
    {
      label: "Employee's Net Pay",
      value: values?.net_amount
        ? `AED ${values?.net_amount}`
        : "Yet to process",
    },
    { label: "Payment Date", value: values?.run_date || "Yet to process" },
    {
      label: "No. of Employees",
      value: Math.round(values?.total_employees) || "Yet to process",
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
function PayRunCard({ cardData }) {
  const [cardDataList, setCardDataList] = useState(cardData?.results || []);
  const currentMonthStart = moment().startOf("month");
  const currentMonthEnd = moment().endOf("month");
  const navigate = useNavigate();

  function processCardData(data) {
    const runDate = moment(data.run_date); // Parse run_date with moment
    const monthName = runDate.format("MMMM"); // Get full month name, e.g., 'October'
    const year = runDate.format("YYYY"); // Get year, e.g., '2024'

    const title = `Process Pay Run for ${monthName} ${year}`;
    if (!data?.is_payroll_run) {
      return {
        ...data,
        title,
        buttonLabel: "Create Pay Run",
        onBtnClick: () => navigate("/payroll/create-payrun"),
      };
    }
    return {
      ...data,
      title,
    };
  }

  useEffect(() => {
    // Check if a pay run exists for the current month
    const currentMonthPayRun = cardDataList?.find((data) => {
      const startDate = moment(data.start_date);
      const endDate = moment(data.end_date);
      return (
        startDate.isSameOrBefore(currentMonthEnd) &&
        endDate.isSameOrAfter(currentMonthStart)
      );
    });
    console.log("CURRENTMONTHLYPAYRUN", currentMonthPayRun);

    if (!currentMonthPayRun) {
      setCardDataList((prevList) => [
        {
          title: `Process Pay Run for ${moment().format("MMMM YYYY")}`,
          employeesNetPay: "",
          paymentDate: "",
          numberofEmployees: "",
          buttonLabel: "Create Pay Run",
          onBtnClick: () => navigate("/payroll/create-payrun"),
        },
        ...prevList, // Add the rest of the data
      ]);
    }
  }, [cardData]);
  console.log("CARD-DATA-LIST", cardDataList);
  return (
    <>
      {cardDataList?.map((data, index) => {
        const processedData = processCardData(data);
        console.log("PROCESSED-DATA", processedData);
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

export default PayRunCard;