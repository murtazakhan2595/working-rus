import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { CardHeader } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
  FileInput,
  PhoneNumberInput,
  EmailInput,
} from "../../../../components/form-control.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../../../components/PageLoader.jsx";
import { connect } from "react-redux";
import { addApplication } from "../../../hooks/recruitment.jsx";
import { Header } from "../Sections/index.js";
import { ApplicationDetail } from "../../../utils/Types/Recruitment.jsx";
import { countriesList, countriesCallingCodes } from "data/Data.js";
import {Card, CardContent } from "components/ui/card.jsx";
import { Button } from "components/ui/button.jsx";

const JobApplicationForm = () => {
  const { id } = useParams();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formData = { ...ApplicationDetail, ...{ job_id: id } };
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;
      response = await addApplication(values);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Application submitted successfully!`, {
          autoClose: 1000,
        });
        navigate("/jobs");
      } else {
        toast.error(`Failed to submit application. Please try again.`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred. Failed to submit application. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F0F1F2]">
      <Header title="Job Application" />
      <Card>
        <CardHeader>
          <div className="mb-0 h4 d-flex align-items-center">
            <i className="nav-icon fas fa-id-card-alt" />
            <span className="ml-2 fw-700">Application Form</span>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <>
            {isLoading ? (
              <PageLoader />
            ) : (
              <Formik
                initialValues={formData}
                innerRef={formRef}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validate={(values) => {
                  const errors = {};

                  return errors;
                }}
              >
                {(props) => (
                  <form onSubmit={props.handleSubmit}>
                    <TextInput
                      name="first_name"
                      error={props.errors.first_name}
                      touch={props.touched.first_name}
                      value={props.values.first_name}
                      label="First Name"
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                    />
                    <TextInput
                      name="last_name"
                      error={props.errors.last_name}
                      touch={props.touched.last_name}
                      value={props.values.last_name}
                      label="Last Name"
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                    />
                    <SelectComponent
                      name={"location"}
                      options={countriesList}
                      error={props.errors.location}
                      touch={props.touched.location}
                      value={props.values.location}
                      label={"Location"}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                    <PhoneNumberInput
                      name={"phone_number"}
                      error={props.errors.phone_number}
                      touch={props.touched.phone_number}
                      value={props.values.phone_number}
                      label={"Contact no."}
                      countryCode={props.values.country_code}
                      countryCodeName={"country_code"}
                      required={true}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      countryOptions={countriesCallingCodes}
                    />
                    <EmailInput
                      name={"email"}
                      error={props.errors.email}
                      touch={props.touched.email}
                      value={props.values.email}
                      label={"Email"}
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                    />
                    <TextInput
                      name="notice_period"
                      error={props.errors.notice_period}
                      touch={props.touched.notice_period}
                      value={props.values.notice_period}
                      label="Notice Period"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      required={true}
                    />
                    <TextInput
                      name="Year_of_Experience"
                      error={props.errors.Year_of_Experience}
                      touch={props.touched.Year_of_Experience}
                      value={props.values.Year_of_Experience}
                      label="Experience (in years)"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      maxLength={3}
                      required={true}
                      regEx={/^[0-9.]+$/}
                    />
                    <TextInput
                      name="current_salary"
                      error={props.errors.current_salary}
                      touch={props.touched.current_salary}
                      value={props.values.current_salary}
                      label="Current Salary"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      maxLength="14,2"
                      regEx={/^[0-9.]+$/}
                    />
                    <TextInput
                      name="expected_salary"
                      error={props.errors.expected_salary}
                      touch={props.touched.expected_salary}
                      value={props.values.expected_salary}
                      label="Expected Salary"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      maxLength="14,2"
                      regEx={/^[0-9.]+$/}
                    />
                    <DateInput
                      name="availability_for_interview"
                      error={props.errors.availability_for_interview}
                      touch={props.touched.availability_for_interview}
                      value={props.values.availability_for_interview}
                      label="Availability for interview"
                      required={true}
                      minDate={new Date()}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                    <FileInput
                      name="cv"
                      label=" resume or drag it here"
                      acceptType=".pdf"
                      error={props.errors?.cv}
                      touch={props.touched?.cv}
                      value={props.values?.cv}
                      required={true}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                    <Link
                      type="button"
                      className="btn btn-outline-dark w-100"
                      to="/jobs"
                    >
                      Cancel
                    </Link>
                    <Button type="submit">{"Submit"}</Button>
                  </form>
                )}
              </Formik>
            )}
          </>
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobApplicationForm);
