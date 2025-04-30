import { useState, useEffect } from 'react';
import axios from 'axios';
import { initialState } from 'state/slices/UserSlice';

// Define baseUrl from UserSlice initial state
const baseUrl = initialState.baseUrl;

// Create proper API function for getting EOS settlements
const getEOSSettlements = async (employeeId) => {
  try {
    const response = await axios.get(`${baseUrl}/payroll/payroll/`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      params: employeeId ? { employee_id: employeeId } : {}
    });
    
    if (response.status === 200) {
      return response.data.results || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching EOS settlements:', error);
    return [];
  }
};

/**
 * Custom hook to determine if EOS settlements should be shown
 * @param {Object} employee - The employee data
 * @param {Object} userProfile - The current user profile
 * @returns {Object} - Information about EOS settlements visibility
 */
const useEOSSettlement = (employee, userProfile) => {
  const [showEOSSettlement, setShowEOSSettlement] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSettlements, setHasSettlements] = useState(false);

  useEffect(() => {
    const checkEOSSettlement = async () => {
      setIsLoading(true);
      
      try {
        // Check if employee is terminated or resigning
        const isExiting = employee?.status === 'terminated' || 
                          employee?.status === 'resigned' ||
                          employee?.notice_period === true;
                         
        if (!isExiting) {
          setShowEOSSettlement(false);
          setHasSettlements(false);
          return;
        }
        
        // Check for user permissions (HR, Admin, or self)
        const canView = 
          userProfile?.role === 'admin' || 
          userProfile?.role === 'hr' || 
          userProfile?.employeeId === employee?.id;
          
        if (!canView) {
          setShowEOSSettlement(false);
          setHasSettlements(false);
          return;
        }
        
        // Check if settlements exist
        const settlements = await getEOSSettlements(employee?.id);
        const filteredSettlements = settlements.filter(s => 
          s.employeeId === employee?.id || s.employee_id === employee?.id
        );
        
        setHasSettlements(filteredSettlements.length > 0);
        setShowEOSSettlement(isExiting && canView && filteredSettlements.length > 0);
      } catch (error) {
        console.error('Error checking EOS settlements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employee?.id) {
      checkEOSSettlement();
    }
  }, [employee, userProfile]);
  
  return { showEOSSettlement, isLoading, hasSettlements };
};

export default useEOSSettlement; 