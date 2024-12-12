import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../src/@/components/ui/table";
import { Progress } from "../../../src/@/components/ui/progress";
import { CalendarIcon, FilterIcon, PlayCircle } from "lucide-react";
import AttendanceReport from './Sections/AttendenceFile';

const Attendance = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-plum-900">Timesheet</span>
              <span className="text-sm text-slate-1200">Sep/5/2024</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-1200">Punch in at</span>
                <span>Sep/23/2024 at 09:10 am</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-1200">Shift Time</span>
                <span>09 am - 6:00 pm</span>
              </div>
              <div className="flex items-center justify-center mt-4">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-plum-900"
                      strokeWidth="5"
                      strokeDasharray={365}
                      strokeDashoffset={365 * 0.55}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <div className="absolute text-2xl font-bold transform -translate-x-1/2 -translate-y-1/2 text-plum-900 top-1/2 left-1/2">
                    4.45
                  </div>
                </div>
                <PlayCircle className="w-8 h-8 ml-4 text-plum-900" />
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <div className="text-slate-1200">Break</div>
                  <div>1.5 hrs</div>
                </div>
                <div>
                  <div className="text-slate-1200">Overtime</div>
                  <div>0 hrs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-plum-900">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Today", value: "4.45", total: "8" },
                { label: "This Week", value: "25", total: "40" },
                { label: "This Month", value: "48.15", total: "160" },
                { label: "Remaining", value: "111.85", total: "160" },
                { label: "Overtime", value: "5", total: "160" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-900">{item.label}</span>
                    <span>
                      <span className="text-slate-1200">{item.value}</span>/{item.total} hrs
                    </span>
                  </div>
                  <Progress value={(parseFloat(item.value) / parseFloat(item.total)) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-plum-900">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10:30 am", activity: "Check in", description: "Back" },
                { time: "10:10 am", activity: "Check out", description: "Away for Bank" },
                { time: "09:10 am", activity: "Check In", description: "Start Working" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div>{item.time}</div>
                    <div className="text-slate-900">{item.description}</div>
                  </div>
                  <div className="text-slate-900">{item.activity}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-plum-900">Attendance History</span>
           
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S. No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Punch In</TableHead>
                <TableHead>Punch Out</TableHead>
                <TableHead>Break</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Productivity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { date: "Sep 4, 2024", punchIn: "09:10 am", punchOut: "19:45 pm", break: "1.5 hrs", overtime: "1 hr", productivity: "9.5 hrs" },
                { date: "Sep 3, 2024", punchIn: "09:05 am", punchOut: "17:55 pm", break: "1.5 hrs", overtime: "0", productivity: "8 hrs" },
                { date: "Sep 2, 2024", punchIn: "09:01 am", punchOut: "17:51 pm", break: "1 hrs", overtime: "0", productivity: "8 hrs" },
                { date: "Sep 2, 2024", punchIn: "09:01 am", punchOut: "17:51 pm", break: "1 hrs", overtime: "0", productivity: "8 hrs" },
              ].map((row, index) => (
                <TableRow key={index} className={index % 2 === 1 ? "bg-purple-50" : ""}>
                  <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.punchIn}</TableCell>
                  <TableCell>{row.punchOut}</TableCell>
                  <TableCell>{row.break}</TableCell>
                  <TableCell>{row.overtime}</TableCell>
                  <TableCell>{row.productivity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    // <AttendanceReport/>
  );
};

export default Attendance;