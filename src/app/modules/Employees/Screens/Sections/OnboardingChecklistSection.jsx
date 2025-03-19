import React, { useEffect, useState } from "react";
import { Switch } from "src/@/components/ui/switch";
import { DateInput } from "components/FormControl";
import { Label } from "src/@/components/ui/label";
// import { getOnboardingDocumentList } from "app/hooks/onboardingHooks";
import { Card, CardContent } from "components/ui/card";
import { Attachments } from "app/modules/TaskManagment/Sections";

const OnboardingChecklistSection = ({ formikProps }) => {
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Document template structure in employee form
  // {
  //   templateId: 1,
  //   name: "Employee ID Proof",
  //   isRequired: true,
  //   isActive: true,
  //   hasExpiryDate: true,
  //   expiryDate: "2025-05-15",
  //   attachment: []
  // }

  useEffect(() => {
    const fetchDocumentTemplates = async () => {
      try {
        setIsLoading(true);
        // const response = await getOnboardingDocumentList();
        let response={
          results:[
            {
              id:1,
              name:"Employee ID Proof",
              isRequired:true
            },
            {
              id:2,
              name:"Employee Address Proof",
              isRequired:false
            }
          ]
        }
        if (response?.results) {
          // Initialize the onboarding documents in formik if not already present
          if (
            !formikProps.values.onboardingDocuments ||
            formikProps.values.onboardingDocuments.length === 0
          ) {
            const initialDocuments = response.results.map((template) => ({
              templateId: template.id,
              name: template.name,
              isRequired: template.isRequired,
              isActive: false,
              hasExpiryDate: false,
              expiryDate: null,
              attachment: [],
            }));

            formikProps.setFieldValue("onboardingDocuments", initialDocuments);
          }
          setDocumentTemplates(response.results);
        }
      } catch (error) {
        console.error("Error fetching onboarding document templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTemplates();
  }, []);

  const handleActiveToggle = (index, checked) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].isActive = checked;

    // If inactive, clear expiry date
    if (!checked) {
      updatedDocs[index].hasExpiryDate = false;
      updatedDocs[index].expiryDate = null;
    }

    formikProps.setFieldValue("onboardingDocuments", updatedDocs);
  };

  const handleExpiryToggle = (index, checked) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].hasExpiryDate = checked;

    // If expiry is turned off, clear the date
    if (!checked) {
      updatedDocs[index].expiryDate = null;
    }

    formikProps.setFieldValue("onboardingDocuments", updatedDocs);
  };

  const handleExpiryDateChange = (index, date) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].expiryDate = date;
    formikProps.setFieldValue("onboardingDocuments", updatedDocs);
  };

  const handleAttachmentChange = (index, attachment) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].attachment = attachment;
    formikProps.setFieldValue("onboardingDocuments", updatedDocs);
  };

  // Get error for a specific document
  const getDocumentError = (index, field) => {
    const errors = formikProps.errors?.onboardingDocuments;
    if (errors && errors[index] && errors[index][field]) {
      return errors[index][field];
    }
    return null;
  };

  // Get touched status for a specific document
  const getDocumentTouched = (index, field) => {
    const touched = formikProps.touched?.onboardingDocuments;
    if (touched && touched[index] && touched[index][field]) {
      return touched[index][field];
    }
    return false;
  };

  if (isLoading) {
    return <div>Loading document templates...</div>;
  }

  if (
    !formikProps.values.onboardingDocuments ||
    formikProps.values.onboardingDocuments.length === 0
  ) {
    return <div>No onboarding documents found.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Onboarding Checklist</h3>
      {formikProps.values.onboardingDocuments.map((doc, index) => (
        <Card key={index} className="pt-4">
          <CardContent className="">
            <div className=" flex justify-between items-center">
              <p className="">
                {doc.name}
              </p>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`active-${index}`} className="text-sm">
                  {doc.isActive ? "Active" : "Inactive"}
                </Label>
                <Switch
                  id={`active-${index}`}
                  checked={doc.isActive || doc.isRequired}
                  disabled={doc.isRequired}
                  onCheckedChange={(checked) =>
                    handleActiveToggle(index, checked)
                  }
                />
              </div>
            </div>

            {(doc.isActive || doc.isRequired)  && (
              <>
                <div className="my-4">
                  <Attachments
                    attachmentSelected={doc.attachment || []}
                    onChange={(attachment) =>
                      handleAttachmentChange(index, attachment)
                    }
                    acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                    error={getDocumentError(index, "attachment")}
                    touch={getDocumentTouched(index, "attachment")}
                  />
                  {doc.isRequired && doc.attachment?.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Document is required
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`expiry-${index}`} className="text-sm">
                      Expiry Date
                    </Label>
                    <Switch
                      id={`expiry-${index}`}
                      checked={doc.hasExpiryDate}
                      onCheckedChange={(checked) =>
                        handleExpiryToggle(index, checked)
                      }
                    />
                  </div>

                  {doc.hasExpiryDate && (
                    <div className="w-full max-w-xs">
                      <DateInput
                        name={`onboardingDocuments[${index}].expiryDate`}
                        value={doc.expiryDate}
                        error={getDocumentError(index, "expiryDate")}
                        touch={getDocumentTouched(index, "expiryDate")}
                        onChange={(field, date) =>
                          handleExpiryDateChange(index, date)
                        }
                        required={doc.hasExpiryDate}
                        disabled={!doc.hasExpiryDate}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OnboardingChecklistSection;
