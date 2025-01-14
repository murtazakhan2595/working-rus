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
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import { getDesignationName } from "utils/getValuesFromTables";
import { useSelector } from "react-redux";
import { DailyReportList } from "../../MyDTR/Screens";

const TeamDailyReportList = ({ dailyReportData, reload }) => {

  console.log("DAILYTASKSREPORTS--->", dailyReportData);
  if (!dailyReportData || dailyReportData.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Daily Reports" />
      <CardContent>
        {dailyReportData.map((report, index) => (
          <div key={index} className={index > 0 ? "mt-4" : ""}>
            <ReportCard {...report} reload={reload}/>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ReportCard = ({
  stats,
  reload,
  designation,
  full_name,
  dtrsList,

}) => {
  const designations = useSelector((state) => state.common.designations);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const toggleDetails = () => {
    setDetailsVisible((prev) => !prev);
  };
  const hasNonApprovedDTRs = dtrsList.some(
    (dtr) => dtr.dtr_status !== "Manager Approval"
  );

  const approveDtr = async (dtrId) => {
    try {
      if (dtrId) {
        // Single DTR approval
        const dtrResponse = await addUpdateDTR(
          {
            dtr_status: "Manager Approval",
            id: dtrId,
          },
          dtrId
        );

        if (dtrResponse) {
          toast.success("DTR approved successfully");
          reload();
        } else {
          toast.error("Error in approving DTR");
        }
      } else {
        // Bulk approval for all DTRs in the list
        const updatePromises = dtrsList.map((dtr) =>
          addUpdateDTR(
            {
              dtr_status: "Manager Approval",
              id: dtr.id,
            },
            dtr.id
          )
        );

        const results = await Promise.all(updatePromises);

        if (results.every((result) => result)) {
          toast.success("All DTRs approved successfully");
          reload();
        } else {
          toast.error("Error in approving some DTRs");
        }
      }
    } catch (error) {
      console.error("Error in DTR approval:", error);
      toast.error("Error in processing DTR approval");
    }
  };

  return (
    <SheetCardExtension>
      <div className="flex flex-wrap justify-between gap-6 w-full bg-white rounded-lg">
        <EmployeeDataInfo
          name={full_name}
          designation={getDesignationName(designation, designations)}
          src={""}
        />
        <div className="flex gap-4 items-center">
          <StatItem icon={Hourglass} value={stats?.consumed_time} />
          <StatItem icon={ClockArrowUp} value={stats?.over_time} />
          <StatItem icon={ClipboardList} value={stats?.pendingTasks} />
          {/* <StatusBadge status={dtr_status} /> */}
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
        <DailyReportList
          dailyReportData={dtrsList}
          reload={reload}
          isMyDtr={false}
          approveDtr={approveDtr}
        />
      )}

      {isDetailsVisible && (
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
            {hasNonApprovedDTRs && (
              <Button
                onClick={() => {
                  approveDtr();
                }}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      )}
    </SheetCardExtension>
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

export default TeamDailyReportList;
