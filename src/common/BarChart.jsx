import Chart from "react-apexcharts";

export default function BarChart({ categories, series }) {
  const chartConfig = {
    type: "bar",
    height: 240,
    series: series,
    options: {
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#25A8E0", "#d3d5d7"], // Custom colors for each series
      plotOptions: {
        bar: {
          columnWidth: "15px", // Adjust bar width
          borderRadius: 3, // Adjust bar border radius
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "transparent",
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'right',
        offsetX: 40
      },
      tooltip: {
        theme: "light",
      },
    },
  };
  return (
    <div className="">
      <div>
        <Chart {...chartConfig} />
      </div>
    </div>
  );
}
