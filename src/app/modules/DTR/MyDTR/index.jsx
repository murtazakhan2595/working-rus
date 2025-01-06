import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import { Header } from "components";
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
import { getDtr } from "app/hooks/dtr";
import { useSelector } from "react-redux";

const TIME_FILTERS = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
};

const VIEW_TYPES = {
  LIST: "list",
  GRID: "grid",
};

const TimeLog = () => {
  const [selectedFilter, setSelectedFilter] = useState(TIME_FILTERS.WEEK);
  const [selectedView, setSelectedView] = useState(VIEW_TYPES.LIST);

  const timeFilters = [
    {
      text: TIME_FILTERS.DAY,
      isActive: selectedFilter === TIME_FILTERS.DAY,
      onClick: () => setSelectedFilter(TIME_FILTERS.DAY),
    },
    {
      text: TIME_FILTERS.WEEK,
      isActive: selectedFilter === TIME_FILTERS.WEEK,
      onClick: () => setSelectedFilter(TIME_FILTERS.WEEK),
    },
    {
      text: TIME_FILTERS.MONTH,
      isActive: selectedFilter === TIME_FILTERS.MONTH,
      onClick: () => setSelectedFilter(TIME_FILTERS.MONTH),
    },
  ];

  const viewButtons = [
    {
      icon: LayoutGrid,
      isActive: selectedView === VIEW_TYPES.LIST,
      onClick: () => setSelectedView(VIEW_TYPES.LIST),
    },
    {
      icon: ListTodo,
      isActive: selectedView === VIEW_TYPES.GRID,
      onClick: () => setSelectedView(VIEW_TYPES.GRID),
    },
  ];

  const IconButton = ({ icon: Icon, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-10",
          isActive && "bg-fuchsia-50",
          !isActive && "bg-white"
        )}
      >
        <Icon className="h-4 w-4 text-plum-1100" aria-hidden="true" />
      </Button>
    );
  };

  const TimeFilterButton = ({ text, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 text-sm font-medium leading-tight",
          isActive && "bg-fuchsia-50 text-fuchsia-700",
          !isActive && "text-neutral-400"
        )}
      >
        {text}
      </Button>
    );
  };

  return (
    <div className="flex flex-wrap items-center">
      <div className="flex flex-col justify-center self-stretch my-auto text-xl font-semibold tracking-normal leading-none text-fuchsia-700 w-[123px]">
        <div className="self-stretch pb-px w-full min-h-[28px] text-nowrap">
          My Time Log
        </div>
      </div>
      <div className="flex flex-1 shrink self-stretch pt-1.5 my-auto basis-0 h-[38px] min-w-[76px] w-[227px]" />
      <div className="flex flex-wrap gap-4 items-center self-stretch my-auto min-w-[240px] max-md:max-w-full">
        <div className="flex flex-wrap gap-1 items-center self-stretch p-1 my-auto bg-white rounded-xl border border-gray-100 border-solid min-h-[40px] min-w-[240px] max-md:max-w-full">
          {timeFilters.map((filter, index) => (
            <TimeFilterButton
              key={index}
              text={filter.text}
              isActive={filter.isActive}
              onClick={filter.onClick}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-neutral-400"
          >
            <CalendarDays />
            <span>11 Nov 2024 - 15 Nov 2024</span>
          </Button>
        </div>
        <div className="flex gap-1 items-center self-stretch p-1 my-auto bg-white rounded-xl border border-gray-100 border-solid min-h-[40px]">
          {viewButtons.map((button, index) => (
            <IconButton
              key={index}
              icon={button.icon}
              isActive={button.isActive}
              onClick={button.onClick}
            />
          ))}
        </div>
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
  );
};

const MyDtr = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const statsData = [
    { label: "Hours Logged", value: 10, icon: Hourglass },
    { label: "Tasks Completed", value: 2, icon: ClipboardCheck },
    {
      label: "Pending Tasks",
      value: 5,
      icon: ClipboardList,
    },
    {
      label: "Pending DTR",
      value: 5,
      icon: CalendarClock,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTaskReport, setDailyTaskReport] = useState(false);
  const [openLogTimeSheet, setOpenLogTimeSheet] = useState(false);
  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getDtr();
        //   {
        //   filterData: {
        //     assigned_to: [userProfile.id],
        //   },
        // }
        if (response) {
          setDailyTaskReport(response.results);
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
      <TimeLog />
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
