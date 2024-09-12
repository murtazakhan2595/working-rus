"'use client'";

import React, { useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeePayrollById } from "app/hooks/payroll";

// Dummy data
const employeeData = {
  id: "TXB-0056",
  name: "Dennis Callis",
  role: "UI/UX Designer / Mid-Level Designer",
  avatar: "/placeholder.svg?height=80&width=80",
  costToCompany: "3,870.34",
  costToCompanyWords: "Three Thousand Eight Hundred And Seventy AED",
  incrementsCount: 3,
  lastIncrementDate: "5 months ago",
};

const salaryBreakup = [
  { component: "Basic Pay", amount: "300.00" },
  { component: "Fixed Allowance", amount: "300.00" },
  { component: "Home Allowance", amount: "50.00" },
  { component: "Phone Allowance", amount: "50.00" },
  { component: "Travel Allowance", amount: "100.00" },
  { component: "Food Allowance", amount: "100.00" },
];

const salarySummary = {
  "Joining Date": "Jul 31, 2022",
  "Last Revised Date": "Aug 2, 2024",
  Experience: "2 years, 5 Months",
  "Previous CTC": "AED 7,901.51",
  "Salary Type": "Monthly",
  "Current CTC": "AED 7,901.51",
  "Salary Package": "Mid-level",
};

const salaryRevisions = [
  {
    date: "Jul 29, 2024",
    revisedCTC: "2000",
    previousCTC: "1000",
    lastRevisedDate: "Jul 29, 2024",
    status: "Pending",
    letterStatus: "Issued",
    reason: "Promotion for outstanding perf",
  },
  {
    date: "Aug 3, 2024",
    revisedCTC: "2000",
    previousCTC: "1000",
    lastRevisedDate: "Aug 3, 2024",
    status: "Pending",
    letterStatus: "Not Issued",
    reason: "Increament for achivement in d",
  },
  {
    date: "Aug 3, 2024",
    revisedCTC: "2000",
    previousCTC: "1000",
    lastRevisedDate: "Aug 3, 2024",
    status: "Approved",
    letterStatus: "Draft",
    reason: "Increament for achivement in d",
  },
];

export default function EmployeeSalaryDetails() {
  const [date, setDate] = React.useState();
  const [payrollDetails, setPayrollDetails] = React.useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeePayrollById(id);
      console.log("employee details payrooll", response);
      if (response) {
        setPayrollDetails(response);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // This will navigate to the previous page
    console.log("Back button clicked");
  };

  return (
    <div className="container p-4 mx-auto">
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
              <AvatarImage src={employeeData.avatar} alt={employeeData.name} />
              <AvatarFallback className="bg-plum-400">
                {employeeData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base text-black">{employeeData.id}</p>
              <h2 className="text-2xl font-bold text-plum-900">
                {employeeData.name}
              </h2>
              <p className="text-base text-muted-foreground">
                {employeeData.role}
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
              {employeeData.costToCompany} AED
            </div>
            <p className="text-xs text-muted-foreground">
              {employeeData.costToCompanyWords}
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
              {employeeData.incrementsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Last increment {employeeData.lastIncrementDate}
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
              {salaryBreakup.map((item, index) => (
                <div className="flex flex-row gap-4" key={index}>
                  <div className="flex-1">{item.component}</div>
                  <div className="flex-1 text-right">AED {item.amount}</div>
                </div>
              ))}
              <div className="flex flex-row font-bold">
                <div className="flex-1 mb-4 text-lg font-medium text-black">
                  Total Salary in AED
                </div>
                <div className="flex-1 text-right">
                  AED{" "}
                  {salaryBreakup
                    .reduce((total, item) => total + parseFloat(item.amount), 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid col-span-2 grid-rows-1 gap-4 mb-4 md:grid-rows-2">
          <SalarySummary />
          <Card className="mb-4 h-fit">
            <CardHeader>
              <CardTitle className="text-plum-900">PaySlips</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pick a month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan">January</SelectItem>
                  <SelectItem value="feb">February</SelectItem>
                  <SelectItem value="mar">March</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={() => navigate("/payslip")}>
                Download Slip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-plum-900">Salary Revisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {["Approved", "Pending", "Rejected"].map((status, index) => (
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
                    {
                      salaryRevisions.filter(
                        (revision) => revision.status === status
                      ).length
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mb-4 space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span>Revision Status</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup heading="Statuses">
                      <CommandItem>Approved</CommandItem>
                      <CommandItem>Pending</CommandItem>
                      <CommandItem>Rejected</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span>Revision Letter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search letter status..." />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup heading="Letter Statuses">
                      <CommandItem>Issued</CommandItem>
                      <CommandItem>Not Issued</CommandItem>
                      <CommandItem>Draft</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
              {salaryRevisions.map((revision, index) => (
                <TableRow key={index}>
                  <TableCell>AED {revision.revisedCTC}</TableCell>
                  <TableCell>AED {revision.previousCTC}</TableCell>
                  <TableCell>{revision.lastRevisedDate}</TableCell>
                  <TableCell>{revision.status}</TableCell>
                  <TableCell>
                    <span
                      className={`bg-${
                        revision.letterStatus === "Issued"
                          ? "green"
                          : revision.letterStatus === "Not Issued"
                          ? "red"
                          : "blue"
                      }-100 text-${
                        revision.letterStatus === "Issued"
                          ? "green"
                          : revision.letterStatus === "Not Issued"
                          ? "red"
                          : "blue"
                      }-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}
                    >
                      {revision.letterStatus}
                    </span>
                  </TableCell>
                  <TableCell>{revision.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const dummyData = {
  joiningDate: "Jul 31, 2022",
  experience: "2 years, 5 Months",
  salaryType: "Hourly",
  payoutPeriod: "Monthly",
  lastRevisedDate: "Aug 2, 2024",
  previousCTC: "AED 7,901.51",
  currentCTC: "AED 7,901.51",
};
function SalarySummary({
  joiningDate,
  experience,
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
              <p className="font-medium text-black">{dummyData.joiningDate}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Experience</p>
              <p className="font-medium text-black">{dummyData.experience}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Salary Type</p>
              <p className="font-medium text-black">{dummyData.salaryType}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Payout Period</p>
              <p className="font-medium text-black">{dummyData.payoutPeriod}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-row gap-6">
              <p className="">Last Revised Date</p>
              <p className="font-medium text-black">
                {dummyData.lastRevisedDate}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Previous CTC</p>
              <p className="font-medium text-black">{dummyData.previousCTC}</p>
            </div>
            <div className="flex flex-row gap-6">
              <p className="">Current CTC</p>
              <p className="font-medium text-black">{dummyData.currentCTC}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
