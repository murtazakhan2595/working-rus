import { useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Button } from "../../../../components/ui/button";
import { Formik } from "formik";
import { RadioGroupInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { Switch } from "../../../../src/@/components/ui/switch";
import { Label } from "../../../../src/@/components/ui/label";

import { saveEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";

import { deleteEarnAndDeduction } from "app/hooks/payroll";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { DetailCard } from "components/SheetCardExtension";
import { DetailBox } from "components/SheetCardExtension";

const initialEarningAndDeduction = {
  name: "",
  income_type: "earning",
  amounts_types: "fixed",
  amounts: "",
  is_active: true, // Default active
};

const validateForm = (values, existingComponents = []) => {
  const errors = {};
  
  if (!values.name) {
    errors.name = "Component name is required";
  } else if (values.name.length > 50) {
    errors.name = "Component name cannot exceed 50 characters";
  } else if (existingComponents && existingComponents.length > 0) {
    // When editing, exclude the current component from duplicate check
    const isDuplicate = existingComponents.some(comp => 
      comp.name && 
      comp.name.toLowerCase() === values.name.toLowerCase() && 
      comp.id !== values.id
    );
    
    if (isDuplicate) {
      errors.name = "Component name already exists";
    }
  }
  
  if (!values.income_type) {
    errors.income_type = "Component type is required";
  }
  
  if (!values.amounts_types) {
    errors.amounts_types = "Amount type is required";
  }
  
  if (!values.amounts) {
    errors.amounts = "Amount is required";
  } else {
    const amountNum = parseFloat(values.amounts);
    const isValidNumber = /^\d+(\.\d+)?$/.test(values.amounts);
    
    if (!isValidNumber) {
      errors.amounts = "Must be a valid number";
    } else if (values.amounts_types === "percentage" && amountNum > 100) {
      errors.amounts = "Percentage cannot exceed 100%";
    }
  }
  
  return errors;
};

const AddComponentSheet = ({
  component,
  openSheet,
  reload,
  isOpen,
  setIsOpen,
  onClose,
  onSuccess,
  existingComponents = []
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [earnAndDeduction, setEarnAndDeduction] = useState(
    component || initialEarningAndDeduction
  );
  const formSheetData = {
    triggerText: component ? "" : "Add Component",
    title: component ? "Components" : "Add Component",

    description: null,
    footer: null,
  };

  const handleSubmit = async (values) => {
    try {
      const response = await saveEarnAndDeduction(values);
      if (response) {
        if (values.id) {
          toast.success("Component updated successfully");
        } else {
          toast.success("Component added successfully");
        }
        setIsOpen(false);
        setIsEdit(false);
        
        // Call onSuccess with the newly created/updated component to update UI immediately
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
        
        // Ensure reload is called properly if onSuccess isn't available
        if (typeof reload === 'function' && typeof onSuccess !== 'function') {
          await reload();
        }
      }
    } catch (error) {
      toast.error("Failed to save component");
      console.error("Save error:", error);
    }
  };

  const handleComponentDelete = async () => {
    try {
      const response = await deleteEarnAndDeduction(component.id);
      if (response) {
        toast.success("Component deleted successfully");
        setIsOpen(false);
        
        // Ensure reload is called properly
        if (typeof reload === 'function') {
          await reload();
        }
      }
    } catch (error) {
      toast.error("Failed to delete component");
      console.error("Delete error:", error);
    }
  };

  const handleOpenState = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsEdit(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <>
      <div>
        {handleCloseWithConfirmation({
          isOpen: closeSheet,
          setCloseSheet,
          setIsOpen,
        })}
        <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={handleOpenState}
          width="568px"
        >
          {component && !isEdit ? (
            <ViewComponent
              component={component}
              handleComponentDelete={handleComponentDelete}
              setIsEdit={setIsEdit}
              isDelete={isDelete}
              setIsDelete={setIsDelete}
            />
          ) : (
            <ComponentForm
              earnAndDeduction={earnAndDeduction}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              setIsEdit={setIsEdit}
              onClose={handleClose}
              onSuccess={onSuccess}
              existingComponents={existingComponents}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
};

export default AddComponentSheet;

const ComponentForm = ({
  earnAndDeduction,
  handleSubmit,
  setIsOpen,
  setIsEdit,
  onClose,
  onSuccess,
  existingComponents = []
}) => {
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  
  // Check for duplicate name as user types
  const checkDuplicateName = (name, id) => {
    if (!name || !existingComponents || existingComponents.length === 0) return false;
    
    return existingComponents.some(comp => 
      comp.name && 
      comp.name.toLowerCase() === name.toLowerCase() && 
      comp.id !== id
    );
  };

  return (
    <Formik
      initialValues={earnAndDeduction}
      validate={(values) => validateForm(values, existingComponents)}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        // Final check for duplicates before submitting
        if (checkDuplicateName(values.name, values.id)) {
          setErrors({ name: "Component name already exists" });
          setShowDuplicateError(true);
          setSubmitting(false);
          toast.error(`"${values.name}" already exists in the component list. Please use a different name.`);
          return;
        }
        
        setShowDuplicateError(false);
        handleSubmit(values);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Component</div>
              </div>
              <div className="pt-4">
                <div>Component Type</div>
              </div>
              <RadioGroupInput
                name={"income_type"}
                error={props.errors?.income_type}
                touch={props.touched?.income_type}
                value={props.values?.income_type}
                options={[
                  { value: "earning", label: "Earning" },
                  { value: "deduction", label: "Deduction" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <div className="pt-4">
                <div>Component Name</div>
              </div>
              <TextInput
                name={"name"}
                error={props.errors?.name}
                touch={props.touched?.name}
                value={props.values?.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                  // Check for duplicates as user types
                  if (checkDuplicateName(value, props.values.id)) {
                    props.setFieldError(field, "Component name already exists");
                    setShowDuplicateError(true);
                  } else {
                    setShowDuplicateError(false);
                  }
                }}
                placeholder="Component Name"
              />
              {showDuplicateError && (
                <div className="text-xs font-medium text-red-500">
                  This component name already exists in the list. Please use a different name.
                </div>
              )}
            </div>
          </div>

          <>
            <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Amount</div>
                </div>
                <div className="pt-4">
                  <div>Amount type</div>
                </div>
                <div>
                  <RadioGroupInput
                    name={"amounts_types"}
                    error={props.errors?.amounts_types}
                    touch={props.touched?.amounts_types}
                    value={props.values?.amounts_types}
                    options={[
                      { value: "fixed", label: "Fixed" },
                      { value: "percentage", label: "Variable" },
                    ]}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
                <div className="pt-4">
                  <div>Amount </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-zinc-900">
                    {props.values.amounts_types === "fixed"
                      ? "Flat Amount"
                      : "% of Gross"}
                  </div>
                  <TextInput
                    value={props.values.amounts}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    name={"amounts"}
                    error={props.errors?.amounts}
                    touch={props.touched?.amounts}
                    placeholder={
                      props.values.amounts_types === "fixed"
                        ? "Enter amount"
                        : "Enter percentage"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={props.values.is_active}
                onCheckedChange={(value) =>
                  props.setFieldValue("is_active", value)
                }
              />
              <Label htmlFor="is_active">Activate</Label>
            </div>
          </>
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button variant="outline" size="lg" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="lg" variant="default">
              {"Save"}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const ViewComponent = ({
  isDelete,
  setIsDelete,
  component,
  handleComponentDelete,
  setIsEdit,
}) => {
  const details = [
    { label: "Amount Type", value: component.amounts_types },
    { label: "Amount Rate", value: component.amounts },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div class="w-[217px] h-9 py-1.5 justify-start items-start gap-3 inline-flex">
          <div class="text-black text-sm font-semibold  ">{component.name}</div>
          <div class="px-3 py-[3px] rounded-[999px] border border-[#f0f0f3] justify-center items-center gap-1.5 flex">
            <div class="w-1.5 h-1.5 bg-[#29a385] rounded-full"></div>
            <div class="text-neutral-1200 text-xs font-semibold capitalize leading-3">
              {component.income_type}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsDelete(true);
            }}
          >
            Delete
          </Button>
          {isDelete && (
            <AlertDialogue
              isOpen={isDelete}
              setIsOpen={setIsDelete}
              handleContinue={handleComponentDelete}
              continueText="Delete"
              title="Are you sure you want to delete this component?"
              description="This action cannot be undone. Once deleted, the component data
                  will be permanently removed."
            />
          )}
        </div>
      </div>
      <DetailCard
        detailCardTitle="Component Details"
        date={component?.created_at}
        dateTitle="Created On"
      >
        {details.map((detail, index) => (
          <DetailBox label={detail?.label} value={detail?.value} />
        ))}
      </DetailCard>
    </>
  );
};
