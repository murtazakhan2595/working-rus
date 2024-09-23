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
import {Button} from "../../../../src/@/components/ui/button";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { Formik } from "formik";
import { RadioGroupInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { DateInput } from "components/form-control";

const AddAdditionalEarningSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [earnings, setEarnings] = useState([]);
   const [amountInputs, setAmountInputs] = useState({});
   const [selectedRadio, setSelectedRadio] = useState(""); 
  const formSheetData = {
    triggerText: "Add Additional Earnings",
    title: "Add Additional Earnings",

    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEarnAndDeduction()
      if (response) {
        console.log(response)
        setEarnings(response.results)
      }
    }
    fetchData()
  },[])

    const initialValues = {
      selectedEarning: "",
      amount_type: "",
      amount: "",
      payable_month:""
    };

    const handleSubmit = (values) => {
      console.log("Form Values:", values);
      // Handle form submission logic here
    };
 const getSelectedEarning = (selectedId) => {
   return earnings.find((earning) => Number(earning.id) === Number(selectedId));
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
                        props.setFieldValue("selectedEarning", value)
                      }
                    >
                      {console.log(props.values)}
                      <SelectTrigger className="w-[80%]">
                        {props.values.selectedEarning
                          ? `${
                              getSelectedEarning(props.values.selectedEarning)
                                ?.name
                            } ${
                              getSelectedEarning(props.values.selectedEarning)
                                ?.income_type
                            }`
                          : ""}
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

                {props.values.selectedEarning && (
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

                    <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
                      <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                        <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                          <div className="text-zinc-950">Payable Month</div>
                        </div>
                        <div className="pt-4">
                          <div>Pick a month</div>
                        </div>
                        <DateInput
                          name={"payable_month"}
                          error={props.errors?.payable_month}
                          touch={props.touched?.payable_month}
                          value={props.values?.payable_month}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
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
                    <Button
                      type="submit"
                      size="lg"
                      variant="default"
                    >
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

