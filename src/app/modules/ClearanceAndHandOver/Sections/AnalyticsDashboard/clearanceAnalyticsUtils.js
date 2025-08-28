// src/app/modules/ClearanceAndHandOver/Sections/clearanceAnalyticsUtils.js

import moment from "moment";

// SLA Rules (hardcoded as requested)
export const SLA_RULES = {
  "External Transfer": 7,
  "Job Rotation": 5,
  "Annual Leave": 3,
  "Internal Transfer": 5,
  Resignation: 10,
  Termination: 7,
  "Special Leave": 3,
};

// High-risk departments (hardcoded as requested)
export const HIGH_RISK_DEPARTMENTS = [
  "Accounts",
  "Treasury",
  "IT Security",
  "AML Department",
  "Finance",
  "Compliance",
  "Internal Audit",
];

// Helper function to get status count from API
export const getStatusCount = (statusSummary, targetStatus) => {
  const found = statusSummary.find((item) => item.status === targetStatus);
  return found ? found.count : 0;
};

// Calculate days between two dates
export const calculateDaysPending = (startDate) => {
  const start = moment(startDate);
  const current = moment();
  return current.diff(start, "days");
};

// Check if request is overdue based on SLA rules
export const isOverdue = (startDate, clearanceType) => {
  const daysPending = calculateDaysPending(startDate);
  const slaLimit = SLA_RULES[clearanceType] || 5;
  return daysPending > slaLimit;
};

// Calculate overdue count from real data
export const calculateOverdueCount = (clearanceList) => {
  return clearanceList.filter((item) =>
    isOverdue(item.start_date, item.clearance_type__name)
  ).length;
};

// Determine risk level based on department
export const determineRiskLevel = (departmentName) => {
  return HIGH_RISK_DEPARTMENTS.includes(departmentName) ? "HIGH" : "MEDIUM";
};

// Build status counts from API response
export const buildStatusCounts = (apiResponse) => {
  const { status_summary, clearance_list } = apiResponse;

  return {
    total: clearance_list?.length || 0,
    pending: getStatusCount(status_summary, "PENDING"),
    in_process: getStatusCount(status_summary, "IN_PROCESS"),
    completed: getStatusCount(status_summary, "COMPLETED"),
    rejected: getStatusCount(status_summary, "REJECTED"),
    overdue: calculateOverdueCount(clearance_list || []),
  };
};

// Enhance clearance data with calculated fields
export const enhanceClearanceData = (clearanceList) => {
  if (!clearanceList || clearanceList.length === 0) return [];

  return clearanceList.map((item) => {
    const daysPending = calculateDaysPending(item.start_date);
    const slaDays = SLA_RULES[item.clearance_type__name] || 5;
    const overdueStatus = daysPending > slaDays;
    const slaDate = moment(item.start_date).add(slaDays, "days");

    return {
      ...item,
      // Real calculated fields
      employee_full_name: `${item.employee__first_name} ${item.employee__last_name}`,
      days_pending: daysPending,
      is_overdue: overdueStatus,
      days_overdue: overdueStatus ? daysPending - slaDays : 0,
      sla_due_date: slaDate.toDate(),

      // Hardcoded logic fields (as requested)
      risk_level: determineRiskLevel(item.department__name),

      // Status-based progress
      progress_percentage:
        item.status === "PENDING"
          ? 10
          : item.status === "IN_PROCESS"
          ? 60
          : item.status === "COMPLETED"
          ? 100
          : item.status === "REJECTED"
          ? 0
          : 10,

      // SLA status
      sla_status: overdueStatus
        ? "BREACHED"
        : daysPending > slaDays * 0.8
        ? "AT_RISK"
        : "WITHIN_SLA",
    };
  });
};

// THIS WAS MISSING - Filter enhanced data
export const applyFilters = (enhancedData, filters) => {
  if (!enhancedData || enhancedData.length === 0) return [];

  return enhancedData.filter((item) => {
    // Employee name filter
    if (filters.employee_search) {
      const searchTerm = filters.employee_search.toLowerCase();
      const fullName = item.employee_full_name.toLowerCase();
      if (!fullName.includes(searchTerm)) return false;
    }

    // Department filter
    if (filters.department && filters.department.length > 0) {
      if (!filters.department.includes(item.department__name)) return false;
    }

    // Clearance type filter
    if (filters.clearance_type && filters.clearance_type.length > 0) {
      if (!filters.clearance_type.includes(item.clearance_type__name))
        return false;
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false;
    }

    // Overdue filter
    if (filters.is_overdue !== undefined && filters.is_overdue !== null) {
      if (filters.is_overdue !== item.is_overdue) return false;
    }

    // Risk level filter
    if (filters.risk_level && filters.risk_level.length > 0) {
      if (!filters.risk_level.includes(item.risk_level)) return false;
    }

    return true;
  });
};
