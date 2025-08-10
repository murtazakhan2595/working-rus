import React, { useState } from "react";
import { SheetUI, EmployeeDetailUI } from "components";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { NumberInput } from "components/FormControl";

export default function RotationSheetWrapper() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { id: user_id, branch_id: user_branch } = useSelector(
    (state) => state.emp.user_details
  );
  const Designations = useSelector((state) => state.common.designations);

  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);

  return (
    <div>
      <Button onClick={() => setIsSheetOpen(true)}>Rotation Request</Button>

      <SheetUI
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        variant="sheet"
        sheetConfig={{
          title: "Job Rotation Request",
          width: "600px",
        }}
        formConfig={{
          initialValues: {},
          submitButtonText: "Submit Request",
          cancelButtonText: "Cancel",
          handleSubmit: () => { },
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Employee Details",
              InputFields: [
                {
                  InputField: EmployeeDetailUI,
                  id: user_id,
                  InformationKeys: ["id", "name", "department", "branch", "manager", "position", "joining_date_tenure"],
                  variant: "FormView",
                  colsSpan: 3,
                  className: "grid grid-cols-2 gap-4",
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: "Job Rotation Form",
              sheetCardName: "roatation_details",
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "new_department",
                  label: "Select Department",
                  options: Departments || [],
                  required: true,
                  onFieldUpdate: async (field, value, values, setFieldValue) => {
                    setFieldValue(field, value);
                  }
                }, {
                  InputField: SelectInputComponent,
                  name: "new_branch",
                  label: "Select New Branch",
                  options: Branches || [],
                  required: true,
                  onChange: async (e)=>{
                    console.log(e.target.value)
                  }
                },
                {
                  InputField: SelectInputComponent,
                  name: "new_designation",
                  label: "Select Designation",
                  options: Designations || [],
                  required: true,
                  onFieldUpdate: async (field, value, values, setFieldValue) => {
                    setFieldValue(field, value);
                  }
                },
                {
                  InputField: DateInput,
                  name: "effective_date",
                  label: "Effective Date",
                  required: true,
                },
                {
                  InputField: NumberInput,
                  name: "rotation_cap_time",
                  label: "Rotation Cap Time",
                  disabled: true,
                },
                {
                  InputField: TextAreaInput,
                  name: "custom_reason",
                  label: "Reason",
                  required: true,
                  colsSpan: 2,
                  rows: 4,
                }
              ]
            }
          ],
        }}
      >

      </SheetUI>
    </div >
  );
}
