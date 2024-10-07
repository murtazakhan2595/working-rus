import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { DateInput } from "components/form-control";
import CustomTable from "components/CustomTable";
import { downloadPayslipColumns } from "app/utils/Types/TableColumns";
import { getEmployeePayroll } from "app/hooks/payroll";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPayrollSummary } from "app/hooks/payroll";
import { CircleCheckBig } from "lucide-react";
import { Download } from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const PayRunDetails = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [component, setComponent] = useState([]);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [payrunSubmitDialog, setPayrunSubmitDialog] = useState(false);

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      // setSelectedComponent(row);
    },
  };
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getEmployeePayroll({ options, filterData });
      if (response) {
        setEmployeeData(response);
      }

      const earnAndDeductions = await getEarnAndDeduction({
        filterData: { is_active: true },
      });
      if (earnAndDeductions) {
        setComponent(earnAndDeductions.results);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [options, filterData]);



  const handleBack = () => {
    navigate(-1);
  };

   const handleDownloadSlip = async () => {
     const data = [
       { name: "John", age: 30, city: "New York" },
       { name: "Jane", age: 28, city: "Los Angeles" },
     ];

     // Convert data to worksheet
     const ws = XLSX.utils.json_to_sheet(
       data
     );

     // Create a new workbook and append the worksheet
     const wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Payslips Data");

     // Generate Excel file
     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

     // Save the file
     const file = new Blob([excelBuffer], { type: "application/octet-stream" });
     saveAs(file, `Payslips_Data.xlsx`);
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
            <span className="text-[#1c2024] text-xl font-semibold  leading-tight">
              Pay Run for{" "}
            </span>
            <span className="text-[#1c2024] text-xl font-bold  leading-tight">
              September 2024
            </span>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-[47px] flex-col justify-center items-start inline-flex">
              <div className="flex-col justify-start items-start flex">
                <div className="self-stretch text-[#ab4aba] text-2xl font-medium  ">
                  Download Payslips
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm  ">
                    Payrolls of all employees are listed below
                  </div>
                </div>
              </div>
            </div>
            {selectedRows.length > 0 && (
              <Button
                className="px-3 py-1.5 bg-[#f9f9fb] rounded-3xl justify-center items-center gap-1 inline-flex"
                onClick={handleDownloadSlip}
              >
                <Download color="#1c2024" size={16} />
                <div className="text-center text-[#1c2024] text-sm font-medium">
                  Download
                </div>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={employeeData?.results || []}
            columns={downloadPayslipColumns(component)}
            pagination={true}
            dataTotalSize={employeeData.count || 0}
            tableOptions={tableOptions}
            selectable={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PayRunDetails;
