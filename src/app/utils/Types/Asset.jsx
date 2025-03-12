const AssetBasicInformation = {
  id: null,
  asset_id: null, // This will be auto-generated on the backend
  asset_name: null,
  category: null,
  specifications: null,
  serial_number: null,
  condition: "New",
};

const AssetLocationInformation = {
  location: null,
  department_assigned: null,
  employee_assigned: null,
  assigned_date: null,
};

const AssetPurchaseInformation = {
  purchase_date: null,
  warranty_expiry: null,
  purchase_cost: null,
  vendor_name: null,
  purchase_order_number: null,
};

const AssetMaintenanceInformation = {
  last_maintenance_date: null,
  next_maintenance_date: null,
  maintenance_history: [],
  maintenance_notes: null,
};

const AssetAttachment = {
  attachment: null,
  attachmentName: null,
  existingAttachmentId: null,
};

const AssetNotes = {
  notes: null,
};

const Asset = {
  id: null,
  asset_id: null,
  asset_name: null,
  category: null,
  specifications: null,
  serial_number: null,
  location: null,
  purchase_date: null,
  warranty_expiry: null,
  condition: "New",
  purchase_cost: null,
  notes: null,
  attachment: null,
  basicInformation: AssetBasicInformation,
  locationInformation: AssetLocationInformation,
  purchaseInformation: AssetPurchaseInformation,
  maintenanceInformation: AssetMaintenanceInformation,
  attachments: AssetAttachment,
  assetNotes: AssetNotes,
};

export {
  Asset,
  AssetBasicInformation,
  AssetLocationInformation,
  AssetPurchaseInformation,
  AssetMaintenanceInformation,
  AssetAttachment,
  AssetNotes,
};
