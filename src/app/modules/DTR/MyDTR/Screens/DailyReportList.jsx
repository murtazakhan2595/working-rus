import { Button } from "components/ui/button";
import { Card, CardHeader, CardContent } from "components/ui/card";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  ClockArrowUp,
  Hourglass,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/@/components/ui/table";
import { MyDtrTasksColumns } from "app/modules/DTR/Sections/DTRTableColumns";
import { getTaskDetailsFromLogtime, addUpdateDTR } from "app/hooks/dtr";

const DailyReportList = ({ dailyReportData, reload }) => {
  console.log(dailyReportData);
  if (!dailyReportData || dailyReportData.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Daily Reports" />
      <CardContent>
        {dailyReportData.map((report, index) => (
          <div key={report.date} className={index > 0 ? "mt-4" : ""}>
            <ReportCard {...report} reload={reload} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ReportCard = ({
  logtime_date,
  id,
  stats,
  dtr_status,
  logtimes,
  reload,
}) => {
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const toggleDetails = () => {
    setDetailsVisible((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTaskDetailsFromLogtime(logtimes);
      if (response) {
        setTasks(response);
      }
    };
    fetchData();
  }, [logtimes]);
  const submitReportDTR = async () => {
    const dtrResponse = await addUpdateDTR(
      {
        dtr_status: "Submitted",
        id: id,
      },
      id
    );

    if (dtrResponse) {
      toast.success("DTR submitted successfully");
      reload(); // Reload the page or data
    } else {
      toast.error("Error in saving leave transaction");
    }
  };

  return (
    <div className="flex flex-col w-full rounded-lg border-[2px] border-[#e8e8ec]">
      <div className="flex flex-wrap justify-between gap-6 py-4 pr-9 pl-4 w-full bg-white rounded-lg">
        <div className="flex flex-col">
          <div className="text-black text-base font-bold">{logtime_date}</div>
          <div className="text-[#1c2024] text-base font-normal">
            {moment(logtime_date).format("dddd")}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <StatItem icon={Hourglass} value={stats?.tasks} />
          <StatItem icon={ClockArrowUp} value={stats?.meetings} />
          <StatItem icon={ClipboardList} value={stats?.reports} />
          <StatusBadge status={dtr_status} />
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
              {dtr_status === "Pending" && (
                <Button
                  onClick={() => {
                    submitReportDTR();
                  }}
                >
                  Submit Report
                </Button>
              )}

              {dtr_status === "Change Request" && (
                <Button
                  onClick={() => {
                    submitReportDTR();
                  }}
                >
                  Resubmit Report
                </Button>
              )}
              {dtr_status !== "Submitted" && <Button>Add New Task</Button>}
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
        Submitted
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
