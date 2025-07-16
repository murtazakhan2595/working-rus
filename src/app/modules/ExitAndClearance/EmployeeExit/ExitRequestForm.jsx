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
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { NoticePeriod } from "data/Data";
import { TextInput } from "components/FormControl";
import { getLabelByValue } from "utils/getValuesFromTables";
import { getManagerName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
import { ResignationReasons } from "data/Data";
import { CoverFileUpload } from "components/FormControl";
import { Card, CardContent, CardTitle } from "components/ui/card";

export default function ExitRequestForm({ reload = () => {} }) {
  const { id: user_id } = useSelector((state) => state.emp.user_details);
  const InitialValues = EmployeeExit;
  const handleSubmit = async (data, resetForm) => {
    try {
      const payload = {
        ...data,
        exit_category: "RESIGNATION",
        employee_id: user_id,
      };
      const response = await saveEmployeeExitDetail(payload);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Request Submitted Successfully!`,
          description: `Your resignation request has been submitted successfully and will be reviewed and processed shortly.`,
        };
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleClose = () => {
    reload();
  };
  return (
    <>
      <Card>
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
              formFields: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: "Employee Details",
                  InputFields: [
                    {
                      InputField: EmployeeDetailUI,
                      id: user_id,
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
                      minDate: new Date(),
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
                      name: "exit_type",
                      required: true,
                      label: "Reason for leaving",
                      options: ResignationReasons,
                    },
                    {
                      InputField: CoverFileUpload,
                      name: "resignation_letter",
                      required: true,
                      label: "Resignation Letter or drag it here",
                      colsSpan: 3,
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
