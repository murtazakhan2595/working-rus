// src/app/modules/Attendance/ShiftCalendar/Section/ScheduleShift.jsx
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ScheduleShiftModal from "../Modals/ScheduleShiftModal";
import { toast } from "react-toastify";

const ScheduleShift = ({ employees = [] }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);

  const handleDateSelect = (selectInfo) => {
    // Get selected date range
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;

    setSelectedDates({ start: startDate, end: endDate });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDates([]);
  };

  const handleScheduleSave = (scheduleData) => {
    // This would normally call an API to save the shift schedule
    console.log("Schedule data to save:", scheduleData);

    // For now, just update the UI
    const newEvents = scheduleData.employees.flatMap((employeeId) => {
      const employeeInfo = employees.find((emp) => emp.id === employeeId);
      return scheduleData.dates.map((date) => ({
        title: `${employeeInfo?.first_name || "Employee"} ${
          scheduleData.isOff
            ? "OFF"
            : scheduleData.customShift
            ? `${scheduleData.startTime}-${scheduleData.endTime}`
            : scheduleData.shiftName
        }`,
        start: date,
        allDay: true,
        backgroundColor: scheduleData.isOff ? "#3b82f6" : "#22c55e", // Blue for OFF, Green for working
        borderColor: scheduleData.isOff ? "#3b82f6" : "#22c55e",
        employeeId: employeeId,
      }));
    });

    setScheduleEvents([...scheduleEvents, ...newEvents]);
    toast.success("Shifts scheduled successfully!");
    handleModalClose();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Schedule Employee Shifts</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>Schedule Shift</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[700px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              initialView="dayGridMonth"
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={scheduleEvents}
              select={handleDateSelect}
            />
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <ScheduleShiftModal
          isOpen={isModalOpen}
          setIsOpen={handleModalClose}
          selectedDates={selectedDates}
          employees={employees}
          onSave={handleScheduleSave}
        />
      )}
    </div>
  );
};

export default ScheduleShift;
