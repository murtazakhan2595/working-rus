import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/@/components/ui/table";
import { Progress } from "../../../src/@/components/ui/progress";
import { CalendarIcon, FilterIcon, PlayCircle } from "lucide-react";
import moment from "moment";
import {
  getShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { calculateBreak } from "app/hooks/attendance";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { getLocalTime } from "app/hooks/attendance";
import { getStats } from "app/hooks/attendance";
import { useNavigate } from "react-router-dom";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";

const Attendance = () => {
  // const navigate = useNavigate();
  // navigate("/attendance/502");
  return (
    <div className="bg-white">
      <div className="p-6 flex bg-gray-100 gap-4">
        <LeaveStatusOverview/>
        <StatisticsChart/>
        <DepartmentOverview/>
      </div>

      <div>
         <StatsCards/>
      </div>
      {/* // <div className="p-4 space-y-4">
        //   <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        //     <EmployeeSelfTimesheet
        //       employeeShift={employeeShift}
        //       attendance={attendance}
        //       startShift={startShift}
        //       pauseShift={pauseShift}
        //       endShift={endShift}
        //       OnBreak={onBreak}
        //     />

        //     <Card>
        //       <CardHeader>
        //         <CardTitle className="text-plum-900">Statistics</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="space-y-4">
        //           {stats.map((item) => (
        //             <div key={item.label}>
        //               <div className="flex justify-between mb-1">
        //                 <span className="text-slate-900">{item.label}</span>
        //                 <span>
        //                   <span className="text-slate-1200">{item.value}</span>/
        //                   {item.total} hrs
        //                 </span>
        //               </div>
        //               <Progress
        //                 value={
        //                   (parseFloat(item.value) / parseFloat(item.total)) *
        //                   100
        //                 }
        //                 className="h-2"
        //               />
        //             </div>
        //           ))}
        //         </div>
        //       </CardContent>
        //     </Card>

        //     <Card>
        //       <CardHeader>
        //         <CardTitle className="text-plum-900">
        //           Recent Activities
        //         </CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="space-y-4">
        //           {[
        //             {
        //               time: "10:30 am",
        //               activity: "Check in",
        //               description: "Back",
        //             },
        //             {
        //               time: "10:10 am",
        //               activity: "Check out",
        //               description: "Away for Bank",
        //             },
        //             {
        //               time: "09:10 am",
        //               activity: "Check In",
        //               description: "Start Working",
        //             },
        //           ].map((item, index) => (
        //             <div
        //               key={index}
        //               className="flex items-center justify-between"
        //             >
        //               <div>
        //                 <div>{item.time}</div>
        //                 <div className="text-slate-900">{item.description}</div>
        //               </div>
        //               <div className="text-slate-900">{item.activity}</div>
        //             </div>
        //           ))}
        //         </div>
        //       </CardContent>
        //     </Card>
        //   </div>

        //   <Card>
        //     <CardHeader>
        //       <CardTitle className="flex items-center justify-between">
        //         <span className="text-plum-900">Attendance History</span>
        //       </CardTitle>
        //     </CardHeader>
        //     <CardContent>
        //       <Table>
        //         <TableHeader>
        //           <TableRow>
        //             <TableHead>S. No</TableHead>
        //             <TableHead>Date</TableHead>
        //             <TableHead>Punch In</TableHead>
        //             <TableHead>Punch Out</TableHead>
        //             <TableHead>Break</TableHead>
        //             <TableHead>Overtime</TableHead>
        //             <TableHead>Productivity</TableHead>
        //           </TableRow>
        //         </TableHeader>
        //         <TableBody>
        //           {attendanceData.map((row, index) => (
        //             <TableRow
        //               key={index}
        //               className={index % 2 === 1 ? "bg-purple-50" : ""}
        //             >
        //               <TableCell>
        //                 {(index + 1).toString().padStart(2, "0")}
        //               </TableCell>
        //               <TableCell>
        //                 {row.date
        //                   ? new Date(row.date).toLocaleDateString("en-GB") // or 'en-US' based on your preference
        //                   : "No Date"}
        //               </TableCell>
        //               <TableCell>
        //                 {moment(attendance?.checkin).format("h:mm A")}
        //               </TableCell>
        //               <TableCell>
        //                 {row.checkout
        //                   ? moment(row?.checkout.replace("Z","")).format("h:mm A")
        //                   : "Not Checked Out"}
        //               </TableCell>
        //               <TableCell>{row.break_duration || 0.0} hrs</TableCell>
        //               <TableCell>{row.overtime_hours || 0.0} hrs</TableCell>
        //               <TableCell>{row.payable_hours || 0.0} hrs</TableCell>
        //             </TableRow>
        //           ))}
        //         </TableBody>
        //       </Table>
        //     </CardContent>
        //   </Card>
        // </div> */}
    </div>
  );
};

export default Attendance;
