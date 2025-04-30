import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { PageLoader } from "components";
import { BadgeCheck, CheckCircle, Clock, Eye, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeExitRequests } from "state/slices/ExitEmployeeSlice";
import { fetchDepartments } from "state/slices/CommonSlice";
import { EmployeeOverview } from "components";
import { DepartmentName, ManagerName } from "utils/getValuesFromTables";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import TableCustom from "components/CustomTable";
import { Card, CardContent } from "components/ui/card";
import { getDepartmentList, getManagersList } from "app/hooks/general";
import { initialState as userInitialState } from 'state/slices/UserSlice';
import axios from "axios";

// Get baseUrl from user initial state
const baseUrl = userInitialState.baseUrl;

// Headers function for API requests
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// API Service functions
const updateEOSStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${baseUrl}/payroll/payroll/${id}/status/`, { status }, {
      headers: headers(),
    });
    return { success: true, message: `Status updated to ${status} successfully`, data: response.data };
  } catch (error) {
    return { success: false, message: "Failed to update status: " + (error.response?.data?.message || error.message) };
  }
};

// Add a new API function to check if EOS data exists for an employee
const checkEOSDataExists = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/payroll/payroll/${id}/`, {
      headers: headers(),
    });
    return { exists: true, data: response.data };
  } catch (error) {
    return { exists: false, error: error.message };
  }
};

// Define status options for the filter dropdown
const eosStatusOptions = [
  { value: "", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Paid", label: "Paid" },
];

// Define exit type options for the filter dropdown
const exitTypeOptions = [
  { value: "", label: "All Types" },
  { value: "Resignation", label: "Resigned" },
  { value: "Termination", label: "Terminated" },
  // Add other types if they exist
];

// Create a separate component for the action buttons
const ActionCell = ({ cell, row, onViewDetails, onSetupEOS }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [dataExists, setDataExists] = useState(null);
  
  useEffect(() => {
    const checkData = async () => {
      setActionLoading(true);
      const employeeId = row.employee_id || row.emp_id || cell;
      if (!employeeId) {
         console.warn("Missing employee ID for row:", row);
         setActionLoading(false);
         setDataExists(false);
         return;
      }
      const result = await checkEOSDataExists(employeeId);
      setDataExists(result.exists);
      setActionLoading(false);
    };
    
    checkData();
  }, [cell, row.employee_id, row.emp_id, row.status]);
  
  if (actionLoading) {
    return <span className="text-sm text-gray-500">Checking...</span>;
  }
  
  if (dataExists === true) {
    // If employee already has EOS data, show View Details button
    // And automatically mark as Approved if it's Pending
    if (row.status === "Pending") {
      const employeeId = row.employee_id || row.emp_id || cell;
      updateEOSStatus(employeeId, "Approved")
        .then(response => {
          if (response.success) {
            toast.success("EOS status updated to Approved");
          }
        })
        .catch(error => {
          console.error("Error updating status:", error);
        });
    }
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetails(cell, row)}
        className="flex items-center space-x-1 text-green-600 hover:text-green-700"
        aria-label={`View details for record ${cell}`}
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Button>
    );
  } else {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSetupEOS(cell, row)}
        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        aria-label={`Setup EOS for record ${cell}`}
      >
        <Plus className="w-4 h-4" />
        <span>Setup EOS</span>
      </Button>
    );
  }
};

const EOSList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user info for organization
  const userProfile = useSelector((state) => state.user.userProfile);
  const organizationId = userProfile?.organization;
  
  // State for filters, pagination, and sorting
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id"); // Default sort by ID descending
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [managersList, setManagersList] = useState([]);
  const [payrollExistenceCache, setPayrollExistenceCache] = useState({});
  
  const allEmployees = useSelector((state) => state.emp.employees);
  const eosData = useSelector((state) => state.exit_emp?.exitRequests || []);
  const eosCount = useSelector((state) => state.exit_emp?.count || 0);
  const isEosLoading = useSelector((state) => state.exit_emp?.loading);
  const error = useSelector((state) => state.exit_emp?.error);
  
  // Check if departments and managers are loaded in Redux store
  const departments = useSelector((state) => state.common?.departments);
  const managers = useSelector((state) => state.emp?.reportingManagers);

  // Update filter data with organization ID when it becomes available
  useEffect(() => {
    if (organizationId) {
      setFilterData(prev => ({
        ...prev,
        organization: organizationId
      }));
    }
  }, [organizationId]);

  // Fetch departments directly from API
  const fetchDepartmentsData = async () => {
    if (!organizationId) {
      return;
    }
    
    try {
      // Add organization filter to ensure we only get departments from the correct organization
      const response = await getDepartmentList({
        filterData: { organization: organizationId }
      });
      if (response && response.results) {
        setDepartmentsList(response.results);
      }
    } catch (error) {
      // Silently handle error
    }
  };
  
  // Fetch managers directly from API
  const fetchManagersData = async () => {
    try {
      const response = await getManagersList();
      if (response) {
        setManagersList(response);
      }
    } catch (error) {
      // Silently handle error
    }
  };
  
  // Fetch departments and managers when organizationId changes
  useEffect(() => {
    if (organizationId) {
      fetchDepartmentsData();
      fetchManagersData();
    }
  }, [organizationId]);

  // Effect to check payroll existence for visible employees
  useEffect(() => {
    const checkPayrollForAll = async () => {
      if (!eosData || eosData.length === 0) return;

      const checks = eosData.map(async (item) => {
        const employeeId = item.employee_id || item.emp_id || item.id;
        if (!employeeId || payrollExistenceCache.hasOwnProperty(employeeId)) {
          return { id: employeeId, exists: payrollExistenceCache[employeeId] };
        }
        try {
          const result = await checkEOSDataExists(employeeId);
          return { id: employeeId, exists: result.exists };
        } catch (error) {
          console.error(`Failed to check payroll data for employee ${employeeId}:`, error);
          return { id: employeeId, exists: false };
        }
      });

      const results = await Promise.all(checks);
      const newCache = results.reduce((acc, { id, exists }) => {
        if (id) {
           acc[id] = exists;
        }
        return acc;
      }, { ...payrollExistenceCache });

      setPayrollExistenceCache(newCache);
    };

    checkPayrollForAll();
  }, [eosData]);

  // Handler for page changes (number or size)
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Handler for sort changes
  const onSortChange = (sortName) => {
    if (sortName) {
      setOrdering(sortName);
    }
  };

  // Combine options and sort handler into tableOptions object
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: onSortChange,
  };

  // Handler for general filter changes
  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1); // Reset to page 1 when filter changes
    
    // Update selected values for controlled components
    if (filterName === "department_id") setSelectedDepartment(filterValue);
    if (filterName === "exit_category") setSelectedType(filterValue);

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null || filterValue === undefined) {
        delete updatedFilters[filterName];
      } else {
        // Map frontend filter names to backend expected names if needed
        const mappedValue = filterName === "emp_search" ? 
          { search: filterValue } : 
          { [filterName]: filterValue };
        Object.assign(updatedFilters, mappedValue);
      }
      
      // Always maintain organization filter if available
      if (organizationId) {
        updatedFilters.organization = organizationId;
      }
      
      return updatedFilters;
    });
  };

  // Specific handler for status filter dropdown
  const onStatusChange = (newStatus) => {
    const statusValue = newStatus === "All Statuses" ? "" : newStatus;
    handleFilterChange("status", statusValue);
    setSelectedStatus(newStatus);
  };

  // Specific handler for exit type filter dropdown
  const onTypeChange = (newType) => {
    const typeValue = newType === "All Types" ? "" : newType;
    handleFilterChange("exit_category", typeValue);
    setSelectedType(newType);
  };

  // Effect to fetch data when filters, pagination, or sorting change
  useEffect(() => {
    const payload = {
      options: {
        page: options.page,
        sizePerPage: options.sizePerPage
      },
      filterData,
      ordering
    };
    
    dispatch(fetchEmployeeExitRequests(payload))
      .unwrap()
      .then(response => {
        // Processing happens silently
      })
      .catch((error) => {
        // Error is handled by Redux
      });
  }, [dispatch, options, filterData, ordering, departmentsList, managersList]);
  
  // Format the EOSData with department names directly
  const processedEOSData = eosData.map(record => {
    // Get department name
    let departmentName = null;
    const deptId = record.department_id || record.department;
    
    if (deptId) {
      // Try to find in our fetched list
      const foundDept = departmentsList.find(dept => 
        dept.value === parseInt(deptId) || dept.id === parseInt(deptId)
      );
      
      if (foundDept) {
        departmentName = foundDept.label || foundDept.name;
      } else if (typeof deptId === 'string' && isNaN(parseInt(deptId))) {
        // If it's already a string like "CEO", use it directly
        departmentName = deptId;
      }
    }
    
    // Get manager name
    let managerName = null;
    const managerId = record.report_to || record.manager_id;
    
    if (managerId) {
      const foundManager = managersList.find(mgr => 
        mgr.value === parseInt(managerId) || mgr.id === parseInt(managerId)
      );
      
      if (foundManager) {
        managerName = foundManager.label || foundManager.name;
      }
    }
    
    // Return enhanced record
    return {
      ...record,
      // Add pre-resolved names to the data object
      department_name_resolved: departmentName,
      manager_name_resolved: managerName
    };
  });

  // Define columns for TableCustom
  const EOSColumns = [
    {
      dataField: 'employee_id',
      text: 'Employee',
      dataSort: true,
      formatter: (cell, row) => {
        // Try different possible ID fields
        const employeeId = cell || row.emp_id || row.id;
        const serialNumber = row.serial_number || '';
        
        return (
          <EmployeeOverview
            id={employeeId}
            showPosition={true}
            showDepartment={false}
            fallbackData={{
              name: row.employee_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || serialNumber,
              position: row.designation || row.position || row.department_position || '',
              profilePicture: row.profile_picture,
              serial_number: serialNumber
            }}
          />
        );
      },
      headerClasses: "text-sm text-gray-1100",
      classes:"min-w-[200px]" // Example min-width
    },
    {
      dataField: 'serial_number',
      text: 'ID',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell, row) => cell || row.emp_id, // Fallback if serial_number is missing
    },
    {
      dataField: 'department_id',
      text: 'Department',
      dataSort: true,
      formatter: (cell, row) => {
        // Simply use the pre-processed department name
        if (row.department_name_resolved) {
          return row.department_name_resolved;
        }
        
        // DIRECT STRING VALUES - If we have a string like "CEO", use it directly
        if (typeof cell === 'string' && isNaN(parseInt(cell))) {
          return cell;
        }
        if (typeof row.department === 'string' && isNaN(parseInt(row.department))) {
          return row.department;
        }
        if (typeof row.department_name === 'string' && isNaN(parseInt(row.department_name))) {
          return row.department_name;
        }
        
        // Try to get a valid ID value to look up
        let departmentId = null;
        if (cell && !isNaN(parseInt(cell))) {
          departmentId = parseInt(cell);
        } else if (row.department && !isNaN(parseInt(row.department))) {
          departmentId = parseInt(row.department);
        } else if (row.department_name && !isNaN(parseInt(row.department_name))) {
          departmentId = parseInt(row.department_name);
        }
        
        // If we have an ID, look it up in our departments list
        if (departmentId !== null) {
          const foundDepartment = departmentsList.find(
            dept => dept.value === departmentId || dept.id === departmentId
          );
          
          if (foundDepartment) {
            return foundDepartment.label || foundDepartment.name;
          }
        }
        
        // If all else fails, try any value that might be available
        const departmentValue = cell || row.department || row.department_name;
        return departmentValue || 'N/A';
      },
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'report_to',
      text: 'Report To',
      dataSort: true,
      formatter: (cell, row) => {
        // Simply use the pre-processed manager name
        if (row.manager_name_resolved) {
          return row.manager_name_resolved;
        }
        
        const managerValue = cell || row.manager_id;
        
        // Try to find manager in our directly fetched list
        const foundManager = managersList.find(
          manager => manager.value === parseInt(managerValue) || manager.id === parseInt(managerValue)
        );
        
        if (foundManager) {
          return foundManager.label || foundManager.name;
        }
        
        // Fall back to the ManagerName component
        return <ManagerName value={managerValue} />;
      },
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'notice_period',
      text: 'Notice Period',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => cell || '1 month',
    },
    {
      dataField: 'exit_date',
      text: 'Last Working Date',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => cell || 'N/A',
    },
    {
      dataField: 'exit_category',
      text: 'Offboarding Type',
      dataSort: true,
      formatter: (cell, row) => getTypeLabel(cell || row.type || 'N/A'),
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'status',
      text: 'Status',
      dataSort: true,
      formatter: (cell, row) => {
        const employeeId = row.employee_id || row.emp_id || row.id;
        const payrollExists = payrollExistenceCache[employeeId];
        const currentStatus = cell || "Pending";
        
        if (payrollExists === true && currentStatus === "Pending") {
          return renderStatusBadge("Approved");
        }
        
        return renderStatusBadge(currentStatus);
      },
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'id',
      text: 'Actions',
      formatter: (cell, row) => (
        <ActionCell 
          cell={cell} 
          row={row} 
          onViewDetails={handleViewDetails} 
          onSetupEOS={handleSetupEOS} 
        />
      ),
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error("Error fetching EOS data: " + error);
    }
  }, [error]);

  const handleViewDetails = (id, row) => {
    // Use employee_id or emp_id, falling back to id if needed
    const employeeId = row.employee_id || row.emp_id || id;
    
    // Navigate to the details page
    navigate(`/payroll/eos/${employeeId}`);
  };

  const handleSetupEOS = (id, row) => {
    const employeeId = row.employee_id || row.emp_id || id;
    toast.info("Redirecting to EOS setup page...");
    navigate(`/payroll/salary-setup-eos/${employeeId}`);
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

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-primary-1100">End of Service</h2>
        <p className="text-sm text-gray-1100">
          View and manage end of service calculations for employees.
        </p>
      </div>

      <div className="flex flex-col justify-between gap-2 lg:flex-row md:flex-row xl:flex-row">
         <div className="flex">
           <SelectInputComponent
             name="status"
             value={selectedStatus}
             placeholder="Filter by Status"
             options={eosStatusOptions}
             onChange={(name, newStatus) => onStatusChange(newStatus)}
             classes="flex-row items-center min-w-[200px]"
           />
         </div>
         <FilterInput
           filters={[
             {
               type: "search",
               placeholder: "Search by ID or Name",
               name: "emp_search",
             },
             {
               type: "select-one",
               option: departmentsList.length > 0 
                ? departmentsList.map(dep => ({ value: dep.id || dep.value, label: dep.name || dep.label }))
                : departments.map(dep => ({ value: dep.id || dep.value, label: dep.name || dep.label })),
               name: "department_id",
               placeholder: "Department",
               values: selectedDepartment,
             },
              {
               type: "select-two",
               option: exitTypeOptions,
               name: "exit_category",
               placeholder: "Offboarding Type",
               values: selectedType,
             },
           ]}
           onChange={handleFilterChange}
         />
       </div>

      {isEosLoading ? (
        <PageLoader />
      ) : (
         <Card>
           <CardContent className="p-6">
             <TableCustom
               data={processedEOSData}
               columns={EOSColumns}
               pagination={true}
               dataTotalSize={eosCount}
               tableOptions={tableOptions}
               keyField="id"
               loading={isEosLoading}
               noDataIndication={() => <div className="py-8 text-center text-gray-500">No EOS records found matching your criteria.</div>}
               classes="border-0"
             />
           </CardContent>
         </Card>
      )}
    </div>
  );
};

export default EOSList; 