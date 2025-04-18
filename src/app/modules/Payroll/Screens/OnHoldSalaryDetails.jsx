import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import CustomTable from "components/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { PageLoader } from "components";
import moment from "moment";

const OnHoldSalaryDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [detailData, setDetailData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [payrollMonth, setPayrollMonth] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  // Mock data for demonstration
  const mockDetailData = {
    results: [
      {
        id: 1,
        employee_id: "TXB-0001",
        employee_name: "John Doe",
        department: "Engineering",
        designation: "Software Engineer",
        branch: "Dubai",
        salary_amount: 5000.0,
        held_by: "Sarah Johnson",
        reason: "Pending documentation verification",
      },
      {
        id: 2,
        employee_id: "TXB-0002",
        employee_name: "Alice Smith",
        department: "Marketing",
        designation: "Marketing Manager",
        branch: "Abu Dhabi",
        salary_amount: 4500.0,
        held_by: "Michael Brown",
        reason: "Performance review pending",
      },
      {
        id: 3,
        employee_id: "TXB-0003",
        employee_name: "Ahmed Hassan",
        department: "Finance",
        designation: "Accountant",
        branch: "Dubai",
        salary_amount: 3000.0,
        held_by: "Sarah Johnson",
        reason: "Adjustment in progress",
      },
    ],
    count: 3,
    payrollMonth: "2025-04-01",
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await getOnHoldSalaryDetails(id, { options });

      // Using mock data for now
      setTimeout(() => {
        setDetailData(mockDetailData);
        setPayrollMonth(mockDetailData.payrollMonth);
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [id, options]);

  const detailColumns = [
    {
      dataField: "employee_id",
      text: "Employee ID",
      formatter: (cellContent) => (
        <div className="font-medium">{cellContent}</div>
      ),
    },
    {
      dataField: "employee_name",
      text: "Employee Name",
      formatter: (cellContent) => (
        <div className="font-medium">{cellContent}</div>
      ),
    },
    {
      dataField: "department",
      text: "Department",
    },
    {
      dataField: "designation",
      text: "Designation",
    },
    {
      dataField: "branch",
      text: "Branch",
    },
    {
      dataField: "salary_amount",
      text: "Salary Amount",
      formatter: (cellContent) => (
        <div className="font-semibold text-plum-900">
          AED {cellContent.toFixed(2)}
        </div>
      ),
    },
    {
      dataField: "held_by",
      text: "On-Hold By",
    },
    {
      dataField: "reason",
      text: "Reason for On-Hold",
      formatter: (cellContent) => (
        <div className="max-w-xs truncate" title={cellContent}>
          {cellContent}
        </div>
      ),
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
                    {detailData?.count || 0} employees with salary on hold
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
              data={detailData?.results || []}
              columns={detailColumns}
              pagination={true}
              dataTotalSize={detailData.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnHoldSalaryDetails;
