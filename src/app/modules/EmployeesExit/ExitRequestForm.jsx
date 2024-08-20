import { PageLoader } from "components";
import { connect } from "react-redux";
import {
  FileInput,
  SelectComponent,
  DateInput,
  TextInput,
  PhoneNumberInput,
} from "components/form-control";
import React, { useState } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { countryOptions, NoticePeriod, ResignationReasons } from "data/Data";

function ExitRequestForm({
  reload,
  reportingManagers,
  designations,
  departments,
  userDetails,
  organizations,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = React.createRef();

  const handleSubmit = async (data, resetForm) => {
    // setIsLoading(true);
    const formData = {
      exit_category: "resignation",
      employee_id: userDetails.id,
      status_resignation: "pending",
      exit_date: data.exit_date,
      resignation_letter: data.resignation_Letter,
      notice_period: data.notice_period,
      exit_type: data.reason_for_leaving,
    };

    try {
      const response = await employeeExit(formData);
      if (response) {
        toast.success("Request has been successfully submitted");
        reload();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="m-2 mt-0 bg-white px-2 py-4 rounded-b-md">
        {loading ? (
          <PageLoader />
        ) : (
          <div className="w-full lg:w-[80%]">
            <div className="bg-white  w-full rounded-lg px-8">
              <div className="flex justify-between">
                <h2 className="text-[#323333] text-lg font-semibold">
                  Employee Information
                </h2>
              </div>
              <div className="flex flex-col">
                {/* Image Section */}
                <div className=" w-full flex  sm:flex-col  md:flex-row lg:flex-row justify-center lg:items-center gap-4">
                  {userDetails?.profile_picture?.file ||
                  userDetails?.profile_picture ? (
                    <img
                      src={
                        userDetails?.profile_picture?.file ||
                        userDetails?.profile_picture
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div className="opacity-70 w-24 h-24 rounded-full bg-slate-100 text-center align-middle justify-center items-center flex">
                      Profile
                    </div>
                  )}
                  <div className="w-full flex flex-col my-auto">
                    <div className="font-semibold text-lg">
                      {userDetails.first_name} {userDetails.last_name}
                    </div>
                    <div className="opacity-70">
                      ID: TXB-{userDetails.id?.toString().padStart(4, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white  w-full rounded-lg p-6 mb-6">
              <Row>
                <Col lg={12}>
                  <Formik
                    initialValues={{}}
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
                      <Form onSubmit={props.handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <TextInput
                              name={"first_name"}
                              error={props.errors.first_name}
                              touch={props.touched.first_name}
                              value={userDetails?.first_name}
                              label={"First Name"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <TextInput
                              name={"last_name"}
                              error={props.errors.last_name}
                              touch={props.touched.last_name}
                              value={userDetails?.last_name}
                              label={"Last Name"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <SelectComponent
                              name={"department_name"}
                              options={departments}
                              error={props.errors.department_name}
                              touch={props.touched.department_name}
                              value={userDetails?.department_name}
                              label={"Department"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <SelectComponent
                              name={"department_position"}
                              options={designations}
                              error={props.errors.department_position}
                              touch={props.touched.department_position}
                              value={parseInt(userDetails?.department_position)}
                              label={"Position"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <SelectComponent
                              name={"employee_location"}
                              options={countryOptions}
                              error={props.errors?.employee_location}
                              touch={props.touched.employee_location}
                              value={userDetails.employee_location}
                              required={true}
                              label={"Employee Location"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <SelectComponent
                              name={"organization"}
                              options={organizations}
                              error={props.errors?.organization}
                              touch={props.touched.organization}
                              value={userDetails.organization}
                              label={"Organization"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <SelectComponent
                              name={"direct_report"}
                              options={reportingManagers}
                              error={props.errors?.direct_report}
                              touch={props.touched.direct_report}
                              value={userDetails.direct_report}
                              label={"Direct Report"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <DateInput
                              name={"joining_date"}
                              error={props.errors?.joining_date}
                              touch={props.touched.joining_date}
                              value={userDetails.joining_date}
                              required={true}
                              label={"Joining Date"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col md={6}>
                            <PhoneNumberInput
                              name={"mobile_no"}
                              error={props.errors?.mobile_no}
                              touch={props.touched.mobile_no}
                              value={userDetails.mobile_no}
                              label={"Contact no."}
                              countryCode={userDetails.country_code}
                              countryCodeName={"country_code"}
                              required={true}
                              onChange={(field, value) => {
                                props.handleChange(field)(value);
                              }}
                              disabled={true}
                            />
                          </Col>
                          <Col lg={12} className="mt-2">
                            <h2 className="text-[#323333] text-lg font-semibold">
                              Exit Details
                            </h2>
                          </Col>
                          <Col md={6}>
                            <DateInput
                              name={"exit_date"}
                              error={props.errors.exit_date}
                              touch={props.touched.exit_date}
                              value={props.values.exit_date}
                              label={"Exit Date"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </Col>

                          <Col md={6}>
                            <SelectComponent
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
                          </Col>
                          <Col md={12} className="z-0">
                            <SelectComponent
                              name={"reason_for_leaving"}
                              options={ResignationReasons}
                              error={props.errors.reason_for_leaving}
                              touch={props.touched.reason_for_leaving}
                              value={props.values.reason_for_leaving}
                              label={"Reason for leaving"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </Col>
                          <Col md="12">
                            <FileInput
                              name={"resignation_Letter"}
                              error={props.errors?.resignation_Letter}
                              touch={props.touched?.resignation_Letter}
                              value={props.values?.resignation_Letter}
                              label={" Resignation Letter or drag it here"}
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
                                className="mt-4 bg-white border-2 border-black rounded-lg flex items-center justify-center gap-x-2 text-black font-lato text-base  w-48 h-12"
                              >
                                Reset
                              </button>

                              <button
                                type="submit"
                                className="mt-4 bg-black rounded-lg flex items-center justify-center gap-x-2 text-white font-lato text-base  w-48 h-12"
                              >
                                Submit
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
    designations: state.common.designations,
    organizations: state.common.organizations,
    reportingManagers: state.emp.reportingManagers,
    userDetails: state.emp.userDetails,
  };
};

export default connect(mapStateToProps)(ExitRequestForm);
