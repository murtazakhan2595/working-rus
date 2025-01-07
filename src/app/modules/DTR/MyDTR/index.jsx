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
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import {
  SaveUpdateLogTime,
  DailyReportList,
} from "app/modules/DTR/MyDTR/Screens";
import { ViewOptions } from "app/modules/DTR/Sections";
import { getDtr, getLogTimeList } from "app/hooks/dtr";
import { useSelector } from "react-redux";
import { calculateTotal, calculateTotalCount } from "utils/renderValues";
import { GetDateRange } from "utils/renderValues";

const MyDtr = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTaskReport, setDailyTaskReport] = useState(false);
  const [openLogTimeSheet, setOpenLogTimeSheet] = useState(false);
  const [logTimeList, setLogTimeList] = useState(false);
  const [activeFilter, setactiveFilter] = useState("week");
  const [activeView, setActiveView] = useState("list");
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
  });
  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getDtr({
          filterData: filterData,
        });

        if (response) {
          setDailyTaskReport(response.results);
        }
        const responseLogTime = await getLogTimeList({
          filterData: {
            employee_id: userProfile.id,
          },
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
  }, [filterData]);
  useEffect(() => {
    setStatsData([
      {
        label: "Hours Logged",
        value: calculateTotal(logTimeList, "consumed_time"),
        icon: Hourglass,
      },
      { label: "Tasks Completed", value: 2, icon: ClipboardCheck },
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
        content={
          <Button
            onClick={() => {
              setOpenLogTimeSheet(true);
            }}
          >
            Login Time
          </Button>
        }
      />
      <Stats stats={statsData} />
      <div className="flex flex-wrap items-center">
        <div className="flex flex-col justify-center self-stretch my-auto text-xl font-semibold tracking-normal leading-none text-fuchsia-700 w-[123px]">
          <div className="self-stretch pb-px w-full min-h-[28px] text-nowrap">
            My Time Log
          </div>
        </div>
        <div className="flex flex-1 shrink self-stretch pt-1.5 my-auto basis-0 h-[38px] min-w-[76px] w-[227px]" />
        <div className="flex flex-wrap gap-4 items-center self-stretch my-auto min-w-[240px] max-md:max-w-full">
          <DateRangeFilter
            activeDateRange={activeFilter}
            setDateRange={(dateRange) => {
              setFilterData((prevFilters) => {
                const updatedFilters = {
                  ...prevFilters,
                  ...{ date_range: GetDateRange(dateRange) },
                };
                setactiveFilter(dateRange);
                return updatedFilters;
              });
            }}
          />
          <ViewOptions activeView={activeView} setActiveView={setActiveView} />

          <Button
            variant="outline"
            size="sm"
            className="h-10 gap-1 rounded-3xl border-gray-100"
          >
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <DailyReportList
        dailyReportData={dailyTaskReport}
        reload={() => {
          fetchData(true);
        }}
      />
      {openLogTimeSheet && (
        <SaveUpdateLogTime
          setIsOpen={setOpenLogTimeSheet}
          isOpen={openLogTimeSheet}
          reload={() => {
            fetchData(true);
          }}
        />
      )}
    </div>
  );
};

export default MyDtr;
