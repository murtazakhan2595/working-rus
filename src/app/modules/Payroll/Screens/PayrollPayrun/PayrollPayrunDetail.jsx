import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { FilterInput } from "components/FormControl";
import CustomTable from "components/CustomTable";
import { EmployeeDetailUI } from "components";
import { PayRunEmployeesColumns } from "app/modules/Payroll/Sections";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { mapEmployeePayrunPayslipData } from "app/utils/MappingObjects/mapPayrollData";
import { DetailBox, SheetCardExtension } from "components/SheetCardExtension";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getPayslip } from "app/hooks/payroll";
import { getPayRunById } from "app/hooks/payroll";
import moment from "moment";
import { NumberInput } from "components/FormControl";
import { getWorkingDays } from "utils/renderValues";

const PayrollPayrunDetail = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [component, setComponent] = useState([]);
  const [paySlipsData, setPaySlipsData] = useState();
  const [payrun, setPayrun] = useState({});
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const payslipsData = await getPayslip({
        filterData: { ...filterData, payroll_id: id },
        options,
      });

      if (payslipsData) {
        setPaySlipsData(payslipsData);
      }
      const payrun = await getPayRunById(id);
      if (payrun) {
        setPayrun(payrun);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [options, filterData, id]);

  console.log("paySlipsData", paySlipsData);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadSlip = async () => {
    const filteredPayslips = paySlipsData?.results?.filter((payslip) =>
      selectedRows.includes(payslip.id)
    );

    // Create the data structure with the required fields
    const formattedData = filteredPayslips.map((payslip) => ({
      Date: moment(payrun?.run_date).format("MMM D, YYYY"),
      "Employee ID": `TXB-${payslip.employeeid}`,
      "Department Name": payslip.department_name,
      "Full Name": payslip.full_name,
      "Work Email": payslip.work_email,
      "Gross Salary": payslip.gross_salary,
      "Net Salary": payslip.net_salary,
    }));

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths for proper spacing
    const wscols = [
      { wch: 15 }, //"DATE"
      { wch: 15 }, // "employeeid"
      { wch: 20 }, // "Department Name"
      { wch: 25 }, // "Full Name"
      { wch: 30 }, // "Work Email"
      { wch: 15 }, // "Gross Salary"
      { wch: 15 }, // "Net Salary"
    ];
    ws["!cols"] = wscols;

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payslips Data");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save the file
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `Payslips_Data.xlsx`);
    setSelectedRows([]);
  };

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
            <span className="text-neutral-1200 text-xl font-semibold  leading-tight">
              Pay Run Details for{" "}
            </span>
            <span className="text-neutral-1200 text-xl font-bold  leading-tight">
              {moment(payrun?.month).format("MMMM YYYY")}
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
                  Payrolls Employees
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm  ">
                    All employess in the payroll are listed below
                  </div>
                </div>
              </div>
            </div>
            {selectedRows.length > 0 && (
              <Button onClick={handleDownloadSlip}>
                <Download color="#fff" size={16} />
                Download
              </Button>
            )}
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Employee Name",
                  name: "first_name",
                },
              ]}
              onChange={handleFilterChange} // Dynamic filter handler
            />
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={paySlipsData?.results || []}
            columns={PayRunEmployeesColumns}
            pagination={true}
            dataTotalSize={paySlipsData?.count || 0}
            tableOptions={tableOptions}
            rowExpand={true}
            renderExpandedContent={(row) => (
              <RenderEmployeePayrunDetails
                PayrunData={row}
                PayRunDetails={payrun}
              />
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const RenderEmployeePayrunDetails = ({ PayrunData, PayRunDetails }) => {
  const [editMode, setEditMode] = useState(false);
  const PayRunUpdatedData = React.useMemo(() => {
    return mapEmployeePayrunPayslipData(PayrunData);
  }, [PayrunData]);
  return (
    <div className="px-6 py-4">
      <div className="flex flex-row justify-between pb-2">
        <div className="text-lg text-plum-900 font-medium">
          Employee Payroll Details
        </div>
        {!editMode && (
          <Button
            size="sm"
            variant="continue"
            onClick={(e) => {
              e.preventDefault();
              setEditMode(!editMode);
            }}
          >
            Edit
          </Button>
        )}
      </div>
      {!editMode ? (
        <RenderEmployeePayrunDetailView
          PayrunData={PayRunUpdatedData}
          PayRunDetails={PayRunDetails}
        />
      ) : (
        <RenderEmployeePayrunDetailsUpdateForm
          PayrunData={PayRunUpdatedData}
          PayRunDetails={PayRunDetails}
        />
      )}
    </div>
  );
};

const RenderEmployeePayrunDetailView = ({ PayrunData, PayRunDetails }) => {
  const TotalWorkingDays = React.useMemo(() => {
    return getWorkingDays(PayRunDetails.start_date, PayRunDetails.end_date);
  }, [PayRunDetails]);
  const labelList = [
    ...(PayrunData.basic_salary
      ? [
          {
            label: "Basic Salary",
            value: PayrunData.basic_salary,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Allowances",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Variable",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    {
      label: "Total Working Days",
      value: TotalWorkingDays,
    },
    ...(PayrunData.serial_number
      ? [
          {
            label: "Total Absent Days",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Salary Per Day",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Paid Leave",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Annual Leave Salary",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Previous Month Salary",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    {
      label: "Inflation Effect",
      value: `${PayrunData.inflation_effect || "0.00"} AED`,
    },
    {
      label: "Reimbursements",
      value: `${PayrunData.reimbursements} AED`,
    },

    ...(PayrunData.serial_number
      ? [
          {
            label: "Salary Payable",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Remarks",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Branch",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData?.viewed_date
      ? [
          {
            label: "Viewed Date",
            value: PayrunData?.viewed_date,
          },
        ]
      : []),
    ...(PayrunData?.target_audience
      ? [
          {
            label: "Target Audience",
            value: PayrunData?.target_audience,
          },
        ]
      : []),
  ].filter(Boolean);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4">
      <EmployeeDetailUI
        id={PayrunData.employeeid}
        InformationKeys={[
          "id",
          "name",
          "position",
          "department",
          "branch",
          "employment_type",
          "joining_date",
          "currency",
          "disbursement_type",
          "contracted_salary",
        ]}
      />
      {labelList &&
        labelList.map((data, index) => {
          return (
            <DetailBox
              orientation="horizontal"
              key={index}
              className=""
              label={data.label}
              value={data.value}
              fallbackText={""}
            />
          );
        })}
    </div>
  );
};
const RenderEmployeePayrunDetailsUpdateForm = ({
  PayrunData,
  PayRunDetails,
}) => {
  const formRef = React.createRef();
  const labelList = [
    ...(PayrunData.serial_number
      ? [
          {
            label: "Salary Payable",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Remarks",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData.serial_number
      ? [
          {
            label: "Branch",
            value: PayrunData.serial_number,
          },
        ]
      : []),
    ...(PayrunData?.viewed_date
      ? [
          {
            label: "Viewed Date",
            value: PayrunData?.viewed_date,
          },
        ]
      : []),
    ...(PayrunData?.target_audience
      ? [
          {
            label: "Target Audience",
            value: PayrunData?.target_audience,
          },
        ]
      : []),
  ].filter(Boolean);
  const FormValues = React.useMemo(() => {
    return PayrunData;
  }, [PayrunData]);
  const TotalWorkingDays = React.useMemo(() => {
    return getWorkingDays(PayRunDetails.start_date, PayRunDetails.end_date);
  }, [PayRunDetails]);
  const handleSubmit = () => {};
  return (
    <div>
      <Formik
        initialValues={FormValues}
        enableReinitialize={true}
        ref={formRef}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validate={(values) => {
          const errors = {};
          console.log(values);
          return errors;
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EmployeeDetailUI
                id={PayrunData.employeeid}
                InformationKeys={[
                  "id",
                  "name",
                  "position",
                  "department",
                  "branch",
                  "employment_type",
                  "joining_date",
                  "currency",
                  "disbursement_type",
                  "contracted_salary",
                ]}
                variant="FormView"
              />
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Basic Salary"}
                  value={props.values.basic_salary}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Allowances"}
                  value={props.values.basic_salary}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Total Working Days"}
                  value={TotalWorkingDays}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Total Absent Days"}
                  value={TotalWorkingDays}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Salary Per Day"}
                  value={props.values.basic_salary}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"basic_salary"}
                  label={"Paid Leave"}
                  value={props.values.basic_salary}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"reimbursements"}
                  label={"Reimbursements"}
                  value={props.values.reimbursements}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"variable_kpi"}
                  label={"Variable KPI"}
                  value={props.values.variable_kpi}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"annual_leave_salary"}
                  label={"Annual Leave Salary"}
                  value={props.values.annual_leave_salary}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  name={"inflation_effect"}
                  label={"Inflation Effect"}
                  value={props.values.inflation_effect}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-end">
              <Button
                type="submit"
                size="lg"
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  props.handleSubmit();
                }}
              >
                Update
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4">
        {labelList &&
          labelList.map((data, index) => {
            return (
              <DetailBox
                orientation="horizontal"
                key={index}
                className=""
                label={data.label}
                value={data.value}
                fallbackText={""}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PayrollPayrunDetail;
