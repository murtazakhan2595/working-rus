// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsDashboard/clearanceAnalyticsUtils.js

import moment from "moment";

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

// Check if request is overdue based on dynamic SLA from API
export const isOverdue = (startDate, slaInDays) => {
  const daysPending = calculateDaysPending(startDate);
  const sla = parseFloat(slaInDays) || 0; // Default to 0 if sla is undefined/null
  return sla > 0 && daysPending > sla;
};

// Calculate overdue count from real data using dynamic SLA
export const calculateOverdueCount = (clearanceList) => {
  return clearanceList.filter((item) => {
    // Don't count ONHOLD items as overdue
    if (item.status === "ONHOLD") return false;
    return isOverdue(item.start_date, item.sla);
  }).length;
};

// Build status counts from API response - Updated to include ONHOLD
export const buildStatusCounts = (apiResponse) => {
  const { status_summary, clearance_list } = apiResponse;

  return {
    total: clearance_list?.length || 0,
    pending: getStatusCount(status_summary, "PENDING"),
    in_process: getStatusCount(status_summary, "IN_PROCESS"),
    completed: getStatusCount(status_summary, "COMPLETED"),
    rejected: getStatusCount(status_summary, "REJECTED"),
    onhold: getStatusCount(status_summary, "ONHOLD"), // NEW: Added ONHOLD count
    overdue: calculateOverdueCount(clearance_list || []),
  };
};

// Enhance clearance data with calculated fields using dynamic SLA
export const enhanceClearanceData = (clearanceList) => {
  if (!clearanceList || clearanceList.length === 0) return [];

  return clearanceList.map((item) => {
    const daysPending = calculateDaysPending(item.start_date);
    const slaDays = parseFloat(item.sla) || 0; // Use dynamic SLA from API, default to 0

    // Don't calculate overdue status for items on hold
    const isOnHold = item.status === "ONHOLD";
    const overdueStatus = !isOnHold && slaDays > 0 && daysPending > slaDays;
    const slaDate =
      slaDays > 0 ? moment(item.start_date).add(slaDays, "days") : null;

    return {
      ...item,
      // Real calculated fields
      employee_full_name: `${item.employee__first_name} ${item.employee__last_name}`,
      days_pending: daysPending,
      is_overdue: overdueStatus,
      days_overdue: overdueStatus ? daysPending - slaDays : 0,
      sla_due_date: slaDate ? slaDate.toDate() : null,

      // Status-based progress - Updated to handle ONHOLD
      progress_percentage:
        item.status === "PENDING"
          ? 10
          : item.status === "IN_PROCESS"
          ? 60
          : item.status === "COMPLETED"
          ? 100
          : item.status === "REJECTED"
          ? 0
          : item.status === "ONHOLD"
          ? 0 // ONHOLD items have 0% progress
          : 10,

      // SLA status using dynamic SLA - Updated to handle ONHOLD
      sla_status:
        item.status === "ONHOLD"
          ? "ON_HOLD" // Special SLA status for items on hold
          : slaDays === 0
          ? "NO_SLA" // New status for items without SLA
          : overdueStatus
          ? "BREACHED"
          : daysPending > slaDays * 0.8
          ? "AT_RISK"
          : "WITHIN_SLA",
    };
  });
};

// Filter enhanced data - Updated to include ONHOLD status filtering
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

    // Status filter - Updated to include ONHOLD
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false;
    }

    // Overdue filter - Don't consider ONHOLD items as overdue
    if (filters.is_overdue !== undefined && filters.is_overdue !== null) {
      const itemOverdue = item.status !== "ONHOLD" && item.is_overdue;
      if (filters.is_overdue !== itemOverdue) return false;
    }

    // SLA status filter - Updated to include ON_HOLD
    if (filters.sla_status && filters.sla_status.length > 0) {
      if (!filters.sla_status.includes(item.sla_status)) return false;
    }

    return true;
  });
};
