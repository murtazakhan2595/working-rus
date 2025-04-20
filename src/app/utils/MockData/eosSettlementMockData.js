// Mock data for End of Service (EOS) settlements
export const eosSettlementsList = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Doe",
    department: "Engineering",
    status: "Pending",
    resignationType: "Resignation",
    resignationDate: "2023-12-15",
    lastWorkingDate: "2024-01-15",
    joiningDate: "2020-01-10",
    totalServiceYears: 4,
    settlementDetails: {
      basicSalary: 5000,
      allowances: 1500,
      grossSalary: 6500,
      gratuityAmount: 8667,
      earnedLeave: 1250,
      unpaidSalary: 3250,
      totalEarnings: 13167,
      deductions: {
        loans: 1200,
        advanceSalary: 0,
        otherDeductions: 350,
        totalDeductions: 1550
      },
      finalSettlementAmount: 11617
    }
  },
  {
    id: 2,
    employeeId: "EMP042",
    employeeName: "Jane Smith",
    department: "Marketing",
    status: "Acknowledged",
    resignationType: "Termination",
    resignationDate: "2023-11-30",
    lastWorkingDate: "2023-12-31",
    joiningDate: "2018-05-15",
    totalServiceYears: 5.5,
    settlementDetails: {
      basicSalary: 6200,
      allowances: 1800,
      grossSalary: 8000,
      gratuityAmount: 14667,
      earnedLeave: 2500,
      unpaidSalary: 4000,
      totalEarnings: 21167,
      deductions: {
        loans: 0,
        advanceSalary: 2000,
        otherDeductions: 500,
        totalDeductions: 2500
      },
      finalSettlementAmount: 18667
    }
  },
  {
    id: 3,
    employeeId: "EMP078",
    employeeName: "Robert Johnson",
    department: "Finance",
    status: "Pending",
    resignationType: "Resignation",
    resignationDate: "2024-01-05",
    lastWorkingDate: "2024-02-05",
    joiningDate: "2019-03-20",
    totalServiceYears: 4.8,
    settlementDetails: {
      basicSalary: 7500,
      allowances: 2200,
      grossSalary: 9700,
      gratuityAmount: 15520,
      earnedLeave: 3250,
      unpaidSalary: 4850,
      totalEarnings: 23620,
      deductions: {
        loans: 5000,
        advanceSalary: 0,
        otherDeductions: 750,
        totalDeductions: 5750
      },
      finalSettlementAmount: 17870
    }
  },
  {
    id: 4,
    employeeId: "EMP125",
    employeeName: "Sarah Williams",
    department: "Human Resources",
    status: "Pending",
    resignationType: "Termination",
    resignationDate: "2024-01-10",
    lastWorkingDate: "2024-01-31",
    joiningDate: "2021-06-15",
    totalServiceYears: 2.6,
    settlementDetails: {
      basicSalary: 4800,
      allowances: 1400,
      grossSalary: 6200,
      gratuityAmount: 5373,
      earnedLeave: 1100,
      unpaidSalary: 3100,
      totalEarnings: 9573,
      deductions: {
        loans: 2500,
        advanceSalary: 1200,
        otherDeductions: 450,
        totalDeductions: 4150
      },
      finalSettlementAmount: 5423
    }
  },
  {
    id: 5,
    employeeId: "TBX-0044",
    employeeName: "Khalid Naeem",
    department: "Project Management",
    status: "Pending",
    resignationType: "End of Contract",
    resignationDate: "2024-12-16",
    lastWorkingDate: "2025-01-16",
    joiningDate: "2022-01-16",
    totalServiceYears: 3,
    settlementDetails: {
      basicSalary: 5500,
      allowances: 1700,
      grossSalary: 7200,
      gratuityAmount: 7200,
      earnedLeave: 1400,
      unpaidSalary: 3600,
      totalEarnings: 12200,
      deductions: {
        loans: 0,
        advanceSalary: 0,
        otherDeductions: 200,
        totalDeductions: 200
      },
      finalSettlementAmount: 12000
    }
  }
];

// Function to simulate API call to get EOS settlements
export const getEOSSettlements = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(eosSettlementsList);
    }, 500); // Simulate network delay
  });
};

// Function to simulate API call to get a specific EOS settlement by ID
export const getEOSSettlementById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const settlement = eosSettlementsList.find(item => item.id === parseInt(id));
      if (settlement) {
        resolve(settlement);
      } else {
        reject(new Error("Settlement not found"));
      }
    }, 300);
  });
};

// Function to simulate API call to acknowledge an EOS settlement
export const acknowledgeEOSSettlement = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedSettlements = eosSettlementsList.map(settlement => {
        if (settlement.id === parseInt(id)) {
          return { ...settlement, status: "Acknowledged" };
        }
        return settlement;
      });
      
      // Update the original array (simulating database update)
      eosSettlementsList.length = 0;
      eosSettlementsList.push(...updatedSettlements);
      
      resolve({ success: true, message: "Settlement acknowledged successfully" });
    }, 500);
  });
}; 