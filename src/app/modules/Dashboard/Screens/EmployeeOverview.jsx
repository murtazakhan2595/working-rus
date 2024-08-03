import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { GoPeople } from "react-icons/go";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getEmployeeCustomList } from "app/hooks/general";


function EmployeeOverview() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [employeeData, setEmployeeData] = useState({
    total: 0,
    active: 0,
    offboarding: 0,
  });

  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#38BDF8", "#7DD3FC"],
    labels: ["Active", "Offboarding"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "75%",
        },
      },
    },
    legend: {
      show: false,
    },
    
  };

  const chartSeries = [employeeData.active, employeeData.offboarding];

  const legendItems = [
    {
      color: "bg-sky-400",
      label: "Active",
      value: ((employeeData.active / employeeData.total) * 100).toFixed(0),
    },
    {
      color: "bg-sky-300",
      label: "Offboarding",
      value: ((employeeData.offboarding / employeeData.total) * 100).toFixed(0),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await getEmployeeCustomList();
      setEmployeeData({
        total: response?.count,
        active: response?.ActiveEmployee,
        offboarding: response?.count - response?.ActiveEmployee,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  return (
    <section className="flex flex-col items-center gap-6 px-[14px] pt-6 bg-white rounded-md w-full h-[100%]">
      <div className=" justify-between items-center inline-flex w-full">
        <div className="items-center gap-2 flex">
          <GoPeople className="text-lg font-bold" />
          <div className="text-[#323233] text-lg font-normalleading-tight">
            Total Employees
          </div>
        </div>
        <Link to="/profile-management">
          <div className="pr-2 rounded-[3px] justify-center items-center gap-[3px] flex">
            <div className="text-black text-[11px] font-normal  leading-[18px]">
              View All
            </div>
            <FaChevronRight size={11} />
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-60 max-w-full max-h-[115px] relative">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
          />
          <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <div className="text-center text-[#5c5e64] text-xs font-normal  leading-tight">
              Total
            </div>
            <p className="text-center text-[#323233] text-base font-bold ">{`${employeeData.active}/${employeeData.total}`}</p>
          </div>
        </div>
        <div className="flex gap-5 justify-between items-center max-w-full text-xs leading-5 text-zinc-600 w-[174px]">
          {legendItems.map((item, index) => (
            <div key={index} className="flex gap-1 self-start items-center">
              <div className={`shrink-0 w-3 h-3 ${item.color} rounded-full`} />
              <div>{item.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-5 justify-between mt-3 max-w-full text-base font-bold leading-7 text-center whitespace-nowrap text-zinc-800 w-[138px]">
          {legendItems.map((item, index) => (
            <div key={index}>{item.value}%</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EmployeeOverview;
