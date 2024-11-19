import React, { useState, useEffect, useRef, forwardRef } from "react";
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
import { addJob, updateJob, getNewJobCode } from "app/hooks/recruitment.jsx";
import { getCurrenciesList } from "app/hooks/general";
import { JobDetail } from "app/utils/Types/Recruitment.jsx";
import { validationJobFormSchema } from "app/utils/FormSchema/jobFormSchema.jsx";
import SheetComponent from "components/ui/SheetComponent.jsx";
import { Button } from "components/ui/button";
import {SheetCardExtension }from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const JobForm = forwardRef(
  ({ isLoading, formData, handleSubmit, isEditMode, id, onClose, setIsOpen }, formRef) => {
    const initialValues = isEditMode ? formData : JobDetail;
    const navigate = useNavigate();
    const [job_Id, setJob_Id] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [closeSheet, setCloseSheet] = useState(false)

    const handleClose = ()=>{
      // onClose()
      setCloseSheet(true)
    }

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



    useEffect(() => {
      const fetchData = async () => {
        try {
          if (formData?.id) {
            setJob_Id(formData?.serial_number);
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
          <>
     {handleCloseWithConfirmation(closeSheet, setCloseSheet, setIsOpen)}

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
                  <SheetCardExtension title="Details">
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        name="id"
                        error={props.errors.id}
                        touch={props.touched.id}
                        value={job_Id}
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <SelectComponent
                      name="Job_Type"
                      options={jobTypeOptions}
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
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
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        label="End Date"
                        required
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
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
                  </SheetCardExtension>
                  <div className="flex justify-end gap-4 mt-2">
                    <Button
                      variant="outline"
                      // to="/jobs"
                      type="button"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{id ? "Update" : "Post Job"}</Button>
                  </div>
                </form>
              )}
            </Formik>
            </>
        )}
      </>
    );
  }
); 

const CreateUpdateJob = ({ baseUrl, token, onClose, isEditMode, formData, fetchJobPosts, isDashboard = false }) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(isEditMode || false);
  const navigate = useNavigate();
  const id = formData?.id;

  const formSheetData = {
    triggerText: !isEditMode ?"Add New Job": null,
    title: !isEditMode ? "Add New Job": "Update Job",

    description: null,
    footer: null,
  };

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
        setIsOpen(false);
        fetchJobPosts()
        if (isEditMode) onClose();
        else if(isDashboard) console.log("");
        else navigate("/jobs");
        

        if (!isEditMode) {
          resetForm();
          setIsOpen(false);
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
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="custom-sheet-width"
      width="600px"
    >
      <JobForm
        isLoading={isLoading}
        formData={formData}
        handleSubmit={handleSubmit}
        formRef={formRef}
        isEditMode={isEditMode}
        id={id}
        onClose={onClose}
        setIsOpen={setIsOpen}
      />
    </SheetComponent>
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
