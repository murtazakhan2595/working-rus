import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { Eye, CheckCircle, Clock, Plus } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { DepartmentName } from "utils/getValuesFromTables";
import { getEOSSettlements } from "app/services/eosSettlementService";
import { toast } from "react-toastify";

const EOSSettlementList = ({ userProfile, employeeId }) => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("SelfService/EOS - User Profile:", userProfile);
  
  // Check if user has EOS-sarly-setup
  const hasEOSSetup = userProfile?.settings?.hasEOSSarlySetup || false;
  const organizationId = userProfile?.organization;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If user doesn't have EOS setup, don't fetch data
        if (!hasEOSSetup) {
          setLoading(false);
          return;
        }
        
        // Prepare query parameters
        const params = { organization: organizationId };
        
        // Add employee filter if available
        if (employeeId) {
          params.employee = employeeId;
        } else if (userProfile?.employeeId) {
          params.employee = userProfile.employeeId;
        }
        
        // Fetch data from API
        const data = await getEOSSettlements(params);
        
        console.log("SelfService/EOS - Settlements from API:", data);
        setSettlements(data);
      } catch (error) {
        console.error("Error fetching EOS settlements:", error);
        setError("Failed to load settlements. Please try again later.");
        toast.error("Failed to load settlements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile, employeeId, hasEOSSetup, organizationId]);

  const handleViewSettlement = (id) => {
    navigate(`/self-service/exit/eos-settlement/${id}`);
  };

  const handleSetupEOS = (id) => {
    // Navigate to setup page or start the setup process
    navigate(`/self-service/exit/setup-eos/${id}`);
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColorClass = (name) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800'
    ];
    
    const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  const renderStatusBadge = (status) => {
    if (status === "Acknowledged" || status === "Approved") {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Approved</span>
        </div>
      );
    } else if (status === "Pending") {
      return (
        <div className="flex items-center text-amber-600">
          <Clock className="w-4 h-4 mr-1" />
          <span>Pending</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-amber-600">
        <Clock className="w-4 h-4 mr-1" />
        <span>Pending</span>
      </div>
    );
  };
  
  // If user doesn't have EOS setup, don't render anything
  if (!hasEOSSetup) {
    return null;
  }

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-primary-1100">End of Service Settlement</h2>
          <p className="text-sm text-gray-500">
            View and manage your end of service settlements
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      ID
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Department
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Report To
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Notice Period
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Last Working Date
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Offboarding Type
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-center text-neutral-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        No EOS settlements found
                      </td>
                    </tr>
                  ) : (
                    settlements.map((settlement) => {
                      console.log("SelfService/EOS - Settlement department:", settlement.department);
                      const avatarClass = getAvatarColorClass(settlement.employeeName);
                      const initials = getInitials(settlement.employeeName);
                      const isApproved = settlement.status === "Acknowledged" || settlement.status === "Approved";
                      return (
                        <tr 
                          key={settlement.id} 
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-full ${avatarClass}`}>
                                {initials}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-1200">{settlement.employeeName}</div>
                                <div className="text-xs text-neutral-500">{settlement.position || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {settlement.employeeId}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {typeof settlement.department === 'string' && isNaN(parseInt(settlement.department))
                              ? (settlement.department === 'Department' ? settlement.department_name || 'Unknown' : settlement.department)
                              : typeof settlement.department === 'number' || 
                                (typeof settlement.department === 'string' && !isNaN(parseInt(settlement.department)))
                                ? <DepartmentName value={settlement.department} debug={false} /> 
                                : settlement.department_name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {settlement.reportTo || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {settlement.noticePeriod || '1 month'}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {new Date(settlement.lastWorkingDate || settlement.resignationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {settlement.resignationType || 'Terminated'}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-1200">
                            {renderStatusBadge(settlement.status)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isApproved ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Approved</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Settlement approved</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100">
                                        <Clock className="w-3 h-3" />
                                        <span>Pending</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Awaiting approval</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              
                              {isApproved ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewSettlement(settlement.id)}
                                        className="flex items-center gap-1 text-xs text-green-700 border-green-200 hover:bg-green-50"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>View Details</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View settlement details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetupEOS(settlement.id)}
                                        className="flex items-center gap-1 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Setup EOS</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Setup end of service settlement</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(EOSSettlementList); 