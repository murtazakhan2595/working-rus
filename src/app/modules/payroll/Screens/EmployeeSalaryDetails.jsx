import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../src/@/components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CalendarIcon,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../src/@/components/ui/command";
import { format } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getSalaryRevision,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import RevisedSalarySheet from "./RevisedSalarySheet";
import {
  DesignationName,
  EmployeeID,
  getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader } from "components";
import {
  revisionLetterOptions,
  revisionStatusOptions,
} from "../../../../data/Data";
import {
  FilterInput,
  SelectComponent,
} from "../../../../components/form-control";
import {
  getEarnAndDeduction,
  getPayslip,
  saveEmployeePayroll,
  updateSalaryRevisionStatus,
} from "../../../hooks/payroll";
import { calculateEarningsAndDeductions } from "../Sections/CalculationsHelperFunctions";
import moment from "moment";

export default function EmployeeSalaryDetails() {
  const [date, setDate] = useState();
  const [payrollDetails, setPayrollDetails] = useState({});
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [approvedRevisions, setApprovedRevisions] = useState(0);
  const [pendingRevisions, setPendingRevisions] = useState(0);
  const [rejectedRevisions, setRejectedRevisions] = useState(0);
  const [lastIncrementDate, setLastIncrementDate] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [months, setMonths] = useState([]);
  const [selectedPayslipId, setSelectedPayslipId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [latestApprovedSalaryRevision, setLatestApprovedSalaryRevision] =
    useState({});
  const [loading, setLoading] = useState(true);
  const [revisionLoading, setRevisionLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const employeeID = new URLSearchParams(location.search).get("employeeID");
  const fromMyPayroll =
    new URLSearchParams(location.search).get("fromMyPayroll") === "true";

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const empData = await getEmployeeData(employeeID);
    if (empData) {
      setEmployeeData(empData);
    }

    const response = await getEmployeePayrollById(id);
    if (response) {
      setPayrollDetails(response);
    }
    const earnAndDeduction = await getEarnAndDeduction();
    if (earnAndDeduction && response) {
      const { earnings, deductions, totalEarnings, totalDeductions } =
        calculateEarningsAndDeductions(
          response.basic_salary,
          earnAndDeduction.results
        );

      setEarnings(earnings);
      setTotalEarnings(totalEarnings);
    }
    const salaryRevisionData = await getSalaryRevision({
      filterData,
    }); // hardcode for now filter not woking on Backend
    if (salaryRevisionData) {
      const revisions = salaryRevisionData?.revision || [];
      // Calculate the lengths based on the revision array
      const approvedRevisions = revisions.filter(
        (revision) => revision.revision_status === "APPROVED"
      ).length;
      const pendingRevisions = revisions.filter(
        (revision) => revision.revision_status === "PENDING"
      ).length;
      const rejectedRevisions = revisions.filter(
        (revision) => revision.revision_status === "REJECTED"
      ).length;

      setSalaryRevisions(revisions);
      setApprovedRevisions(approvedRevisions);
      setPendingRevisions(pendingRevisions);
      setRejectedRevisions(rejectedRevisions);
      setLastIncrementDate(salaryRevisionData?.lastIncrementDate);
    }

    const approvedRevisions = salaryRevisionData?.revision?.filter(
      (revision) => revision.revision_status === "APPROVED"
    );

    const latestApprovedSalaryRevision =
      approvedRevisions?.length > 0
        ? approvedRevisions?.reduce((latest, current) =>
            new Date(current.last_revised_date) >
            new Date(latest.last_revised_date)
              ? current
              : latest
          )
        : {};
    setLatestApprovedSalaryRevision(latestApprovedSalaryRevision);

    const payslips = await getPayslip({ filterData: { employee_payroll: id } });
    if (payslips) {
      setPayslips(payslips);
    }
    setLoading(false);
  };
  useEffect(() => {
    filterData?.employee_payroll && fetchData();
  }, [filterData]);

  useEffect(() => {
    if (employeeID) {
      setFilterData({ employee_payroll: id });
    }
  }, [id]);

  useEffect(() => {
    if (payslips && payslips.results?.length > 0) {
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
      payslips.results.forEach((payslip) => {
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
  }, [payslips]);

  const handleBack = () => {
    navigate(fromMyPayroll ? -2 : -1);
  };
  const handleSalaryRevisionClicked = (revision) => {
    setSelectedRevision(revision);
  };
  const onClose = () => {
    setSelectedRevision(null);
    fetchData();
  };

  if (loading) {
    return <PageLoader />;
  }

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

  const handleStatusChange = async (name, value, revision) => {
    setRevisionLoading(true);
    if (name === "revision_status") {
      revision.revision_status = value;
    } else if (name === "revision_letter") {
      revision.revision_letter = value;
    }
    const response = await updateSalaryRevisionStatus(revision);
    if (response) {
      fetchData();
      if (revision.revision_status === "APPROVED") {
        await saveEmployeePayroll({
          id,
          basic_salary: revision.new_salary,
        });
      }
    }

    setRevisionLoading(false);
  };
  return (
    <div className="container p-4 mx-auto">
      {selectedRevision && !fromMyPayroll && (
        <RevisedSalarySheet
          payrollID={id}
          state={"view"}
          selectedRevision={selectedRevision}
          onClose={onClose}
          employeeData={employeeData}
        />
      )}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-4 text-xl text-balance"
        >
          <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
          Detail
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center pt-6 space-x-4">
            <Avatar className="w-20 h-20 ">
              <AvatarImage
                src={employeeData?.avatar}
                alt={`${employeeData?.first_name} ${employeeData?.last_name}`}
              />
              <AvatarFallback className="bg-plum-400">
                {`${employeeData?.first_name} `
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base text-black">
                <EmployeeID value={employeeID} />
              </p>
              <h2 className="text-2xl font-bold text-black">
                {employeeData?.first_name} {employeeData?.last_name}
              </h2>
              <p className="text-base text-muted-foreground">
                <DesignationName value={employeeData?.department_position} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-base font-medium text-black">
              Cost to Company
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-plum-900">
              {Number(totalEarnings)} AED
            </div>
            <p className="text-xs text-muted-foreground">
              {numberToWords(Number(totalEarnings))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-base font-medium text-black">
              No. of increments
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-plum-900">
              {approvedRevisions}
            </div>
            <p className="text-xs text-muted-foreground">
              Last increment {lastIncrementDate}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3 h-[450px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-plum-900">Salary BreakUp</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-black">
              CTC Components
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row font-bold text-left"></div>
              {earnings?.map((item, index) => (
                <div className="flex flex-row gap-4" key={index}>
                  <div className="flex-1">{item.name}</div>
                  <div className="flex-1 text-right">
                    AED {item.monthly_amount}
                  </div>
                </div>
              ))}
              <div className="flex flex-row font-bold">
                <div className="flex-1 mb-4 text-lg font-medium text-black">
                  Total Salary in AED
                </div>
                <div className="flex-1 text-right">AED {totalEarnings}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid col-span-2 grid-rows-1 gap-4 mb-4 md:grid-rows-2">
          <SalarySummary
            joiningDate={employeeData?.joining_date}
            salaryType={payrollDetails?.salary_type}
            payoutPeriod={payrollDetails?.payout_period}
            lastRevisedDate={latestApprovedSalaryRevision?.last_revised_date}
            previousCTC={
              latestApprovedSalaryRevision?.previous_salary
            }
            currentCTC={latestApprovedSalaryRevision?.new_salary}
          />
          <Card className="mb-4 h-fit">
            <CardHeader>
              <CardTitle className="text-plum-900">Salary Slips</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Select
                onValueChange={(value) => {
                  const selectedMonth = months.find(
                    (month) => month.value === value
                  );
                  setSelectedMonth(selectedMonth.label);
                  setSelectedPayslipId(selectedMonth.payslipId);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pick a month" />
                </SelectTrigger>
                <SelectContent className="">
                  {months?.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!selectedMonth} 
                variant="secondary"
                onClick={() =>
                  navigate(
                    `/payslip/${selectedPayslipId}?employeeID=${employeeID}`
                  )
                }
              >
                Download Slip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between w-full">
          <CardTitle className="text-plum-900">Salary Revisions</CardTitle>
          {!fromMyPayroll && (
            <RevisedSalarySheet
              payrollID={id}
              state={"create"}
              onClose={onClose}
              previousCTC={
                latestApprovedSalaryRevision?.new_salary || totalEarnings
              }
              employeeData={employeeData}
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { status: "Approved", count: approvedRevisions },
              { status: "Pending", count: pendingRevisions },
              { status: "Rejected", count: rejectedRevisions },
            ].map(({ status, count }, index) => (
              <div key={index}>
                <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="text-base font-medium text-black">
                    {status} Revision
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold text-plum-900 ${
                      status === "Rejected" ? "text-red-600" : ""
                    }`}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mb-4 space-x-4">
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: revisionStatusOptions,
                  name: "revision_status",
                  placeholder: "Revision Status",
                },
                {
                  type: "select-two",
                  option: revisionLetterOptions,
                  name: "revision_letter",
                  placeholder: "Revision Letter",
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Revised CTC</TableHead>
                <TableHead>Previous CTC</TableHead>
                <TableHead>Last Revised Date</TableHead>
                <TableHead>Revision Status</TableHead>
                <TableHead>Revision Letter</TableHead>
                <TableHead>Reason for Revision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryRevisions?.map((revision, index) => (
                <TableRow key={index} className="cursor-pointer">
                  <TableCell
                    onClick={() => {
                      handleSalaryRevisionClicked(revision);
                    }}
                  >
                    AED {revision?.new_salary}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSalaryRevisionClicked(revision);
                    }}
                  >
                    AED {revision?.previous_salary}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSalaryRevisionClicked(revision);
                    }}
                  >
                    {revision?.last_revised_date}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="capitalize">
                        {revision.revision_status.toLowerCase()}
                      </div>
                      {!fromMyPayroll && (
                        <StatusDropdown
                          name="revision_status"
                          value={revision?.revision_status}
                          revision={revision}
                          handleChange={handleStatusChange}
                          statuses={revisionStatusOptions}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`capitalize bg-${
                          revision.revision_letter?.toLowerCase() === "issued"
                            ? "green"
                            : revision.revision_letter?.toLowerCase() ===
                              "not issued"
                            ? "red"
                            : "blue"
                        }-100 text-${
                          revision.revision_letter?.toLowerCase() === "issued"
                            ? "green"
                            : revision.revision_letter?.toLowerCase() ===
                              "not issued"
                            ? "red"
                            : "blue"
                        }-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}
                      >
                        {/* {revision.revision_letter?.toLowerCase()} */}
                        <div className="capitalize">
                          {revision.revision_letter.toLowerCase()}
                        </div>
                      </span>
                      {!fromMyPayroll && (
                        <StatusDropdown
                          name="revision_letter"
                          value={revision?.revision_letter}
                          revision={revision}
                          handleChange={handleStatusChange}
                          statuses={revisionLetterOptions}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSalaryRevisionClicked(revision);
                    }}
                  >
                    {revision.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SalarySummary({
  joiningDate,
  salaryType,
  payoutPeriod,
  lastRevisedDate,
  previousCTC,
  currentCTC,
}) {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-plum-900">
          Salary Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="mb-4 text-lg font-semibold text-black">Details</h3>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="space-y-4">
            <div className="flex flex-row gap-6">
              <p className="">Joining Date</p>
              <p className="font-medium text-black">
                {moment(
                  joiningDate,
                  ["MM-DD-YYYY", "YYYY-MM-DD"],
                  true
                ).isValid()
                  ? moment(joiningDate, ["MM-DD-YYYY", "YYYY-MM-DD"]).format(
                      "MMM D, YYYY"
                    )
                  : "Invalid date"}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Experience</p>
              <p className="font-medium text-black">
                {getExperience(joiningDate)}{" "}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Salary Type</p>
              <p className="font-medium text-black">{salaryType}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Payout Period</p>
              <p className="font-medium text-black">{payoutPeriod}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-row gap-6">
              <p className="">Last Revised Date</p>
              <p className="font-medium text-black">{lastRevisedDate}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Previous CTC</p>
              <p className="font-medium text-black">{previousCTC}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Current CTC</p>
              <p className="font-medium text-black">{currentCTC}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const StatusDropdown = ({
  name,
  value,
  handleChange,
  revision,
  statuses,
}) => {
  return (
    <>
      <Select
        defaultValue={value}
        onValueChange={(value) => {
          handleChange(name, value, revision);
        }}
        className=""
      >
        <SelectTrigger className="flex gap-6 justify-between items-center px-3 py-2 w-full text-xs font-semibold leading-none text-teal-700 bg-white rounded-md max-w-[40px] border-none">
          {/* <SelectValue placeholder="Select status" /> */}
        </SelectTrigger>
        <SelectContent className="w-[136px]">
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <div
                className={`flex gap-2 items-center px-2 py-1.5 w-full ${
                  status.value === "approved"
                    ? "text-fuchsia-700 bg-fuchsia-50 rounded-[999px]"
                    : "bg-white"
                }`}
              >
                <span className="self-stretch flex-1 my-auto shrink basis-0">
                  {status.label}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
