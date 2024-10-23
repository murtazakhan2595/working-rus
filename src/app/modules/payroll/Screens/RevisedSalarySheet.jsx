import { useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { useRef } from "react";
import { Formik } from "formik";
import {
  TextInput,
  CheckBoxInput,
  TextAreaInput,
} from "components/form-control";
import { DateInput } from "components/form-control";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import {
  saveSalaryRevision,
  deleteSalaryRevision,
  updateSalaryRevisionStatus,
  saveEmployeePayroll,
} from "../../../hooks/payroll";
import { toast } from "react-toastify";
import { validateRevisedSalaryForm } from "../../../utils/FormSchema/payrollFormSchema";
import EmployeeDataInfo from "../Sections/EmployeeDataInfo";
import moment from "moment";
import { StatusDropdown } from "./EmployeeSalaryDetails";
import { revisionStatusOptions } from "data/Data";
import { revisionLetterOptions } from "data/Data";

export default function RevisedSalarySheet({
  payrollID,
  selectedRevision,
  state,
  onClose,
  previousCTC,
  employeeData,
}) {
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(state === "edit" || state === "view");
  const [formState, setFormState] = useState(state);
  const [formData, setFormData] = useState(
    selectedRevision || {
      new_salary: "",
      previous_salary: previousCTC,
      revision_difference: "",
      percentage: "",
      last_revised_date: "",
      notes: "",
      revision_letter: "DRAFT",
      revision_status: "PENDING",
    }
  );
  const formSheetData = {
    triggerText: "Revise Salary",
    title: "Revise Salary",

    description: null,
    footer: null,
  };

  // console.log("payrollID", payrollID);
  // console.log("formState", formState);
  console.log("selectedRevision", selectedRevision);
  const handleSubmit = async (values, resetForm) => {
    console.log(values);
    values.employee_payroll = payrollID;
    values.organization = 1; // need to remove this this will handle on bakcend
    values.effective_date = values.last_revised_date;
    const response = await saveSalaryRevision(values);
    if (response) {
      resetForm();
      setIsOpen(false);
      handleSheetClose(false);
      toast.success("Salary revised successfully");
    }
  };
  const handleEdit = () => {
    setFormState("edit");
  };
  const onDelete = async () => {
    const response = await deleteSalaryRevision(selectedRevision.id);
    toast.success("Salary revision deleted successfully");
    handleSheetClose(false);
  };

  const handleSheetClose = (isOpenState) => {
    setIsOpen(isOpenState);
    if (!isOpenState) {
      onClose(); // Fetch new data when the sheet is closed
    }
  };
  return (
    <>
      <div>
        <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={handleSheetClose}
          width="500px"
        >
          {formState === "view" ? (
            <RevisedSalaryView
              isOpen={isOpen}
              setIsOpen={handleSheetClose}
              selectedRevision={selectedRevision}
              onEdit={handleEdit}
              onDelete={onDelete}
              employeeData={employeeData}
              payrollID={payrollID}
            />
          ) : (
            <RevisedSalaryForm
              formData={formData}
              formRef={formRef}
              handleSubmit={handleSubmit}
              validateRevisedSalaryForm={validateRevisedSalaryForm}
              isEditMode={formState === "edit"}
              isOpen={isOpen}
              setIsOpen={handleSheetClose}
              employeeData={employeeData}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
}

const RevisedSalaryView = ({
  isOpen,
  setIsOpen,
  selectedRevision,
  onEdit,
  onDelete,
  employeeData,
  payrollID,
}) => {
  const [revision, setRevision] = useState(selectedRevision);
  const handleStatusChange = async (name, value, revision) => {
    if (name === "revision_status") {
      revision.revision_status = value;
    } else if (name === "revision_letter") {
      revision.revision_letter = value;
    }
    const response = await updateSalaryRevisionStatus(revision);
    if (response) {
      if (revision.revision_status === "APPROVED") {
        await saveEmployeePayroll({
          payrollID,
          basic_salary: revision.new_salary,
        });
      }
      console.log("THIS IS WHAT I GET ", response);
      setRevision(response);
    }
  };
  console.log("SELECTED REVISION", revision);
  const detailItems = [
    { label: "Revised CTC", value: revision?.new_salary },
    { label: "Previous CTC", value: revision?.previous_salary },
    { label: "Percentage", value: `${revision?.percentage}%` },
    { label: "Last revised date", value: revision?.last_revised_date },
    {
      label: "Reason for revision",
      value: revision?.notes || "No reason provided",
    },
  ];
  return (
    <div
      side="right"
      className="w-full p-0 "
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="flex flex-col ">
        <div className="flex-grow ">
          <div className="p-0">
            <div className="flex items-center justify-between">
              <EmployeeDataInfo
                name={`${employeeData?.first_name} ${employeeData?.last_name}`}
                email={employeeData?.work_email}
                src={employeeData?.profile_picture?.file}
                id={employeeData?.id}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={onEdit}
                  className="border bg-white border-[#e8e8ec] text-[#1c2024] text-xs font-semibold font-[inter]"
                >
                  {" "}
                  Edit
                </Button>
                <Button
                  onClick={onDelete}
                  className="border bg-white border-[#e8e8ec] text-[#1c2024] text-xs font-semibold font-[inter]"
                >
                  {" "}
                  Delete
                </Button>
              </div>
            </div>
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
                <div className="text-gray-900 text-sm font-semibold whitespace-nowrap">
                  Details
                </div>
                <div className="flex mt-3 w-full">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    {detailItems.map((item, index) => (
                      <div className="flex gap-4 items-center mt-4 max-w-full">
                        <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                          <div>{item.label}</div>
                        </div>
                        <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                  <div>
                    <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                      Created on:
                    </span>
                    <span className="text-[#8b8d98] text-xs font-normal  leading-3">
                      {` ${moment(revision?.created_at).format(
                        "MMMM DD, YYYY"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
                <div className="text-gray-900 text-sm font-semibold whitespace-nowrap">
                  Status
                </div>
                <div className="flex mt-3 w-full">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    <div className="flex gap-4 items-center mt-4 max-w-full">
                      <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                        <div>Revision Status</div>
                      </div>
                      <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                        <div className="flex items-center gap-2">
                          <div className="capitalize">
                            {revision?.revision_status?.toLowerCase()}
                          </div>
                          <StatusDropdown
                            name="revision_status"
                            value={revision?.revision_status}
                            revision={revision}
                            handleChange={handleStatusChange}
                            statuses={revisionStatusOptions}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center mt-4 max-w-full">
                      <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                        <div>Revision Letter</div>
                      </div>
                      <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                        <div className="flex items-center gap-2">
                          <span
                            className={`capitalize bg-${
                              revision.revision_letter?.toLowerCase() ===
                              "issued"
                                ? "green"
                                : revision.revision_letter?.toLowerCase() ===
                                  "not issued"
                                ? "red"
                                : "blue"
                            }-100 text-${
                              revision.revision_letter?.toLowerCase() ===
                              "issued"
                                ? "green"
                                : revision.revision_letter?.toLowerCase() ===
                                  "not issued"
                                ? "red"
                                : "blue"
                            }-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}
                          >
                            {/* {revision.revision_letter?.toLowerCase()} */}
                            <div className="capitalize">
                              {revision?.revision_letter?.toLowerCase()}
                            </div>
                          </span>
                          <StatusDropdown
                            name="revision_letter"
                            value={revision?.revision_letter}
                            revision={revision}
                            handleChange={handleStatusChange}
                            statuses={revisionLetterOptions}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                  <div>
                    <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                      Updated on:
                    </span>
                    <span className="text-[#8b8d98] text-xs font-normal  leading-3">
                      {` ${moment(revision?.created_at).format(
                        "MMMM DD, YYYY"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <CheckBoxInput
                name={"condition"}
                value={true}
                label={"Terms and conditions followed as per offer letter"}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RevisedSalaryForm = ({
  formData,
  formRef,
  handleSubmit,
  validateRevisedSalaryForm,
  isEditMode,
  isOpen,
  setIsOpen,
  employeeData,
}) => {
  const updateValues = (value) => {
    const previous_salary = formData.previous_salary;
    const revision_difference = value - previous_salary;
    const percentage =
      (revision_difference / (previous_salary === 0 ? 1 : previous_salary)) *
      100;
    formRef.current.setFieldValue("revision_difference", revision_difference);
    formRef.current.setFieldValue("percentage", percentage.toFixed(2));
  };
  return (
    <div
      side="right"
      className="w-full p-0 "
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="flex flex-col ">
        <div className="flex-grow ">
          <div className="p-0">
            <EmployeeDataInfo
              name={`${employeeData?.first_name} ${employeeData?.last_name}`}
              email={employeeData?.work_email}
              src={employeeData?.profile_picture?.file}
              id={employeeData?.id}
            />
            <Formik
              initialValues={formData}
              innerRef={formRef}
              onSubmit={(values, { resetForm }) => {
                console.log("Form Data:", values); // Log form data to console
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = validateRevisedSalaryForm(values, isEditMode);
                return errors;
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                  <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
                    <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                      <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                        <div className="text-zinc-950">Details</div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <TextInput
                          name={"new_salary"}
                          error={props.errors?.new_salary}
                          touch={props.touched?.new_salary}
                          value={props.values?.new_salary}
                          label={"Revised CTC (Per Month)"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                            updateValues(value);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          name={"previous_salary"}
                          error={props.errors?.previous_salary}
                          touch={props.touched?.previous_salary}
                          value={props.values?.previous_salary}
                          label={"Previous CTC (Per Month)"}
                          disabled={true}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <TextInput
                          name={"revision_difference"}
                          error={props.errors?.revision_difference}
                          touch={props.touched?.revision_difference}
                          value={props.values?.revision_difference}
                          label={"Revision Difference"}
                          disabled={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"percentage"}
                          error={props.errors?.percentage}
                          touch={props.touched?.percentage}
                          value={props.values?.percentage}
                          label={"Percentage"}
                          disabled={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <DateInput
                          name={"last_revised_date"}
                          error={props.errors?.last_revised_date}
                          touch={props.touched?.last_revised_date}
                          value={props.values?.last_revised_date}
                          required={true}
                          label={"Last Revised Date"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"notes"}
                          error={props.errors?.notes}
                          touch={props.touched?.notes}
                          value={props.values?.notes}
                          label={"Reason for Revision"}
                          maxRows={1}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <CheckBoxInput
                          name={"condition"}
                          value={props.values.condition}
                          error={props.errors?.condition}
                          label={
                            "Terms and conditions followed as per offer letter"
                          }
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
                        disabled={!props.values.condition}
                      >
                        {isEditMode ? "Update" : "Save"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
};
