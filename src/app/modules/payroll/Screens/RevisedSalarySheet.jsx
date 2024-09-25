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
import { saveSalaryRevision,deleteSalaryRevision } from "../../../hooks/payroll";
import { toast } from "react-toastify";
import { validateRevisedSalaryForm } from "../../../utils/FormSchema/payrollFormSchema";

export default function RevisedSalarySheet({
  payrollID,
  selectedRevision,
  state,
  onClose,
  previousCTC,
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
 ;

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
}) => {
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
              <div>profile</div>
              <div className="flex items-center gap-3">
                <Button onClick={onEdit}> Edit</Button>
                <Button onClick={onDelete}> Delete</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {selectedRevision.new_salary}
              {selectedRevision.previous_salary}
              {selectedRevision.revision_difference}
              {selectedRevision.percentage}
              {selectedRevision.last_revised_date}
              {selectedRevision.notes}
              {selectedRevision.revision_letter}
              {selectedRevision.revision_status}
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
}) => {

  const updateValues = (value) => {
    const previous_salary = formData.previous_salary;
    const revision_difference = value - previous_salary;
    const percentage = (revision_difference / (previous_salary === 0?1:previous_salary)) * 100;
    formRef.current.setFieldValue("revision_difference", revision_difference);
    formRef.current.setFieldValue("percentage", percentage.toFixed(2));

  }
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
                  <div className="space-y-4">
                    <div className="space-y-2">
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
