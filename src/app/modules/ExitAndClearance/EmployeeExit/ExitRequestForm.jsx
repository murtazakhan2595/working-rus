import { PageLoader, EmployeeOverview } from "components";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { Formik } from "formik";
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
  const [loading, setLoading] = useState(false);
  const initialValues = {
    exit_date: null,
    notice_period: null,
    reason_for_leaving: null,
    resignation_Letter: null,
  };
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

  const personalInfo = [
    [
      {
        title: "Department",
        data: getLabelByValue(department_name, departments),
      },
      {
        title: "Designation",
        data: getLabelByValue(parseInt(department_position), designations),
      },
      {
        title: "Work Location",
        data: employee_location || "",
      },

      {
        title: "Report to",
        data: getManagerName(direct_report, managers),
      },

      {
        title: "Joining date",
        data: renderDate(joining_date),
      },
      { title: "Phone number", data: phone_no },
    ],
  ];
  return loading ? (
    <PageLoader />
  ) : (
    <Card>
      <CardContent className="pt-6">
        <div className="w-full lg:w-[80%]">
          <div className="flex justify-between">
            <h2 className="text-lg text-neutral-1100">Employee Information</h2>
          </div>
          <div className="flex flex-col py-2 gap-4">
            {/* Image Section */}
            <EmployeeOverview id={id} showId={true} avatarSize={20} />

            <div className="grid w-full gap-4 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
              {/* Personal Info Sections */}
              {personalInfo[0].map((info) => (
                <div className="space-y-2">
                  <TextInput
                    value={info.data}
                    name={info.title}
                    label={info.title}
                    disabled={true}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <h2 className="text-lg text-neutral-1100">Exit Details</h2>
          </div>
          <Formik
            initialValues={initialValues}
            ref={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={(values) => {
              const errors = {};
              console.log(values);

              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <div className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-3">
                  <DateInput
                    placeholder="Date"
                    label="Exit Date"
                    error={props.errors.exit_date}
                    touch={props.touched.exit_date}
                    value={props.values.exit_date}
                    name="exit_date"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                  <SelectInputComponent
                    name={"notice_period"}
                    options={NoticePeriod}
                    error={props.errors.notice_period}
                    touch={props.touched.notice_period}
                    value={props.values.notice_period}
                    label={"Notice Period"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                  <SelectInputComponent
                    name={"reason_for_leaving"}
                    options={ReasonForLeaving}
                    error={props.errors.reason_for_leaving}
                    touch={props.touched.reason_for_leaving}
                    value={props.values.reason_for_leaving}
                    label={"Reason for leaving"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <CoverFileUpload
                  name={"resignation_Letter"}
                  error={props.errors?.resignation_Letter}
                  touch={props.touched?.resignation_Letter}
                  value={props.values?.resignation_Letter}
                  label={" Resignation Letter or drag it here"}
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    props.setFieldTouched(field, true);
                  }}
                />
                <div className="flex flex-row gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    onClick={() => props.resetForm()}
                  >
                    Reset
                  </Button>

                  <Button type="submit" size="lg" variant="default">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </CardContent>
    </Card>
  );
}
