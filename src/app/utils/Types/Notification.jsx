export const Notification = {
  action_url: null,
  created_at: null,
  id: null,
  is_read: null,
  message: null,
  module: null,
  notification_type: null,
  related_id: null,
  sender: null,
  title: null,
  user: null,
};

export const NotificationTitle = {
  REQUISTION_REQUEST: 'requisition request',
  OFFER_LETTER: 'offer letter',
  HEADCOUNT_REQUEST: 'headcount request',
}

export const Notifications_Action_URL = [
  {
    module: "Reimbursement",
    notification_type: "Reimbursement",
    action_url: "/claim-request",
  },
  {
    module: "Document Management",
    notification_type: "Expiry Notification",
    action_url: "#",
  },
  {
    module: "Document Management",
    notification_type: "Expiry Notification (Scheduled)",
    action_url: "#",
  },
  {
    module: "Document Management",
    notification_type: "Document Assignment",
    action_url: "#",
  },
  {
    module: "Document Management",
    notification_type: "Document Reminder",
    action_url: "#",
  },
  {
    module: "Document Management",
    notification_type: "Document Acknowledgment",
    action_url: "#",
  },
  {
    module: "user_management",
    notification_type: "Transfer Request",
    action_url: "/employee-tranfer",
  },
  {
    module: "user_management",
    notification_type: "transfer_request_initiated_for_employee",
    action_url: "/employee-tranfer",
  },
  {
    module: "user_management",
    notification_type: "transfer_request_initiated_for_self",
    action_url: "/my-tranfers",
  },
  {
    module: "user_management",
    notification_type: "Rejection",
    action_url: "#",
  },
  {
    module: "user_management",
    notification_type: "Approval",
    action_url: "#",
  },
  {
    module: "user_management",
    notification_type: "Team Update",
    action_url: "#",
  },
  {
    module: "Task Management",
    notification_type: "Task Assignment",
    action_url: "project-board/card/{related_id}",
  },
  {
    module: "Task Management",
    notification_type: "Task Unassignment",
    action_url: "project-board/card/{related_id}",
  },
  {
    module: "Project Management",
    notification_type: "Project Addition",
    action_url: "project-board/{related_id}",
  },
  {
    module: "Task Management",
    notification_type: "Mention",
    action_url: "project-board/card/{related_id}",
  },
  {
    module: "Project Management",
    notification_type: "Join Request",
    action_url: "/projects/{project_id}/join_request",
  },
  // Salary Structure Setup - For HR
  {
    module: "Payroll",
    notification_type: "Salary",
    action_url: "/my-payroll",
  },
  // Loan Deduction Configured - For HR
  {
    module: "Payroll",
    notification_type: "Loan",
    action_url: "#",
  },
  // Loan Deduction Applied - For Employee
  {
    module: "Payroll",
    notification_type: "Loan",
    action_url: "#",
  },
  // Salary Revision Approved - For HR
  {
    module: "Payroll",
    notification_type: "Salary Increment",
    action_url: "#",
  },
  // Salary Revision Approved - For Employee
  {
    module: "Payroll",
    notification_type: "Salary Increment",
    action_url: "#",
  },
  // Earning/Deduction Created - For Manager
  {
    module: "Payroll",
    notification_type: "EarningDeduction",
    action_url: "#",
  },
  // Earning/Deduction Approved/Rejected by Manager - For Employee
  {
    module: "Payroll",
    notification_type: "EarningDeduction",
    action_url: "#",
  },
  // Earning/Deduction Approved/Rejected by Manager - For HR
  {
    module: "Payroll",
    notification_type: "EarningDeduction",
    action_url: "#",
  },
  // Earning/Deduction Approved/Rejected by HR - For Employee
  {
    module: "Payroll",
    notification_type: "EarningDeduction",
    action_url: "#",
  },
  // Earning/Deduction Approved/Rejected by HR - For Manager
  {
    module: "Payroll",
    notification_type: "EarningDeduction",
    action_url: "#",
  },
  {
    module: "compliance_documents",
    notification_type: "document_acknowledged",
    action_url: "/documents/detail",
  },
  {
    module: "compliance_documents",
    notification_type: "document_assigned",
    action_url: "/my-documents",
  },
];
