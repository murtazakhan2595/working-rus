// src/app/modules/Attendance/ShiftCalendar/Section/ShiftRequest.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import ShiftRequestModal from "../Modals/ShiftRequestModal";
import TableCustom from "components/CustomTable";
import { SelectInputComponent } from "components/FormControl";
import { toast } from "react-toastify";
import ViewRequestModal from "../Modals/ViewRequestModal";
import PageLoader from "components/PageLoader";

const ShiftRequest = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [changeRequests, setChangeRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const userProfile = useSelector((state) => state.user.userProfile);

  // Mock employee shifts (replace with API call later)
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

  // Handle pagination
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Mock change requests (replace with API call later)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setChangeRequests([
        {
          id: 1,
          employee_id: 101,
          employee_name: "John Doe",
          request_date: "2025-05-15",
          shift_date: "2025-05-20",
          current_shift: "9:00 AM - 6:00 PM",
          requested_shift: "10:00 AM - 7:00 PM",
          is_off_current: false,
          is_off_requested: false,
          requested_by: "Branch Manager",
          status: "Pending",
        },
        {
          id: 2,
          employee_id: 102,
          employee_name: "Jane Smith",
          request_date: "2025-05-16",
          shift_date: "2025-05-23",
          current_shift: "OFF",
          requested_shift: "10:00 AM - 7:00 PM",
          is_off_current: true,
          is_off_requested: false,
          requested_by: "Employee",
          status: "Approved",
        },
        {
          id: 3,
          employee_id: 101,
          employee_name: "John Doe",
          request_date: "2025-05-14",
          shift_date: "2025-05-21",
          current_shift: "9:00 AM - 6:00 PM",
          requested_shift: "OFF",
          is_off_current: false,
          is_off_requested: true,
          requested_by: "Employee",
          status: "Rejected",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

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

  const handleRequestShiftChange = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first");
      return;
    }
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = (requestData) => {
    // This would call the API to submit the request
    toast.success("Shift change request submitted successfully!");
    setIsRequestModalOpen(false);

    // Add the request to the list (normally this would be handled by re-fetching)
    const newRequest = {
      id: Date.now(), // Temporary ID
      employee_id: selectedEmployee.id,
      employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      request_date: new Date().toISOString().split("T")[0],
      shift_date: requestData.date,
      current_shift: requestData.is_current_off
        ? "OFF"
        : `${requestData.current_start_time} - ${requestData.current_end_time}`,
      requested_shift: requestData.is_requested_off
        ? "OFF"
        : `${requestData.requested_start_time} - ${requestData.requested_end_time}`,
      is_off_current: requestData.is_current_off,
      is_off_requested: requestData.is_requested_off,
      requested_by: "Branch Manager",
      status: "Pending",
    };

    setChangeRequests([newRequest, ...changeRequests]);
  };

  const handleViewRequest = (row) => {
    setSelectedRequest(row);
    setIsViewModalOpen(true);
  };

  const handleApproveRequest = (requestId) => {
    // This would call the API to approve the request
    toast.success("Request approved successfully!");

    // Update the status in the UI
    setChangeRequests(
      changeRequests.map((req) =>
        req.id === requestId ? { ...req, status: "Approved" } : req
      )
    );

    setIsViewModalOpen(false);
  };

  const handleRejectRequest = (requestId, reason) => {
    // This would call the API to reject the request
    toast.success("Request rejected successfully!");

    // Update the status in the UI
    setChangeRequests(
      changeRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: "Rejected", rejection_reason: reason }
          : req
      )
    );

    setIsViewModalOpen(false);
  };

  // Filter change requests based on status
  const filteredRequests = statusFilter
    ? changeRequests.filter((req) => req.status === statusFilter)
    : changeRequests;

  // Define columns for the table
  const requestColumns = [
    {
      dataField: "employee_name",
      text: "Employee",
    },
    {
      dataField: "shift_date",
      text: "Shift Date",
    },
    {
      dataField: "current_shift",
      text: "Current Shift",
    },
    {
      dataField: "requested_shift",
      text: "Requested Shift",
    },
    {
      dataField: "requested_by",
      text: "Requested By",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => (
        <span
          className={`px-2 py-1 rounded-full text-center text-sm font-medium inline-block w-24
          ${
            cell === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : cell === "Approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {cell}
        </span>
      ),
    },
    {
      text: "Actions",
      formatter: (cell, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewRequest(row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className="mt-4">
              <Button
                className="w-full"
                onClick={handleRequestShiftChange}
                disabled={!selectedEmployee}
              >
                Request Shift Change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shift Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <SelectInputComponent
                name="statusFilter"
                placeholder="Filter by Status"
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                ]}
                value={statusFilter}
                onChange={(name, value) => setStatusFilter(value)}
              />
            </div>

            {loading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={requestColumns}
                data={filteredRequests}
                pagination={true}
                dataTotalSize={filteredRequests.length}
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {isRequestModalOpen && (
        <ShiftRequestModal
          isOpen={isRequestModalOpen}
          setIsOpen={setIsRequestModalOpen}
          employee={selectedEmployee}
          employeeShifts={employeeShifts[selectedEmployee?.id] || []}
          onSubmit={handleSubmitRequest}
        />
      )}

      {isViewModalOpen && selectedRequest && (
        <ViewRequestModal
          isOpen={isViewModalOpen}
          setIsOpen={setIsViewModalOpen}
          request={selectedRequest}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default ShiftRequest;
