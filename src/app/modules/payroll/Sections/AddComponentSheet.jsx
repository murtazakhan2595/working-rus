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

const AddComponentSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountInputs, setAmountInputs] = useState({});
  const [selectedRadio, setSelectedRadio] = useState("");
  const formSheetData = {
    triggerText: "Add Component",
    title: "Add Component",

    description: null,
    footer: null,
  };

  const initialValues = {
    type_name: "",
    income_type: "",
    amount_type: "",
    amount: "",
    activate: false,
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    // Handle form submission logic here
  };

  const handleRadioChange = (value) => {
    // Reset the amount input for the selected radio option
    setSelectedRadio(value);
    setAmountInputs((prev) => ({ ...prev, [value]: "" }));
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
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                      name={"type_name"}
                      error={props.errors?.type_name}
                      touch={props.touched?.type_name}
                      value={props.values?.type_name}
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
                          name={"amount_type"}
                          error={props.errors?.amount_type}
                          touch={props.touched?.amount_type}
                          value={props.values?.amount_type}
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
                        <RadioGroup
                          defaultValue=""
                          onValueChange={handleRadioChange}
                        >
                          {["option1", "option2", "option3"].map((option) => (
                            <div className="flex items-center" key={option}>
                              <RadioGroupItem
                                value={option}
                                id={`r${option.slice(-1)}`}
                              />
                              <TextInput
                                value={
                                  selectedRadio === option
                                    ? props.values.amount
                                    : ""
                                }
                                onChange={(field, value) => {
                                  if (selectedRadio === option) {
                                    props.setFieldValue("amount", value);
                                  }
                                }}
                                placeholder="Enter %"
                                disabled={selectedRadio !== option}
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activate"
                      checked={props.values.activate}
                      onCheckedChange={(value) =>
                        props.setFieldValue("activate", value)
                      }
                    />
                    <Label htmlFor="activate">Activate</Label>
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
        </SheetComponent>
      </div>
    </>
  );
};

export default AddComponentSheet;
