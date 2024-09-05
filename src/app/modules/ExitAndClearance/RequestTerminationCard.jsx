import React from "react";
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

const { RxCross2 } = require("react-icons/rx");


const RequestTerminationCard = ({ employees, closeModel }) => {
  const [initialValues, setInitialValues] = React.useState({});
  const [employeeData, setEmployeeData] = React.useState([[] ]);
  const formRef = React.createRef();

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
    console.log("field", field);
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
          { title: "Organization", data: response.organization },
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
      setEmployeeData(employeeDataArray);

    } catch (e) {
      console.error(e);
    }
  };
  const handleSubmit =async (values, resetForm) => {
    console.log(values);
    const payload = {
      exit_date: values.exit_interview_date,
      final_working_day: values.last_working_day,
      exit_category: "termination",
      termination_letter: values.termination_letter,
      notice_period: values.notice_period,
      employee_id: values.terminate_employee,
    };
    try{
      const response = await employeeExit(payload);
      if(response){
        toast.success("Termination request submitted successfully");
        closeModel();
      }
    }catch(e){
      console.error(e);
      toast.error("Failed to submit the form");
    }

  };
  return (
    <div
      className="fixed top-0 text-[#323333] right-0 w-[95%] h-[100vh] z-10 overflow-y-auto p-8 hideScroll bg-white"
      style={{ maxWidth: "806px", minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-bold ">Termination</h2>

        <RxCross2
          className="cursor-pointer "
          onClick={() => {
            closeModel();
          }}
        />
      </div>

      <div className="mt-10 pr-7">
        <Row>
          <Col lg={12}>
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
                <form onSubmit={props.handleSubmit}>
                  <Row>
                    <div className="flex flex-col gap-8 mb-4 overflow-visible lg:flex-row no-scrollbar whitespace-break-spaces">
                      {employeeData.map((infoGroup, index) => (
                        <div
                          key={index}
                          className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-2"
                        >
                          <SelectComponent
                            name="terminate_employee"
                            options={employees}
                            error={props.errors.terminate_employee}
                            touch={props.touched.terminate_employee}
                            value={props.values.terminate_employee}
                            required
                            label="Select Employee"
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              handleEmployeeChange(field, value);
                            }}
                          />
                          {infoGroup.length > 0
                            ? infoGroup.map((info) => (
                                <div
                                  className="flex flex-col w-full px-3 py-1 border rounded-md h-fit"
                                  key={info.title}
                                >
                                  <div className="w-full opacity-60 ">
                                    {info.title}
                                  </div>

                                  <div className="w-full">
                                    {info.data || "-----"}
                                  </div>
                                </div>
                              ))
                            : employeeFootPrint.map((info)=>{
                              return (
                                <div
                                  className="flex w-full border items-center px-3 py-[1rem] h-fit  rounded-md"
                                  key={info.title}
                                >
                                  <div className="w-full opacity-60 ">
                                    {info.title}
                                  </div>

                                </div>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                    <div className="mb-4 text-lg font-bold">Exit Details</div>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6} className="z-0">
                      <SelectComponent
                        name={"reason_for_terminating"}
                        options={[
                          {
                            value: "poor-performance",
                            label: "Poor Performance",
                          },
                          { value: "involuntary", label: "Involuntary" },
                          {
                            value: "end-of-contract",
                            label: "End of Contract",
                          },
                          { value: "retirement", label: "Retirement" },
                          { value: "layoff", label: "Layoff" },
                          { value: "dismissal", label: "Dismissal" },
                          {
                            value: "mutual-agreement",
                            label: "Mutual Agreement",
                          },
                        ]}
                        error={props.errors.reason_for_terminating}
                        touch={props.touched.reason_for_terminating}
                        value={props.values.reason_for_terminating}
                        label={"Reason for leaving"}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md="12">
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
                    </Col>
                    <Col md="12">
                      <div className="flex flex-row gap-9 ">
                        <button
                          type="submit"
                          className="flex items-center justify-center w-48 h-12 mt-4 text-base text-black bg-white border-2 border-black rounded-lg gap-x-2 font-lato"
                        >
                          Reset
                        </button>

                        <button
                          type="submit"
                          className="flex items-center justify-center w-48 h-12 mt-4 text-base text-white bg-black rounded-lg gap-x-2 font-lato"
                        >
                          Submit
                        </button>
                      </div>
                    </Col>
                  </Row>
                </form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};
export default  connect(mapStateToProps)(RequestTerminationCard);