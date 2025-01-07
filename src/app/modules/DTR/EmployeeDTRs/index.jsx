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

const EmployeeDTRs = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [openLogTimeSheet, setOpenLogTimeSheet] = useState(false);
  const [dailyTaskReport, setDailyTaskReport] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [logTimeList, setLogTimeList] = useState(false);
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
        const response = await getDtr({
          // filterData: {
          //   direct_report: userProfile.id,
          // },
        });

        if (response) {
          console.log("results in dtr emplouyee", response.results);
          let dtrs = groupData(response.results);
          console.log("groupData", dtrs);
          setDailyTaskReport(dtrs);
        }
        const responseLogTime = await getLogTimeList({
          // filterData: {
          //   employee_id: userProfile.id,
          // },
        });
        if (responseLogTime) {
          setLogTimeList(responseLogTime.results);
        }
      }
    } catch (error) {
      console.error("Error frtching DTR", error);
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
  useEffect(() => {
    setStatsData([
      {
        label: "Team Hours",
        value: calculateTotal(logTimeList, "consumed_time"),
        icon: Hourglass,
      },
      { label: "Overtime Hours", value: 2, icon: TimerReset },
      {
        label: "Tasks Submitted",
        value: 5,
        icon: ClipboardCheck,
      },
      {
        label: "Pending Tasks",
        value: 5,
        icon: ClipboardList,
      },
      {
        label: "Pending DTR",
        value: calculateTotalCount(dailyTaskReport, "dtr_status", "Pending"),
        icon: CalendarClock,
      },
    ]);
  }, [logTimeList]);
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
      />
      <Stats stats={statsData} />
      <TeamDailyReportList
        dailyReportData={dailyTaskReport}
        reload={() => {
          fetchData(true);
        }}
      />
    </div>
  );
};

export default EmployeeDTRs;
