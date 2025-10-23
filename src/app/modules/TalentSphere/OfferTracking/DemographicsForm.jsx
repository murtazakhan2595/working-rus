// src/app/modules/TalentSphere/DemographicsPublicForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PageLoader } from "components";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import {
  TextInput,
  NumberInput,
  EmailInput,
  DateInput,
  RadioGroupInput,
  CheckBoxInput,
  SelectInputComponent,
  TextAreaInput,
  SwitchInput,
  CoverFileUpload,
  PhoneNumberInput,
} from "components/FormControl";
import { toast } from "react-toastify";
import {
  getDemographicFormByUUID,
  submitDemographicResponse,
} from "app/hooks/talentSphere";
import { countriesCallingCodes } from "data/Data";

const DemographicsPublicForm = () => {
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
    const applicantIdFromUrl = searchParams.get("applicant");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStructure, setFormStructure] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [attachments, setAttachments] = useState({}); // Store file attachments separately
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch form structure
  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        setIsLoading(true);
        const data = await getDemographicFormByUUID(uuid);

        if (data) {
          setFormStructure(data);

          // Initialize form values based on field types
          const initialValues = {};
          data.sections?.forEach((section) => {
            section.fields?.forEach((field) => {
              const fieldName = `field_${field.id}`;
              if (field.field_type === "checkbox") {
                initialValues[fieldName] = [];
              } else if (field.field_type === "toggle") {
                initialValues[fieldName] = false;
              } else if (field.field_type === "file") {
                initialValues[fieldName] = null;
              } else if (field.field_type === "phone") {
                initialValues[fieldName] = "";
                initialValues[`${fieldName}_country_code`] = "";
              } else {
                initialValues[fieldName] = "";
              }
            });
          });
          setFormValues(initialValues);
        } else {
          toast.error("Failed to load form. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching form structure:", error);
        toast.error("Failed to load form. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchFormStructure();
    }
  }, [uuid]);

  // Handle field value change
  const handleFieldChange = (fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle file attachment change
  const handleAttachmentChange = (fieldName, file) => {
    setAttachments((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    // Clear error when file is selected
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    formStructure.sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        const fieldName = `field_${field.id}`;
        const value = formValues[fieldName];
        const attachment = attachments[fieldName];

        // Required field validation
        if (field.required) {
          if (field.field_type === "file") {
            if (!attachment) {
              newErrors[fieldName] = `${field.label} is required`;
            }
          } else {
            if (
              !value ||
              (Array.isArray(value) && value.length === 0) ||
              value === ""
            ) {
              newErrors[fieldName] = `${field.label} is required`;
            }
          }
        }

        // Attachment required validation (for non-file fields)
        if (
          field.attachment_required &&
          field.field_type !== "file" &&
          !attachment
        ) {
          newErrors[fieldName] = `Attachment is required for ${field.label}`;
        }

        // Email validation
        if (field.field_type === "email" && value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[fieldName] = "Invalid email format";
          }
        }

        // Number validation
        if (field.field_type === "number" && value && value !== "") {
          if (isNaN(value)) {
            newErrors[fieldName] = "Must be a valid number";
          }
        }
      });
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if applicant ID is provided
    if (!applicantIdFromUrl) {
      toast.error("Applicant ID is missing. Please use the correct link.");
      return;
    }

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formValues).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare FormData (since we're uploading files)
      const formData = new FormData();
      formData.append("applicant", applicantIdFromUrl);
      formData.append("form", formStructure.id);

      // Prepare answers array
      const answers = [];
      formStructure.sections?.forEach((section) => {
        section.fields?.forEach((field) => {
          const fieldName = `field_${field.id}`;
          const value = formValues[fieldName];
          const attachment = attachments[fieldName];

          // Convert value to string for API
          let stringValue = "";
          if (field.field_type === "file") {
            // For file type fields, value is empty but attachment is required
            stringValue = "";
          } else if (field.field_type === "phone") {
            // For phone fields, combine country code and phone number
            const countryCode = formValues[`${fieldName}_country_code`] || "";
            const phoneNumber = value || "";
            stringValue = countryCode && phoneNumber ? `${countryCode}${phoneNumber}` : phoneNumber;
          } else if (Array.isArray(value)) {
            stringValue = value.join(",");
          } else if (typeof value === "boolean") {
            stringValue = value.toString();
          } else {
            stringValue = String(value || "");
          }

          const answer = {
            field: field.id,
            value: stringValue,
          };

          // Add attachment if present
          if (attachment) {
            answer.attachment = attachment;
          }

          answers.push(answer);
        });
      });

      // DEBUG: Log the answers before sending
      console.log("=== DEBUG: Form Submission ===");
      console.log("Applicant ID:", applicantIdFromUrl);
      console.log("Form ID:", formStructure.id);
      console.log("Answers array:", answers);

      // Append answers to FormData using correct nested structure
      answers.forEach((answer, index) => {
        // Make sure field ID exists and is valid
        if (answer.field !== undefined && answer.field !== null) {
          console.log(`Answer ${index}:`, {
            field: answer.field,
            value: answer.value,
            hasAttachment: !!answer.attachment,
          });

          // Use proper FormData nested syntax without brackets
          formData.append(`answers[${index}]field`, answer.field);
          formData.append(`answers[${index}]value`, answer.value);

          // Append file if present
          if (answer.attachment) {
            formData.append(`answers[${index}]attachment`, answer.attachment);
          }
        } else {
          console.error(`Answer ${index} has invalid field ID:`, answer);
        }
      });

      // DEBUG: Log all FormData entries
      console.log("=== FormData Contents ===");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], `[File: ${pair[1].name}]`);
        } else {
          console.log(pair[0], pair[1]);
        }
      }
      console.log("=========================");

      // Submit form
      const response = await submitDemographicResponse(formData);

      if (response) {
        toast.success("Form submitted successfully!");
        setIsSubmitted(true);
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const fieldName = `field_${field.id}`;
    const value = formValues[fieldName];
    const error = errors[fieldName];
    const isTouched = touched[fieldName];
    const attachmentFieldName = `${fieldName}_attachment`;

    const commonProps = {
      name: fieldName,
      label: field.label,
      value: value,
      error: error,
      touch: isTouched,
      required: field.required,
      onChange: handleFieldChange,
    };

    // Render the main field
    const renderMainField = () => {
      switch (field.field_type) {
        case "text":
          return <TextInput {...commonProps} />;

        case "textarea":
          return <TextAreaInput {...commonProps} />;

        case "number":
          return <NumberInput {...commonProps} />;

        case "email":
          return <EmailInput {...commonProps} />;

        case "phone":
          return (
            <PhoneNumberInput
              {...commonProps}
              countryOptions={countriesCallingCodes}
              countryCodeName={`${fieldName}_country_code`}
            />
          );

        case "date":
          return <DateInput {...commonProps} />;

        case "radio":
          if (!field.options || !Array.isArray(field.options)) {
            return null;
          }
          return (
            <RadioGroupInput
              {...commonProps}
              options={field.options.map((opt) => ({
                value: opt,
                label: opt,
              }))}
            />
          );

        case "checkbox":
          if (!field.options || !Array.isArray(field.options)) {
            return null;
          }
          return (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-1200">
                {field.required && <span className="text-red-600">* </span>}
                {field.label}
              </label>
              <div className="space-y-2">
                {field.options.map((option) => (
                  <CheckBoxInput
                    key={option}
                    name={`${fieldName}_${option}`}
                    label={option}
                    value={value?.includes(option) || false}
                    onChange={(_, checked) => {
                      const newValue = checked
                        ? [...(value || []), option]
                        : (value || []).filter((v) => v !== option);
                      handleFieldChange(fieldName, newValue);
                    }}
                  />
                ))}
              </div>
              {error && isTouched && (
                <div className="text-red-800 text-xs font-normal ml-1">
                  {error}
                </div>
              )}
            </div>
          );

        case "dropdown":
          if (!field.options || !Array.isArray(field.options)) {
            return null;
          }
          return (
            <SelectInputComponent
              {...commonProps}
              options={field.options.map((opt) => ({
                value: opt,
                label: opt,
              }))}
              placeholder={`Select ${field.label}`}
            />
          );

        case "toggle":
          return <SwitchInput {...commonProps} />;

        case "file":
          return (
            <CoverFileUpload
              name={fieldName}
              label={field.label}
              value={attachments[fieldName]}
              error={error}
              touch={isTouched}
              required={field.required}
              onChange={(_, file) => {
                handleAttachmentChange(fieldName, file);
              }}
              acceptType=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              maxSize={10}
              variant="CoverFileUpload"
            />
          );

        default:
          return <TextInput {...commonProps} />;
      }
    };

    // Render attachment field if attachment_required is true for non-file fields
    const renderAttachmentField = () => {
      if (field.attachment_required && field.field_type !== "file") {
        return (
          <div className="mt-4">
            <CoverFileUpload
              name={attachmentFieldName}
              label={`Attachment for ${field.label}`}
              value={attachments[fieldName]}
              error={error}
              touch={isTouched}
              required={field.attachment_required}
              onChange={(_, file) => {
                handleAttachmentChange(fieldName, file);
              }}
              acceptType=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              maxSize={10}
              variant="AttachmentFileUpload"
            />
          </div>
        );
      }
      return null;
    };

    return (
      <div>
        {renderMainField()}
        {renderAttachmentField()}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Form not found
  if (!formStructure) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-1200 mb-2">
            Form not found
          </h2>
          <p className="text-neutral-1000">
            The form you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-1200 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-neutral-1000">
            Thank you for completing the {formStructure.name}. Your responses
            have been recorded.
          </p>
        </div>
      </div>
    );
  }

  // Form render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-neutral-1200 mb-2">
            {formStructure.name}
          </h1>
          {formStructure.description && (
            <p className="text-neutral-1000">{formStructure.description}</p>
          )}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {formStructure.sections
            ?.sort((a, b) => a.order - b.order)
            .map((section) => (
              <SheetCardExtension
                key={section.id}
                title={section.heading}
                className="bg-white"
              >
                {section.description && (
                  <p className="text-neutral-1000 text-sm mb-4">
                    {section.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields
                    ?.sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div
                        key={field.id}
                        className={
                          field.field_type === "textarea" ||
                          field.field_type === "checkbox" ||
                          field.field_type === "file" ||
                          field.attachment_required
                            ? "md:col-span-2"
                            : ""
                        }
                      >
                        {renderField(field)}
                      </div>
                    ))}
                </div>
              </SheetCardExtension>
            ))}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 bg-white rounded-lg shadow-sm p-6">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemographicsPublicForm;
