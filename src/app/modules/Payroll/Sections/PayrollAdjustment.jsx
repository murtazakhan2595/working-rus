import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card.jsx";
import { AdjustmentComponentColumns } from "app/modules/Payroll/Sections";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { getEarnAndDeduction } from "app/hooks/payroll.jsx";
import { saveEarnAndDeduction } from "app/hooks/payroll.jsx";
import AddAdjustmentSheet from "./AddAdjustmentSheet.jsx";
import { handleCloseWithConfirmation } from "components/SheetCardExtension.jsx";
import { getEmployeeEarnAndDeduction } from "app/hooks/payroll.jsx";

const PayrollAdjustment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adjustment, setAdjustment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [adjustmentComponent, setAdjustmentComponent] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [adjustmentFilterData, setAdjustmentFilterData] = useState({});

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setIsOpen(true);
      setAdjustmentComponent(row);
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getEmployeeEarnAndDeduction({
      options,
      filterData: { ...adjustmentFilterData },
    });
    if (response) {
      setAdjustment(response.results);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [options, adjustmentFilterData]);

  // Handler for Adjustment filters
  const handleAdjustmentFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    const updatedFilters = { ...adjustmentFilterData };
    if (filterValue === "") {
      delete updatedFilters[filterName];
    } else {
      updatedFilters[filterName] = filterValue;
    }
    setAdjustmentFilterData(updatedFilters);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCloseSheet(true);
  };

  // Function to generate month options for the dropdown
const generateMonthOptions = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = [
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

  // Generate options for current year only
  const options = [];
  months.forEach((month, index) => {
    options.push({
      value: `${currentYear}-${String(index + 1).padStart(2, "0")}`,
      label: `${month} ${currentYear}`,
    });
  });

  return options;
};

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex flex-col items-start justify-center">
          <div className="self-stretch text-[#ab4aba] text-2xl font-medium leading-normal">
            {"Payroll Adjustments"}
          </div>
          <div className="self-stretch text-[#8b8d98] text-sm font-normal leading-[16.80px]">
            {"Employee payroll adjustments are listed here"}
          </div>
        </div>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Employee Name",
              name: "employee_name",
              onChange: (value) => {
                handleAdjustmentFilterChange("employee_name", value);
              },
            },
            {
              type: "select-one",
              option: [
                { value: "earning", label: "Earning" },
                { value: "deduction", label: "Deduction" },
              ],
              name: "income_type",
              placeholder: "Component Type",
            },
            {
              type: "select-two",
              option: generateMonthOptions(),
              name: "month",
              placeholder: "Payable Month",
            },
          ]}
          onChange={handleAdjustmentFilterChange}
        />
      </div>
      <div className="flex flex-col gap-4 profile-management">
        {handleCloseWithConfirmation({
          isOpen: closeSheet,
          setCloseSheet,
          setIsOpen,
        })}
        {adjustmentComponent && (
          <AddAdjustmentSheet
            adjustment={adjustmentComponent}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            reload={fetchData}
            onClose={handleClose}
          />
        )}

        {isLoading ? (
          <PageLoader />
        ) : (
          <CustomTable
            data={adjustment}
            columns={AdjustmentComponentColumns}
            pagination={true}
            dataTotalSize={adjustment.length}
            tableOptions={tableOptions}
          />
        )}
      </div>
    </>
  );
};

export default PayrollAdjustment;
