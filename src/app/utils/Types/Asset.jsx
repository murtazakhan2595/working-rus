// app/utils/Types/Asset.js
const Asset = {
  id: null,
  asset_name: "",
  category: "", // Maps to asset_type in API
  specifications: "", // Maps to asset_description and asset_model in API
  serial_number: "", // Maps to asset_serial_number in API
  purchase_date: null, // Maps to asset_purchase_date in API
  purchase_cost: "", // Maps to asset_purchase_price in API
  warranty_expiry: null, // Maps to asset_warranty_expiry in API
  condition: "New", // Maps to asset_initial_condition in API
  location: null, // Maps to asset_location in API
  notes: "", // Maps to asset_notes in API
  attachment: [],
};

export { Asset };
