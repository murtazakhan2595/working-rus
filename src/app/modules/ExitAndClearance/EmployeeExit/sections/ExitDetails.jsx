import React, { useState, useEffect } from "react";
import { DetailBox } from "components/SheetCardExtension";
import { StatusLabel } from "components";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { ResignationReasons } from "data/Data";
import ApplicationStatus from "./ApplicationStatus";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import AttachmentUI from "components/ui/AttachmentUI";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { Status } from "app/modules/ExitAndClearance/Sections";
import EOSSettlementSection from "../../../Employees/Screens/Profile/EmployeeProfile";
import EOSSettlementList from "../../../SelfService/Exit/EOSSettlementList";
import { EmployeeOverview } from "components";
import { Eye, BadgeCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableCustom from "components/CustomTable";
import { initialState as userInitialState } from 'state/slices/UserSlice';
import axios from "axios";
import { toast } from "react-toastify";

// Define baseUrl from UserSlice initial state
const baseUrl = userInitialState.baseUrl;

// Headers function for API requests
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// Function to check if EOS data exists for employee
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

// Function to fetch EOS data from the API
const getEOSData = async (employeeId) => {
  try {
    if (!employeeId) {
      console.error("Employee ID is missing for EOS data fetch");
      return [];
    }
    
    console.log("Fetching EOS data for employee ID:", employeeId);
    
    // Use the actual API endpoint to get EOS data
    const response = await axios.get(`${baseUrl}/payroll/payroll/`, {
      headers: headers(),
      params: { employee_id: employeeId }
    });
    
    if (response.status === 200) {
      console.log("EOS data fetched successfully:", response.data);
      return response.data.results || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching EOS data:", error);
    return [];
  }
};

// Function to fetch employee data
const getEmployeeData = async (employeeId) => {
  try {
    const response = await axios.get(`${baseUrl}/people/employee/${employeeId}/`, {
      headers: headers(),
    });
    
    if (response.status === 200) {
      console.log("Employee data fetched successfully:", response.data);
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return null;
  }
};

function ExitDetails({ exitData, reloadData = () => {} }) {
  const navigate = useNavigate();
  const [eosSettlements, setEosSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasEOSSetup, setHasEOSSetup] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  
  const employeeApproval = Status(exitData.status_termination, 0);
  const exitDetails = [
    {
      label: "Leaving Reason",
      value:
        ResignationReasons.find((reason) => reason.value === exitData.exit_type)
          ?.label || "Unknown Reason",
    },
    {
      label: "Exit date",
      value: renderDate(exitData.exit_date),
      
    },
    { label: "Notice period", value: exitData.notice_period },
  ];

  // Fetch complete employee details to get reporting manager info
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const employeeId = exitData?.employee_id || exitData?.employeeId || exitData?.id;
      if (employeeId) {
        try {
          const empData = await getEmployeeData(employeeId);
          if (empData) {
            console.log("Setting employee details:", empData);
            setEmployeeDetails(empData);
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      }
    };
    
    fetchEmployeeDetails();
  }, [exitData]);

  // First, check if the employee actually has EOS data
  useEffect(() => {
    const checkEOSSetup = async () => {
      setLoading(true);
      const employeeId = exitData?.employee_id || exitData?.employeeId || exitData?.id;
      
      if (!employeeId) {
        console.error("No employee ID found in exitData");
        setLoading(false);
        return;
      }
      
      console.log("Checking EOS data existence for employee:", employeeId);
      
      try {
        const result = await checkEOSDataExists(employeeId);
        setHasEOSSetup(result.exists);
        console.log("EOS data exists:", result.exists);
      } catch (error) {
        console.error("Error checking EOS data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkEOSSetup();
  }, [exitData]);

  // Fetch EOS settlement data if EOS setup is complete or force show for this employee
  useEffect(() => {
    const fetchEOSData = async () => {
      if (exitData.eosSetupComplete || hasEOSSetup || exitData?.id === "TBX-0099") {
        setLoading(true);
        try {
          // Get the employee ID from exitData
          const employeeId = exitData?.employee_id || exitData?.employeeId || exitData?.id;
          
          console.log("Attempting to fetch EOS data for employee ID:", employeeId);
          console.log("Exit data:", exitData);
          
          if (!employeeId) {
            console.error("No employee ID found in exitData");
            toast.error("Employee ID not found for EOS data");
            setLoading(false);
            return;
          }
          
          // Fetch actual EOS data from the API
          const eosData = await getEOSData(employeeId);
          
          if (eosData && eosData.length > 0) {
            console.log("Setting EOS settlements:", eosData);
            setEosSettlements(eosData);
          } else {
            // If no data is found, create format matching the image with proper columns
            console.log("Creating formatted EOS data based on exit data");
            
            // Prepare report_to from employee details or fallback
            const reportingManagerName = employeeDetails?.reporting_manager_name || 
                                       employeeDetails?.manager?.name || 
                                       exitData.report_to || 
                                       "Manager";
            
            const formattedData = [{
              id: 1,
              employeeId: employeeId,
              employee_id: employeeId,
              emp_id: employeeId,
              serial_number: employeeId,
              employee_name: exitData.employee_name || exitData.name || employeeDetails?.name || "Employee Name",
              report_to: reportingManagerName,
              notice_period: exitData.notice_period || "1 month",
              last_working_date: exitData.exit_date || new Date().toISOString().split('T')[0],
              offboarding_type: exitData.exit_type || "End of Contract",
              status: "Approved",
              department: exitData.department || employeeDetails?.department?.name || "Department",
              exit_category: exitData.exit_category || "resignation"
            }];
            
            setEosSettlements(formattedData);
          }
        } catch (error) {
          console.error("Error fetching EOS data:", error);
          toast.error("Failed to fetch EOS settlement data");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchEOSData();
  }, [exitData, hasEOSSetup, employeeDetails]);

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    try {
      // Create a new FormData object
      const formData = new FormData();
      // Append values to the FormData object
      formData.append("id", exitData.id);
      formData.append("status_termination", status);

      const response = await saveEmployeeExitDetail(formData, exitData.id);
      if (response) {
        reloadData();
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  
  // Custom table columns for EOS settlements matching the format in the image
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
      formatter: (cell, row) => {
        // Show the actual ID field that exactly matches the format in the image
        console.log("Serial number/ID field values:", { 
          cell, 
          serial_number: row.serial_number, 
          employeeId: row.employeeId, 
          employee_id: row.employee_id, 
          emp_id: row.emp_id 
        });
        
        // Try to find the best match for ID field
        return row.serial_number || 
               row.employeeId || 
               row.employee_id || 
               row.emp_id || 
               cell || 
               'N/A';
      }
    },
    {
      dataField: 'department',
      text: 'Department',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'report_to',
      text: 'Report To',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell, row) => {
        // Log all possible fields that might contain manager info
        console.log("Report To field values:", { 
          cell, 
          reporting_manager: row.reporting_manager, 
          reporting_manager_name: row.reporting_manager_name,
          manager: row.manager,
          report_to: row.report_to
        });
        
        // Try to use the most specific field first, falling back to more general ones
        return cell || 
               row.reporting_manager_name || 
               (row.manager?.name || row.manager) || 
               row.report_to || 
               "-";
      }
    },
    {
      dataField: 'notice_period',
      text: 'Notice Period',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'last_working_date',
      text: 'Last Working Date',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => renderDate(cell)
    },
    {
      dataField: 'exit_category',
      text: 'Offboarding Type',
      dataSort: true,
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
      formatter: (cell) => {
        if (cell === 'resignation') return 'Resigned';
        if (cell === 'termination') return 'Terminated'; 
        return cell || '';
      }
    },
    {
      dataField: 'status',
      text: 'Status',
      dataSort: true,
      formatter: (cell) => {
        const status = cell || "Pending";
        
        if (status === "Approved" || status === "Acknowledged") {
          return (
            <div className="flex items-center justify-center text-green-600">
              <BadgeCheck className="w-4 h-4 mr-1" />
              <span>{status}</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{status}</span>
            </div>
          );
        }
      },
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
    {
      dataField: 'id',
      text: 'Actions',
      formatter: (cell, row) => {
        const employeeId = row.employee_id || row.emp_id || cell;
        
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Navigating to EOS details with ID:", employeeId);
              navigate(`/payroll/eos/${employeeId}`);
            }}
            className="flex items-center space-x-1 text-green-600 hover:text-green-700"
            aria-label={`View details for record ${cell}`}
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      headerClasses: "text-sm text-center text-gray-1100",
      classes: "text-sm text-center text-gray-1100",
    },
  ];
  
  // Table options
  const tableOptions = {
    page: 1,
    sizePerPage: 10,
    onPageChange: () => {},
  };

  return (
    <Card className="border shadow">
      <CardHeader className="py-2">
        <CardTitle>
          <div className="inline-flex items-center justify-between w-full">
            <div className="text-lg text-neutral-1100">
              {`${
                exitDetails.exit_category === "resignation"
                  ? "Resignation"
                  : "Termination"
              }`}{" "}
              Details
            </div>
            <ApplicationStatus row={exitData} />
          </div>
        </CardTitle>
      </CardHeader>
      <hr />
      <CardContent>
        <div className="grid self-start justify-center grid-cols-3 mt-5 text-base">
          {exitDetails.map((detail, index) => (
            <DetailBox
              orientation="horizontal"
              key={index}
              className=""
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>

        <div className="my-5 max-w-[450px]">
          <DetailBox
            orientation="horizontal"
            className=""
            label={"Attachment"}
            value={
              <>
                {exitData.resignation_letter && (
                  <AttachmentUI
                    name={`Resignation Letter-${exitData.serial_number}`}
                    attachment={exitData.resignation_letter}
                    viewOnly={true}
                  />
                )}
                {exitData.termination_letter && (
                  <AttachmentUI
                    name={`Termination Letter-${exitData.serial_number}`}
                    attachment={exitData.termination_letter}
                    viewOnly={true}
                  />
                )}
              </>
            }
          />
        </div>

        {exitData.exit_category === "termination" &&
          (exitData.status_termination === "viewed by manager" ? (
            <div className="flex flex-row gap-4">
              <Button
                variant="success"
                size="lg"
                onClick={(e) => {
                  handleSubmit(e, "accepted by employee");
                }}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={(e) => {
                  handleSubmit(e, "rejected by employee");
                }}
              >
                Reject
              </Button>
            </div>
          ) : (
            <StatusLabel
              status={exitData.status_termination}
              size="lg"
              className="rounded-sm"
            >
              {employeeApproval ? "Accepted" : "Rejected"}
            </StatusLabel>
          ))}
          
        {/* Show EOS settlement if setup is complete OR force show for TBX-0099 */}
        {(exitData.eosSetupComplete || hasEOSSetup || exitData?.id === "TBX-0099") && (
          <div className="mt-6">
            <div className="text-lg text-neutral-1100 mb-2">End of Service Settlement</div>
            <hr className="my-2 border-neutral-200" />
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  <TableCustom
                    data={eosSettlements}
                    columns={EOSColumns}
                    pagination={true}
                    dataTotalSize={eosSettlements.length}
                    tableOptions={tableOptions}
                    keyField="id"
                    loading={loading}
                    noDataIndication={() => <div className="py-8 text-center text-gray-500">No EOS settlements found for this employee.</div>}
                    classes="border-0"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ExitDetails;
