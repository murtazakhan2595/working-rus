
import { Formik } from "formik";
import React, { useEffect } from "react";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import { Button } from "components/ui/button";
import { TextInput } from "components/FormControl";

import { DateInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { terminationReasonsOptions } from "data/Data";
import { getEmployeeData } from "app/hooks/employee";

import moment from "moment";
import { connect } from "react-redux";
import { NoticePeriod } from "data/Data";
import { validateTerminationForm } from "app/utils/FormSchema/exitAndClearanceFormSchema";
import { CoverFileUpload } from "components/FormControl";

const RequestTerminationForm = ({
  employees,
  formData,
  formRef,
  handleSubmit,
  isOpen,
  setIsOpen,
  userProfile,
  TerminationReasons,
  organizations,
  designations,
  departments,
  managers,
}) => {
  const [employeeData, setEmployeeData] = React.useState([[]]);
  const [loading, setLoading] = React.useState(false);
  const [terminations, setTerminations] = React.useState([]);
  const [filterEmployees, setFilterEmployees] = React.useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesResignations({
        filterData: {
          exit_category: "termination",
          ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),
        },
      });
      console.log(response);
      setTerminations(response.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const terminationsId = terminations.map((item) => item.employee_id);
    const filter = employees.filter(
      (item) => !terminationsId.includes(item.value)
    );
    setFilterEmployees(filter);
  }, [terminations]);

  const employeeFootPrint = [
    {
      title: "Designation",
    },
    { title: "First Name" },
    { title: "Last Name" },
    {
      title: "Department",
    },
    { title: "Phone Number" },
    {
      title: "Work Location",
    },
    { title: "Organization" },
    {
      title: "Report To",
    },
    {
      title: "Joining Date",
    },
  ];

  const handleEmployeeChange = async (field, value) => {
    try {
      const response = await getEmployeeData(value);
      const employeeDataArray = [
        [
          {
            title: "Designation",
            data:
              designations.find(
                (option) =>
                  option.value === parseInt(response.department_position)
              )?.label || "N/A",
          },
          { title: "First Name", data: response.first_name },
          { title: "Last Name", data: response.last_name },
          {
            title: "Department",
            data:
              departments.find(
                (option) => option.value === parseInt(response.department_name)
              )?.label || "N/A",
          },
          { title: "Phone Number", data: response.mobile_no },
          {
            title: "Work Location",
            data: response.employee_location || "",
          },
          {
            title: "Organization",
            data: organizations.find(
              (org) => org.value === response.organization
            )?.label,
          },
          {
            title: "Report To",
            data:
              managers.find(
                (option) => option.value === parseInt(response.direct_report)
              )?.label || "N/A",
          },
          {
            title: "Joining Date",
            data: moment(response.joining_date, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            ),
          },
        ],
      ];
      console.log("employeeDataArray", employeeDataArray);
      setEmployeeData(employeeDataArray);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = (resetForm) => {
    setEmployeeData([[]]);
    resetForm(); 
  };

  return (
    <>
      <div
        side="right"
        className="w-full p-0 "
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <div className="p-2">
              {/* <CardHeader className="prose">
                <CardTitle>Termination</CardTitle>
              </CardHeader> */}
              <Formik
                initialValues={formData}
                ref={formRef}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validate={validateTerminationForm}
              >
                {(props) => (
                  <form
                    onSubmit={props.handleSubmit}
                    className="mt-6 space-y-6"
                  >
                    <div className="space-y-4">
                      {employeeData.map((infoGroup, index) => (
                        <div
                          key={index}
                          className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-2"
                        >
                          <div className="space-y-2">
                            <SelectInputComponent
                              name={"terminate_employee"}
                              options={filterEmployees}
                              error={props.errors.terminate_employee}
                              touch={props.touched?.terminate_employee}
                              value={props.values?.terminate_employee}
                              required={true}
                              label={"Select Employee"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                                handleEmployeeChange(field, value);
                              }}
                            />
                          </div>
                          {infoGroup.length > 0
                            ? infoGroup.map((info) => (
                                <div className="flex flex-col justify-end space-y-2">
                                  <TextInput
                                    value={info.data}
                                    name={info.title}
                                    label={info.title}
                                    disabled={true}
                                  />
                                </div>
                              ))
                            : employeeFootPrint.map((info) => {
                                return (
                                  <div className="flex flex-col justify-end space-y-2">
                                    <TextInput
                                      value={info.title}
                                      disabled={true}
                                    />
                                  </div>
                                );
                              })}
                        </div>
                      ))}
                      <div className="mb-4 text-lg font-bold text-plum-1100">
                        Exit Details
                      </div>
                      <div className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        <DateInput
                          name={"last_working_day"}
                          error={props.errors.last_working_day}
                          touch={props.touched.last_working_day}
                          value={props.values.last_working_day}
                          label={"Last Working Day"}
                          required={true}
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
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <DateInput
                          name={"exit_interview_date"}
                          error={props.errors.exit_interview_date}
                          touch={props.touched.exit_interview_date}
                          value={props.values.exit_interview_date}
                          label={"Exit Interview Date"}
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <SelectInputComponent
                          name={"reason_for_terminating"}
                          options={TerminationReasons}
                          error={props.errors.reason_for_terminating}
                          touch={props.touched.reason_for_terminating}
                          value={props.values.reason_for_terminating}
                          label={"Reason for Terminating"}
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <CoverFileUpload
                        name={"termination_letter"}
                        error={props.errors?.termination_letter}
                        touch={props.touched?.termination_letter}
                        value={props.values?.termination_letter}
                        label={"Upload Termination Letter or drag it here"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        acceptType=".png,.jpg,.jpeg,.pdf"
                      />

                      <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end space-x-4">
                          <Button
                            variant="outline"
                            size="lg"
                            type="button"
                            onClick={() => handleReset(props.resetForm)}
                          >
                            Reset
                          </Button>
                          <Button type="submit" size="lg" variant="default">
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
    organizations: state.common.organizations,
    userProfile: state.user.userProfile,
    designations: state.common.designations,
    departments: state.common.departments,
    managers: state.emp.reportingManagers,
    TerminationReasons: state.exit_emp.TerminationReasons,
  };
};
export default connect(mapStateToProps)(RequestTerminationForm);
