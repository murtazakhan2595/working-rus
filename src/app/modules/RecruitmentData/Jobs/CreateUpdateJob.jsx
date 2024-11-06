import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Card, CardHeader, CardBody, Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  TextInput,
  SelectComponent,
  DateInput,
  TextAreaInput,
} from "components/form-control.jsx";
import { toast } from "react-toastify";
import { AmountPattern } from "app/utils/Types/ValidationPattern";
import "react-toastify/dist/ReactToastify.css";
import {
  educationTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  workTypeOptions,
  countriesList,
} from "data/Data.js";

import PageLoader from "components/PageLoader.jsx";
import { connect } from "react-redux";
import { addJob, updateJob ,getNewJobCode} from "app/hooks/recruitment.jsx";
import { getCurrenciesList } from "app/hooks/general";
import { JobDetail } from "app/utils/Types/Recruitment.jsx";
import { validationJobFormSchema } from "app/utils/FormSchema/jobFormSchema.jsx";
import SheetComponent from "components/ui/SheetComponent.jsx";
import { Button } from "components/ui/button";
import { getJobTypeOptions } from "data/Data";

const JobForm = forwardRef(
  ({ isLoading, formData, handleSubmit, isEditMode, id, onClose }, formRef) => {
    const initialValues = isEditMode ? formData : JobDetail;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [job_Id, setJob_Id] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const currencyData = await getCurrenciesList();
          setCurrencies(currencyData);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }, []);

    const formSheetData = {
      triggerText: "Add New Job",
      title: "Add New Job",
  
      description: null,
      footer: null,
    };

    
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formData?.id) {
          setJob_Id(formData?.id);
        } else {
          const response = await getNewJobCode();
          setJob_Id(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

    return (
      <>
        {isLoading ? (
              <PageLoader />
        ) : (
          <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          width="600px"
        >
              <Formik
                initialValues={initialValues}
                innerRef={formRef}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, resetForm);
                }}
                validate={(values) => {
                  const errors = validationJobFormSchema(values);
                  return errors;
                }}
              >
                {(props) => (
                  <form onSubmit={props.handleSubmit}>
                        <h5 className="mb-3 fw-700">Details</h5>
                        <TextInput
                          name="id"
                          error={props.errors.id}
                          touch={props.touched.id}
                          value={job_Id || props.values.id}
                          label="Job Id"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          disabled
                        />
                        <TextInput
                          name="Job_Title"
                          error={props.errors.Job_Title}
                          touch={props.touched.Job_Title}
                          value={props.values.Job_Title}
                          label="Job Title"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                        <SelectComponent
                          name="Job_Type"
                          options={getJobTypeOptions()}
                          error={props.errors.Job_Type}
                          touch={props.touched.Job_Type}
                          value={props.values.Job_Type}
                          label="Job Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                        <SelectComponent
                          name="Work_type"
                          options={workTypeOptions}
                          error={props.errors.Work_type}
                          touch={props.touched.Work_type}
                          value={props.values.Work_type}
                          label="Work Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />

                        <SelectComponent
                          name="Employee_Type"
                          options={employeeTypeOptions}
                          error={props.errors.Employee_Type}
                          touch={props.touched.Employee_Type}
                          value={props.values.Employee_Type}
                          label="Employee Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
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

                        <SelectComponent
                          name="location"
                          options={countriesList}
                          error={props.errors.location}
                          touch={props.touched.location}
                          value={props.values.location}
                          label="Location"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                            const currenciesCode = currencies.filter((obj) =>
                              obj.label.includes(value)
                            );
                            if (currenciesCode && currenciesCode.length > 0)
                              props.setFieldValue(
                                "currency",
                                currenciesCode[0]?.value
                              );
                          }}
                        />

                        <SelectComponent
                          name="currency"
                          options={currencies}
                          error={props.errors.currency}
                          touch={props.touched.currency}
                          value={props.values.currency}
                          label="Currency"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />

                        <TextInput
                          name="min_salary"
                          error={props.errors.min_salary}
                          touch={props.touched.min_salary}
                          value={props.values.min_salary}
                          label="Salary range (min)"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          maxLength="14,2"
                          regEx={AmountPattern}
                        />
   
                        <TextInput
                          name="max_salary"
                          error={props.errors.max_salary}
                          touch={props.touched.max_salary}
                          value={props.values.max_salary}
                          label="Salary range (max)"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          maxLength="14,2"
                          regEx={AmountPattern}
                        />
                        <DateInput
                          name="start_date"
                          error={props.errors.start_date}
                          touch={props.touched.start_date}
                          value={props.values.start_date}
                          label="Start Date"
                          required
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <DateInput
                          name="Deadline"
                          error={props.errors.Deadline}
                          touch={props.touched.Deadline}
                          value={props.values.Deadline}
                          label="Deadline"
                          required
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <h5 className="mt-4 mb-3 fw-700">Description</h5>
                        <TextAreaInput
                          name="Job_Requirement"
                          error={props.errors.Job_Requirement}
                          touch={props.touched.Job_Requirement}
                          value={props.values.Job_Requirement}
                          label="Job Requirement"
                          required
                          maxRows={5}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                        <TextAreaInput
                          name="Job_Description"
                          error={props.errors.Job_Description}
                          touch={props.touched.Job_Description}
                          value={props.values.Job_Description}
                          label="Job Description"
                          required
                          maxRows={5}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                        <div className="flex justify-end gap-4 mt-2">
                        <Button
                          variant="outline"
                          // to="/jobs"
                          onClick={() => {
                            isEditMode ? onClose() : navigate("/jobs");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" >
                          {id ? "Update" : "Add"}
                        </Button>
                        </div>
                  </form>
                )}
              </Formik>
        </SheetComponent>
        )}
      </>
    );
  }
);

const CreateUpdateJob = ({ baseUrl, token, onClose, isEditMode, formData }) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const id = formData?.id;

  const handleSubmit = async (values, resetForm) => {
    setIsLoading(true);

    try {
      let response;
      if (isEditMode && id) {
        response = await updateJob(baseUrl, id, values, token);
      } else {
        response = await addJob(baseUrl, values, token);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Job ${isEditMode ? "updated" : "added"} successfully!`, {
          autoClose: 1000,
        });
        if (isEditMode) onClose();
        else navigate("/jobs");

        if (!isEditMode) {
          resetForm();
        }
      } else {
        toast.error(
          `Failed to ${isEditMode ? "update" : "add"} job. Please try again.`
        );
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} job:`, error);
      toast.error(`Error ${isEditMode ? "updating" : "adding"} job:`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isEditMode ? (
        <JobForm
          isLoading={isLoading}
          formData={formData}
          handleSubmit={handleSubmit}
          formRef={formRef}
          isEditMode={isEditMode}
          id={id}
          onClose={onClose}
        />
      ) : (
        <div className="screen bg-[#F0F1F2]">
              <Card>
                <CardBody style={{ maxWidth: "800px" }}>
                  <JobForm
                    isLoading={isLoading}
                    formData={formData}
                    handleSubmit={handleSubmit}
                    formRef={formRef}
                    isEditMode={isEditMode}
                    id={id}
                  />
                </CardBody>
              </Card>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CreateUpdateJob);
