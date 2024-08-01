import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";

export default function TaskProgress() {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "88%",
        },
      },
    },
    fill: {
      colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false, // Disable tooltips
    },
  };

  
  // Calculate the series values
  const getSegMentValue = (overallCompletion) => {
    const firstSegment = 33.33;
    const secondSegment = 33.33;
    const thirdSegment = 33.33;
    const remainingSegment = 100 - overallCompletion;
    if (overallCompletion < firstSegment) {
      return [overallCompletion, 0, 0, remainingSegment];
    } else if (overallCompletion < firstSegment + secondSegment) {
      return [
        firstSegment,
        firstSegment + secondSegment - overallCompletion,
        0,
        remainingSegment,
      ];
    } else if (
      overallCompletion <
      firstSegment + secondSegment + thirdSegment
    ) {
      return [
        firstSegment,
        secondSegment,
        firstSegment + secondSegment + thirdSegment - overallCompletion,
        remainingSegment,
      ];
    }
    const chartSeries = [
      firstSegment,
      secondSegment,
      thirdSegment,
      remainingSegment,
    ];
    return chartSeries;
  };

  //  const totalTwoSegments = firstSegment + secondSegment;
  //  const thirdSegment = overallCompletion - totalTwoSegments; // The completed part in the third segment
  //  const remainingSegment = 100 - overallCompletion; // The remaining part as gray color

  return (
    <div className="w-[480px] h-[296px] p-[18px] bg-white rounded-[5px] ">
      <header className="justify-between items-center inline-flex w-full">
        <div className="text-[#323233] text-lg font-normal leading-tight">
          Task Progress
        </div>
        <div className="justify-start items-center gap-1 flex">
          <Link to="">
            <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
              <div className="grow my-auto">All</div>
              <FaChevronDown size={11} />
            </div>
          </Link>
        </div>
      </header>
      <div className="relative mt-6">
        <Chart
          options={chartOptions}
          series={getSegMentValue(88)}
          type="donut"
          width="100%"
          height="200px"
        />
        <div className="flex items-center flex-col absolute top-[34px] left-1/2 -translate-x-1/2 ">
          <div className="text-[#060606] text-[28px] font-normal tracking-tight">
            72%
          </div>
          <div className="w-[72px] text-center text-[#9a9a9a] text-sm font-normal tracking-tight">
            Completed
          </div>
        </div>
        <div className="w-[364px] justify-between items-center inline-flex top-[130px] left-1/2 -translate-x-1/2 absolute">
          <div className="flex-col justify-center items-center gap-1.5 inline-flex">
            <div className="text-[#060606] text-[22px] font-normal font-['Lato'] tracking-tight">
              10
            </div>
            <div className="text-[#797979] text-sm font-normal font-['Lato']">
              Total projects
            </div>
          </div>
          <div className="flex-col justify-center items-center gap-1.5 inline-flex">
            <div className="text-[#1a922d] text-[22px] font-normal font-['Lato'] tracking-tight">
              5
            </div>
            <div className="text-[#797979] text-sm font-normal font-['Lato']">
              Completes
            </div>
          </div>
          <div className="flex-col justify-center items-center gap-1.5 inline-flex">
            <div className="text-[#dfa510] text-[22px] font-normal font-['Lato'] tracking-tight">
              2
            </div>
            <div className="text-[#797979] text-sm font-normal font-['Lato']">
              Delayed
            </div>
          </div>
          <div className="flex-col justify-center items-center gap-1.5 inline-flex">
            <div className="text-[#e65f2b] text-[22px] font-normal font-['Lato'] tracking-tight">
              3
            </div>
            <div className="text-[#797979] text-sm font-normal font-['Lato']">
              On going
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
