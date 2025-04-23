import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "src/@/components/ui/table";
import { PageLoader } from "components";
import { BadgeCheck, CheckCircle, Clock, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeExitRequests } from "state/slices/ExitEmployeeSlice";
import { EmployeeOverview } from "components";
import { DepartmentName, ManagerName } from "utils/getValuesFromTables";

const EOSList = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const allEmployees = useSelector((state) => state.emp.employees);
  const eosData = useSelector((state) => state.exit_emp?.exitRequests || []);
  const isEosLoading = useSelector((state) => state.exit_emp?.loading);
  const error = useSelector((state) => state.exit_emp?.error);
  
  // Check if departments and managers are loaded in Redux store
  const departments = useSelector((state) => state.common?.departments);
  const managers = useSelector((state) => state.emp?.reportingManagers);
  
  useEffect(() => {
    dispatch(fetchEmployeeExitRequests())
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching EOS data: " + error);
    }
  }, [error]);

  useEffect(() => {
    if (eosData.length > 0) {
      console.log("Payroll/EOS - EOS Data Sample:", eosData[0]);
    }
  }, [eosData]);

  const handleViewDetails = (id) => {
    navigate(`/payroll/eos/${id}`);
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
    const formattedType = typeof type === 'string' ? type.toLowerCase() : '';
    
    if (formattedType.includes('resign')) {
      return <span className="text-amber-600">Resigned</span>;
    } else if (formattedType.includes('termin')) {
      return <span className="text-red-600">Terminated</span>;
    } else {
      return <span>{type}</span>;
    }
  };

  // Check if required data is loaded
  if (loading || isEosLoading) {
    return <PageLoader />;
  }

  // Check if department and managers data exists in Redux store
  const isDataLoaded = departments && departments.length > 0 && 
                        managers && managers.length > 0;

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
              <TableHead>Employee</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">ID</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Department</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Report To</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Notice Period</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Last Working Date</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Offboarding Type</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Status</TableHead>
              <TableHead className="text-sm text-center text-gray-1100">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eosData.length > 0 ? (
              eosData.map((employee) => {
                const empId = employee.employee_id || employee.emp_id;
                const departmentId = parseInt(employee.department_id || employee.department) || null;
                const managerId = employee.report_to || employee.manager_id;
                
                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <EmployeeOverview 
                        id={empId} 
                        showPosition={true} 
                        showDepartment={false} 
                      />
                    </TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">{employee.serial_number || empId}</TableCell>
                    <TableCell className="text-sm text-center text-gray-1100 ">
                      <DepartmentName value={employee?.department_name} />
                    </TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">
                      <ManagerName value={managerId} />
                    </TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">{employee.notice_period || '1 month'}</TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">{employee.exit_date || 'N/A'}</TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">
                      {getTypeLabel(employee.exit_category || employee.type || 'N/A')}
                    </TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">{renderStatusBadge(employee.status || "Pending")}</TableCell>
                    <TableCell className="text-sm text-center text-gray-1100">
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-gray-500">
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