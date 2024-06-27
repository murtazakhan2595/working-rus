import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeInformation } from "app/utils/Types/Employee.jsx";
import { getEmployeeInformation } from "app/utils/MappingObjects/mapEmployeeData.jsx";
import { getEmployeeData, getNewEmployeeCode } from "app/hooks/employee.jsx";
import {
  EmailInput,
  PhoneNumberInput,
  TextAreaInput,
  TextInput,
} from "components/form-control.jsx";
import { validationEmployeeInfoFormSchema } from "app/utils/FormSchema/employeeFormSchema.jsx";
import {
  HeadOfDepartmentOptions,
  employeeStatus,
  jobRoles,
  workplaceTypes,
  UserRoles,
} from "data/Data";

import {
  SelectComponent,
  SelectMultiInputComponent,
  DateInput,
} from "components/form-control";
import {
  getDepartmentList,
  getManagersList,
  getDesignationList,
  getOrganizationList,
} from "app/hooks/general";
import { countryOptions } from "data/Data";

function getManagersStringSelected(managers) {
  if (managers) {
    const matchingObjects = managers.map((obj) => {
      return obj.value;
    });
    return matchingObjects.join(", ");
  }
  return [];
}
const EmployeeForm = ({
  token,
  baseUrl,
  isEditMode,
  nextStep,
  setShowSuccessModal,
  setEmail,
  id,
}) => {
  const formRef = React.createRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EmployeeInformation);
  const [empId, setEmpId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [organization, setOrganization] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await getEmployeeData(id);
          const employeeData = await getEmployeeInformation(response);
          setFormData(employeeData);
          setEmpId(`TXB-${employeeData.id.toString().padStart(4, "0")}`);
        } else {
          const response = await getNewEmployeeCode();
          setEmpId(`TXB-${response.toString().padStart(4, "0")}`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const departmentResponse = await getDepartmentList();
        setDepartments(departmentResponse);

        const managerResponse = await getManagersList();
        setManagers(managerResponse);

        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);

        const organizationResponse = await getOrganizationList();
        setOrganization(organizationResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const handleSubmit = async (data) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    setIsLoading(true);
    try {
      // Check if an API call is already in progress
      data.indirect_report = data?.indirect_report
        ? getManagersStringSelected(data.indirect_report)
        : "";
      if (data.id) {
        const response = await axios.patch(`${baseUrl}/emp/${data.id}`, data, {
          headers,
        });
        if (response.status === 200) {
          toast.success("Employee Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          if (isEditMode) nextStep();
          else navigate("/profile-management");
        }
      } else {
        const response = await axios.post(`${baseUrl}/emp/add`, data, {
          headers,
        });
        if (response.status === 201) {
          setShowSuccessModal && setShowSuccessModal(true);
        }
      }
    } catch (error) {
      setFormData(data);
      if (
        error.response &&
        error.response.data.username[0] ===
          "A user with that username already exists."
      ) {
        toast.error("A user with that username already exists.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("API Error:", error);
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              initialValues={formData}
              innerRef={formRef}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = validationEmployeeInfoFormSchema(values , isEditMode);
                return errors;
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    {!isEditMode && (
                      <>
                        <Col md="12">
                          <h5 className="fw-700 mb-3">Employee Details</h5>
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={"employeeId"}
                            error={props.errors?.employeeId}
                            touch={props.touched?.employeeId}
                            value={empId}
                            label={"Employee ID"}
                            required={true}
                            disabled={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={"username"}
                            error={props.errors?.username}
                            touch={props.touched.username}
                            value={props.values.username}
                            label={"User Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={"first_name"}
                            error={props.errors?.first_name}
                            touch={props.touched.first_name}
                            value={props.values.first_name}
                            label={"First Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={"last_name"}
                            error={props.errors?.last_name}
                            touch={props.touched.last_name}
                            value={props.values.last_name}
                            label={"Last Name"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <EmailInput
                            name={"work_email"}
                            error={props.errors?.work_email}
                            touch={props.touched.work_email}
                            value={props.values.work_email}
                            label={"Email"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                              setEmail && setEmail(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <FormGroup floating>
                            <Input
                              type="password"
                              maxLength="100"
                              id="password"
                              name="password"
                              autoComplete="Off"
                              placeholder={"Enter User Name"}
                              onChange={(option) => {
                                props.handleChange("password")(option);
                              }}
                              value={props.values.password}
                              className={
                                props.errors?.password && props.touched.password
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            <Label htmlFor="password">
                              <span className="text-danger">* </span>Password
                            </Label>
                            {props.errors?.password &&
                              props.touched.password && (
                                <div className="invalid-feedback">
                                  {props.errors?.password}
                                </div>
                              )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <PhoneNumberInput
                            name={"mobile_no"}
                            error={props.errors?.mobile_no}
                            touch={props.touched.mobile_no}
                            value={props.values.mobile_no}
                            label={"Contact no."}
                            countryCode={props.values.country_code}
                            countryCodeName={"country_code"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextAreaInput
                            name={"residential_address"}
                            error={props.errors?.residential_address}
                            touch={props.touched?.residential_address}
                            value={props.values?.residential_address}
                            label={"Address"}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <h5 className="fw-700 mb-3 mt-4">Work information</h5>
                        </Col>
                      </>
                    )}
                    <>
                      <Col md="6" className="z-0">
                        <SelectComponent
                          name={"department_name"}
                          options={departments}
                          error={props.errors?.department_name}
                          touch={props.touched.department_name}
                          value={props.values.department_name}
                          label={"Department"}
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <SelectComponent
                          name={"organization"}
                          options={organization}
                          error={props.errors?.organization}
                          touch={props.touched.organization}
                          value={props.values.organization}
                          label={"Organization"}
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <SelectComponent
                          name={"employee_location"}
                          options={countryOptions}
                          error={props.errors?.employee_location}
                          touch={props.touched.employee_location}
                          value={props.values.employee_location}
                          required={true}
                          label={"Employee Location"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md={6} className="z-0">
                        <SelectComponent
                          name={"department_position"}
                          options={designations}
                          error={props.errors?.department_position}
                          touch={props.touched.department_position}
                          value={parseInt(props.values.department_position)}
                          label={"Designation"}
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <SelectComponent
                          name={"user_role"}
                          options={UserRoles}
                          error={props.errors?.user_role}
                          touch={props.touched.user_role}
                          value={props.values.user_role}
                          required={true}
                          label={"Role"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md="6" className="z-0">
                        <FormGroup>
                          <SelectComponent
                            name={"employee_type"}
                            options={jobRoles}
                            error={props.errors?.employee_type}
                            touch={props.touched.employee_type}
                            value={props.values.employee_type}
                            required={true}
                            label={"Employee Type"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <SelectComponent
                            name={"employee_status"}
                            options={employeeStatus}
                            error={props.errors?.employee_status}
                            touch={props.touched.employee_status}
                            value={props.values.employee_status}
                            required={true}
                            label={"Employee status"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6} className="z-0">
                        <SelectComponent
                          name={"employee_work_type"}
                          options={workplaceTypes}
                          error={props.errors?.employee_work_type}
                          touch={props.touched.employee_work_type}
                          value={props.values.employee_work_type}
                          required={true}
                          label={"Employee Work Type"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>

                      <Col md={6}>
                        <SelectComponent
                          name={"direct_report"}
                          options={managers}
                          error={props.errors?.direct_report}
                          touch={props.touched.direct_report}
                          value={props.values.direct_report}
                          required={true}
                          label={"Direct Report"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>

                      <Col md={6}>
                        <SelectMultiInputComponent
                          name={"indirect_report"}
                          options={managers}
                          error={props.errors?.indirect_report}
                          touch={props.touched.indirect_report}
                          value={props.values.indirect_report}
                          required={true}
                          label={"Indirect Report"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md={6} className="z-0">
                        <SelectComponent
                          name={"department_manager"}
                          options={HeadOfDepartmentOptions}
                          error={props.errors?.department_manager}
                          touch={props.touched.department_manager}
                          value={props.values.department_manager}
                          required={true}
                          label={"Department Head"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <DateInput
                          name={"joining_date"}
                          error={props.errors?.joining_date}
                          touch={props.touched.joining_date}
                          value={props.values.joining_date}
                          required={true}
                          label={"Joining Date"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </Col>
                    </>
                    
                  </Row>
                  <Row>
                    {!isEditMode && (
                      <Col md="2">
                        <Link
                          type="button"
                          className="btn btn-outline-dark w-100"
                          to="/profile-management"
                        >
                          Cancel
                        </Link>
                      </Col>
                    )}
                    <Col md="4">
                      <Button type="submit" className="btn btn-dark w-100">
                        {id ? "Update" : "Add"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
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

export default connect(mapStateToProps)(EmployeeForm);
