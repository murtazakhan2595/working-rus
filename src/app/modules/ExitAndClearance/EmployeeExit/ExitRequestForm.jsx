import {
  PageLoader,
  EmployeeOverview,
  EmployeeDetailUI,
  SheetUI,
} from "components";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { EmployeeExit } from "app/utils/Types/EmployeeExit";
import { renderDate } from "utils/renderValues";
import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { NoticePeriod } from "data/Data";
import { TextInput } from "components/FormControl";
import { getLabelByValue } from "utils/getValuesFromTables";
import { getManagerName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
import { ReasonForLeaving } from "data/Data";
import { CoverFileUpload } from "components/FormControl";
import { Card, CardContent, CardTitle } from "components/ui/card";

export default function ExitRequestForm({ reload }) {
  const {
    joining_date,
    department_name,
    department_position,
    direct_report,
    employee_location,
    phone_no,
    id,
  } = useSelector((state) => state.emp.user_details);
  const designations = useSelector((state) => state.common.designations);
  const departments = useSelector((state) => state.common.departments);
  const managers = useSelector((state) => state.emp.reportingManagers);
  const [isLoading, setLoading] = useState(false);
  const InitialValues = EmployeeExit;
  const formRef = React.createRef();
  const handleSubmit = async (data, resetForm) => {
    const formData = new FormData();
    formData.append("exit_category", "resignation");
    formData.append("employee_id", id);
    formData.append("status_resignation", "pending");
    formData.append("exit_date", data.exit_date);
    formData.append("notice_period", data.notice_period);
    formData.append("exit_type", data.reason_for_leaving);

    if (data.resignation_Letter) {
      formData.append("resignation_letter", data.resignation_Letter);
    }
    try {
      const response = await employeeExit(formData);
      if (response) {
        toast.success("Request has been successfully submitted");
        reload();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleClose = () => {
    // navigate("/profile-management");
  };
  return (
    <>
      <Card className="max-w-[1040px] m-auto">
        <CardContent>
          <SheetUI
            isOpen={true}
            setIsOpen={handleClose}
            variant=""
            sheetConfig={{}}
            formConfig={{
              initialValues: InitialValues,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              validateFormSchema: (values) => {
                // const error = validateUpdateAttendanceFormSchema(
                //   values,
                //   Boolean(ActiveShift.status && ActiveShift.is_split_shift)
                // );
                // if (values.date && !ActiveShift.status) {
                //   if (!ActiveShift.shift_assigned) {
                //     error.date = `No Shift was assigned to ${selectedEmployee.name} for this date. Kindly update the shift to record attendance`;
                //   } else if (ActiveShift.isOffToday) {
                //     error.date = `${selectedEmployee.name} is on ${
                //       ActiveShift?.OffLabel?.toLowerCase() || ""
                //     } for this date`;
                //   }
                // }
                return {};
              },
              submitButtonText: "Submit",
              cancelButtonText: "Cancel",
              columns: 3,
              //     renderUpdatedFormValues: setFormValues,
              disableSubmit: isLoading,
              formFields: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: "Employee Details",
                  InputFields: [
                    {
                      InputField: EmployeeDetailUI,
                      id: id,
                      InformationKeys: [
                        "name",
                        "department",
                        "branch",
                        "position",
                        "work_location",
                        "manager",
                        "joining_date",
                        "employment_type",
                        "contact_no",
                      ],
                      variant: "FormView",
                      colsSpan: 3,
                      className: "grid grid-cols-3 gap-4",
                    },
                  ],
                },
                {
                  sheetCardExtension: true,
                  sheetCardTitle: "Exit Details",
                  InputFields: [
                    {
                      InputField: DateInput,
                      name: "exit_date",
                      required: true,
                      label: "Exit Date",
                      maxDate: new Date(),
                    },
                    {
                      InputField: SelectInputComponent,
                      name: "notice_period",
                      options: NoticePeriod,
                      required: true,
                      label: "Notice Period",
                    },
                    {
                      InputField: SelectInputComponent,
                      name: "reason_for_leaving",
                      required: true,
                      label: "Reason for leaving",
                      options: ReasonForLeaving,
                    },
                    {
                      InputField: CoverFileUpload,
                      name: "resignation_letter",
                      required: true,
                      label: "Resignation Letter or drag it here",
                    },
                  ],
                },
              ],
            }}
          ></SheetUI>
        </CardContent>
      </Card>
    </>
  );
}
