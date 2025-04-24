import React, { useEffect, useState } from "react";
import { DetailBox } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CalendarIcon,
  Filter,
} from "lucide-react";
import EmployeePayslipDetails from "app/modules/Payroll/Screens/EmployeeSalaryDetails/EmployeePayslipDetails";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { format } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getSalaryRevision,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import { RevisedSalarySheet } from "app/modules/Payroll/Screens/SalarySetup/EmployeesSalarySetup";
import {
  DesignationName,
  EmployeeID,
  getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader, EmployeeOverview } from "components";
import { revisionLetterOptions, revisionStatusOptions } from "data/Data";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import {
  getEarnAndDeduction,
  getPayslip,
  saveEmployeePayroll,
  updateSalaryRevisionStatus,
} from "app/hooks/payroll";
import { calculateEarningsAndDeductions } from "app/modules/Payroll/Sections/CalculationsHelperFunctions";
import moment from "moment";
import SalaryBreakDown from "app/modules/Payroll/Screens/EmployeeSalaryDetails/SalaryBreakDown";

export default function EmployeeSalaryRevisions({
  employee_Id,
  editMode = true,
  payrollId,
  previousCTC,
}) {
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [approvedRevisions, setApprovedRevisions] = useState(0);
  const [pendingRevisions, setPendingRevisions] = useState(0);
  const [rejectedRevisions, setRejectedRevisions] = useState(0);
  const [lastIncrementDate, setLastIncrementDate] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [months, setMonths] = useState([]);

  const [latestApprovedSalaryRevision, setLatestApprovedSalaryRevision] =
    useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const employeeID = new URLSearchParams(location.search).get("employeeID");
  const fromMyPayroll =
    new URLSearchParams(location.search).get("fromMyPayroll") === "true";

  const fetchData = async () => {
    setLoading(true);
    const empData = await getEmployeeData(employeeID);
    if (empData) {
      setEmployeeData(empData);
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
    fetchData();
  }, [filterData]);

  useEffect(() => {
    if (employee_Id) {
      setFilterData({ employee_payroll: payrollId });
    }
  }, [payrollId]);

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
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle className="text-plum-900">Salary Revisions</CardTitle>
        {editMode && (
          <RevisedSalarySheet
            payrollID={payrollId}
            state={"create"}
            onClose={onClose}
            previousCTC={previousCTC}
            employeeData={employeeData}
            employee_Id={employee_Id}
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
