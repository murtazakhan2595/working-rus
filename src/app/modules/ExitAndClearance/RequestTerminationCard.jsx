import React, { useEffect } from "react";
import { Formik } from "formik";
import { Col, Form, Row } from "reactstrap";
import { DateInput } from "components/form-control";
import { SelectComponent } from "components/form-control";
import { FileInput } from "components/form-control";
import { connect } from "react-redux";
import { getEmployeeData } from "app/hooks/employee";
import { DesignationName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";
import { getAllCountries } from "countries-and-timezones";
import moment from "moment";
import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { terminationReasonsOptions } from "data/Data";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../src/@/components/ui/sheet";
import { Button } from "../../../src/@/components/ui/button";
import { TextInput } from "components/form-control";

const { RxCross2 } = require("react-icons/rx");

const RequestTerminationCard = ({
  employees,
  organizations,
  closeModel,
  userProfile,
}) => {
  const [initialValues, setInitialValues] = React.useState({});
  const [employeeData, setEmployeeData] = React.useState([[]]);
  const [loading, setLoading] = React.useState(false);
  const [terminations, setTerminations] = React.useState([]);
  const [filterEmployees, setFilterEmployees] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const formRef = React.createRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesResignations({
        filterData: {
          exit_category: "termination",
          ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),
        },
      });
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
    console.log("value", value);
    try {
      const response = await getEmployeeData(value);
      const employeeDataArray = [
        [
          {
            title: "Designation",
            data: <DesignationName value={response.department_position} />,
          },
          { title: "First Name", data: response.first_name },
          { title: "Last Name", data: response.last_name },
          {
            title: "Department",
            data: <DepartmentName value={response.department_name} />,
          },
          { title: "Phone Number", data: response.mobile_no },
          {
            title: "Work Location",
            data: getAllCountries()[response.employee_location]?.name || "",
          },
          {
            title: "Organization",
            data: organizations.find(
              (org) => org.value === response.organization
            )?.label,
          },
          {
            title: "Report To",
            data: <ManagerName value={response.direct_report} />,
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
  const handleSubmit = async (values, resetForm) => {
    const payload = {
      exit_date: values.last_working_day,
      exit_interview_date: values.exit_interview_date,
      final_working_day: values.last_working_day,
      exit_category: "termination",
      termination_letter: values.termination_letter,
      notice_period: values.notice_period,
      employee_id: values.terminate_employee,
      reason_of_termination: values.reason_for_terminating,
      status_termination: "viwed by manager",
    };
    try {
      const response = await employeeExit(payload);
      if (response) {
        toast.success("Termination request submitted successfully");
        closeModel();
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit the form");
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default">Request Termination +</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-4xl ">
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <div className="p-6">
              <SheetHeader>
                <SheetTitle>Termination</SheetTitle>
              </SheetHeader>
              <Formik
                initialValues={initialValues}
                ref={formRef}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validate={(values) => {
                  const errors = {};

                  return errors;
                }}
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
                          className="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-4"
                        >
                          <div className="space-y-2">
                            <SelectComponent
                              name={"terminate_employee"}
                              options={filterEmployees}
                              error={props.errors.terminate_employee}
                              touch={props.touched.terminate_employee}
                              value={props.values.terminate_employee}
                              required
                              label={"Select Employee"}
                              onChange={(field, value) => {
                                console.log("changing value", value);
                                props.setFieldValue(field, value);
                                handleEmployeeChange(field, value);
                              }}
                            />
                          </div>
                          {infoGroup.length > 0
                            ? infoGroup.map((info) => (
                                <div className="space-y-2 flex flex-col justify-end">
                                  {console.log("info", info)}
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
                                  <div className="space-y-2 flex flex-col justify-end">
                                    <TextInput
                                      value={info.title}
                                      disabled={true}
                                    />
                                  </div>
                                );
                              })}
                        </div>
                      ))}
                      <div className="font-bold text-lg mb-4 text-plum-1100">
                        Exit Details
                      </div>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-4">
                        <DateInput
                          name={"last_working_day"}
                          error={props.errors.last_working_day}
                          touch={props.touched.last_working_day}
                          value={props.values.last_working_day}
                          label={"Last Working Day"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <SelectComponent
                          name={"notice_period"}
                          options={[
                            {
                              value: "1 month",
                              label: "1 month",
                            },
                            {
                              value: "2 month",
                              label: "2 month",
                            },
                            {
                              value: "3 month",
                              label: "3 month",
                            },
                            {
                              value: "0 month",
                              label: "0 month",
                            },
                          ]}
                          error={props.errors.notice_period}
                          touch={props.touched.notice_period}
                          value={props.values.notice_period}
                          label={"Notice Period"}
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
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <SelectComponent
                          name={"reason_for_terminating"}
                          options={terminationReasonsOptions}
                          error={props.errors.reason_for_terminating}
                          touch={props.touched.reason_for_terminating}
                          value={props.values.reason_for_terminating}
                          label={"Reason for Terminating"}
                          onChange={(field, value) => {
                            console.log("value", value);
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <FileInput
                        name={"termination_letter"}
                        error={props.errors?.termination_letter}
                        touch={props.touched?.termination_letter}
                        value={props.values?.termination_letter}
                        label={"Upload Termination Letter or drag it here"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />

                      <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end space-x-4">
                          <Button variant="outline" size="lg" type="submit">
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
      </SheetContent>
    </Sheet>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
    organizations: state.common.organizations,
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)(RequestTerminationCard);
