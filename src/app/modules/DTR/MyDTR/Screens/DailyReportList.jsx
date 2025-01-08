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
import CreateCard from "app/modules/TaskManagment/Boards/CreateCardModal";
import { Badge } from "components/ui/badge";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { toast } from "react-toastify";
import moment from "moment";
import { MyDtrTasksColumns } from "app/modules/DTR/Sections/DTRTableColumns";
import { getTaskDetailsFromLogtime, addUpdateDTR } from "app/hooks/dtr";

const DailyReportList = ({ dailyReportData, reload }) => {
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
  const toggleDetails = () => {
    setDetailsVisible((prev) => !prev);
  };

  return (
    <SheetCardExtension>
      <div className="flex flex-wrap justify-between gap-6 w-full bg-white rounded-lg">
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
        <DTRDetailsBox
          logtimes={logtimes}
          toggleDetails={toggleDetails}
          dtr_status={dtr_status}
          id={id}
          reload={reload}
          isDetailsVisible={isDetailsVisible}
        />
      )}
    </SheetCardExtension>
  );
};

const DTRDetailsBox = ({
  logtimes,
  toggleDetails,
  isDetailsVisible,
  dtr_status,
  id,
  reload,
}) => {
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTaskDetailsFromLogtime(logtimes);
      if (response) {
        console.log(response);
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
    <div className=" p-4">
      <CustomTable
        data={tasks || []}
        columns={MyDtrTasksColumns}
        dataTotalSize={tasks.length || 0}
        pagination={false}
        selectable={true}
        selectedRows={[]}
        setSelectedRows={() => {}}
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
          {dtr_status !== "Submitted" && (
            <Button
              onClick={() => {
                setOpenCreateCard(true);
              }}
            >
              Add New Task
            </Button>
          )}
        </div>
      </div>
      {openCreateCard && (
        <CreateCard
          onClose={() => {
            setOpenCreateCard(false);
          }}
          boardId={null}
          isOpen={openCreateCard}
          projectId={null}
          setIsOpen={setOpenCreateCard}
        />
      )}
    </div>
  );
};
const StatusBadge = ({ status }) => {
  const Status = status.toUpperCase();
  const iconClassName = "w-3.5 h-[14.50px] relative mr-1";
  let variant = "";
  let icon = "";
  switch (Status) {
    case "PENDING":
      variant = "neutral";
      icon = <Clock className={iconClassName} />;
      break;
    case "SUBMITTED":
      variant = "success";
      icon = <Check className={iconClassName} />;
      break;
    case "CHANGE REQUEST":
      variant = "warning";
      icon = <Clock className={iconClassName} />;
      break;
    default:
      icon = <Clock className={iconClassName} />;
      variant = "plum";
  }
  return (
    <Badge className={"px-4 py-2"} variant={variant}>
      {icon}
      {status}
    </Badge>
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
