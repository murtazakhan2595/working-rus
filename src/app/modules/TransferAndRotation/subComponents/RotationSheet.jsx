import React, { useEffect, useState } from "react";
import { SheetUI, EmployeeDetailUI } from "components";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { NumberInput } from "components/FormControl";
import { PostJobRotation } from "app/hooks/Rotation";
import {toast} from "react-toastify";
import axios from "axios";

export default function RotationSheetWrapper() {
  useEffect(() => {
    res();
  }, []);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const { id: user_id, branch_id: user_branch } = useSelector(
    (state) => state.emp.user_details
  );
  const handleSubmit = async (values) => {
    setIsSubmittingForm(true);
    try {
      const payload = { ...values, employee: user_id ,"created_by": "manager"};
      console.log(payload)
      PostJobRotation(payload);
      setIsSheetOpen(false);
      toast.success("Job rotation request submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit job rotation request.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [managers, setmanagers] = useState([]);
  const Designations = useSelector((state) => state.common.designations);
  const baseUrlState = useSelector((state) => state.user.baseUrl);
  const headers = () => ({
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });
  const res = async () => {
    try {
      const api = await axios.get(`${baseUrlState}/emplistofmanager/`, {
        headers: headers(),
      });
      const mangeres_res = api.data.map((items) => {
        return {
          id: items.id,
          name: items.first_name,
        };
      });
      setmanagers(mangeres_res);
    } catch (err) {
      console.log(err);
    }
  };
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
          handleSubmit: handleSubmit,
          disableSubmit: isSubmittingForm,

          cancelButtonText: "Cancel",
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Employee Details",
              InputFields: [
                {
                  InputField: EmployeeDetailUI,
                  id: user_id,
                  InformationKeys: [
                    "id",
                    "name",
                    "department",
                    "branch",
                    "manager",
                    "position",
                    "joining_date_tenure",
                  ],
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
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "new_reporting_manager",
                  label: "Select New Reporting Manager",
                  options:
                    managers.map((item) => ({
                      label: item.name,
                      value: item.id,
                    })) || [],
                  required: true,
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "new_branch",
                  label: "Select New Branch",
                  options: Branches || [],
                  required: true,
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "new_designation",
                  label: "Select Designation",
                  options: Designations || [],
                  required: true,
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "rotation_type",
                  label: "Rotation Type",
                  options: [
                    { label: "Temporary", value: "temporary" },
                    { label: "Permanent", value: "permanent" },
                  ],
                  required: true,
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                  },
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
                  onFieldUpdate: async (
                    field,
                    value,
                    values,
                    setFieldValue
                  ) => {
                    setFieldValue(field, value);
                    const defaultCapDays = 90;
                    setFieldValue("rotation_cap_time", parseInt(value) || defaultCapDays);
                  },
                },
                {
                  InputField: TextAreaInput,
                  name: "custom_reason",
                  label: "Reason",
                  required: true,
                  colsSpan: 2,
                  rows: 4,
                },
              ],
            },
          ],
        }}
      ></SheetUI>
    </div>
  );
}
