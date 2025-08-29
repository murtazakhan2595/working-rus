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
      validateFormSchema,
      submitButtonText = "Submit",
      cancelButtonText,
      formFields,
      renderUpdatedFormValues = () => { },
      columns,
      onFormChange,
      disableSubmit = false,
      loadingMessage,
      onSubmitClick = () => { },
      DataList = [],
    } = formConfig;

    const handleClose = () => {
      setIsCloseConfirmationOpen(true);
    };

    const HandleSubmit = async (values, resetForm) => {
      try {
        setIsSubmittingForm(true);
        const response = await handleSubmit(values, resetForm);
        if (response?.status) {
          setMessageConfig(response);
          setOpenActionMessage(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmittingForm(false);
      }
    };

    const validateFieldValue = useCallback(
      async (value, label, id) => {
        if (!value) {
          setValidateFieldErrors((prevErrors) => {
            const updated = { ...prevErrors };
            delete updated[label];
            return updated;
          });
          return 0;
        }

        const filtered = DataList.filter(
          (obj) =>
            obj[label]?.toLowerCase() === value.trim().toLowerCase() &&
            parseInt(obj.id) !== parseInt(id)
        );

        if (filtered.length > 0) {
          setValidateFieldErrors((prevErrors) => ({
            ...prevErrors,
            [label]: `Already exists. Please choose a different value`,
          }));
        } else {
          setValidateFieldErrors((prevErrors) => {
            const updated = { ...prevErrors };
            delete updated[label];
            return updated;
          });
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
              const schemaErrors =
                typeof validateFormSchema === "function"
                  ? validateFormSchema(values || {})
                  : {};

              if (schemaErrors && typeof schemaErrors === "object") {
                errors = { ...errors, ...schemaErrors };
              }

              // Optional debugging
              console.error("Form Errors:", errors, "Values:", values);

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
                              shouldRender = true, // NEW: Default to true for backward compatibility
                              renderCondition = true, // NEW: Alternative prop name for conditional rendering
                              customComponent,
                              validateDuplicate = false,
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

                            // NEW: Check if field should be rendered
                            // Support both shouldRender and renderCondition props for flexibility
                            const isFieldVisible =
                              shouldRender && renderCondition;

                            // NEW: Skip rendering if field should not be visible
                            if (!isFieldVisible) {
                              return null;
                            }

                            const error = get(props.errors, name);
                            return (
                              <div
                                className={`space-y-4 ${colsSpan ? `col-span-${colsSpan || 1}` : ""
                                  }`}
                                key={name || index}
                              >
                                <InputField
                                  error={typeof error === "string" ? error : ""}
                                  touch={get(props?.touched, name)}
                                  value={
                                    value ? value : get(props?.values, name)
                                  }
                                  onChange={async (field, value) => {
                                    console.log(field, value);
                                    if (onFieldUpdate && typeof onFieldUpdate === "function")
                                      await onFieldUpdate(field, value, props.values, props.setFieldValue);
                                    if (validateDuplicate) {
                                      await validateFieldValue(value, name, props.values.id);
                                    }

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
                <div className="p-6 border-t border-gray-200 bg-gray-50">
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
                    <Button
                      type="submit"
                      size="lg"
                      variant="default"
                      onClick={(event) => {
                        event.preventDefault();
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
                  </div>
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
