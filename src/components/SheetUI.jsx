import { Button } from "components/ui/button";
import React, { useState, forwardRef, useCallback } from "react";
import { DialogBox } from "components";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik } from "formik";
import ActionAlert from "components/ui/ActionAlert";
import get from "lodash/get";
import { errorClassName, InvalidInput } from "components/FormControl";
import { validateRequiredFields } from "app/utils/FormSchema/generalFormSchema";

const SheetUI = forwardRef(
  (
    {
      isOpen = true,
      setIsOpen = () => { },
      children,
      className,
      variant = "modal", // Determines if the component is a 'modal' or 'sheet'
      sheetConfig = {
        triggerText: "Submit",
        title: "Form",
        description: null,
        footer: null,
        width: "678px", // Default width for sheet variant
      },
      formConfig = {},
    },
    ref
  ) => {
    const [isCloseConfirmationOpen, setIsCloseConfirmationOpen] =
      useState(false);
    const formRef = React.createRef();
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [openActionMessage, setOpenActionMessage] = useState(false);
    const [messageConfig, setMessageConfig] = useState(false);
    const [validateFieldErrors, setValidateFieldErrors] = useState({});

    // Extract form configurations
    const {
      initialValues,
      enableReinitialize,
      handleSubmit,
      validateFormSchema = () => { },
      submitButtonText = "Submit",
      additionalButtonConfig = [],
      cancelButtonText,
      formFields,
      renderUpdatedFormValues = () => { },
      columns,
      onFormChange,
      disableSubmit = false,
      loadingMessage,
      onSubmitClick = () => { },
      DataList = [],
      customFooter = null, // NEW: Custom footer function
    } = formConfig;

    const handleClose = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsCloseConfirmationOpen(true);
    };

    const HandleSubmit = async (values, resetForm, CustomClick) => {
      try {
        setIsSubmittingForm(true);
        if (CustomClick && typeof CustomClick === "function") {
          const response = await CustomClick(values, resetForm);
          if (response?.status) {
            setMessageConfig(response);
            setOpenActionMessage(true);
          }
        } else {
          const response = await handleSubmit(values, resetForm);
          if (response?.status) {
            setMessageConfig(response);
            setOpenActionMessage(true);
          }
        }


      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmittingForm(false);
      }
    };


    /**
 * ✅ Validates if a given field value or a combination of field values already exists in the DataList.
 *
 * @param {string|number|array} value - The field value to validate.
 * @param {string} label - The name of the field being validated.
 * @param {object} formValues - Object containing all field values in the current form.
 * @param {string[]} combinationKeys - Array of field names that define a unique combination for validation.
 */
    const validateDuplicateFieldValue = useCallback(
      async (value, label, formValues = {}, combinationKeys, errorMessage) => {
        const { id } = formValues;

        // 🧩 Step 1: Basic validation
        setValidateFieldErrors((prevErrors) => {
          const updated = { ...prevErrors };
          if (combinationKeys && Array.isArray(combinationKeys) && combinationKeys.length > 0) {
            // 🧹 Remove all related combination field errors
            combinationKeys.forEach((key) => {
              delete updated[key];
            });
          } else {
            // 🧹 Remove only the current field error
            delete updated[label];
          }

          return updated;
        });
        if (value === undefined || value === null || value === "")
          return; // if value is null validation is not required

        // 🧩 Step 2: Defensive checks
        if (!Array.isArray(DataList)) {
          console.warn("⚠️ DataList is not an array. Skipping duplicate validation.");
          return;
        }

        // 🧩 Step 3: Normalize a value (handles string, number, or array)
        const normalize = (val) => {
          if (Array.isArray(val)) return val.map((v) => v?.toString().trim().toLowerCase()).join(",");
          if (typeof val === "number") return val.toString();
          return val?.toString().trim().toLowerCase() || "";
        };

        const normalizedValue = normalize(value);

        // 🧩 Step 4: Filter out duplicates
        const filtered = DataList.filter((obj) => {
          if (parseInt(obj.id) === parseInt(id)) return false; // skip self

          // 🧩 Combination key validation
          if (combinationKeys && Array.isArray(combinationKeys) && combinationKeys.length > 0) {
            return combinationKeys.every((key) => {
              const currentVal = key === label ? normalizedValue : normalize(formValues[key]);
              const targetVal = normalize(obj[key]);
              return currentVal === targetVal;
            });
          }

          // 🧩 Single field validation
          return normalize(obj[label]) === normalizedValue;
        });

        // 🧩 Step 5: Update validation errors
        if (filtered.length > 0) {
          const duplicateType =
            combinationKeys && combinationKeys.length > 0
              ? errorMessage ?? `Combination of [${[...combinationKeys, label].join(", ")}] already exists.`
              : `Value already exists. Please choose a different one.`;

          setValidateFieldErrors((prevErrors) => ({
            ...prevErrors,
            [label]: duplicateType,
          }));
        }
      },
      [DataList, setValidateFieldErrors]
    );


    return (
      <>
        {openActionMessage && (
          <ActionAlert
            isOpen={openActionMessage}
            onClose={() => {
              setOpenActionMessage(false);
              setIsOpen(false);
            }}
            title={messageConfig.title || "Request Submitted!"}
            description={
              messageConfig.description ||
              "Your form has been submitted successfully!."
            }
            messageType={messageConfig.messageType || "SUCCESS"}
          />
        )}
        <SheetVariant
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          variant={variant}
          sheetConfig={sheetConfig}
          isCloseConfirmationOpen={isCloseConfirmationOpen}
          setIsCloseConfirmationOpen={setIsCloseConfirmationOpen}
          className={className}
        >
          <Formik
            initialValues={initialValues}
            innerRef={formRef}
            enableReinitialize={enableReinitialize}
            onSubmit={(values, { resetForm }) => {
              HandleSubmit(values, resetForm);
            }}
            validate={(values) => {
              let errors = {};

              // Ensure formFields is a valid array
              if (Array.isArray(formFields)) {
                for (const Field of formFields) {
                  if (!Field || typeof Field !== "object") continue;

                  const { InputFields } = Field;

                  // Validate required fields if InputFields is an array
                  if (Array.isArray(InputFields)) {
                    const requiredFieldErrors = validateRequiredFields(
                      InputFields,
                      values
                    );

                    if (
                      requiredFieldErrors &&
                      typeof requiredFieldErrors === "object"
                    ) {
                      for (const key of Object.keys(requiredFieldErrors)) {
                        errors[key] = requiredFieldErrors[key];
                      }
                    }
                  }
                }
              }

              // Merge with schema-based validations
              const schemaErrors = typeof validateFormSchema === "function" ? validateFormSchema(values || {}) : {};

              if (schemaErrors && typeof schemaErrors === "object") {
                errors = { ...errors, ...schemaErrors };
              }

              // Notify form value update
              if (typeof renderUpdatedFormValues === "function") {
                renderUpdatedFormValues(values);
              }

              if (typeof onFormChange === "function") {
                onFormChange(values);
              }

              // Add async field validation errors
              if (
                validateFieldErrors &&
                typeof validateFieldErrors === "object" &&
                !Array.isArray(validateFieldErrors)
              ) {
                for (const [field, message] of Object.entries(
                  validateFieldErrors
                )) {
                  if (
                    typeof field === "string" &&
                    typeof message === "string"
                  ) {
                    errors[field] = message;
                  }
                }
              }
              console.log('Values', values, 'Error', errors)
              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                {children}
                {formFields?.map(
                  (
                    {
                      InputFields,
                      sheetCardExtension,
                      sheetCardTitle,
                      sheetCardName,
                      customComponent,
                      description,
                    },
                    index
                  ) => {
                    const sheetCardError = get(props.errors, sheetCardName);

                    // Handle custom component if provided
                    if (customComponent) {
                      return (
                        <div key={index}>
                          {typeof customComponent === "function"
                            ? customComponent({ form: props })
                            : customComponent}
                        </div>
                      );
                    }

                    return (
                      <div key={index}>
                        <FormBody
                          sheetCardExtension={sheetCardExtension}
                          sheetCardTitle={sheetCardTitle}
                          sheetCardError={sheetCardError}
                          columns={columns}
                          description={description}
                        >
                          {InputFields?.map((fieldsConfig, index) => {
                            const {
                              name,
                              onFieldUpdate,
                              value,
                              colsSpan,
                              InputField,
                              subColumns,
                              shouldRender = true,
                              renderCondition = true,
                              customComponent,
                              validateDuplicate = false, // flag indicating whether to check for duplicate entries in the DataList  
                              combinationKeys = null, // array of field names used to identify duplicate record combinations in the DataList
                              duplicateErrorMessage = null, // error message to display if identify duplicate record combinations in the DataList
                            } = fieldsConfig;

                            // Handle custom component inside InputFields
                            if (customComponent) {
                              return (
                                <div
                                  className={`space-y-4 ${colsSpan ? `col-span-${colsSpan || 1}` : ""
                                    }`}
                                  key={name || `custom-${index}`}
                                >
                                  {typeof customComponent === "function"
                                    ? customComponent({
                                      field: fieldsConfig,
                                      form: props,
                                    })
                                    : customComponent}
                                </div>
                              );
                            }

                            // Check if field should be rendered
                            const isFieldVisible = (() => {
                              if (typeof shouldRender === "function") {
                                return shouldRender(props.values);
                              }
                              return shouldRender && renderCondition;
                            })();

                            // Skip rendering if field should not be visible
                            if (!isFieldVisible) {
                              return null;
                            }

                            const error = get(props.errors, name);
                            return (
                              <div className={`space-y-4 ${colsSpan ? `col-span-${colsSpan || 1}` : ""}`} key={`${name}-${index}`}>
                                <InputField
                                  error={typeof error === "string" ? error : ""}
                                  touch={get(props?.touched, name)}
                                  value={
                                    value ? value : get(props?.values, name)
                                  }
                                  onChange={async (field, value) => {
                                    if (onFieldUpdate && typeof onFieldUpdate === "function")
                                      onFieldUpdate(field, value, props.values, props.setFieldValue);
                                    if (validateDuplicate)
                                      validateDuplicateFieldValue(value, name, props.values, combinationKeys ? [...(combinationKeys || []), name] : null, duplicateErrorMessage);
                                    props?.setFieldValue(field, value);
                                  }}
                                  columns={subColumns}
                                  {...fieldsConfig}
                                />
                              </div>
                            );
                          })}
                        </FormBody>
                      </div>
                    );
                  }
                )}

                {/* Footer Section */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  {customFooter && typeof customFooter === "function" ? (
                    // Render custom footer if provided
                    customFooter(props)
                  ) : (
                    // Render default footer buttons
                    <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                      {cancelButtonText && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleClose}
                          type="button"
                        >
                          {cancelButtonText}
                        </Button>
                      )}
                      {additionalButtonConfig.map(({ buttonText, variant, onButtonClick, disabled, loadingText, validateForm }, index) =>
                        <Button
                          size="lg"
                          variant={variant}
                          onClick={(event) => {
                            debugger
                            event.preventDefault();
                            event.stopPropagation();
                            if (validateForm) {
                              if (
                                validateFieldErrors &&
                                typeof validateFieldErrors === "object" &&
                                !Array.isArray(validateFieldErrors) && Object.keys(validateFieldErrors).length > 0
                              ) {
                                // Mark all fields as touched
                                Object.keys(validateFieldErrors).forEach(field => {
                                  props.setFieldTouched(field, true, false);
                                });

                                // Clone and set errors
                                props.setErrors({ ...validateFieldErrors });

                                // Force validation (optional but safe)
                                props.validateForm();

                                return;
                              }
                            }
                            HandleSubmit(props.values, () => { }, onButtonClick);
                          }}
                          key={`${buttonText}-${index}`}
                          disabled={disableSubmit || isSubmittingForm || disabled}
                        >
                          {isSubmittingForm
                            ? loadingText
                            : (disableSubmit || disabled) && loadingMessage
                              ? loadingText
                              : buttonText}
                        </Button>
                      )}
                      {submitButtonText && (
                        <Button
                          type="submit"
                          size="lg"
                          variant="default"
                          onClick={(event) => {

                            event.preventDefault();
                            event.stopPropagation();
                            onSubmitClick(props.values);
                            props.handleSubmit();
                          }}
                          disabled={disableSubmit || isSubmittingForm}
                        >
                          {isSubmittingForm
                            ? "Submitting Form..."
                            : disableSubmit && loadingMessage
                              ? loadingMessage
                              : submitButtonText}
                        </Button>
                      )}

                    </div>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </SheetVariant>
      </>
    );
  }
);

const FormBody = ({
  children,
  sheetCardExtension = false,
  sheetCardTitle = null,
  sheetCardError = null,
  columns,
  description,
}) => {
  const className = `grid grid-cols-1 gap-4 lg:grid-cols-${columns || 1
    } md:grid-cols-${parseInt((columns || 1) / 2 + 1)}`;

  return sheetCardExtension ? (
    <SheetCardExtension
      title={sheetCardTitle}
      className={sheetCardError ? InvalidInput : ""}
    >
      {description && (
        <div className="text-neutral-1000 text-xs mb-4">{description}</div>
      )}
      <div className={className}>{children}</div>
      {sheetCardError && (
        <div className={`${errorClassName} mt-4`}>{sheetCardError}</div>
      )}
    </SheetCardExtension>
  ) : (
    <div className={className}>{children}</div>
  );
};

const SheetVariant = ({
  children,
  isOpen = true,
  className,
  setIsOpen = () => { },
  setIsCloseConfirmationOpen = () => { },
  isCloseConfirmationOpen = false,
  variant = "modal", // Can be 'modal' or 'sheet'
  sheetConfig = {
    triggerText: "Submit",
    title: "Form",
    description: null,
    footer: null,
    width: "678px", // Default width for sheet variant
  },
}) => {
  return (
    <>
      {/* Render close confirmation dialog if needed */}
      {isCloseConfirmationOpen &&
        handleCloseWithConfirmation({
          isOpen: isCloseConfirmationOpen,
          setCloseSheet: setIsCloseConfirmationOpen,
          setIsOpen,
        })}
      <div className={className}>
        {variant === "modal" ? (
          // Render a dialog box when variant is 'modal'
          <DialogBox
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={sheetConfig.title}
            description={sheetConfig.description}
            className={sheetConfig.className}
          >
            {children}
          </DialogBox>
        ) : variant === "sheet" ? (
          // Render a sheet component when variant is 'sheet'
          <SheetComponent
            {...sheetConfig}
            width={sheetConfig.width}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            {children}
          </SheetComponent>
        ) : (
          // Default case if variant is neither 'modal' nor 'sheet'
          children
        )}
      </div>
    </>
  );
};

export default SheetUI;
