import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Row, Col, Button, Form, CardHeader } from "reactstrap";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import {
  TextInput,
  SelectComponent,
  PhoneNumberInput,
  SelectMultiInputComponent,
  DateInput,
  TextAreaInput,
} from "components/form-control.jsx";
import { PageLoader } from "components";

import { getEmployeeData } from "app/hooks/employee";
import { addLeaveRequest } from "app/hooks/leaveManagment";
import {
  getEmployeeLeaveTypes,
  allotLeavesToEmployee,
} from "app/hooks/leaveManagment";
import { FaChevronCircleLeft } from "react-icons/fa";
import { countriesList } from "data/Data";
import { getLavefromEmployeeInfo } from "app/utils/MappingObjects/mapLeaveData";
import { Leave } from "app/utils/Types/LeaveManagment";
import moment from "moment";
import { validationLeaveRequestFormSchema } from "app/utils/FormSchema/leaveManagmentFormSchema";
import { getEmployeeLeavesTypesList } from "utils/Lists";
function getManagerSelected(managers) {
  if (managers) {
    const matchingObjects = managers.map((obj) => {
      return obj.value;
    });
    return matchingObjects;
  }
  return "";
}

const CreateLeaveRequest = ({
  userProfile,
  managers,
  departments,
  designations,
  leaveTypes,
}) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [leaveForm, setLeaveForm] = useState(Leave);
  const navigate = useNavigate();
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [employeeLeaveTypesInfo, setEmployeeLeaveTypesInfo] = useState({});
  const [selectedLeaveTypeInfo, setSelectedLeaveTypeInfo] = useState({});
  const [leavesInfo, setLeavesInfo] = useState(0);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setIsLoading(true);
      try {
        const employeeResponse = await getEmployeeData(userProfile.id);
        const leaveData = await getLavefromEmployeeInfo(employeeResponse);
        setLeaveForm({ ...Leave, ...leaveData });

        // If you need to update form fields directly
        if (formRef.current) {
          for (const [field, value] of Object.entries(leaveData)) {
            formRef.current.setFieldValue(field, value || "");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [userProfile]);

  const getPosts = async () => {
    try {
      const data = await getEmployeeLeaveTypes({
        employee_id: userProfile.id,
      });
      setEmployeeLeaveTypesInfo(data.results);
      setEmployeeLeaveTypes(
        getEmployeeLeavesTypesList(leaveTypes, data.results)
      );
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
    }
  };
  useEffect(() => {
    getPosts();
  }, [userProfile, leaveTypes]);

  const getAllotedLeaveInfo = (leaveType, props) => {
    const alloted_leaves_info = employeeLeaveTypesInfo.find(
      (obj) => obj.id === leaveType
    );
    setSelectedLeaveTypeInfo(alloted_leaves_info);
    calculateAllowedLeaves(
      alloted_leaves_info,
      props.values.total_leave,
      props
    );
  };
  const calculateAllowedLeaves = (alloted_leaves_info, total_leaves) => {
    console.log("alloted_leaves_info", alloted_leaves_info);
    console.log("total_leaves", total_leaves);
    if (alloted_leaves_info && total_leaves) {
      const requested_leave = parseInt(total_leaves);
      const used_leaves = alloted_leaves_info.used_leave;
      const left_leave = alloted_leaves_info.left_leave;
      setLeavesInfo({
        ...alloted_leaves_info,
        ...{
          left_leave: left_leave - requested_leave,
          used_leave: used_leaves + requested_leave,
        },
      });
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    console.log("values",values);
    try {
      // Extract the value from the report_to field
      const modifiedValues = {
        ...values,
        indirect_report_to: getManagerSelected(values.indirect_report_to),
      };
      console.log("modifiedValues",modifiedValues);
      const response = await addLeaveRequest(modifiedValues);
      if (response) {
        const leaveResponse = await allotLeavesToEmployee(
          userProfile.id,
          [leavesInfo]
        );
        if (leaveResponse) {
          toast.success("Form submitted successfully!");
          resetForm();
          navigate("/leave-tracker");
        }
      } else {
        toast.error("Form submission failed.");
      }
    } catch (error) {
      toast.error("Form submission failed.");
    } finally {
      setIsLoading(false);
    }
  };
  const setLeaveDays = (totalLeave, startDate) => {
    startDate = startDate ? new Date(moment(startDate)) : null;
    if (startDate && !isNaN(startDate.getTime()) && totalLeave) {
      console.log(startDate.getDate());
      console.log(totalLeave);
      const lastWorkingDay = moment(startDate).subtract(1, "days");
      let endDate = moment(startDate); // Initialize endDate to startDate itself
      let workingDaysAdded = 0; // Start counting from 0
      while (workingDaysAdded < totalLeave) {
        // Check if the current day is a weekday
        if (endDate.isoWeekday() !== 6 && endDate.isoWeekday() !== 7) {
          workingDaysAdded++;
        }
        // Only add a day if we haven't reached the total leave days yet
        if (workingDaysAdded < totalLeave) {
          endDate.add(1, "days");
        }
        console.log(workingDaysAdded, totalLeave, endDate.format("YYYY-MM-DD"));
      }
      console.log("endDate", endDate.format("YYYY-MM-DD"));

      const rejoiningDate = moment(endDate).add(1, "days");
      formRef.current.setFieldValue("end_date", endDate.format("YYYY-MM-DD"));
      formRef.current.setFieldValue(
        "rejoining_date",
        rejoiningDate.format("YYYY-MM-DD")
      );
      formRef.current.setFieldValue(
        "last_work_day",
        lastWorkingDay.format("YYYY-MM-DD")
      );
    }
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Row>
        <Col lg={12} className="mx-auto">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={10}>
                  <div className="mb-0 h4 d-flex align-items-center">
                    <i className="nav-icon fas fa-id-card-alt" />
                    <span className="ml-2 fw-700">New Leave Request</span>
                  </div>
                </Col>
                <Col lg={2}>
                  <Link
                    type="button"
                    className="bg-transparent btn btn-light fw-700"
                    to="/leave-tracker"
                  >
                    <span style={{ display: "inline-block" }}>Go Back</span>
                    <FaChevronCircleLeft
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                        marginBottom: "2px",
                      }}
                    />
                  </Link>
                </Col>
              </Row>
            </CardHeader>

            <CardBody style={{ maxWidth: "800px" }}>
              <>
                {isLoading ? (
                  <Row>
                    <Col lg={12}>
                      <PageLoader />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={leaveForm}
                        enableReinitialize={true} // Ensure Formik updates initialValues when leaveForm changes
                        innerRef={formRef}
                        onSubmit={handleSubmit}
                        validate={(values) => {
                          const errors = validationLeaveRequestFormSchema(
                            values,
                            selectedLeaveTypeInfo
                          );
                          return errors;
                        }}
                      >
                        {(props) => (
                          <form onSubmit={props.handleSubmit}>
                            <h2 className="text-lg font-semibold text-baseGray font-lato">
                              Application Date
                            </h2>
                            {/* {console.log(props.values)} */}
                            <Row>
                              <Col md="6">
                                <DateInput
                                  name="date"
                                  error={props.errors.date}
                                  touch={props.touched.date}
                                  value={props.values.date}
                                  label="Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  disabled={true}
                                />
                              </Col>
                            </Row>
                            <h2 className="text-lg font-semibold text-baseGray font-lato">
                              Employee Details
                            </h2>
                            <Row>
                              <Col md="6">
                                <TextInput
                                  name="employee_id"
                                  error={props.errors.employee_id}
                                  touch={props.touched.employee_id}
                                  value={
                                    props.values.employee_id
                                      ? `TXB-${props.values.employee_id
                                          .toString()
                                          .padStart(4, "0")}`
                                      : ""
                                  }
                                  disabled={true}
                                  label="Employee ID"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6"></Col>

                              <Col md={6}>
                                <TextInput
                                  name="name"
                                  error={props.errors.name}
                                  touch={props.touched.name}
                                  value={props.values.name}
                                  label="Name"
                                  disabled={true}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="position"
                                  options={designations}
                                  error={props.errors.position}
                                  touch={props.touched.position}
                                  value={parseInt(props.values.position)}
                                  disabled={true}
                                  label="Position"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="department"
                                  options={departments}
                                  error={props.errors.department}
                                  touch={props.touched.department}
                                  value={props.values.department}
                                  disabled={true}
                                  label="Department"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="joining_date"
                                  error={props.errors.joining_date}
                                  touch={props.touched.joining_date}
                                  value={props.values.joining_date}
                                  label="Joining Date"
                                  disabled={true}
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="nationality"
                                  options={countriesList}
                                  error={props.errors.nationality}
                                  touch={props.touched.nationality}
                                  value={props.values.nationality}
                                  disabled={true}
                                  label="Nationality"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <h2 className="text-lg font-semibold text-baseGray font-lato">
                              Leave Details
                            </h2>
                            <Row>
                              <Col md="6">
                                <DateInput
                                  name="start_date"
                                  error={props.errors.start_date}
                                  touch={props.touched.start_date}
                                  value={props.values.start_date}
                                  label="Start Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                    setLeaveDays(
                                      props.values.total_leave,
                                      value
                                    );
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="end_date"
                                  error={props.errors.end_date}
                                  touch={props.touched.end_date}
                                  value={props.values.end_date}
                                  label="End Date"
                                  required={true}
                                  minDate={
                                    new Date(props.values.start_date) ||
                                    new Date()
                                  }
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>

                              <Col md={6}>
                                <DateInput
                                  name="last_work_day"
                                  error={props.errors.last_work_day}
                                  touch={props.touched.last_work_day}
                                  value={props.values.last_work_day}
                                  label="Last Work Day"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md={6}>
                                <DateInput
                                  name="rejoining_date"
                                  error={props.errors.rejoining_date}
                                  touch={props.touched.rejoining_date}
                                  value={props.values.rejoining_date}
                                  label="Rejoining Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="total_leave"
                                  error={props.errors.total_leave}
                                  touch={props.touched.total_leave}
                                  value={props.values.total_leave}
                                  label="Total Leave"
                                  required={true}
                                  onChange={(field, value) => {
                                    if (value) {
                                      props.setFieldValue(
                                        field,
                                        parseInt(value)
                                      );
                                      calculateAllowedLeaves(
                                        selectedLeaveTypeInfo,
                                        parseInt(value),
                                        props
                                      );
                                      setLeaveDays(
                                        parseInt(value),
                                        props.values.start_date
                                      );
                                    }
                                    props.setFieldValue(field, value);
                                  }}
                                  regEx={/^[0-9]+$/}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="leave_type"
                                  options={employeeLeaveTypes}
                                  error={props.errors.leave_type}
                                  touch={props.touched.leave_type}
                                  value={props.values.leave_type}
                                  required={true}
                                  label="Leave Type"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                    getAllotedLeaveInfo(value, props);
                                  }}
                                />
                              </Col>
                              <Col md="12">
                                <TextAreaInput
                                  name="reason"
                                  error={props.errors.reason}
                                  touch={props.touched.reason}
                                  value={props.values.reason}
                                  label="Reason"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <PhoneNumberInput
                                  name={"contact_no"}
                                  error={props.errors.contact_no}
                                  touch={props.touched.contact_no}
                                  value={props.values.contact_no}
                                  label={"Contact Number"}
                                  countryCode={props.values.country_code}
                                  countryCodeName={"country_code"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              {/* <Col md="6">
                                <SelectMultiInputComponent
                                  name="indirect_report_to"
                                  options={managers}
                                  error={props.errors.indirect_report_to}
                                  touch={props.touched.indirect_report_to}
                                  value={props.values.indirect_report_to}
                                  label="Reporting Manager"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col> */}
                              <Col md="12">
                                <TextInput
                                  name="address_during_leave"
                                  error={props.errors.address_during_leave}
                                  touch={props.touched.address_during_leave}
                                  value={props.values.address_during_leave}
                                  label="Address During Leave"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md="2">
                                <Link
                                  type="button"
                                  className="btn btn-outline-dark w-100"
                                  to="/leave-tracker"
                                >
                                  Cancel
                                </Link>
                              </Col>
                              <Col md="4">
                                <Button
                                  type="submit"
                                  className="btn btn-dark w-100"
                                >
                                  Submit
                                </Button>
                              </Col>
                            </Row>
                          </form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                )}
              </>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    leaveTypes: state.common.leaveTypes,
    departments: state.common.departments,
    designations: state.common.designations,
    managers: state.emp.reportingManagers,
  };
};

export default connect(mapStateToProps)(CreateLeaveRequest);
