import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../../src/@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../src/@/components/ui/radio-group";
import {Button} from "../../../../src/@/components/ui/button";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { Formik } from "formik";
import { RadioGroupInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { SelectComponent
 } from "components/form-control";
import { monthsOptions } from "data/Data";
import { toast } from "react-toastify";
import { saveEmployeeEarnDeduction } from "app/hooks/payroll";

const AddAdditionalEarningSheet = ({ reload, payrollId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [earnings, setEarnings] = useState([]);
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
  const formSheetData = {
    triggerText: "Add Additional Earnings",
    title: "Add Additional Earnings",

    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEarnAndDeduction();
      if (response) {
        console.log(response);
        setEarnings(response.results);
      }
    };
    fetchData();
  }, []);

  const initialValues = {
    income_type: "",
    amount_type: "fixed",
    amount: "",
    month: "",
  };

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    const response = await saveEmployeeEarnDeduction({
      ...values,
      employee_payroll: payrollId,
    });
    if (response) {
      reload();
      toast.success("Earning added successfully");
    }
  };
  const getSelectedEarning = (selectedId) => {
    const earning = earnings.find(
      (earning) => Number(earning.id) === Number(selectedId)
    );
    return `${earning?.name} ${earning.income_type}`
  };

  return (
    <>
      <div>
        <SheetComponent
          {...formSheetData}
          onSubmit={handleSubmit}
          width="500px"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          contentClassName="custom-sheet-width"
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
                      <div className="text-zinc-950">Details</div>
                    </div>
                    <div className="pt-4">
                      <div>Select Component</div>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        props.setFieldValue("income_type", value)
                      }
                    >
                      <SelectTrigger className="w-[80%]">
                        {props.values.income_type ? getSelectedEarning(props.values.income_type) : ""}
                      </SelectTrigger>
                      <SelectContent>
                        {earnings.map((earning) => (
                          <SelectItem key={earning.id} value={earning.id}>
                            {earning.name} {earning.income_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {props.values.income_type && (
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
                            {[
                              { value: "option1", label: "Flat Amount" },
                              {
                                value: "option2",
                                label: "Percentage of Gross",
                              },
                              {
                                value: "option3",
                                label: "Percentage of Basic",
                              },
                            ].map((option) => (
                              <div
                                className="flex items-center space-x-4"
                                key={option.value}
                              >
                                {/* Label before radio button */}
                                <div className="text-zinc-900">
                                  {option.label}
                                </div>

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
                                  onChange={(field, value) => {
                                    setAmountInputs((prev) => ({
                                      ...prev,
                                      [option.value]: value,
                                    }));
                                    if (selectedRadio === option.value) {
                                      props.setFieldValue("amount", value); // Store raw value in form state
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

                    <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
                      <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                        <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                          <div className="text-zinc-950">Payable Month</div>
                        </div>
                        <div className="pt-4">
                          <div>Pick a month</div>
                        </div>
                        <SelectComponent
                          name={"month"}
                          value={props.values?.month}
                          error={props.errors?.month}
                          touch={props.touched?.month}
                          options={monthsOptions}
                          label={"Month"}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

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

export default AddAdditionalEarningSheet;

