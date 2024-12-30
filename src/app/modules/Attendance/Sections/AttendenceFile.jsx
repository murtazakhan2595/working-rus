// // Import necessary libraries and components
// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Card, CardHeader, CardContent, CardFooter } from "components/ui/card";
// import { Bar } from "react-chartjs-2";
// import Newlogo from "assets/images/NewLogo";
// import { Button } from "components/ui/button";
// import { usePDF } from "react-to-pdf";
// import TableCustom from "components/CustomTable";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const AttendanceReport = () => {
//   const navigate = useNavigate()
//   const { toPDF, targetRef } = usePDF({
//     filename: "my-attendance.pdf",
//     page: {
//       format: "A4",
//       orientation: "portrait",
//       margin: 10,
//     },
//     scale: 0.95,
//   });

//   const downloadPDF = () => {
//     const noPrintElements = document.querySelectorAll(".no-print");

//     // Hide no-print elements before generating the PDF
//     noPrintElements.forEach((el) => (el.style.display = "none"));

//     // Generate the PDF
//     toPDF().then(() => {
//       // Show no-print elements after PDF is generated
//       noPrintElements.forEach((el) => (el.style.display = ""));
//     });
//   };

//   const columns = [
//     { text: "Date", dataField: "date" },
//     { text: "Check In", dataField: "checkIn" },
//     { text: "Check Out", dataField: "checkOut" },
//     { text: "Break", dataField: "break" },
//     { text: "Overtime", dataField: "overtime" },
//     { text: "Productivity", dataField: "productivity" },
//     { text: "Status", dataField: "status" },
//   ];

//   const chartData = {
//     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     datasets: [
//       {
//         label: "Present Days",
//         data: [5, 4, 6, 3],
//         backgroundColor: "#34D399",
//       },
//       {
//         label: "Absent Days",
//         data: [1, 0, 1, 0],
//         backgroundColor: "#F87171",
//       },
//       {
//         label: "Late Arrivals",
//         data: [0, 1, 0, 0],
//         backgroundColor: "#FBBF24",
//       },
//     ],
//   };

//   const attendanceData = [
//     {
//       date: "Sep 4, 2024",
//       checkIn: "09:30 am",
//       checkOut: "Working",
//       break: "1.5 hrs",
//       overtime: "1 hr",
//       productivity: "9 hrs",
//       status: "Present",
//     },
//     {
//       date: "Sep 3, 2024",
//       checkIn: "09:05 am",
//       checkOut: "17:55 pm",
//       break: "1.5 hrs",
//       overtime: "0",
//       productivity: "8 hrs",
//       status: "Present",
//     },
//     {
//       date: "Sep 2, 2024",
//       checkIn: "09:01 am",
//       checkOut: "17:51 pm",
//       break: "1 hr",
//       overtime: "0",
//       productivity: "8 hrs",
//       status: "Present",
//     },
//     {
//       date: "Sep 1, 2024",
//       checkIn: "--",
//       checkOut: "--",
//       break: "--",
//       overtime: "--",
//       productivity: "--",
//       status: "Off Day",
//     },
//   ];

//   return (
//     <div>
//             <div className="mb-4">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="p-2 text-lg text-balance"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2 bg-white rounded-lg shadow-sm" />
//           Attendance Detail
//         </Button>
//       </div>
//       <div  className="p-6 space-y-6 bg-white" ref={targetRef}>

//       <CardHeader className="py-2 text-white bg-plum-400">
//         <div className="flex items-center justify-between">
//           <Newlogo />
//         </div>
//       </CardHeader>
//       <header className="flex flex-col items-start space-y-2">
//         {/* <h1 className="text-3xl font-bold">Cohurs</h1>
//         <p className="text-gray-500">Karachi, Pakistan</p> */}
//         <h2 className="pb-2 text-xl font-semibold border-b text-slate-1200">
//           Attendance for the month of{" "}
//           <span className="text-plum-900">December 2024</span>
//         </h2>
//       </header>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         {[
//           {
//             title: "Present Days",
//             value: 17,
//             description: "85% attendance",
//             color: "#34D399",
//           },
//           {
//             title: "Absent Days",
//             value: 2,
//             description: "10% absence",
//             color: "#F87171",
//           },
//           {
//             title: "Late Arrivals",
//             value: 1,
//             description: "5% late",
//             color: "#FBBF24",
//           },
//           {
//             title: "Overtime Hours",
//             value: 3,
//             description: "This month",
//             color: "#A78BFA",
//           },
//           {
//             title: "Working Hours",
//             value: 136,
//             description: "This month",
//             color: "#7C3AED",
//           },
//         ].map((card, index) => (
//           <Card key={index} className="p-4">
//             <CardHeader>
//               <h3 className="text-lg font-medium" style={{ color: card.color }}>
//                 {card.title}
//               </h3>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{card.value}</p>
//               <p className="text-gray-900">{card.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Attendance Overview Chart */}
//       <div className="bg-white p-6 rounded-md shadow">
//         <h3 className="text-lg font-medium mb-4">Attendance Overview</h3>
//         <Bar data={chartData} />
//       </div>

//       {/* Daily Attendance Log */}
//       <div className="bg-white p-6 rounded-md shadow">
//         <h3 className="text-lg font-medium mb-4">Daily Attendance Log</h3>
//         <TableCustom
//           data={attendanceData}
//           columns={columns}
//           pagination={false}
//         />
//       </div>
//       <CardFooter className="flex justify-end py-2 no-print">
//         <Button onClick={downloadPDF} className="px-3 py-1">
//           Download PDF
//         </Button>
//       </CardFooter>
//       </div>
//     </div>
//   );
// };

// export default AttendanceReport;
