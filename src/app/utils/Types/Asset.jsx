export const Asset = {
  id: null,
  asset_name: "",
  category: "", 
  purchase_date: "",
  purchase_cost: "",
  notes: "",
  warranty_expiry: null,
  condition: "",
  attachment: [],
  ...Object.create(null), 
};

// NEW: Asset Category Type
export const AssetCategory = {
  id: null,
  name: "",
  description: "",
  is_active: true,
  dynamic_fields: [
    // Example:
    // {
    //   field_name: "Model & Specifications",
    //   field_type: "text",
    //   is_required: true,
    //   placeholder: "Enter model and specifications",
    //   validation_rules: { maxLength: 255 }
    // }
  ],
  created_at: null,
  updated_at: null,
};

// NEW: Asset Request Type
export const AssetRequest = {
  id: null,
  category_id: "", // NEW: Link to category instead of direct asset
  assigned_asset_id: null, // NEW: Set when HR assigns specific asset
  reason: "",
  additional_notes: "",
  preferred_specifications: {}, // NEW: Employee preferences
  asset_status: "Pending",
  asset_employee_id: null,
  asset_assigned_date: null,
  asset_assigned_by: null,
  asset_request_status: "Requested",
  rejection_reason: "",
  created_at: null,
  updated_at: null,
};
