// EmployeesSalaryDetails data

import axios from 'axios';

export const fetchEmployeeData = async () => {
  const response = await axios.get('/api/employee');
  return response.data;
};

export const fetchSalaryBreakup = async () => {
  const response = await axios.get('/api/salary-breakup');
  return response.data;
};

export const fetchSalarySummary = async () => {
  const response = await axios.get('/api/salary-summary');
  return response.data;
};

export const fetchSalaryRevisions = async () => {
  const response = await axios.get('/api/salary-revisions');
  return response.data;
};

// Dummy data
// export const employeeData = {
//     id: 'TXB-0056',
//     name: 'Dennis Callis',
//     role: 'UI/UX Designer / Mid-Level Designer',
//     avatar: '/placeholder.svg?height=80&width=80',
//     costToCompany: '3,870.34',
//     costToCompanyWords: 'Three Thousand Eight Hundred And Seventy AED',
//     incrementsCount: 3,
//     lastIncrementDate: '5 months ago'
//   }
  
//   export const salaryBreakup = [
//     { component: 'Basic Pay', amount: '300.00' },
//     { component: 'Fixed Allowance', amount: '300.00' },
//     { component: 'Home Allowance', amount: '50.00' },
//     { component: 'Phone Allowance', amount: '50.00' },
//     { component: 'Travel Allowance', amount: '100.00' },
//     { component: 'Food Allowance', amount: '100.00' },
//   ]
  
//   export const salarySummary = {
//     'Joining Date': 'Jul 31, 2022',
//     'Last Revised Date': 'Aug 2, 2024',
//     'Experience': '2 years, 5 Months',
//     'Previous CTC': 'AED 7,901.51',
//     'Salary Type': 'Monthly',
//     'Current CTC': 'AED 7,901.51',
//     'Salary Package': 'Mid-level'
//   }