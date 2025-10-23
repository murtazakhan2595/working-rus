// Payroll Utility Functions

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {object} exchangeRates - Exchange rates object
 * @returns {number} - Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRates) => {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = exchangeRates[`${fromCurrency}_${toCurrency}`];
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    return amount;
  }
  
  return Number((amount * rate).toFixed(2));
};

/**
 * Format currency with symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (AED, GBP, USD, etc.)
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = "AED", locale = "en-US") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "-";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate tax based on country-specific rules
 * @param {number} grossSalary - Gross salary amount
 * @param {string} country - Country code
 * @param {array} taxTables - Tax tables for the country
 * @returns {object} - Tax breakdown
 */
export const calculateTax = (grossSalary, country, taxTables) => {
  if (!taxTables || taxTables.length === 0) {
    return { tax: 0, taxableIncome: grossSalary, effectiveRate: 0 };
  }

  let tax = 0;
  let remainingIncome = grossSalary;

  // Sort tax brackets by threshold
  const sortedBrackets = [...taxTables].sort((a, b) => a.min_threshold - b.min_threshold);

  for (const bracket of sortedBrackets) {
    if (grossSalary > bracket.min_threshold) {
      const maxThreshold = bracket.max_threshold || grossSalary;
      const taxableInBracket = Math.min(remainingIncome, maxThreshold - bracket.min_threshold);
      
      if (taxableInBracket > 0) {
        tax += (taxableInBracket * bracket.rate) / 100;
      }
      
      remainingIncome -= taxableInBracket;
      
      if (remainingIncome <= 0) break;
    }
  }

  return {
    tax: Number(tax.toFixed(2)),
    taxableIncome: grossSalary,
    effectiveRate: grossSalary > 0 ? Number(((tax / grossSalary) * 100).toFixed(2)) : 0,
  };
};

/**
 * Calculate UAE-specific gratuity (End of Service)
 * @param {number} basicSalary - Basic salary amount
 * @param {number} yearsOfService - Years of service
 * @param {string} contractType - unlimited or limited
 * @param {string} resignationType - resignation or termination
 * @returns {number} - Gratuity amount
 */
export const calculateUAEGratuity = (
  basicSalary,
  yearsOfService,
  contractType = "unlimited",
  resignationType = "resignation"
) => {
  let gratuity = 0;

  if (yearsOfService < 1) return 0;

  // For unlimited contract
  if (contractType === "unlimited") {
    if (resignationType === "resignation") {
      // No gratuity for less than 1 year
      if (yearsOfService < 1) return 0;

      // 0 gratuity for 1-5 years on resignation (some companies give prorated)
      if (yearsOfService >= 1 && yearsOfService < 5) {
        // 0 as per UAE law, but can be prorated if company policy allows
        gratuity = 0;
      } else if (yearsOfService >= 5) {
        // 21 days for each of the first 5 years
        gratuity += (basicSalary / 30) * 21 * 5;
        
        // 30 days for each year after 5 years
        const remainingYears = yearsOfService - 5;
        gratuity += (basicSalary / 30) * 30 * remainingYears;
      }
    } else {
      // Termination - Full gratuity from day 1
      if (yearsOfService <= 5) {
        gratuity = (basicSalary / 30) * 21 * yearsOfService;
      } else {
        gratuity = (basicSalary / 30) * 21 * 5;
        const remainingYears = yearsOfService - 5;
        gratuity += (basicSalary / 30) * 30 * remainingYears;
      }
    }
  } else {
    // For limited contract - Full gratuity regardless
    if (yearsOfService <= 5) {
      gratuity = (basicSalary / 30) * 21 * yearsOfService;
    } else {
      gratuity = (basicSalary / 30) * 21 * 5;
      const remainingYears = yearsOfService - 5;
      gratuity += (basicSalary / 30) * 30 * remainingYears;
    }
  }

  return Number(gratuity.toFixed(2));
};

/**
 * Calculate UK National Insurance (NI) Contribution
 * @param {number} grossSalary - Gross annual salary
 * @param {string} year - Tax year (e.g., "2024-2025")
 * @returns {object} - NI breakdown
 */
export const calculateUKNI = (grossSalary, year = "2024-2025") => {
  // 2024-2025 rates (simplified)
  const PRIMARY_THRESHOLD = 12570; // Annual
  const UPPER_EARNINGS_LIMIT = 50270; // Annual
  const RATE_BELOW_UEL = 0.12; // 12%
  const RATE_ABOVE_UEL = 0.02; // 2%

  let ni = 0;

  if (grossSalary <= PRIMARY_THRESHOLD) {
    return { ni: 0, employeeNI: 0, employerNI: 0 };
  }

  // Employee NI
  if (grossSalary > PRIMARY_THRESHOLD && grossSalary <= UPPER_EARNINGS_LIMIT) {
    ni = (grossSalary - PRIMARY_THRESHOLD) * RATE_BELOW_UEL;
  } else if (grossSalary > UPPER_EARNINGS_LIMIT) {
    ni = (UPPER_EARNINGS_LIMIT - PRIMARY_THRESHOLD) * RATE_BELOW_UEL;
    ni += (grossSalary - UPPER_EARNINGS_LIMIT) * RATE_ABOVE_UEL;
  }

  // Employer NI (simplified - 13.8% above secondary threshold)
  const SECONDARY_THRESHOLD = 9100;
  let employerNI = 0;
  if (grossSalary > SECONDARY_THRESHOLD) {
    employerNI = (grossSalary - SECONDARY_THRESHOLD) * 0.138;
  }

  return {
    ni: Number(ni.toFixed(2)),
    employeeNI: Number(ni.toFixed(2)),
    employerNI: Number(employerNI.toFixed(2)),
    total: Number((ni + employerNI).toFixed(2)),
  };
};

/**
 * Calculate net salary
 * @param {number} grossSalary - Gross salary
 * @param {object} deductions - Deductions object
 * @returns {number} - Net salary
 */
export const calculateNetSalary = (grossSalary, deductions = {}) => {
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
  return Number((grossSalary - totalDeductions).toFixed(2));
};

/**
 * Validate WPS file data
 * @param {array} employees - Array of employee payroll data
 * @returns {object} - Validation result
 */
export const validateWPSData = (employees) => {
  const errors = [];
  const warnings = [];

  employees.forEach((emp, index) => {
    // Required fields validation
    if (!emp.employee_id) {
      errors.push({ row: index + 1, field: "employee_id", message: "Employee ID is required" });
    }
    if (!emp.salary || emp.salary <= 0) {
      errors.push({ row: index + 1, field: "salary", message: "Valid salary is required" });
    }
    if (!emp.iban || emp.iban.length < 15) {
      errors.push({ row: index + 1, field: "iban", message: "Valid IBAN is required" });
    }

    // Warnings
    if (emp.salary > 100000) {
      warnings.push({ row: index + 1, field: "salary", message: "Salary seems unusually high" });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalRecords: employees.length,
    validRecords: employees.length - errors.length,
  };
};

/**
 * Format date for payroll period
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type (month, year, full)
 * @returns {string} - Formatted date string
 */
export const formatPayrollPeriod = (date, format = "month") => {
  const d = new Date(date);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  switch (format) {
    case "month":
      return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    case "year":
      return d.getFullYear().toString();
    case "short":
      return `${monthNames[d.getMonth()].substring(0, 3)} ${d.getFullYear()}`;
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Detect payroll anomalies (AI simulation)
 * @param {object} currentPayroll - Current payroll data
 * @param {object} previousPayroll - Previous payroll data
 * @returns {array} - Array of anomalies
 */
export const detectPayrollAnomalies = (currentPayroll, previousPayroll) => {
  const anomalies = [];

  if (!previousPayroll) return anomalies;

  // Salary spike detection
  const currentTotal = currentPayroll.gross_salary || 0;
  const previousTotal = previousPayroll.gross_salary || 0;
  const percentageChange = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : 0;

  if (Math.abs(percentageChange) > 20) {
    anomalies.push({
      type: "salary_spike",
      severity: "high",
      message: `Salary changed by ${percentageChange.toFixed(2)}% from previous period`,
      employeeId: currentPayroll.employee_id,
      currentValue: currentTotal,
      previousValue: previousTotal,
    });
  }

  // Missing timesheet detection
  if (!currentPayroll.timesheet_id && currentPayroll.has_variable_pay) {
    anomalies.push({
      type: "missing_timesheet",
      severity: "medium",
      message: "Timesheet data is missing for employee with variable pay",
      employeeId: currentPayroll.employee_id,
    });
  }

  // Negative deduction detection
  Object.entries(currentPayroll.deductions || {}).forEach(([key, value]) => {
    if (value < 0) {
      anomalies.push({
        type: "negative_deduction",
        severity: "high",
        message: `Negative deduction detected: ${key}`,
        employeeId: currentPayroll.employee_id,
        field: key,
        value,
      });
    }
  });

  return anomalies;
};

/**
 * Generate payroll summary statistics
 * @param {array} payrollData - Array of payroll records
 * @returns {object} - Summary statistics
 */
export const generatePayrollSummary = (payrollData) => {
  if (!payrollData || payrollData.length === 0) {
    return {
      totalEmployees: 0,
      totalGross: 0,
      totalNet: 0,
      totalDeductions: 0,
      averageSalary: 0,
      byCurrency: {},
      byDepartment: {},
      byCountry: {},
    };
  }

  const summary = {
    totalEmployees: payrollData.length,
    totalGross: 0,
    totalNet: 0,
    totalDeductions: 0,
    byCurrency: {},
    byDepartment: {},
    byCountry: {},
  };

  payrollData.forEach((record) => {
    summary.totalGross += record.gross_salary || 0;
    summary.totalNet += record.net_salary || 0;
    summary.totalDeductions += (record.gross_salary || 0) - (record.net_salary || 0);

    // By currency
    const currency = record.currency || "AED";
    if (!summary.byCurrency[currency]) {
      summary.byCurrency[currency] = { count: 0, total: 0 };
    }
    summary.byCurrency[currency].count++;
    summary.byCurrency[currency].total += record.gross_salary || 0;

    // By department
    const dept = record.department || "Unknown";
    if (!summary.byDepartment[dept]) {
      summary.byDepartment[dept] = { count: 0, total: 0 };
    }
    summary.byDepartment[dept].count++;
    summary.byDepartment[dept].total += record.gross_salary || 0;

    // By country
    const country = record.country || "Unknown";
    if (!summary.byCountry[country]) {
      summary.byCountry[country] = { count: 0, total: 0 };
    }
    summary.byCountry[country].count++;
    summary.byCountry[country].total += record.gross_salary || 0;
  });

  summary.averageSalary = summary.totalGross / summary.totalEmployees;

  return summary;
};

/**
 * Round currency amount based on currency rules
 * @param {number} amount - Amount to round
 * @param {string} currency - Currency code
 * @returns {number} - Rounded amount
 */
export const roundCurrency = (amount, currency = "AED") => {
  // Different currencies have different rounding rules
  const roundingRules = {
    AED: 2, // 2 decimal places
    GBP: 2,
    USD: 2,
    EUR: 2,
    KWD: 3, // Kuwaiti Dinar has 3 decimal places
    BHD: 3, // Bahraini Dinar has 3 decimal places
  };

  const decimals = roundingRules[currency] || 2;
  return Number(amount.toFixed(decimals));
};

export default {
  convertCurrency,
  formatCurrency,
  calculateTax,
  calculateUAEGratuity,
  calculateUKNI,
  calculateNetSalary,
  validateWPSData,
  formatPayrollPeriod,
  detectPayrollAnomalies,
  generatePayrollSummary,
  roundCurrency,
};

