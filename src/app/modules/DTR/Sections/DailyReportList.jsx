import { Button } from "components/ui/button";
import { Card, CardHeader, CardContent } from "components/ui/card";
import { Check, ChevronDown, ChevronUp, ClipboardList, Clock, ClockArrowUp, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/@/components/ui/table";
import { MyDtrTasksColumns } from "app/utils/Types/TableColumns";
import { getDtr } from "app/hooks/dtr";

// / Mock data
const dailyReportData = [
  {
    date: "24 - 11 - 2024",
    day: "Thursday",
    stats: { tasks: 8, meetings: 0, reports: 1 },
    status: "pending",
    tasks: [
      {
        id: "T0031",
        name: "Wireframing",
        dueDate: "June 13",
        priority: "Low",
        timeEst: "5h",
        timeSpent: "2h",
        status: "In-Progress",
      },
      {
        id: "T0033",
        name: "Prototyping",
        dueDate: "June 15",
        priority: "Medium",
        timeEst: "3h",
        timeSpent: "3h",
        status: "Completed",
      },
      {
        id: "T0231",
        name: "Design Review",
        dueDate: "June 13",
        priority: "High",
        timeEst: "4h",
        timeSpent: "2.5h",
        status: "In-Progress",
      },
    ],
  },
  // More reports can be added here...
];

const DailyReportList = () => {
  // const [dailyReportData, setDailyReportData] = useState([]);
  // const fetchData = async () => {
  //   const myDtr =await getDtr()
  //   if (myDtr) {
  //     setDailyReportData(myDtr?.results)
  //   }
  // }
  // console.log(dailyReportData)
  // useEffect(() => {
  //   // Fetch daily reports here
  //   fetchData()
  // }, []);

  return (
    <Card>
      <CardHeader title="Daily Reports" />
      <CardContent>
        {dailyReportData.map((report, index) => (
          <div key={report.date} className={index > 0 ? "mt-4" : ""}>
            <ReportCard {...report} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ReportCard = ({ date, day, stats, status, tasks }) => {
  const [isDetailsVisible, setDetailsVisible] = useState(false);
   const toggleDetails = () => {
     setDetailsVisible((prev) => !prev);
   };
  return (
    <div className="flex flex-col w-full rounded-lg border-[2px] border-[#e8e8ec]">
      <div className="flex flex-wrap justify-between gap-6 py-4 pr-9 pl-4 w-full bg-white rounded-lg">
        <div className="flex flex-col">
          <div className="text-black text-base font-bold">{date}</div>
          <div className="text-[#1c2024] text-base font-normal">{day}</div>
        </div>
        <div className="flex gap-4 items-center">
          <StatItem icon={Hourglass} value={stats.tasks} />
          <StatItem icon={ClockArrowUp} value={stats.meetings} />
          <StatItem icon={ClipboardList} value={stats.reports} />
          <StatusBadge status={status} />
          <div
            className="h-8 px-2 py-1 flex items-center gap-2 cursor-pointer"
            onClick={toggleDetails}
          >
            <div className="text-[#7f838d] text-base font-semibold">
              {isDetailsVisible ? "Hide Details" : "View Details"}
            </div>
            {isDetailsVisible ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {isDetailsVisible && (
        <div className=" p-4">
          <CustomTable
            data={tasks || []}
            columns={MyDtrTasksColumns}
            dataTotalSize={tasks.length || 0}
            pagination={false}
            // tableOptions={tableOptions}
          />
          <div className="flex justify-between mt-4">
            <div
              className="h-8 px-2 py-1 flex items-center gap-2 cursor-pointer"
              onClick={toggleDetails}
            >
              <div className="text-[#7f838d] text-base font-semibold">
                {isDetailsVisible ? "Hide Details" : "View Details"}
              </div>
              {isDetailsVisible ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button>Submit Report</Button>
              <Button>Add New Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const StatusBadge = ({ status }) => {
  const isSubmitted = status === "submitted";

  return (
    <div className="h-7 px-3 py-1 bg-[#e5fff9] rounded-full justify-start items-center gap-1 inline-flex">
      <div className="text-[#1d735e] text-sm font-normal font-['Inter'] leading-tight">
        Submitted{" "}
      </div>
      <Check className="w-3.5 h-[14.50px] relative" />
    </div>
  );
};

const StatItem = ({ icon: Icon, value }) => {
  return (
    <div className="flex gap-2 items-center self-stretch px-2 my-auto text-base whitespace-nowrap text-neutral-800">
      <Icon className="h-5 w-5 text-neutral-800" aria-hidden="true" />
      <div className="self-stretch my-auto">{value}</div>
    </div>
  );
};

export default DailyReportList;
