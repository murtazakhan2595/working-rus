import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

function LeaveBalanceCard() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [leaveData, setLeaveData] = useState({
    total: 0,
    used: 0,
    remaining: 0,
  });

  console.log("leaveData", leaveData);
  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#38BDF8", "#7DD3FC"],
    labels: ["Used", "Remaining"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "85%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#71717A",
              offsetY: -30,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#27272A",
              offsetY: -25,
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const chartSeries = [leaveData.used, leaveData.remaining];

  const legendItems = [
    { color: "bg-sky-400", label: "Used", value: leaveData.used },
    { color: "bg-sky-300", label: "Remaining", value: leaveData.remaining },
  ];

  const fetchData = async () => {
    try {
      const response = await getEmployeeLeaveTypes({
        employee_id: userProfile.id,
      });
      console.log(response);
      setLeaveData({
        total: response?.allotedLeaves,
        used: response?.usedLeaves,
        remaining: response?.remainingLeaves,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  return (
    <section className="flex flex-col items-center gap-6 px-[14px] pt-6 bg-white rounded-md h-full">
      <div className="text-[#323233] text-lg font-normal  leading-tight self-start pl-8">
        Leave Balance
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-60 max-w-full max-h-[115px] relative">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
            <div className="text-center text-[#5c5e64] text-xs font-normal font-['Lato'] leading-tight">
              Total
            </div>
            <div className="text-center text-[#323233] text-base font-bold font-['Lato'] leading-7">
              {leaveData.total}
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between items-center max-w-full text-xs leading-5 text-zinc-600 w-[174px] mt-3">
          {legendItems.map((item, index) => (
            <div key={index} className="flex gap-1 self-start">
              <div className={`shrink-0 w-3 h-3 ${item.color} rounded-full`} />
              <div>{item.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-5 justify-between max-w-full text-base font-bold leading-7 text-center whitespace-nowrap text-zinc-800 w-[138px]">
          {legendItems.map((item, index) => (
            <div key={index}>{item.value}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LeaveBalanceCard;
