export const Document = {
  acknowledgment_type: "MANDATORY",
  name: null,
  category: null,
  expiration_date: null,
  target_audience: null,
  department: null,
  employee_id: null,
  description: null,
  file: null,
  doc_status:null,
};

export const DocumentCategory = { name: null, description: null };

export const DocumentAssignment = {
  object_id: null,
  status: "PENDING",
  viewed_date: null,
  acknowledged_date: null,
  document: null,
  document_name: null,
  due_date: null,
  document_category: null,
  document_file:null,
  signature_data:null,
  signature_file:null,
  acknowledgment_type:null,
  assigned_date:null,
};
