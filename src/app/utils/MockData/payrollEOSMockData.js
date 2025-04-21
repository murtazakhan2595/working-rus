// Mock data for End of Service (EOS) in Payroll section
import { eosSettlementsList } from './eosSettlementMockData';
import { getEOSSettlementById } from './eosSettlementMockData';

export const eosEmployeesList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employees = eosSettlementsList.map(settlement => ({
        id: settlement.id,
        employeeId: settlement.employeeId,
        employeeName: settlement.employeeName,
        department: settlement.department,
        branch: "Main Branch", // Adding default value since it's not in original data
        nationality: "UAE", // Adding default value since it's not in original data
        type: settlement.resignationType,
        status: settlement.status,
        joiningDate: settlement.joiningDate,
        lastWorkingDate: settlement.lastWorkingDate,
        resignationDate: settlement.resignationDate,
        totalServiceYears: settlement.totalServiceYears
      }));
      
      resolve(employees);
    }, 500);
  });
};

// Function to get employee details from settlement data by ID
export const eosEmployeeDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const settlement = eosSettlementsList.find(item => item.id === parseInt(id));
      
      if (settlement) {
        // Create a payroll-specific version of the employee data
        const employeeDetails = {
          id: settlement.id,
          employeeId: settlement.employeeId,
          employeeName: settlement.employeeName,
          department: settlement.department,
          branch: "HR Department", // Different from settlement data
          joiningDate: settlement.joiningDate,
          lastWorkingDay: settlement.lastWorkingDate,
          type: settlement.resignationType,
          resignationDate: settlement.resignationDate,
          totalServiceYears: settlement.totalServiceYears,
          status: settlement.status,
          // Add structured data needed for the form
          salary: {
            basicSalary: settlement.settlementDetails.basicSalary || 4500,
            housing: settlement.settlementDetails.allowances * 0.5 || 1800,
            transportation: settlement.settlementDetails.allowances * 0.3 || 800,
            food: settlement.settlementDetails.allowances * 0.2 || 300,
            otherAllowance: 200,
            mobile: 100,
            salik: 50,
            additionalAllowance: 0,
            totalGrossSalary: settlement.settlementDetails.grossSalary || 7750,
            perDaySalary: (settlement.settlementDetails.grossSalary / 30) || 254.79
          },
          eosCalculation: {
            leavePay: {
              days: 15,
              amount: settlement.settlementDetails.earnedLeave || 3821.92
            },
            gratuity: settlement.settlementDetails.gratuityAmount || 8000,
            gpssa: 0,
            airTicket: 2500,
            netHealthCommission: 0,
            commissionQ4: 1000,
            commissionQ1: 1000,
            loan: 0,
            noticePay: 0,
            additionalFields: [],
            totalPayable: settlement.settlementDetails.totalEarnings || 16321.92
          },
          // Use the settlement deductions
          deductions: [
            {
              type: "Loans",
              amount: settlement.settlementDetails.deductions.loans || 0
            },
            {
              type: "Advance Salary",
              amount: settlement.settlementDetails.deductions.advanceSalary || 0
            },
            {
              type: "Other Deductions",
              amount: settlement.settlementDetails.deductions.otherDeductions || 0
            }
          ],
          totalDeductions: settlement.settlementDetails.deductions.totalDeductions || 2500,
          netPayable: settlement.settlementDetails.finalSettlementAmount || 13821.92
        };
        
        resolve(employeeDetails);
      } else {
        reject(new Error("Employee data not found"));
      }
    }, 300);
  });
};

// Function to simulate API call to get EOS employees list
export const getEOSEmployees = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(eosEmployeesList());
    }, 500); // Simulate network delay
  });
};

// Function to simulate API call to update EOS employee status
export const updateEOSEmployeeStatus = (id, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (eosEmployeeDetailsById[id]) {
        eosEmployeeDetailsById[id].status = status;
        
        // Also update in the list
        const updatedList = eosEmployeesList().map(emp => {
          if (emp.id === parseInt(id)) {
            return { ...emp, status };
          }
          return emp;
        });
        
        eosEmployeesList().length = 0;
        eosEmployeesList().push(...updatedList);
        
        resolve({ success: true, message: `EOS status updated to ${status}` });
      } else {
        resolve({ success: false, message: "Employee not found" });
      }
    }, 500);
  });
};

// Function to simulate API call to update EOS employee details
export const updateEOSEmployeeDetails = (id, details) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (eosEmployeeDetailsById[id]) {
        eosEmployeeDetailsById[id] = { 
          ...eosEmployeeDetailsById[id],
          ...details 
        };
        
        resolve({ success: true, message: "EOS details updated successfully" });
      } else {
        resolve({ success: false, message: "Employee not found" });
      }
    }, 500);
  });
};

export const getEOSEmployeeById = getEOSSettlementById; 