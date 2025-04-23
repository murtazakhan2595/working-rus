import React,{useState,useEffect} from "react";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getPayun } from "app/hooks/payroll.jsx";

function CardValues({ values }) {
  const items = [
    {
      label: "Employee's Net Pay",
      value:
        values?.employeesNetPay || values?.net_amount
          ? `AED ${values?.net_amount || values?.employeesNetPay}`
          : "Yet to process",
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
function ProceededPayRuns({ cardData }) {
  const [PayRunData, setPayRunData] = useState([]);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({ is_payroll_run: true });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    const data = await getPayun({ ordering, filterData });
    if (data && isMounted) {
      setPayRunData(data);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options]);

  const currentMonthStart = moment().startOf("month");
  const currentMonthEnd = moment().endOf("month");
  const navigate = useNavigate();

  function processCardData(data) {
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
      {PayRunData?.results?.map((data, index) => {
        const processedData = processCardData(data);
        return (
          <Card className="mb-4" key={index}>
            <CardHeader>
              <CardTitle className="text-plum-900 text-lg sm:text-2xl">
                {processedData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap justify-between w-full items-start gap-4 pt-6">
              <CardValues values={processedData} />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

export default ProceededPayRuns;
