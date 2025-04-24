import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  exportRecordToExcel,
  exportRecordToCSV,
  exportRecordToPDF,
} from "utils/downloadUtils";
import { getLabelByValue } from "utils/getValuesFromTables";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { useSelector } from "react-redux";
import { MonthInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { getPayun } from "app/hooks/payroll.jsx";
import { errorClassName } from "components/FormControl";
import { GenderOptions, countriesList } from "data/Data";
import { renderDate } from "utils/renderValues";
import { Employee } from "app/utils/Types/Employee";

const GenerateSIFFile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const Employees = useSelector((state) => state.emp.employess);
  const Managers = useSelector((state) => state.emp.reportingManagers);

  const exportPayrollData = async (data, format, month) => {
    const dataToExport = await Promise.all(
      data?.map(async (row) => ({
        ID: row.id,
        Month: renderDate(row.month, "-", "month"),
        "Start Date": renderDate(row.start_date),
        "End Date": renderDate(row.end_date),
        Departments: await getLabelByValue(row.departments, Departments, "All"),
        Genders: await getLabelByValue(row.genders, GenderOptions, "All"),
        "Excluded Employees": await getLabelByValue(
          row.excluded_employees,
          Employees,
          "All"
        ),
        Branches: await getLabelByValue(row.branches, Branches, "All"),
        Managers: await getLabelByValue(row.managers, Managers, "All"),
        Nationalities: await getLabelByValue(
          row.nationalities,
          countriesList,
          "All"
        ),
        "Total Employee": `${row.total_employees || "-"}`,
        "Gross Amount": `${row.gross_amount || "0.00"} AED`,
        "Net Amount": `${row.net_amount || "0.00"} AED`,
        "Total Amount": `${row.total_amount || "0.00"} AED`,
        "Excluded Employees Net": `${
          row.excluded_employees_total_net || "0.00"
        } AED`,
        "Run Date": renderDate(row.run_date),
        Status: !row.is_payroll_run ? "Pending to proceed" : "Proceeded",
      }))
    );
    if (format === "excel")
      exportRecordToExcel(
        dataToExport,
        "Payroll",
        `Payroll-${renderDate(month, "-", "month")}`
      );

    if (format === "csv")
      exportRecordToCSV(
        dataToExport,
        "Payroll",
        `Payroll-${renderDate(month, "-", "month")}`
      );
    if (format === "pdf")
      exportRecordToPDF(
        dataToExport,
        "Payroll",
        `Payroll-${renderDate(month, "-", "month")}`
      );
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="ml-2"
      >
        Generate SIF File
      </Button>
      <ExportDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exportPayrollData={exportPayrollData}
      />
    </>
  );
};

const ExportDialog = ({ isOpen, setIsOpen, exportPayrollData = () => {} }) => {
  const [month, setMonth] = useState(null);
  const [disbursementType, setDisbursementType] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchData = async (isMounted) => {
    if (month && disbursementType) {
      const data = await getPayun({
        filterData: { month: month, is_payroll_run: true },
      });
      if (isMounted) {
        if (data && data?.results && data.results.length !== 0)
          exportPayrollData(data.results, "csv", month);
        else
          setErrors({
            download: `Payroll does not exist for ${renderDate(
              month,
              "-",
              "month"
            )}`,
          });
      }
    }
  };
  const handleDownload = async () => {
    const errors = {};
    if (!month) {
      errors.month = "Month is required";
    }
    if (!disbursementType) {
      errors.disbursementType = "Disbursement type is required";
    }
    setErrors(errors);
    fetchData(true);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Export Payroll
          </DialogTitle>
          <DialogDescription>
            <span className="text-neutral-900">
              Select payroll month and disbursement type to export the payroll
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 w-full">
          <MonthInput
            name="month"
            value={month}
            onChange={(_, value) => {
              setMonth(value);
              setErrors({});
            }}
          />
          <SelectInputComponent
            name="disbursementType"
            options={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Exchange", label: "Exchange" },
            ]}
            value={disbursementType}
            onChange={(_, value) => {
              setDisbursementType(value);
              setErrors({});
            }}
            placeholder="Select Disbursement Type"
          />
        </div>
        <div className={`${errorClassName} flex flex-col`}>
          <span> {errors.month}</span>
          <span> {errors.disbursementType}</span>
          <span> {errors.download}</span>
        </div>
        <div className="flex flex-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleDownload();
            }}
          >
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default GenerateSIFFile;
