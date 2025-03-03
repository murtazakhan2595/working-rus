import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { CheckBoxInput } from "components/FormControl";
import { toast } from "react-toastify";
import { Formik } from "formik";

const OnboardingChecklist = ({ employeeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = React.createRef();

  // Initial checklist data
  const initialValues = {
    id: 1,
    empId: employeeId,
    resume: true,
    signed_offer_letter: true,
    educational_documents: false,
    professional_certificate: false,
    picture_with_white_background: false,
    country_residency_id_card: false,
    passport_copy: true,
    visa_page_copy: false,
    leave_applications: false,
    increment_letters: false,
    confirmation_letters: false,
    others: false,
  };

  // Mock API call to save the checklist
  const saveChecklist = async (values) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock API success response
      console.log("Saving checklist:", values);

      toast.success("Onboarding checklist has been saved successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
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
          onSubmit={(values, { setSubmitting }) => {
            saveChecklist(values);
          }}
          validate={validateForm}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="space-y-6">
              <div className="grid w-full grid-cols-1 gap-4">
                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="resume"
                    value={props.values.resume}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Resume"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="signed_offer_letter"
                    value={props.values.signed_offer_letter}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Signed Offer Letter"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="educational_documents"
                    value={props.values.educational_documents}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Educational Documents"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="professional_certificate"
                    value={props.values.professional_certificate}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Professional Certificate"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="picture_with_white_background"
                    value={props.values.picture_with_white_background}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Picture with White Background"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="country_residency_id_card"
                    value={props.values.country_residency_id_card}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Country Residency ID Card"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="passport_copy"
                    value={props.values.passport_copy}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Passport Copy"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="visa_page_copy"
                    value={props.values.visa_page_copy}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Visa Page Copy"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="leave_applications"
                    value={props.values.leave_applications}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Leave Applications"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="increment_letters"
                    value={props.values.increment_letters}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Increment Letters"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="confirmation_letters"
                    value={props.values.confirmation_letters}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    label="Confirmation Letters"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <CheckBoxInput
                    name="others"
                    value={props.values.others}
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
                  onClick={() => props.resetForm()}
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
