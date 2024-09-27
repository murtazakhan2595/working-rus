import { useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { Paperclip } from "lucide-react";


import {
  TextInput,
  SelectComponent,
  TextAreaInput,
} from "components/form-control";
import { DateInput } from "components/form-control";
import { ClaimExpenseTypeOptions } from "data/Data";

const ReimbursmentDetailsRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const claimRequest = {
    expense_type: "",
    date_of_expense: "",
    amount: "",
    description: "",
    attachments: "",
  };
  const formSheetData = {
    triggerText: "Send Request",
    title: "Claim request",

    description: null,
    footer: null,
  };

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="600px"
      >
        <Formik
          initialValues={claimRequest}
          // validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <div className={`flex w-full flex-col rounded-lg`}>
                <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium  tracking-[0px] text-zinc-900">
                  <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                    <div className="text-zinc-950">Details</div>
                  </div>
                  <div className="pt-4">
                    <div>Expense Type</div>
                  </div>
                  <SelectComponent
                    name={"expense_type"}
                    error={props.errors?.expense_type}
                    touch={props.touched?.expense_type}
                    value={props.values?.expense_type}
                    options={ClaimExpenseTypeOptions}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Select"
                  />
                  <div className="gap-4 flex items-center ">
                    <div className="flex-1 space-y-2">
                      <div>
                        <div>Amount</div>
                      </div>
                      <TextInput
                        name={"amount"}
                        error={props.errors?.amount}
                        touch={props.touched?.amount}
                        value={props.values?.amount}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        placeholder="Add Value"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div>Date of Expense</div>
                      </div>
                      <DateInput
                        name={"date_of_expense"}
                        error={props.errors?.date_of_expense}
                        touch={props.touched?.date_of_expense}
                        value={props.values?.date_of_expense}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <div>Description</div>
                  </div>
                  <TextAreaInput
                    name={"description"}
                    error={props.errors?.description}
                    touch={props.touched?.description}
                    value={props.values?.description}
                    options={ClaimExpenseTypeOptions}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder="Type your description here"
                  />

                  <div className="h-[118px] flex-col justify-start  gap-2 inline-flex">
                    <div className=" justify-center  gap-12 inline-flex">
                      <div className=" flex-col justify-start  inline-flex text-neutral-800 text-sm font-medium ">
                        Attachments
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="grow flex-col justify-start  inline-flex p-4 pr-5 border border-solid border-zinc-200 rounded-md">
                          <div className="flex items-center">
                            <div>
                              <div className="flex items-center text-[#8b8d98] text-sm  gap-2">
                                <Paperclip size={16} />
                                <span className="text-[#ab4aba] text-sm font-semibold ">
                                  Upload a file
                                </span>
                                or drag and drop
                              </div>
                              <div className="w-[263px] h-3 pl-8 pr-[26.62px] flex-col justify-start items-start inline-flex">
                                <div className="text-[#8b8d98] text-xs  ">
                                  PNG, JPG, GIF up to 10MB
                                </div>
                              </div>
                            </div>
                            <Button className="bg-white border border-[#e8e8ec] text-[#1c2024]">
                              Upload
                            </Button>
                          </div>
                        </div>
                        <Button className="bg-white border border-[#e8e8ec] text-[#1c2024] text-sm font-medium w-fit">
                          + Add another
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    className=" bg-[#1c2024] text-white"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Submit
                  </Button>
                </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </div>
  );
};

export default ReimbursmentDetailsRequest;
