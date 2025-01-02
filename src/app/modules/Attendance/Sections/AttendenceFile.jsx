// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Card, CardHeader, CardContent, CardFooter } from "components/ui/card";
import { Bar } from "react-chartjs-2";
import Newlogo from "assets/images/NewLogo";
import { Button } from "components/ui/button";
import { usePDF } from "react-to-pdf";
import TableCustom from "components/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAttendance } from "app/hooks/attendance";
import moment from "moment";
import { format } from "date-fns";
import { renderDate } from "utils/renderValues";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getWeekNumber = (date) => moment(date).isoWeek();

const processData = (data) => {
  const weekMetrics = {};

  data.forEach((item) => {
    const weekNumber = getWeekNumber(item.date);
    if (!weekMetrics[weekNumber]) {
      weekMetrics[weekNumber] = { present: 0, absent: 0, late: 0 };
    }

    if (item.is_absent) {
      weekMetrics[weekNumber].absent++;
    } else {
      weekMetrics[weekNumber].present++;
    }

    if (item.is_late) {
      weekMetrics[weekNumber].late++;
    }
  });

  return weekMetrics;
};

const AttendanceReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const currentMonth = format(new Date(), "MMMM yyyy");
  const [attendanceHistoryLoading, setAttendanceHistoryLoading] =
    useState(false);
  const [cardsData, setCardsData] = useState({
    totalAbsent: 0,
    totalLate: 0,
    totalCheckins: 0,
    totalOvertimeHours: 0,
    totalWorkingHours: 0,
    absentPercentage: 0,
    latePercentage: 0,
    checkinPercentage: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    presentData: [],
    absentData: [],
    lateData: []
  })
  const [filterData, setFilterData] = useState({
    employee_id: id,
    date_range:
      moment().startOf("month").format("YYYY-MM-DD") +
      "," +
      moment().endOf("month").format("YYYY-MM-DD"),
  });
  const { toPDF, targetRef } = usePDF({
    filename: "my-attendance.pdf",
    page: {
      format: "A4",
      orientation: "portrait",
      margin: 10,
    },
    scale: 0.95,
  });

  const getAttendanceList = async () => {
    setAttendanceHistoryLoading(true);
    const attendanceData = await getAttendance({
      filterData: filterData,
    });
    if (attendanceData) {
      const weekMetrics = processData(attendanceData?.results);

  const labels = Object.keys(weekMetrics).map((week) => `Week ${week}`);
  const presentData = Object.values(weekMetrics).map((week) => week.present);
  const absentData = Object.values(weekMetrics).map((week) => week.absent);
  const lateData = Object.values(weekMetrics).map((week) => week.late);

  setChartData({
    labels: labels,
    presentData: presentData,
    absentData: absentData,
    lateData: lateData
  })
  console.log(labels, presentData, "HELLo")

      const totalEntries = attendanceData?.results?.length;
      const totalAbsent = attendanceData?.results.filter(
        (entry) => entry.is_absent
      ).length;
      const totalLate = attendanceData?.results.filter(
        (entry) => entry.is_late
      ).length;
      const totalCheckins = attendanceData?.results.filter(
        (entry) => entry.checkin
      ).length;
      const totalOvertimeHours = attendanceData?.results
        ?.reduce((sum, entry) => sum + parseFloat(entry.overtime_hours), 0)
        .toFixed(2);
      const totalWorkingHours = attendanceData?.results
        ?.reduce((sum, entry) => sum + parseFloat(entry.payable_hours), 0)
        .toFixed(2);

      const absentPercentage = ((totalAbsent / totalEntries) * 100).toFixed(2);
      const latePercentage = ((totalLate / totalEntries) * 100).toFixed(2);
      const checkinPercentage = ((totalCheckins / totalEntries) * 100).toFixed(
        2
      );

      setCardsData({
        totalAbsent: totalAbsent,
        totalLate: totalLate,
        totalCheckins: totalCheckins,
        totalOvertimeHours: totalOvertimeHours,
        totalWorkingHours: totalWorkingHours,
        absentPercentage: absentPercentage,
        latePercentage,
        checkinPercentage,
      });
      setAttendanceData(attendanceData.results);
    }
    setAttendanceHistoryLoading(false);
  };

  

  useEffect(() => {
    getAttendanceList();
  }, [id]);

  const downloadPDF = () => {
    const noPrintElements = document.querySelectorAll(".no-print");

    // Hide no-print elements before generating the PDF
    noPrintElements.forEach((el) => (el.style.display = "none"));

    // Generate the PDF
    toPDF().then(() => {
      // Show no-print elements after PDF is generated
      noPrintElements.forEach((el) => (el.style.display = ""));
    });
  };

  const columns = [
    { text: "Date", dataField: "date",  formatter: (cell)=> <>{`${renderDate(cell)}`}</>},
    {
      text: "Check In",
      dataField: "checkin",
      formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
    },
    {
      text: "Check Out",
      dataField: "checkout",
      formatter: (cell) =>
        cell ? <span>{moment(cell).format("h:mm A")}</span> : "Not Checked Out",
    },
    { text: "Break", dataField: "break_duration" },
    { text: "Overtime", dataField: "overtime_hours" },
    { text: "Productivity", dataField: "payable_hours" },
    { text: "Status", dataField: "status" },
  ];

  const barChartData = {
    labels: chartData?.labels,
    datasets: [
      {
        label: "Present Days",
        data: chartData?.presentData,
        backgroundColor: "#34D399",
      },
      {
        label: "Absent Days",
        data: chartData?.absentData,
        backgroundColor: "#F87171",
      },
      {
        label: "Late Arrivals",
        data: chartData?.lateData,
        backgroundColor: "#FBBF24",
      },
    ],
  };

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 text-lg text-balance"
        >
          <ArrowLeft className="w-4 h-4 mr-2 bg-white rounded-lg shadow-sm" />
          Attendance Detail
        </Button>
      </div>
      <div className="p-6 space-y-6 bg-white" ref={targetRef}>
        <CardHeader className="py-2 text-white bg-plum-400">
          <div className="flex items-center justify-between">
            <Newlogo />
          </div>
        </CardHeader>
        <header className="flex flex-col items-start space-y-2">
          <h2 className="pb-2 text-xl font-semibold border-b text-slate-1200">
            Attendance for the month of{" "}
            <span className="text-plum-900">{currentMonth}</span>
          </h2>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              title: "Present Days",
              value: cardsData?.totalCheckins || 0,
              description: `${cardsData?.checkinPercentage}% attendance`,
              color: "#34D399",
            },
            {
              title: "Absent Days",
              value: cardsData?.totalAbsent || 0,
              description: `${cardsData?.absentPercentage}% absence`,
              color: "#F87171",
            },
            {
              title: "Late Arrivals",
              value: cardsData?.totalLate || 0,
              description: `${cardsData?.latePercentage}% late`,
              color: "#FBBF24",
            },
            {
              title: "Overtime Hours",
              value: cardsData?.totalOvertimeHours || 0,
              description: "This month",
              color: "#A78BFA",
            },
            {
              title: "Working Hours",
              value: cardsData?.totalWorkingHours || 0,
              description: "This month",
              color: "#7C3AED",
            },
          ].map((card, index) => (
            <Card key={index} className="p-4">
              <CardHeader>
                <h3
                  className="text-lg font-medium"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-gray-900">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Overview Chart */}
        <div className="bg-white p-6 rounded-md shadow">
          <h3 className="text-lg font-medium mb-4">Attendance Overview</h3>
          <Bar data={barChartData} />
        </div>

        {/* Daily Attendance Log */}
        <div className="bg-white p-6 rounded-md shadow">
          <h3 className="text-lg font-medium mb-4">Daily Attendance Log</h3>
          <TableCustom
            data={attendanceData}
            columns={columns}
            pagination={false}
          />
        </div>
        <CardFooter className="flex justify-end py-2 no-print">
          <Button onClick={downloadPDF} className="px-3 py-1">
            Download PDF
          </Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default AttendanceReport;
