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
