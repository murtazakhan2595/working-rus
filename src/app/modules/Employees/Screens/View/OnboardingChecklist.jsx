import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { CheckBoxInput } from "components/FormControl";
import { toast } from "react-toastify";
import { Formik } from "formik";
import {
  saveDocumentChecklist,
  getDocumentChecklist,
} from "app/hooks/employee"; // Import both functions
import { useNavigate } from "react-router-dom";

const OnboardingChecklist = ({ employeeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [checklistData, setChecklistData] = useState(null);
  const formRef = React.createRef();
  const navigate = useNavigate();
  // Fetch existing checklist data if available
  useEffect(() => {
    const fetchChecklistData = async () => {
      setIsDataLoading(true);
      try {
        // Call the actual API to get document checklist
        const response = await getDocumentChecklist(employeeId);

        // Check if we got data back and there are results
        if (response && response.results && response.results.length > 0) {
          // Use the first result as our checklist data
          setChecklistData(response.results[0]);
        } else {
          // No existing checklist found, set to null to create new
          setChecklistData(null);
        }
      } catch (error) {
        console.error("Error fetching checklist data:", error);
        toast.error("Failed to load checklist data", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Set to null so we can create a new one
        setChecklistData(null);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (employeeId) {
      fetchChecklistData();
    }
  }, [employeeId]);

  // Initial checklist data - either from API or empty defaults
  const initialValues = {
    id: checklistData?.id || null,
    employee_id: employeeId,
    is_resume: checklistData?.is_resume || false,
    is_signed_offer_letter: checklistData?.is_signed_offer_letter || false,
    is_educational_documents: checklistData?.is_educational_documents || false,
    is_professional_certificates:
      checklistData?.is_professional_certificates || false,
    is_picture: checklistData?.is_picture || false,
    is_id_card: checklistData?.is_id_card || false,
    is_passport_copy: checklistData?.is_passport_copy || false,
    is_visa_copy: checklistData?.is_visa_copy || false,
    is_leave_application: checklistData?.is_leave_application || false,
    is_increment_letter: checklistData?.is_increment_letter || false,
    is_confirmation_letter: checklistData?.is_confirmation_letter || false,
    is_others: checklistData?.is_others || false,
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Call the saveDocumentChecklist function with the form values
      const response = await saveDocumentChecklist(values);

      if (response) {
        // Update the local state with the response data
        setChecklistData(response);

        // Show success message based on whether it was created or updated
        const message = values.id
          ? "Onboarding checklist has been updated successfully!"
          : "Onboarding checklist has been created successfully!";

        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        throw new Error("Failed to save checklist");
      }
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("Failed to save onboarding checklist.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation (if needed)
  const validateForm = (values) => {
    const errors = {};
    return errors;
  };

  // If data is still loading, show a loading state
  if (isDataLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Onboarding Documents Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          Onboarding Documents Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          innerRef={formRef}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validate={validateForm}
          enableReinitialize={true}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="space-y-6">
              <div className="grid w-full grid-cols-1 gap-4">
                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_resume"
                    value={props.values.is_resume}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Resume"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_signed_offer_letter"
                    value={props.values.is_signed_offer_letter}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Signed Offer Letter"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_educational_documents"
                    value={props.values.is_educational_documents}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Educational Documents"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_professional_certificates"
                    value={props.values.is_professional_certificates}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Professional Certificate"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_picture"
                    value={props.values.is_picture}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Picture with White Background"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_id_card"
                    value={props.values.is_id_card}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Country Residency ID Card"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_passport_copy"
                    value={props.values.is_passport_copy}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Passport Copy"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_visa_copy"
                    value={props.values.is_visa_copy}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Visa Page Copy"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_leave_application"
                    value={props.values.is_leave_application}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Leave Applications"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_increment_letter"
                    value={props.values.is_increment_letter}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Increment Letters"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_confirmation_letter"
                    value={props.values.is_confirmation_letter}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Confirmation Letters"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="is_others"
                    value={props.values.is_others}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Others"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    props.resetForm();
                    navigate(-1);
                  }}
                  disabled={isLoading}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !props.dirty}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
