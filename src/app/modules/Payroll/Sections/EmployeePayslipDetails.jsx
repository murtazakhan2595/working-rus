import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { PageLoader, TableCustom } from "components";
import { FilterInput } from "components/FormControl";
import { getPayslip } from "app/hooks/payroll";
import { EmployeePayslipColumns } from "app/modules/Payroll/Sections";

const EmployeePayslipDetails = ({ payrollId ,employeeID}) => {
  const [filterData, setFilterData] = useState({ employee_payroll: payrollId });
  const [Payslips, setPayslips] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedPayslipId, setSelectedPayslipId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [IsLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState("-id");

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
    onRowClick:(row)=>{
        navigate(`/payslip/${row.id}?employeeID=${employeeID}`)
    }
  };
  const fetchData = async () => {
    setIsLoading(true);

    const Payslips = await getPayslip({ filterData });
    if (Payslips) {
      setPayslips(Payslips);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setFilterData({ employee_payroll: payrollId });
    return () => {
      isMounted = false;
    };
  }, [payrollId]);

  useEffect(() => {
    if (Payslips && Payslips.results?.length > 0) {
      const currentYear = new Date().getFullYear(); // Get current year
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Set to collect unique months for the current year
      const uniqueMonths = new Set();
      const monthToPayslipIdMap = {};

      // Update payslip data to include month name
      Payslips.results.forEach((payslip) => {
        const generatedAt = new Date(payslip.generated_at);
        const year = generatedAt.getFullYear();
        const month = generatedAt.getMonth(); // 0-based index (0 = January)

        // Check if the year is the current year
        if (year === currentYear) {
          uniqueMonths.add(month);
          payslip.month = monthNames[month];
          monthToPayslipIdMap[month] = payslip.id;
        }
      });

      // Convert the Set to an array of month objects for the dropdown
      const currentYearMonths = Array.from(uniqueMonths).map((monthIndex) => ({
        value: `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`, // e.g. "2024-01"
        label: monthNames[monthIndex],
        payslipId: monthToPayslipIdMap[monthIndex],
      }));
      setMonths(currentYearMonths);
    }
  }, [Payslips]);

  const handleFilterChange = (filterName, filterValue) => {
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

  return (
    <Card className="mb-4 h-full">
      <CardHeader>
        <CardTitle className="text-plum-900">Salary Slips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2">
          <FilterInput
            filters={[
              {
                type: "select-one",
                option: months,
                name: "month",
                placeholder: "Pick a month",
                values: selectedMonth,
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        {IsLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={Payslips.results}
            columns={EmployeePayslipColumns}
            pagination={true}
            dataTotalSize={Payslips.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePayslipDetails;
