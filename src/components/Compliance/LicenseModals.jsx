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
import { Download } from "lucide-react";

const ViewLicenseModal = ({ isOpen, onClose, licenseData }) => {
  if (!licenseData || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">License Details</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Branch
              </label>
              <p className="text-sm font-semibold">
                {licenseData.facilityName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                License Type
              </label>
              <p className="text-sm font-semibold">{licenseData.licenseType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                License Number
              </label>
              <p className="text-sm font-semibold">
                {licenseData.licenseNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Issuing Authority
              </label>
              <p className="text-sm font-semibold">
                {licenseData.issuingAuthority}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Issue Date
              </label>
              <p className="text-sm font-semibold">{licenseData.issueDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Expiry Date
              </label>
              <p className="text-sm font-semibold">{licenseData.expiryDate}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Location
            </label>
            <p className="text-sm font-semibold">{licenseData.location}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  licenseData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : licenseData.status === "Expiring Soon"
                    ? "bg-yellow-100 text-yellow-800"
                    : licenseData.status === "Renewal Tracking"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {licenseData.status}
              </span>
            </div>
          </div>

          {licenseData.complianceScore && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Compliance Score
              </label>
              <p className="text-sm font-semibold">
                {licenseData.complianceScore}%
              </p>
            </div>
          )}

          {licenseData.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-sm">{licenseData.description}</p>
            </div>
          )}

          {licenseData.file && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Attached Document
              </label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {licenseData.file.name || "license-document.pdf"}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const EditLicenseModal = ({
  isOpen,
  onClose,
  onSave,
  licenseData,
  existingLicenses = [],
}) => {
  const [formData, setFormData] = useState({
    branch: licenseData?.facilityName || "",
    licenseType: licenseData?.licenseType || "",
    licenseNumber: licenseData?.licenseNumber || "",
    issuingAuthority: licenseData?.issuingAuthority || "",
    issueDate: licenseData?.issueDate ? new Date(licenseData.issueDate) : null,
    expiryDate: licenseData?.expiryDate
      ? new Date(licenseData.expiryDate)
      : null,
    location: licenseData?.location || "",
    description: licenseData?.description || "",
    file: licenseData?.file || null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Same options as AddLicenseModal
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

    if (!formData.branch) {
      newErrors.branch = "Branch is required";
    }

    if (!formData.licenseType) {
      newErrors.licenseType = "License Type is required";
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License Number is required";
    } else {
      // Check for duplicate license numbers for the same branch (excluding current record)
      const duplicateExists = existingLicenses.some(
        (license) =>
          license.licenseNumber === formData.licenseNumber &&
          license.facilityName === formData.branch &&
          license.id !== licenseData?.id
      );
      if (duplicateExists) {
        newErrors.licenseNumber =
          "License number already exists for this branch";
      }
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue Date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry Date is required";
    } else if (
      formData.issueDate &&
      formData.expiryDate <= formData.issueDate
    ) {
      newErrors.expiryDate = "Expiry date must be after issue date";
    }

    if (formData.file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = "Only PDF, JPG, and PNG files are allowed";
      }
      if (formData.file.size > 5 * 1024 * 1024) {
        newErrors.file = "File size must be less than 5MB";
      }
    }

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

    if (!validateForm()) {
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

      const updatedLicenseData = {
        ...licenseData,
        ...formData,
        facilityName: formData.branch,
        issueDate: formData.issueDate
          ? formData.issueDate.toISOString().split("T")[0]
          : "",
        expiryDate: formData.expiryDate
          ? formData.expiryDate.toISOString().split("T")[0]
          : "",
        status,
        renewalIntimations: licenseData.renewalIntimations || 0,
        updatedAt: new Date().toISOString(),
      };

      await onSave(updatedLicenseData);
      onClose();
    } catch (error) {
      console.error("Error updating license:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      branch: licenseData?.facilityName || "",
      licenseType: licenseData?.licenseType || "",
      licenseNumber: licenseData?.licenseNumber || "",
      issuingAuthority: licenseData?.issuingAuthority || "",
      issueDate: licenseData?.issueDate
        ? new Date(licenseData.issueDate)
        : null,
      expiryDate: licenseData?.expiryDate
        ? new Date(licenseData.expiryDate)
        : null,
      location: licenseData?.location || "",
      description: licenseData?.description || "",
      file: licenseData?.file || null,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Edit License</h2>
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

            {/* License Type and License Number */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Issuing Authority and Location */}
            <div className="grid grid-cols-2 gap-4">
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

              {/* Location */}
              <FormField name="location" label="Location">
                <TextInput
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter Location"
                />
              </FormField>
            </div>

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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update License"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteLicenseModal = ({ isOpen, onClose, onConfirm, licenseData }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(licenseData);
      onClose();
    } catch (error) {
      console.error("Error deleting license:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Delete License</h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this license?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">{licenseData?.facilityName}</p>
            <p className="text-xs text-gray-500">
              License: {licenseData?.licenseNumber}
            </p>
          </div>
          <p className="text-xs text-red-600 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="p-6 border-t flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ViewLicenseModal, EditLicenseModal, DeleteLicenseModal };
