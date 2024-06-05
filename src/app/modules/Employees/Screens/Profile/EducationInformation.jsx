import React, { useState, useEffect } from "react";
import {
    CardHeader,
    CardBody,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
} from 'reactstrap';
import { Formik } from 'formik';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getEmployeeAcademicRecordData, saveEmployeeAcademicRecordData } from '../../../../hooks/employee.jsx';
import PageLoader from '../../../../../components/PageLoader.jsx';
import { EmployeeAcademicRecord } from '../../../../utils/Types/Employee';

import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const EducationInformation = ({ nextstep, baseUrl, token, employeeId, isEditMode }) => {

    const formRef = React.createRef();
    const [educations, setEducations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getEmployeeAcademicRecordData(baseUrl, employeeId, token).then(response => {
            setEducations(response);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, employeeId, token]);

    const handleSubmit = (data) => {
        const response = saveEmployeeAcademicRecordData(baseUrl, employeeId, token, data.educations);
        if (response && isEditMode)
            nextstep();
    };

    return (
        <>
            <div className="screen">
                <Row>
                    <Col lg={8} className="mx-auto">
                        <CardHeader>
                            <Row>
                                <Col lg={12}>
                                    <div className="flex justify-between">
                                        <div className="flex justify-start items-start">
                                            <img
                                                src={logo}
                                                className="w-[142px] h-auto md:h-auto lg:pl-5"
                                                alt="Tecbrix logo"
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            {isLoading ?
                                <Row>
                                    <Col lg={12}>
                                        <PageLoader />
                                    </Col>
                                </Row>
                                :
                                <Row>
                                    <Col lg={12}>
                                        <Formik
                                            initialValues={{ educations: educations }}
                                            ref={formRef}
                                            onSubmit={(values, { resetForm }) => {
                                                handleSubmit(values, resetForm);
                                            }}
                                            validate={(values) => {
                                                const errors = {};
                                                if (values.educations) {
                                                    values.educations.forEach((value, index) => {
                                                        const educationErrors = {};
                                                        Object.keys(value).forEach((field) => {
                                                            if (!value[field]) {
                                                                educationErrors[field] = 'This field is required';
                                                            }
                                                        });
                                                        if (Object.keys(educationErrors).length > 0) {
                                                            errors.educations = errors.educations || [];
                                                            errors.educations[index] = educationErrors;
                                                        }
                                                    });
                                                }
                                                return errors;
                                            }}
                                        >
                                            {(props) => (
                                                <Form onSubmit={props.handleSubmit}>
                                                    <Row>
                                                        {props.values?.educations && props.values.educations.length > 0 && props.values.educations.map((education, index) => (
                                                            <React.Fragment key={index}>
                                                                <Col md="12">
                                                                    <h5 className="fw-700 mb-3 mt-4">Education {index + 1}</h5>
                                                                </Col>
                                                                <div className="flex flex-wrap gap-x-3">
                                                                    <div className="w-full md:w-[48%]">
                                                                        <SelectComponent 
                                                                            name={`educations[${index}].education_level`} 
                                                                            value={education.education_level}
                                                                            onChange={props.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="w-full md:w-[48%]">
                                                                        <TextInput 
                                                                            name={`educations[${index}].program`} 
                                                                            value={education.program}
                                                                            onChange={props.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="w-full md:w-[48%]">
                                                                        <TextInput 
                                                                            name={`educations[${index}].institute_name`} 
                                                                            value={education.institute_name}
                                                                            onChange={props.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="w-full md:w-[48%]">
                                                                        <DateInput 
                                                                            name={`educations[${index}].edu_start_date`} 
                                                                            value={education.edu_start_date}
                                                                            onChange={props.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="w-full md:w-[48%]">
                                                                        <DateInput 
                                                                            name={`educations[${index}].edu_end_date`} 
                                                                            value={education.edu_end_date}
                                                                            onChange={props.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40">
                                                                        <input 
                                                                            type="file" 
                                                                            name={`educations[${index}].education_body`} 
                                                                            onChange={(e) => {
                                                                                props.setFieldValue(`educations[${index}].education_body`, e.currentTarget.files[0]);
                                                                            }} 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                        <Col md="12" className="text-left">
                                                            <Button
                                                                type="button"
                                                                className="btn btn-outline-dark"
                                                                onClick={() => {
                                                                    const length = props.values?.educations?.length;
                                                                    const index = length ? length : 0;
                                                                    props.setFieldValue(`educations[${index}]`, EmployeeAcademicRecord);
                                                                }}
                                                            >
                                                                + Add Another
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup className="text-right">
                                                                <Button
                                                                    type="submit"
                                                                    className="btn btn-dark"
                                                                >
                                                                    Next
                                                                </Button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Col>
                                </Row>
                            }
                        </CardBody>
                        <div className="flex justify-start items-start">
                            <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
                                © 2024 TecBrix
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(EducationInformation);
