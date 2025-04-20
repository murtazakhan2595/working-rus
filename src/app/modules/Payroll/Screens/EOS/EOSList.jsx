import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "src/@/components/ui/table";
import { PageLoader } from "components";
import { BadgeCheck, CheckCircle, Clock, Eye } from "lucide-react";
import { getEOSEmployees } from "app/utils/MockData/payrollEOSMockData";
import { Badge } from "components/ui/badge";

const EOSList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEOSEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEOSEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching EOS employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEOSEmployees();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/payroll/eos/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <div className="flex items-center px-3 py-1 text-blue-600 ">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Approved</span>
          </div>
        );
      case "Paid":
        return (
          <div className="flex items-center px-3 py-1 text-green-600 ">
            <BadgeCheck className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Paid</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 text-amber-600">
            <Clock className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Pending</span>
          </div>
        );
    }
  };


  const getTypeLabel = (type) => {
    switch (type) {
      case "Resigned":
        return <span className="text-amber-600">Resigned</span>;
      case "Terminated":
        return <span className="text-red-600">Terminated</span>;
      default:
        return <span>{type}</span>;
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary-1100">End of Service</h2>
        <p className="text-sm text-gray-1100">
          View and manage end of service calculations for employees who have resigned or been terminated
        </p>
      </div>

      <div className="overflow-hidden bg-white border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell className="font-medium">{employee.employeeName}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>{employee.nationality}</TableCell>
                  <TableCell>{getTypeLabel(employee.type)}</TableCell>
                  <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(employee.id)}
                      className="flex items-center space-x-1 text-green-600"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                  No EOS records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EOSList; 