import { Button } from "components/ui/button";
import React, { useState, forwardRef } from "react";
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

const SheetUI = forwardRef(
  (
    {
      isOpen = true,
      setIsOpen = () => {},
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

    // Extract form configurations
    const {
      initialValues,
      enableReinitialize,
      handleSubmit,
      validateFormSchema,
      submitButtonText = "Submit",
      cancelButtonText,
      formFiels,
      renderUpdatedFormValues = () => {},
      columns,
      onFormChange,
      disableSubmit = false,
      loadingMessage,
      onSubmitClick = () => {},
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
    return (
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
            const errors = validateFormSchema(values);
            // if (errors)
            console.error("Form Errors:", errors, "Values:", values);
            if (renderUpdatedFormValues) {
              renderUpdatedFormValues(values);
            }
            if (onFormChange) {
              onFormChange(values);
            }
            return errors;
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {children}
              {formFiels?.map(
                (
                  {
                    InputFields,
                    sheetCardExtension,
                    sheetCardTitle,
                    sheetCardName,
                  },
                  index
                ) => {
                  const sheetCardError = get(props.errors, sheetCardName);
                  return (
                    <div key={index}>
                      <FormBody
                        sheetCardExtension={sheetCardExtension}
                        sheetCardTitle={sheetCardTitle}
                        sheetCardError={sheetCardError}
                        columns={columns}
                      >
                        {InputFields?.map((fieldsConfig, index) => {
                          const {
                            name,
                            required,
                            disabled,
                            label,
                            onFieldUpdate = async () => {},
                            options,
                            value,
                            colsSpan,
                            date,
                            placeholder,
                            maxRows,
                            InputField,
                            variant,
                            multiple,
                            subColumns,
                          } = fieldsConfig;
                          const error = get(props.errors, name);
                          return (
                            <div
                              className={`space-y-4 ${
                                colsSpan ? `col-span-${colsSpan || 1}` : ""
                              }`}
                              key={name || index}
                            >
                              <InputField
                                name={name}
                                options={options}
                                error={typeof error === "string" ? error : ""}
                                touch={get(props?.touched, name)}
                                value={value ? value : get(props?.values, name)}
                                required={required}
                                disabled={disabled}
                                label={label}
                                placeholder={placeholder}
                                onChange={async (field, value) => {
                                  await onFieldUpdate(field, value , props.values);
                                  await props?.setFieldValue(field, value);
                                }}
                                maxRows={maxRows}
                                date={date}
                                variant={variant}
                                multiple={multiple}
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
                      : loadingMessage
                      ? loadingMessage
                      : submitButtonText}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
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
      </SheetVariant>
    );
  }
);
const FormBody = ({
  children,
  sheetCardExtension = false,
  sheetCardTitle = null,
  sheetCardError = null,
  columns,
}) => {
  const className = `grid grid-cols-1 gap-4 lg:grid-cols-${
    columns || 1
  } md:grid-cols-${parseInt((columns || 1) / 2 + 1)}`;
  return sheetCardExtension ? (
    <SheetCardExtension
      title={sheetCardTitle}
      className={sheetCardError ? InvalidInput : ""}
    >
      <div className={className}>{children}</div>
      {sheetCardError && <div className={`${errorClassName} mt-4`}>{sheetCardError}</div>}
    </SheetCardExtension>
  ) : (
    <div className={className}>{children}</div>
  );
};
const SheetVariant = ({
  children,
  isOpen = true,
  className,
  setIsOpen = () => {},
  setIsCloseConfirmationOpen = () => {},
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
