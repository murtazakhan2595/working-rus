import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../src/@/components/ui/radio-group";
import { Button } from "../../../../src/@/components/ui/button";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { Formik } from "formik";
import { RadioGroupInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { DateInput } from "components/form-control";
import { Switch } from "../../../../src/@/components/ui/switch";
import { Label } from "../../../../src/@/components/ui/label";

import { saveEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../../../../components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../src/@/components/ui/alert-dialog";
import { deleteEarnAndDeduction } from "app/hooks/payroll";

const initialEarningAndDeduction = {
  name: "",
  income_type: "earning",
  amounts_types: "fixed",
  amounts: "",
  is_active: false,
};

const AddComponentSheet = ({ component, openSheet, reload }) => {
  console.log("Component:", component);
  console.log("Open Sheet:", openSheet);
  const [isOpen, setIsOpen] = useState(openSheet || false);
  const [isEdit, setIsEdit] = useState(false);

  const [earnAndDeduction, setEarnAndDeduction] = useState(
    component || initialEarningAndDeduction
  );
  useEffect(() => {
    if (openSheet || component) {
      setIsOpen(true); 
       setIsEdit(false);
    } else {
      setIsOpen(false); // Close the sheet otherwise
    }
  }, [openSheet, component]);
  const formSheetData = {
    triggerText: component ? "" : "Add Component",
    title: component ? "Components" : "Add Component",

    description: null,
    footer: null,
  };

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    const response = await saveEarnAndDeduction(values);
    if (response) {
      if(values.id){
        toast.success("Component updated successfully");

      }
      else{
        toast.success("Component added successfully");
      }
      setIsOpen(false);
      reload()
    }
  };

  const handleComponentDelete = async () => {
    console.log("Delete component:", component);
    const response = await deleteEarnAndDeduction(component.id);
    if (response) {
      toast.success("Component deleted successfully");
      setIsOpen(false);
      reload()
    }
  };

  return (
    <>
      <div>
        <SheetComponent
          sheetData={formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          {component && !isEdit ? (
            <ViewComponent
              component={component}
              handleComponentDelete={handleComponentDelete}
              setIsEdit={setIsEdit}
            />
          ) : (
            <ComponentForm
              earnAndDeduction={earnAndDeduction}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              editMode={isEdit}
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
  editMode,
}) => {
    const [amountInputs, setAmountInputs] = useState({
      option1: "", // For Flat Amount
      option2: "", // For Percentage of Gross
      option3: "", // For Percentage of Basic
    });
  const [selectedRadio, setSelectedRadio] = useState("");
  const handleRadioChange = (value) => {
    // Reset the amount input for the selected radio option
    setSelectedRadio(value);
    setAmountInputs((prev) => ({ ...prev, [value]: "" }));
  };
  const formatValueForBackend = (option, value) => {
    if (option === "option1") {
      return `AED ${parseFloat(value).toFixed(2)} Flat Amount`; // Flat Amount
    } else if (option === "option2") {
      return `${value}% of Gross`; // Percentage of Gross
    } else if (option === "option3") {
      return `${value}% of Basic`; // Percentage of Basic
    }
    return value;
  };
   const handleFormSubmit = (values) => {
     const formattedAmount = formatValueForBackend(
       selectedRadio,
       amountInputs[selectedRadio]
     );

     const finalValues = {
       ...values,
       amounts: formattedAmount, // Add the formatted value
     };

     handleSubmit(finalValues); // Call the provided handleSubmit with formatted values
   };


  return (
    <Formik
      initialValues={earnAndDeduction}
      // validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
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
                }}
                placeholder="Component Name"
              />
            </div>
          </div>

          <>
            <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
              <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Amount</div>
                </div>
                <div className="pt-4">
                  <div>Amount type</div>
                </div>
                <div>
                  <RadioGroupInput
                    name={"amounts_type"}
                    error={props.errors?.amounts_type}
                    touch={props.touched?.amounts_type}
                    value={props.values?.amounts_type}
                    options={[
                      { value: "fixed", label: "Fixed" },
                      { value: "variable", label: "Variable" },
                    ]}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
                <div className="pt-4">
                  <div>Amount </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <RadioGroup defaultValue="" onValueChange={handleRadioChange}>
                    {[
                      { value: "option1", label: "Flat Amount" },
                      { value: "option2", label: "Percentage of Gross" },
                      { value: "option3", label: "Percentage of Basic" },
                    ].map((option) => (
                      <div
                        className="flex items-center space-x-4"
                        key={option.value}
                      >
                        {/* Label before radio button */}
                        <div className="text-zinc-900">{option.label}</div>

                        {/* Radio Button */}
                        <RadioGroupItem
                          value={option.value}
                          id={`r${option.value.slice(-1)}`}
                        />

                        {/* Text Input */}
                        <TextInput
                          value={
                            selectedRadio === option.value
                              ? amountInputs[option.value]
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            // Keep the raw value in state
                            setAmountInputs((prev) => ({
                              ...prev,
                              [option.value]: value,
                            }));
                            if (selectedRadio === option.value) {
                              props.setFieldValue("amounts", value); // Store raw value in form state
                            }
                          }}
                          placeholder={
                            option.value === "option1"
                              ? "Enter amount"
                              : "Enter percentage"
                          }
                          disabled={selectedRadio !== option.value}
                        />
                      </div>
                    ))}
                  </RadioGroup>
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
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel{" "}
              </Button>
              <Button type="submit" size="lg" variant="default">
                {"Save"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};


const ViewComponent = ({ component, handleComponentDelete, setIsEdit }) => {
  const details = [
    { label: "Amount Type", value: component.amounts_types },
    { label: "Amount Rate", value: component.amounts },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div class="w-[217px] h-9 py-1.5 justify-start items-start gap-3 inline-flex">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-[21px]">
            {component.name}
          </div>
          <div class="px-3 py-[3px] rounded-[999px] border border-[#f0f0f3] justify-center items-center gap-1.5 flex">
            <div class="w-1.5 h-1.5 bg-[#29a385] rounded-full"></div>
            <div class="text-[#1c2024] text-xs font-semibold font-['Inter'] leading-3">
              {component.income_type}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={()=>{setIsEdit(true)}}>
            Edit
          </Button>
          <AlertDialog >
            <AlertDialogTrigger asChild>
              <Button variant="" className="">
                Delete 
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this component?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Once deleted, the component data
                  will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleComponentDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <section className="flex flex-col pt-14 ">
        <Card className="mt-0">
          <CardContent className="p-6">
            <div className="w-full font-semibold   ">Component Details</div>
            <div className="flex items-start mt-3 max-w-full w-[285px]">
              <div className="flex flex-col pr-20 min-w-[240px] w-[285px]">
                {details.map((detail, index) => (
                  <div className="flex gap-4 items-start w-full h-5  mb-4">
                    <div className=" text-sm">{detail.label}</div>
                    <div className="flex flex-col items-start">
                      <div className="text-gray-900 text-sm">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center px-6 pt-3.5 pb-3 w-full text-xs font-medium  border-t  max-md:px-5 ">
            <div className="flex-1 shrink self-stretch my-auto w-full min-w-[240px] ">
              Created on: <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};
