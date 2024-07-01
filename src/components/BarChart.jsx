import Chart from "react-apexcharts";

export default function BarChart({ categories, series }) {
  const chartConfig = {
    type: "bar",
    height: 240,
    series: series,
    options: {
      chart: {
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
      colors: ["#25A8E0", "#EBECED"], // Custom colors for each series
      plotOptions: {
        bar: {
          columnWidth: "15px", // Adjust bar width
          borderRadius: 4, // Adjust bar border radius
          stacked: true,
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
