import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import CustomTable from "components/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { PageLoader } from "components";
import moment from "moment";
import { getPayRunById } from "app/hooks/payroll";
import { getDesignationName } from "utils/getValuesFromTables";
import { useSelector } from "react-redux";

const OnHoldSalaryDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [detailData, setDetailData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [payrollMonth, setPayrollMonth] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const Designations = useSelector((state) => state.common.designations);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getPayRunById(id)
      if(response){
        setDetailData(response);
        setPayrollMonth(response?.month || "");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id, options]);

  const detailColumns = [
    {
      dataField: "serial_number",
      text: "Employee ID",
      formatter: (cellContent) => (
        <div className="font-medium">{cellContent}</div>
      ),
    },
    {
      dataField: "name",
      text: "Employee Name",
      formatter: (cellContent) => (
        <div className="font-medium">{cellContent}</div>
      ),
    },
    {
      dataField: "department_name",
      text: "Department",
    },
    {
      dataField: "department_role",
      text: "Designation",
      formatter: (cellContent) => {
        const designation = getDesignationName(
          cellContent,
          Designations
        );
        return <div className="font-medium">{designation}</div>;
      }
    },
    {
      dataField: "branch",
      text: "Branch",
    },
    {
      dataField: "net_amount",
      text: "Salary Amount",
      formatter: (cellContent) => {
        const amount = parseFloat(cellContent);
        return (
          <div className="font-semibold text-plum-900">
            AED {isNaN(amount) ? "0.00" : amount.toFixed(2)}
          </div>
        );
      },
    },
    {
      dataField: "held_by",
      text: "On-Hold By",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-10 justify-between items-center h-11">
        <div className="flex items-center gap-4">
          <button
            className="w-[27px] h-[27px] bg-white rounded-3xl border border-[#e8e8ec] justify-center items-center gap-1 inline-flex"
            onClick={handleBack}
          >
            <ArrowLeft size={14} color="#000" />
          </button>
          <div>
            <span className="text-neutral-1200 text-xl font-semibold leading-tight">
              On-Hold Salaries for{" "}
            </span>
            <span className="text-neutral-1200 text-xl font-bold leading-tight">
              {payrollMonth ? moment(payrollMonth).format("MMMM YYYY") : ""}
            </span>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-[47px] flex-col justify-center items-start inline-flex">
              <div className="flex-col justify-start items-start flex">
                <div className="self-stretch text-[#ab4aba] text-2xl font-medium">
                  On-Hold Employees
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm">
                    {detailData?.excluded_employees?.length || 0} employees with
                    salary on hold
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <CustomTable
              data={detailData?.excluded_employees || []}
              columns={detailColumns}
              pagination={true}
              dataTotalSize={detailData?.excluded_employees?.length || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnHoldSalaryDetails;
