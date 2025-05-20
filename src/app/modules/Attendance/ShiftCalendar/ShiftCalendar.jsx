// src/app/modules/Attendance/ShiftManagement/Sections/ShiftCalendar.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useSelector } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import ShiftCalendarView from "./Section/ShiftCalendar";

const ShiftCalendar = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userProfile = useSelector((state) => state.user.userProfile);

  // Mock shift data (replace with API call later)
  const [employeeShifts, setEmployeeShifts] = useState({
    101: [
      {
        date: "2025-05-20",
        is_off: false,
        start_time: "2025-05-20T09:00:00",
        end_time: "2025-05-20T18:00:00",
      },
      {
        date: "2025-05-21",
        is_off: false,
        start_time: "2025-05-21T09:00:00",
        end_time: "2025-05-21T18:00:00",
      },
      { date: "2025-05-22", is_off: true },
      {
        date: "2025-05-23",
        is_off: false,
        start_time: "2025-05-23T09:00:00",
        end_time: "2025-05-23T18:00:00",
      },
      {
        date: "2025-05-24",
        is_off: false,
        start_time: "2025-05-24T09:00:00",
        end_time: "2025-05-24T18:00:00",
      },
    ],
    102: [
      {
        date: "2025-05-20",
        is_off: false,
        start_time: "2025-05-20T10:00:00",
        end_time: "2025-05-20T19:00:00",
      },
      {
        date: "2025-05-21",
        is_off: false,
        start_time: "2025-05-21T10:00:00",
        end_time: "2025-05-21T19:00:00",
      },
      {
        date: "2025-05-22",
        is_off: false,
        start_time: "2025-05-22T10:00:00",
        end_time: "2025-05-22T19:00:00",
      },
      { date: "2025-05-23", is_off: true },
      { date: "2025-05-24", is_off: true },
    ],
  });

  useEffect(() => {
    // Fetch employees under this manager
    const fetchEmployees = async () => {
      try {
        const response = await getEmployeeCustomList({
          filterData: { direct_report: userProfile.id },
        });
        if (response && response.results) {
          setEmployees(response.results);
          setFilteredEmployees(response.results);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [userProfile.id]);

  useEffect(() => {
    // Filter employees based on search query
    if (searchQuery) {
      const filtered = employees.filter(
        (emp) =>
          `${emp.first_name} ${emp.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          emp.id.toString().includes(searchQuery)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shift Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 border-r pr-4">
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedEmployee?.id === employee.id
                        ? "bg-primary-50 text-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    {employee.first_name} {employee.last_name}
                  </div>
                ))}

                {filteredEmployees.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No employees found
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-3">
              {selectedEmployee ? (
                <div>
                  <h3 className="font-medium mb-4 text-lg">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}'s
                    Schedule
                  </h3>

                  <ShiftCalendarView
                    shifts={employeeShifts[selectedEmployee.id] || []}
                    employeeName={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                    editable={false}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-[500px] bg-gray-50 rounded-md border text-gray-500">
                  Select an employee to view their shift calendar
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftCalendar;
