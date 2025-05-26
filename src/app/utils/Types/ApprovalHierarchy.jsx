export const ApprovalLevel = {
  level_number: null,
  assignment_type: "DESIGNATION",
  designation: null,
  user: null,
  is_final_approval: false,
  auto_forward_enabled: false,
  auto_forward_threshold: null,
  id:null,
  initiative_designation:null,
};

export const ApprovalHierarchy = {
  id: null,
  name: null,
  request_type: null,
  levels: [],
  request_initiative: [],
};

export const ApprovalHierarchyHistoryLogs = {
  action_type: null,
  branch: null,
  to_value: null,
  permission_changed: null,
  hierarchy: null,
  request_type: null,
  performed_by: null,
  level_number: null,
  timestamp: null,
  id: null,
  from_value: null,
  changed_by: null,
  original_approver: null,
  department: null,
  request_id: null,
};

export const DelegateLevel = {
  level: null,
  branch: 1,
  department: null,
  delegate: null,
  start_date: null,
  end_date: null,
  reason: null,
  id:null,
};
