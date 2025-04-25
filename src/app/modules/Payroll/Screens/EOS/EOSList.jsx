import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { PageLoader } from "components";
import { BadgeCheck, CheckCircle, Clock, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeExitRequests } from "state/slices/ExitEmployeeSlice";
import { EmployeeOverview } from "components";
import { DepartmentName, ManagerName } from "utils/getValuesFromTables";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import TableCustom from "components/CustomTable";
import { Card, CardContent } from "components/ui/card";

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

const EOSList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for filters, pagination, and sorting
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id"); // Default sort by ID descending
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  const allEmployees = useSelector((state) => state.emp.employees);
  const eosData = useSelector((state) => state.exit_emp?.exitRequests || []);
  const eosCount = useSelector((state) => state.exit_emp?.count || 0);
  const isEosLoading = useSelector((state) => state.exit_emp?.loading);
  const error = useSelector((state) => state.exit_emp?.error);
  
  // Check if departments and managers are loaded in Redux store
  const departments = useSelector((state) => state.common?.departments);
  const managers = useSelector((state) => state.emp?.reportingManagers);
  
  // Handler for page changes (number or size)
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Handler for sort changes
  const onSortChange = (sortName) => {
    setOrdering(sortName);
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
    console.log("Filter Changed:", { filterName, filterValue }); // Log input
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
      console.log("Updated Filter Data State:", updatedFilters);
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
    
    console.log("Fetching EOS Data with payload:", payload);
    dispatch(fetchEmployeeExitRequests(payload))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching EOS data:", error);
      });
  }, [dispatch, options, filterData, ordering]);

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

  // Define columns for TableCustom
  const EOSColumns = [
    {
      dataField: 'employee_id',
      text: 'Employee',
      formatter: (cell, row) => (
        <EmployeeOverview
          id={cell || row.emp_id}
          showPosition={true}
          showDepartment={false}
        />
      ),
      headerClasses: "text-sm text-gray-1100",
      classes:"min-w-[200px]" // Example min-width
    },
    {
      dataField: 'serial_number',
      text: 'ID',
      sort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell, row) => cell || row.emp_id, // Fallback if serial_number is missing
    },
    {
      dataField: 'department_id',
      text: 'Department',
      sort: true, // Make sure backend supports sorting by department_id or name
      formatter: (cell, row) => <DepartmentName value={row?.department_name || cell} />,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'report_to',
      text: 'Report To',
      sort: true, // Make sure backend supports sorting by manager ID or name
      formatter: (cell, row) => <ManagerName value={cell || row.manager_id} />,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'notice_period',
      text: 'Notice Period',
      sort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => cell || '1 month',
    },
    {
      dataField: 'exit_date',
      text: 'Last Working Date',
      sort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => cell || 'N/A',
    },
    {
      dataField: 'exit_category',
      text: 'Offboarding Type',
      sort: true,
      formatter: (cell, row) => getTypeLabel(cell || row.type || 'N/A'),
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => renderStatusBadge(cell || "Pending"),
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'id',
      text: 'Actions',
      formatter: (cell, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(cell)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-700"
          aria-label={`View details for record ${cell}`}
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </Button>
      ),
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
  ];

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
               option: departments.map(dep => ({ value: dep.id, label: dep.name })),
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
           <CardContent className="p-0">
             <TableCustom
               data={eosData}
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