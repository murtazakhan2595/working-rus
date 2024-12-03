/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  PhoneNumberInput,
  EmailInput,
  CoverFileUpload,
} from "../../../../components/form-control.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { connect } from "react-redux";
import { addApplication, fetchJobById } from "../../../hooks/recruitment.jsx";
import { Header } from "../Sections/index.js";
import { ApplicationDetail } from "../../../utils/Types/Recruitment.jsx";
import { countriesList, countriesCallingCodes } from "data/Data.js";
import { Card } from "components/ui/card.jsx";
import { Button } from "components/ui/button.jsx";
import Newlogo from "assets/images/NewLogo.jsx";
import { educationTypeOptions } from "data/Data.js";
import ApplicationSuccessPage from "./ApplicationSuccessPage.jsx";

const JobApplicationForm = () => {
  const { id } = useParams();
  const formRef = useRef();
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formData = { ...ApplicationDetail, ...{ job_id: id } };
  const [jobDetails, setJobDetails] = useState(null);
  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const data = await fetchJobById(id);
        console.log(data, "DATA")
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    getJobDetails();
  }, [id]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;
      response = await addApplication(values);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Application submitted successfully!`, {
          autoClose: 1000,
        });
        setShowSuccess(true)
        // navigate("/jobs");
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
    <>
      <div className="main-content !pt-0 !px-0">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <Newlogo className="h-8" />
          <div className="text-sm text-gray-500">A Project by TecBrix</div>
        </div>

       {!showSuccess ? <div className=" max-w-[800px] mx-auto">
          <Header
            title="Job Application Form"
            showBackButton={true}
            onBack={() => navigate(-1)}
          />
          <Card className="p-6 bg-white dark:bg-neutral-1000">
            <h2 className="mb-6 text-xl text-primary">
              {jobDetails?.Job_Title}
            </h2>

            <div className="mb-6">
              <label>Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <Button variant="outline">Upload</Button>
              </div>
            </div>

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
                  <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Enter First name"
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
                      placeholder="Enter Last name"
                    />

                    <PhoneNumberInput
                      name="phone_number"
                      error={props.errors.phone_number}
                      touch={props.touched.phone_number}
                      value={props.values.phone_number}
                      label="Contact no."
                      countryCode={props.values.country_code}
                      countryCodeName={"country_code"}
                      required={true}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      countryOptions={countriesCallingCodes}
                      placeholder="Enter Phone no."
                    />
                    <EmailInput
                      name="email"
                      error={props.errors.email}
                      touch={props.touched.email}
                      value={props.values.email}
                      label="Email"
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      placeholder="Enter Email address"
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
                      placeholder="Enter Current salary"
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
                      placeholder="Enter Expected salary"
                    />

                    <SelectComponent
                      name="Education"
                      options={educationTypeOptions}
                      error={props.errors.Education}
                      touch={props.touched.Education}
                      value={props.values.Education}
                      label="Education"
                      required
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
                      placeholder="Enter Notice period"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <SelectComponent
                      name="location"
                      options={countriesList}
                      error={props.errors.location}
                      touch={props.touched.location}
                      value={props.values.location}
                      label="Location"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      placeholder="Select Location"
                      className="mt-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <CoverFileUpload
                        name="cover_letter"
                        label="Attach Cover later"
                        acceptType=".png,.jpg,.pdf"
                        maxSize="10MB"
                        error={props.errors?.cover_letter}
                        touch={props.touched?.cover_letter}
                        value={props.values?.cover_letter}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          props.setFieldTouched(field, true);
                        }}
                      />
                    </div>
                    <div>
                      <CoverFileUpload
                        name="cv"
                        label="Attach Resume"
                        acceptType=".png,.jpg,.pdf"
                        maxSize="10MB"
                        error={props.errors?.cv}
                        touch={props.touched?.cv}
                        value={props.values?.cv}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          props.setFieldTouched(field, true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button type="submit" className="px-8 text-white bg-black"
                    disabled={new Date() > new Date(jobDetails?.Deadline)}
                    >
                      Apply
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </Card> 
        </div> :(
          <ApplicationSuccessPage/>
        )}
      </div>

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobApplicationForm);
