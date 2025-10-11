import React, { useState } from "react";
import { Button } from "components/ui/button";
import {
  FormField,
  SelectInputComponent,
  TextInput,
  DateInput,
  TextAreaInput,
  CoverFileUpload,
} from "components/FormControl";

const AddLicenseModal = ({
  isOpen,
  onClose,
  onSave,
  existingLicenses = [],
}) => {
  const [formData, setFormData] = useState({
    branch: "",
    licenseType: "",
    licenseNumber: "",
    issuingAuthority: "",
    issueDate: null,
    expiryDate: null,
    location: "",
    description: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for dropdowns
  const branchOptions = [
    { value: "Dubai Mall Pharmacy", label: "Dubai Mall Pharmacy" },
    { value: "Abu Dhabi Marina Pharmacy", label: "Abu Dhabi Marina Pharmacy" },
    {
      value: "Sharjah City Center Pharmacy",
      label: "Sharjah City Center Pharmacy",
    },
    {
      value: "Dubai Healthcare City Pharmacy",
      label: "Dubai Healthcare City Pharmacy",
    },
    { value: "Al Ain Pharmacy", label: "Al Ain Pharmacy" },
    { value: "Fujairah Pharmacy", label: "Fujairah Pharmacy" },
    { value: "Ras Al Khaimah Pharmacy", label: "Ras Al Khaimah Pharmacy" },
    { value: "Ajman Pharmacy", label: "Ajman Pharmacy" },
  ];

  const licenseTypeOptions = [
    { value: "Retail Pharmacy License", label: "Retail Pharmacy License" },
    { value: "Warehouse License", label: "Warehouse License" },
    { value: "Wholesale License", label: "Wholesale License" },
    { value: "Clinical License", label: "Clinical License" },
    { value: "Specialized License", label: "Specialized License" },
  ];

  const issuingAuthorityOptions = [
    { value: "Dubai Health Authority", label: "Dubai Health Authority" },
    {
      value: "Department of Health Abu Dhabi",
      label: "Department of Health Abu Dhabi",
    },
    { value: "Sharjah Health Department", label: "Sharjah Health Department" },
    { value: "Ministry of Health UAE", label: "Ministry of Health UAE" },
    {
      value: "Health Authority Abu Dhabi",
      label: "Health Authority Abu Dhabi",
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Very basic validation for testing
    if (!formData.branch) {
      newErrors.branch = "Branch is required";
    }

    if (!formData.licenseType) {
      newErrors.licenseType = "License Type is required";
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License Number is required";
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue Date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry Date is required";
    }

    console.log("Validation errors:", newErrors);
    console.log("Form data for validation:", formData);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (field, files) => {
    if (files && files.length > 0) {
      handleInputChange("file", files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started", formData);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine status based on expiry date
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );

      let status = "Active";
      if (daysUntilExpiry <= 60) {
        status = "Expiring Soon";
      }

      const newLicense = {
        id: Date.now(), // Simple ID generation for demo
        facilityName: formData.branch,
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        issuingAuthority: formData.issuingAuthority,
        issueDate: formData.issueDate
          ? formData.issueDate.toISOString().split("T")[0]
          : "",
        expiryDate: formData.expiryDate
          ? formData.expiryDate.toISOString().split("T")[0]
          : "",
        location: formData.location,
        description: formData.description,
        status,
        complianceScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
        renewalIntimations: 0,
        file: formData.file,
        createdAt: new Date().toISOString(),
      };

      await onSave(newLicense);
      console.log("License saved successfully", newLicense);

      // Reset form
      setFormData({
        branch: "",
        licenseType: "",
        licenseNumber: "",
        issuingAuthority: "",
        issueDate: null,
        expiryDate: null,
        location: "",
        description: "",
        file: null,
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error saving license:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      branch: "",
      licenseType: "",
      licenseNumber: "",
      issuingAuthority: "",
      issueDate: null,
      expiryDate: null,
      location: "",
      description: "",
      file: null,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Add New License</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Branch Selection */}
            <FormField
              name="branch"
              label="Branch"
              required={true}
              error={errors.branch}
              touched={!!errors.branch}
            >
              <SelectInputComponent
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                options={branchOptions}
                placeholder="Select Branch"
                error={errors.branch}
                touch={!!errors.branch}
              />
            </FormField>

            {/* License Type */}
            <FormField
              name="licenseType"
              label="License Type"
              required={true}
              error={errors.licenseType}
              touched={!!errors.licenseType}
            >
              <SelectInputComponent
                name="licenseType"
                value={formData.licenseType}
                onChange={handleInputChange}
                options={licenseTypeOptions}
                placeholder="Select License Type"
                error={errors.licenseType}
                touch={!!errors.licenseType}
              />
            </FormField>

            {/* License Number */}
            <FormField
              name="licenseNumber"
              label="License Number"
              required={true}
              error={errors.licenseNumber}
              touched={!!errors.licenseNumber}
            >
              <TextInput
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Enter License Number"
                error={errors.licenseNumber}
                touch={!!errors.licenseNumber}
              />
            </FormField>

            {/* Issuing Authority */}
            <FormField name="issuingAuthority" label="Issuing Authority">
              <SelectInputComponent
                name="issuingAuthority"
                value={formData.issuingAuthority}
                onChange={handleInputChange}
                options={issuingAuthorityOptions}
                placeholder="Select Issuing Authority"
              />
            </FormField>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Issue Date */}
              <FormField
                name="issueDate"
                label="Issue Date"
                required={true}
                error={errors.issueDate}
                touched={!!errors.issueDate}
              >
                <DateInput
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  placeholder="Select Issue Date"
                  error={errors.issueDate}
                  touch={!!errors.issueDate}
                />
              </FormField>

              {/* Expiry Date */}
              <FormField
                name="expiryDate"
                label="Expiry Date"
                required={true}
                error={errors.expiryDate}
                touched={!!errors.expiryDate}
              >
                <DateInput
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="Select Expiry Date"
                  error={errors.expiryDate}
                  touch={!!errors.expiryDate}
                />
              </FormField>
            </div>

            {/* Location */}
            <FormField name="location" label="Location">
              <TextInput
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter Location"
              />
            </FormField>

            {/* Description */}
            <FormField name="description" label="Description">
              <TextAreaInput
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
              />
            </FormField>

            {/* File Upload */}
            <FormField
              name="file"
              label="License Document (PDF/JPG/PNG - Max 5MB)"
              error={errors.file}
              touched={!!errors.file}
            >
              <CoverFileUpload
                name="file"
                value={formData.file ? [formData.file] : []}
                onChange={handleFileUpload}
                acceptType=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                variant="AttachmentFileUpload"
                multiple={false}
                error={errors.file}
                touch={!!errors.file}
              />
            </FormField>
          </div>

          <div className="p-6 border-t flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log("Test button clicked");
                console.log("Current form data:", formData);
                console.log("Current errors:", errors);
                // Test with dummy data
                const testLicense = {
                  id: Date.now(),
                  facilityName: formData.branch || "Test Branch",
                  licenseNumber: formData.licenseNumber || "TEST-001",
                  licenseType: formData.licenseType || "Test License",
                  issuingAuthority:
                    formData.issuingAuthority || "Test Authority",
                  issueDate: formData.issueDate || "2024-01-01",
                  expiryDate: formData.expiryDate || "2025-01-01",
                  location: formData.location || "Test Location",
                  status: "Active",
                  complianceScore: 95,
                  renewalIntimations: 0,
                  file: formData.file,
                  createdAt: new Date().toISOString(),
                };
                console.log("Test license data:", testLicense);
                onSave(testLicense);
                handleClose();
              }}
              disabled={isSubmitting}
            >
              Save License
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLicenseModal;
