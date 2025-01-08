import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import { Header, DateRangeFilter } from "components";
import Stats from "components/ui/Stats";
import {
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Contact,
  Download,
  Hourglass,
  LayoutGrid,
  ListTodo,
  TimerReset,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import {
  SaveUpdateLogTime,
  DailyReportList,
} from "app/modules/DTR/MyDTR/Screens";
import { getDtr, getLogTimeList } from "app/hooks/dtr";
import { useSelector } from "react-redux";
import { calculateTotal, calculateTotalCount } from "utils/renderValues";
import TeamDailyReportList from "./Screens/TeamDailyReportList";
import { getTaskDetailsFromLogtime } from "app/hooks/dtr";
import { PageLoader } from "components";

const EmployeeDTRs = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [openLogTimeSheet, setOpenLogTimeSheet] = useState(false);
  const [dailyTaskReport, setDailyTaskReport] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const groupData = (data) => {
  // Grouping Logic
  const groupedData = Object.values(
    data.reduce((acc, item) => {
      const key = `${item.full_name}-${item.designation}-${item.direct_report}`;
      if (!acc[key]) {
        acc[key] = {
          direct_report: item.direct_report,
          full_name: item.full_name,
          designation: item.designation,
          dtrsList: [],
        };
      }
      acc[key].dtrsList.push({
        id: item.id,
        logtime_date: item.logtime_date,
        dtr_status: item.dtr_status,
        employee_id: item.employee_id,
        organization: item.organization,
        logtimes: item.logtimes,
      });
      return acc;
    }, {})
  );
  return groupedData
}

const fetchData = async (isMounted) => {
  setIsLoading(true);
  try {
    if (isMounted) {
      const response = await getDtr(
        userProfile.role === 2
          ? { filterData: { direct_report: userProfile.id } }
          : {}
      );

      if (response) {
        console.log("results in dtr employee", response.results);
        let dtrs = groupData(response.results);

        // Process each employee's data
        const processedDtrs = await Promise.all(
          dtrs.map(async (employeeData) => {
            // Collect all logtimes from all DTRs for this employee
            const allLogtimes = employeeData.dtrsList.reduce((acc, dtr) => {
              return [...acc, ...(dtr.logtimes || [])];
            }, []);

            // Get task details for all logtimes
            const taskDetails = await getTaskDetailsFromLogtime(allLogtimes);

            let stats = {
              consumed_time: "0.00",
              estimated_time: "0.00",
              over_time: "0.00",
            };

            if (taskDetails && taskDetails.length > 0) {
              // Calculate total consumed time
              const totalConsumedTime = taskDetails.reduce((sum, task) => {
                return sum + parseFloat(task.consumed_time || 0);
              }, 0);

              // Calculate total estimated time
              const totalEstimatedTime = taskDetails.reduce((sum, task) => {
                return sum + parseFloat(task.estimated_time || 0);
              }, 0);

              // Calculate overtime
              const overTime = totalConsumedTime - totalEstimatedTime;

              stats = {
                consumed_time: totalConsumedTime.toFixed(2),
                estimated_time: totalEstimatedTime.toFixed(2),
                over_time: overTime.toFixed(2),
              };
            }

            // Return employee data with stats
            return {
              ...employeeData,
              stats,
            };
          })
        );

        // Calculate team-wide totals
        const teamTotals = processedDtrs.reduce(
          (totals, employee) => {
            return {
              consumed_time:
                parseFloat(totals.consumed_time) +
                parseFloat(employee.stats.consumed_time),
              over_time:
                parseFloat(totals.over_time) +
                parseFloat(employee.stats.over_time),
            };
          },
          { consumed_time: 0, over_time: 0 }
        );

        // Calculate pending DTR count
        const pendingDtrCount = processedDtrs.reduce((count, employee) => {
          return (
            count +
            employee.dtrsList.filter((dtr) => dtr.dtr_status === "Pending")
              .length
          );
        }, 0);

        // Set complete statsData
        setStatsData([
          {
            label: "Team Hours",
            value: teamTotals.consumed_time.toFixed(2),
            icon: Hourglass,
          },
          {
            label: "Overtime Hours",
            value: teamTotals.over_time.toFixed(2),
            icon: TimerReset,
          },
          {
            label: "Tasks Submitted",
            value: 5, // Static value as requested
            icon: ClipboardCheck,
          },
          {
            label: "Pending Tasks",
            value: 5, // Static value as requested
            icon: ClipboardList,
          },
          {
            label: "Pending DTR",
            value: pendingDtrCount,
            icon: CalendarClock,
          },
        ]);

        console.log("groupData with stats", processedDtrs);
        setDailyTaskReport(processedDtrs);
      }
    }
  } catch (error) {
    console.error("Error fetching DTR", error);
  } finally {
    if (isMounted) setIsLoading(false);
  }
};
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {isLoading? <PageLoader/> :<div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <Header />
        <Stats stats={statsData} />
        <TeamDailyReportList
          dailyReportData={dailyTaskReport}
          reload={() => {
            fetchData(true);
          }}
        />
      </div>}
    </>
  );
};

export default EmployeeDTRs;
