// app/utils/FormSchema/AssetsFormSchema.js
const validateAssetFormSchema = (values) => {
  const errors = {};

  if (!values.asset_name) errors.asset_name = "Asset name is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.specifications)
    errors.specifications = "Model & specifications are required";
  if (!values.serial_number)
    errors.serial_number = "Serial number/IMEI is required";
  if (!values.location) errors.location = "Location is required";
  if (!values.purchase_date) errors.purchase_date = "Purchase date is required";
  if (!values.condition) errors.condition = "Initial condition is required";
  if (!values.purchase_cost) errors.purchase_cost = "Purchase cost is required";

  // Purchase cost validation - must be at least 1
  if (values.purchase_cost && parseFloat(values.purchase_cost) < 1) {
    errors.purchase_cost = "Purchase cost must be at least 1";
  }

  // Warranty date validation (optional field, but if provided, must be after purchase date)
  if (values.warranty_expiry && values.purchase_date) {
    const purchaseDate = new Date(values.purchase_date);
    const warrantyDate = new Date(values.warranty_expiry);

    // Check if warranty date is less than or equal to purchase date
    if (warrantyDate <= purchaseDate) {
      errors.warranty_expiry =
        "Warranty expiry date must be after purchase date";
    }
  }

  return errors;
};

// Validation schema for asset request form
const validateAssetRequestForm = (values, mode = "request") => {
  const errors = {};

  // Common validations for both request and assign modes
  if (!values.asset_name) {
    errors.asset_name = "Asset name is required";
  }

  if (!values.reason) {
    errors.reason = "Reason is required";
  } else if (values.reason.length < 10) {
    errors.reason = "Please provide a more detailed reason (at least 10 characters)";
  }

  // Validations specific to assign mode
  if (mode === "assign") {
    if (!values.employee) {
      errors.employee = "Employee is required";
    }
    
    if (!values.assign_date) {
      errors.assign_date = "Assign date is required";
    }
    
    if (!values.location) {
      errors.location = "Location is required";
    }
  }

  return errors;
};

export { validateAssetFormSchema, validateAssetRequestForm };
