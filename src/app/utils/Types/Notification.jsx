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
    action_url: "#",
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
    action_url: "/tasks/{task_id}",
  },
  {
    module: "Task Management",
    notification_type: "Task Unassignment",
    action_url: "/tasks/{task_id}",
  },
  {
    module: "Project Management",
    notification_type: "Project Addition",
    action_url: "/projects/{project_id}",
  },
  {
    module: "Task Management",
    notification_type: "Mention",
    action_url: "/tasks/{task_id}/comments/{comment_id}",
  },
  {
    module: "Project Management",
    notification_type: "Join Request",
    action_url: "/projects/{project_id}/join_request",
  },
];
