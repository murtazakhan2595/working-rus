import { Button } from "components/ui/button";
import React, { useState, forwardRef } from "react";
import { DialogBox } from "components";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik } from "formik";

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
    } = formConfig;

    const handleClose = () => {
      setIsCloseConfirmationOpen(true);
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
            handleSubmit(values, resetForm);
          }}
          validate={(values) => {
            const errors = validateFormSchema(values);
            // if (errors)
            console.error("Form Errors:", errors, "Values:", values);
            if (renderUpdatedFormValues) {
              renderUpdatedFormValues(values);
            }
            return errors;
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {children}
              {formFiels?.map(
                ({ InputFiels, sheetCardExtension, sheetCardTitle }, index) => {
                  return (
                    <div key={index}>
                      <FormBody
                        sheetCardExtension={sheetCardExtension}
                        sheetCardTitle={sheetCardTitle}
                        columns={columns}
                      >
                        {InputFiels?.map(
                          ({
                            name,
                            required,
                            disabled,
                            label,
                            onChange,
                            options,
                            value,
                            colsSpan,
                            date,
                            placeholder,
                            maxRows,
                            InputField,
                            variant,
                            multiple,
                            allowUpdate,
                          }) => {
                            return (
                              <div
                                className={`space-y-4 ${
                                  colsSpan ? `col-span-${colsSpan || 1}` : ""
                                }`}
                                key={name}
                              >
                                <InputField
                                  name={name}
                                  options={options}
                                  error={props?.errors[name]}
                                  touch={props?.touched[name]}
                                  value={value ? value : props?.values[name]}
                                  required={required}
                                  disabled={disabled}
                                  label={label}
                                  placeholder={placeholder}
                                  onChange={(field, value) => {
                                    props?.setFieldValue(field, value);
                                    if (onChange) {
                                      onChange(field, value);
                                    }
                                  }}
                                  maxRows={maxRows}
                                  date={date}
                                  variant={variant}
                                  allowUpdate={allowUpdate}
                                  multiple={multiple}
                                />
                              </div>
                            );
                          }
                        )}
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
                    onClick={props.handleSubmit}
                  >
                    {submitButtonText}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </SheetVariant>
    );
  }
);
const FormBody = ({
  children,
  sheetCardExtension = false,
  sheetCardTitle = null,
  columns,
}) => {
  const className = `grid grid-cols-1 gap-4 lg:grid-cols-${
    columns || 1
  } md:grid-cols-${parseInt((columns || 1) / 2 + 1)}`;
  return sheetCardExtension ? (
    <SheetCardExtension title={sheetCardTitle}>
      <div className={className}>{children}</div>
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
