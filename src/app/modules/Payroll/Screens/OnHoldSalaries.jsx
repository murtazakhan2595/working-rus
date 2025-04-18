import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header.jsx";
import { PageLoader } from "components";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Button } from "components/ui/button";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import moment from "moment";
import DateInput from "components/FormControl/DateInput.jsx";

const OnHoldSalaries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onHoldData, setOnHoldData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterDate, setFilterDate] = useState(null);
  const navigate = useNavigate();

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Mock data for demonstration
  const mockOnHoldData = {
    results: [
      {
        id: 1,
        month: "2025-04-01",
        total_employees: 3,
        total_amount: 12500.0,
      },
      {
        id: 2,
        month: "2025-03-01",
        total_employees: 5,
        total_amount: 18750.0,
      },
      {
        id: 3,
        month: "2025-02-01",
        total_employees: 2,
        total_amount: 8000.0,
      },
    ],
    count: 3,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await getOnHoldSalaries({ options, filterData });

      // Using mock data for now
      setTimeout(() => {
        setOnHoldData(mockOnHoldData);
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [options, filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const onHoldColumns = [
    {
      dataField: "month",
      text: "Payroll Month",
      formatter: (cellContent) => (
        <div className="font-medium">
          {moment(cellContent).format("MMMM YYYY")}
        </div>
      ),
    },
    {
      dataField: "total_employees",
      text: "Employees On Hold",
      formatter: (cellContent) => (
        <div className="font-semibold text-plum-900">{cellContent}</div>
      ),
    },
    {
      dataField: "total_amount",
      text: "Total Amount On Hold",
      formatter: (cellContent) => (
        <div className="font-semibold text-plum-900">
          AED {cellContent.toFixed(2)}
        </div>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1.5 flex items-center gap-1"
          onClick={() => navigate(`/payroll/on-hold-salaries/${row.id}`)}
        >
          <Eye size={14} />
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header />
      <div>
        <div className="flex justify-end mb-4">
          <DateInput
            placeholder="Date"
            value={filterDate}
            name="payment_date"
            onChange={(field, value) => {
              setFilterDate(value);
              handleFilterChange(field, value);
            }}
            className="w-fit"
          />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-[47px] flex-col justify-center items-start inline-flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ab4aba] text-2xl font-medium">
                    On-Hold Salaries
                  </div>
                </div>
                <div className="pt-1.5 flex-col justify-start items-start flex">
                  <div className="flex-col justify-start items-start flex">
                    <div className="self-stretch text-[#8b8d98] text-sm">
                      Employees with salaries on hold for each payroll month
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
                data={onHoldData?.results || []}
                columns={onHoldColumns}
                pagination={true}
                dataTotalSize={onHoldData.count || 0}
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnHoldSalaries;
