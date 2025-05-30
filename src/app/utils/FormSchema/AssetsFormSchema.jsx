// Update validation based on dynamic fields
const validateAssetFormSchema = (values, category) => {
  const errors = {};

  if (!values.asset_name) errors.asset_name = "Asset name is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.asset_location) errors.asset_location = "Location is required";
  if (!values.purchase_date) errors.purchase_date = "Purchase date is required";
  if (!values.condition) errors.condition = "Initial condition is required";
  if (!values.purchase_cost) errors.purchase_cost = "Purchase cost is required";

  // Purchase cost validation
  if (values.purchase_cost) {
    // Allow single dot (user typing '0.' or just '.' as intermediate input)
    if (values.purchase_cost === "." || values.purchase_cost === "") {
      // Optionally skip error or show a soft warning
    } else if (isNaN(values.purchase_cost)) {
      errors.purchase_cost = "Purchase cost must be a valid number";
    } else if (parseFloat(values.purchase_cost) < 1) {
      errors.purchase_cost = "Purchase cost must be at least 1";
    }
  }

  // Warranty date validation
  if (values.warranty_expiry && values.purchase_date) {
    const purchaseDate = new Date(values.purchase_date);
    const warrantyDate = new Date(values.warranty_expiry);

    if (warrantyDate <= purchaseDate) {
      errors.warranty_expiry =
        "Warranty expiry date must be after purchase date";
    }
  }

  // Validate dynamic fields based on category
  if (category?.dynamic_fields) {
    category.dynamic_fields.forEach((field) => {
      const fieldKey = `dynamic_${field.field_name}`;
      const fieldValue = values[fieldKey];

      if (field.is_required && (!fieldValue || fieldValue.trim() === "")) {
        errors[fieldKey] = `${field.field_name} is required`;
      }

      // Add validation based on field type
      if (field.field_type === "number" && fieldValue) {
        const num = parseFloat(fieldValue);
        if (isNaN(num)) {
          errors[fieldKey] = `${field.field_name} must be a number`;
        }
        if (field.validation_rules?.min && num < field.validation_rules.min) {
          errors[
            fieldKey
          ] = `${field.field_name} must be at least ${field.validation_rules.min}`;
        }
        if (field.validation_rules?.max && num > field.validation_rules.max) {
          errors[
            fieldKey
          ] = `${field.field_name} must be at most ${field.validation_rules.max}`;
        }
      }
    });
  }

  return errors;
};

// Update asset request validation
const validateAssetRequestForm = (values, mode = "request") => {
  const errors = {};

  if (mode === "request") {
    if (!values.category_id) {
      errors.category_id = "Category is required";
    }
  } else {
    if (!values.asset_name) {
      errors.asset_name = "Asset is required";
    }
    if (!values.employee) {
      errors.employee = "Employee is required";
    }
    if (!values.assign_date) {
      errors.assign_date = "Assign date is required";
    }
  }

  if (!values.reason) {
    errors.reason = "Reason is required";
  } else if (values.reason.length < 10) {
    errors.reason =
      "Please provide a more detailed reason (at least 10 characters)";
  }

  return errors;
};

export { validateAssetFormSchema, validateAssetRequestForm };
