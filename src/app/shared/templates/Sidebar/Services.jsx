
import { Award, CalendarClockIcon, CalendarRange, Crosshair, FileChartColumnIncreasing, ListTodo, UserRoundCheck, UserRoundSearch, UsersRound } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../../../src/@/components/ui/card"
import React from 'react';
import { Header } from "components";
import { Link } from "react-router-dom";



const ServicesList = [
  { icon: UsersRound, label: "People Team", description: "Manage your team's profiles, roles, and organizational structure", path: "/people-team" },
  { icon: UserRoundCheck, label: "Self Service", description: "Enable employees to access and update their own information.", path: "/self-service" },
  { icon: UserRoundSearch, label: "Talent Spere", description: "Attract, hire, and retain the best talent for your organization.", path: "/talent-spere" },
  { icon: ListTodo, label: "Task Management", description: "Assign tasks, track progress, and collaborate on projects.", path: "/task-management" },
  { icon: CalendarClockIcon, label: "Pay and Attendance", description: "Manage employee payroll, timesheets, and attendance records.", path: "/pay-attendance" },
  { icon: Crosshair, label: "People Engagement", description: "Foster a positive work culture and improve employee satisfaction.", path: "/people-engagement" },
  { icon: UsersRound, label: "Personal Development", description: "Provide learning opportunities and track employee growth.", path: "/personal-development" },
  { icon: CalendarRange, label: "Leave Tracker", description: "Manage employee leave requests and time off policies.", path: "/leave-tracker" },
  { icon: Award, label: "Performance", description: "Manage employee performance and track employee growth.", path: "/performance" },
  { icon: FileChartColumnIncreasing, label: "Reports", description: "Generate comprehensive reports on employee performance.", path: "/reports" },
];
const ServicesCards = () => {
  return (
    <div className="screen services">
      <Header />
      <div className="flex flex-wrap">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {ServicesList.map((service, index) => (
            <Link to={service.path} key={index}>
              <Card>
                <CardHeader>
                  <service.icon className="w-8 h-8 text-plum-1000" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="text-slate-1200">{service.label}</CardTitle>
                  <CardDescription className="text-slate-1000">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesCards;