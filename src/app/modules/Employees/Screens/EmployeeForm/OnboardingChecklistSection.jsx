import React, { useEffect, useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { DateInput } from "components/FormControl";
import { Label } from "src/@/components/ui/label";
import { Card, CardContent } from "components/ui/card";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { getOnboardingDocument } from "app/hooks/officeSetting";

const OnboardingChecklistSection = ({ formikProps }) => {
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false since parent handles it
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeDocuments = useCallback(async () => {

    try {
      setIsLoading(true);

      const response = await getOnboardingDocument();

      if (response?.results) {
        setDocumentTemplates(response.results);

        // Check if documents are already initialized by parent
        const currentDocs = formikProps.values.onboardingDocuments;

        const hasExistingDocs = currentDocs && currentDocs.length > 0;

        if (!hasExistingDocs) {
          // Initialize new documents only if parent didn't
          const initialDocuments = response.results.map((template) => ({
            templateId: template.id,
            name: template.name,
            isActive: false,
            hasExpiryDate: false,
            expiryDate: null,
            attachment: [],
          }));

          await formikProps.setFieldValue(
            "onboardingDocuments",
            initialDocuments
          );

        } else {

          // Check if existing docs need template name mapping
          const needsMapping = currentDocs.some((doc) => doc.checklist_id);

          if (needsMapping) {

            const mappedDocuments = currentDocs.map((doc) => {
              const template = response.results.find(
                (t) => t.id === doc.checklist_id
              );
              return {
                id: doc.id,
                templateId: doc.checklist_id,
                name: template?.name || doc.name,
                isActive: doc.is_Active,
                hasExpiryDate: doc.has_expiry_date,
                expiryDate: doc.expiry_date,
                attachment: doc.attachment,
              };
            });

            await formikProps.setFieldValue(
              "onboardingDocuments",
              mappedDocuments
            );
          } else {
          }
        }

        setIsInitialized(true);
      } else {
        console.log("❌ Child: No results in API response");
      }
    } catch (error) {
      console.error("❌ Child: Error in initializeDocuments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {

    // Only initialize if we haven't done so already
    if (!isInitialized) {
      initializeDocuments();
    } else {
      console.log("✅ Child: Already initialized, skipping");
    }
  }, [initializeDocuments, isInitialized]);

  const handleActiveToggle = (index, checked) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].isActive = checked;

    if (!checked) {
      updatedDocs[index].hasExpiryDate = false;
      updatedDocs[index].expiryDate = null;
    }

    formikProps.setFieldValue("onboardingDocuments", updatedDocs);
  };

  const handleExpiryToggle = (index, checked) => {
    const updatedDocs = [...formikProps.values.onboardingDocuments];
    updatedDocs[index].hasExpiryDate = checked;

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

  const getDocumentError = (index, field) => {
    const errors = formikProps.errors?.onboardingDocuments;
    if (errors && errors[index] && errors[index][field]) {
      return errors[index][field];
    }
    return null;
  };

  const getDocumentTouched = (index, field) => {
    const touched = formikProps.touched?.onboardingDocuments;
    if (touched && touched[index] && touched[index][field]) {
      return touched[index][field];
    }
    return false;
  };


  // Show loading state only if we're actively loading
  if (isLoading) {
    console.log("🔄 Child: Rendering: Loading state");
    return <div>Loading document templates...</div>;
  }

  // Get current docs
  const currentDocs = formikProps.values.onboardingDocuments;

  // If no documents exist at all, show no documents message
  if (!currentDocs || currentDocs.length === 0) {
    // Only show loading message if we're still trying to initialize
    if (!isInitialized) {
      return <div>Initializing documents...</div>;
    } else {
      return <div>No onboarding documents found.</div>;
    }
  }


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Onboarding Checklist</h3>
      {currentDocs.map((doc, index) => (
        <Card key={doc.templateId || index} className="pt-4">
          <CardContent className="">
            <div className=" flex justify-between items-center">
              <p className="">{doc.name}</p>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`active-${index}`} className="text-sm">
                  {doc.isActive ? "Active" : "Inactive"}
                </Label>
                <Switch
                  id={`active-${index}`}
                  checked={doc.isActive}
                  onCheckedChange={(checked) =>
                    handleActiveToggle(index, checked)
                  }
                />
              </div>
            </div>

            {doc.isActive && (
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
