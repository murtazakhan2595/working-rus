import React, { useState, useEffect } from "react";
import { getEOSSettlements } from "app/utils/MockData/eosSettlementMockData";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { Eye } from "lucide-react";
import { BadgeCheck, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const EOSSettlementList = ({ userProfile, employeeId }) => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEOSSettlements();
        
        console.log("All settlements:", data);
        console.log("Employee ID passed to component:", employeeId);
        console.log("User profile employeeId:", userProfile?.employeeId);
        
        // Fix the filtering logic
        let filteredData = data;
        if (employeeId) {
          // Filter by provided employeeId prop
          filteredData = data.filter(settlement => 
            String(settlement.employeeId).toLowerCase() === String(employeeId).toLowerCase()
          );
        } else if (userProfile?.employeeId) {
          // Filter by current user's employeeId from Redux state
          filteredData = data.filter(settlement => 
            String(settlement.employeeId).toLowerCase() === String(userProfile.employeeId).toLowerCase()
          );
        }
        
        // Add debugging to verify IDs match
        console.log("Current user employeeId:", userProfile?.employeeId);
        console.log("Settlement IDs in data:", data.map(s => s.employeeId));
        
        console.log("Filtered settlements:", filteredData);
        setSettlements(filteredData);
      } catch (error) {
        console.error("Error fetching EOS settlements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile, employeeId]);

  const handleViewSettlement = (id) => {
    navigate(`/self-service/exit/eos-settlement/${id}`);
    
    // Alternative: Use this direct URL if routing issues persist
    // window.location.href = `/self-service/exit/eos-settlement/${id}`;
  };

  const renderStatusBadge = (status) => {
    if (status === "Acknowledged") {
      return (
        <div className="flex items-center text-green-600">
          <BadgeCheck className="w-4 h-4 mr-1" />
          <span>Acknowledged</span>
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

  return (
    <div className="mt-4">
      
      <div>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                    Department
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-neutral-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-center text-neutral-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No EOS settlements found
                    </td>
                  </tr>
                ) : (
                  settlements.map((settlement) => (
                    <tr 
                      key={settlement.id} 
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-1200">
                        {settlement.employeeId}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-1200">
                        {settlement.employeeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-1200">
                        {settlement.department}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-1200">
                        {renderStatusBadge(settlement.status)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewSettlement(settlement.id)}
                                className="flex items-center justify-center w-8 h-8 p-0 text-green-600 border border-green-200 rounded-full shadow-sm bg-green-white hover:bg-green-200 hover:text-green-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(EOSSettlementList); 