
import { useState } from 'react';
import { CardHeader } from 'components/ui/card';
import { CardTitle } from 'components/ui/card';
import SheetComponent from '../../../../components/ui/SheetComponent';
import { useRef } from 'react';
import { Formik } from 'formik';
import {
  TextInput,
  CheckBoxInput,
  TextAreaInput,
} from "components/form-control";
import { DateInput } from "components/form-control";
import { Button } from 'components/ui/button';
import { Link } from 'react-router-dom';
import {saveSalaryRevision} from '../../../hooks/payroll';
import { toast } from 'react-toastify';
import {validateRevisedSalaryForm} from "../../../utils/FormSchema/payrollFormSchema";

export default function RevisedSalarySheet({payrollID, state}) {
  console.log("payrollID", payrollID);
  console.log("state", state);
      const formRef = useRef();
       const [isOpen, setIsOpen] = useState(state === "view");
        const [formData, setFormData] = useState({
        new_salary: "",
        previous_salary: "",
        revision_difference: "",
        percentage: "",
        effective_date: "",
        notes: "",
        
        });
      const formSheetData = {
        triggerText: "Revise Salary",
        title: "Revise Salary",

        description: null,
        footer: null,
      };
        const handleSubmit =async (values, resetForm) => {
          console.log(values);
          values.employee_payroll = payrollID;
          values.organization = 1; // need to remove this this will handle on bakcend
          const response = await saveSalaryRevision(values);
          if(response){
            resetForm();
            setIsOpen(false);
            toast.success("Salary revised successfully");
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
          <RevisedSalaryForm
            formData={formData}
            formRef={formRef}
            handleSubmit={handleSubmit}
            validateRevisedSalaryForm={validateRevisedSalaryForm}
            isEditMode={false}
             isOpen={isOpen}
          setIsOpen={setIsOpen}
          />
        </SheetComponent>
      </div>
    </>
  );
}

const RevisedSalaryForm = ({
  formData,
  formRef,
  handleSubmit,
  validateRevisedSalaryForm,
  isEditMode,
  id,
  isOpen,
  setIsOpen,
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
            <Formik
              initialValues={formData}
              innerRef={formRef}
              onSubmit={(values, { resetForm }) => {
                console.log("Form Data:", values); // Log form data to console
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = validateRevisedSalaryForm(values, isEditMode);
                console.log("Errors", errors);
                return errors;
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                  <div className="space-y-4">
                    {console.log(
                      "props",
                      props,
                      props.errors?.new_salary && props.touched?.new_salary
                    )}
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
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <DateInput
                        name={"effective_date"}
                        error={props.errors?.effective_date}
                        touch={props.touched?.effective_date}
                        value={props.values?.effective_date}
                        required={true}
                        label={"Last Revised Date"}
                        onChange={(field, value) => {
                          console.log("field", field, value);
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
                      <Button variant="outline" size="lg">
                        <Link to="#">Cancel</Link>
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        variant="default"
                        disabled={!props.values.condition}
                      >
                        {id ? "Update" : "Save"}
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