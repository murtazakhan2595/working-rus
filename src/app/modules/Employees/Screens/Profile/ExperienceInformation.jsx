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
import { getEmployeeProfessionalExperianceData, saveEmployeeProfessionalExperianceData } from '../../../../hooks/employee.jsx';
import { getBankDetails } from '../../../../utils/MappingObjects/mapEmployeeData.jsx'
import PageLoader from '../../../../../components/PageLoader.jsx';
import Experience from '../Sections/ExperianceForm.jsx'
import { EmployeeProfessionalExperiance } from '../../../../utils/Types/Employee'
import {
    DateInput,
    SelectComponent,
    TextInput,
    CustomDarkButton,
    CustomLightOutlineButton,
} from "../../../../../components/form-control";

const ExperienceInformation = ({ nextstep, baseUrl, token, employeeId, isEditMode, prevStep }) => {

    const formRef = React.createRef();
    const [experiences, setExperiences] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getEmployeeProfessionalExperianceData(baseUrl, employeeId, token).then(response => {
            setExperiences(response);
            setIsLoading(false)
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, employeeId, token]); // Empty dependency array ensures this effect runs only once after the initial render

    const handleSubmit = (data) => {
        const response = saveEmployeeProfessionalExperianceData(baseUrl, employeeId, token, data.experiences);
        if (response)
            nextstep();
    };

    return (
        <>
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
                            initialValues={{ experiences: experiences }}
                            ref={formRef}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values, resetForm);
                            }}
                            validate={(values) => {
                                const errors = {};
                                // console.log(values, errors, 'Error');
                                // if (values.experiences) {
                                //     values.experiences.forEach((value, index) => {
                                //         const experienceErrors = {};
                                //         // Object.keys(value).forEach((field) => {
                                //         //     if (!value[field] && field !== 'disableEndDate') {
                                //         //         experienceErrors[field] = 'This field is required';
                                //         //     }
                                //         // });
                                //         // if (Object.keys(experienceErrors).length > 0) {
                                //         //     errors.experiences = errors.experiences || [];
                                //         //     errors.experiences[index] = experienceErrors;
                                //         // }
                                //     });
                                // }
                                return errors;
                            }}

                        >
                            {(props) => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Row>
                                        {props.values?.experiences && props.values.experiences.length > 0 && props.values.experiences.map((experience, index) => (
                                            <>
                                                <Col md="12">
                                                    <h5 className="fw-700 mb-3 mt-4">Experience {index + 1}</h5>
                                                </Col>
                                                <Experience
                                                    values={experience}
                                                    errors={props.errors?.experiences ? props.errors?.experiences[index] : {}}
                                                    touched={props.touched?.experiences ? props.touched?.experiences[index] : {}}
                                                    onChange={(field, value) => {
                                                        props.setFieldValue(`experiences[${index}].${field}`, value);
                                                    }}
                                                />
                                            </>
                                        ))}
                                        <Col md="12" className="text-left mt-4">
                                            <Link
                                                type="button"
                                                className="btn btn-outline-dark"
                                                onClick={() => {
                                                    const length = props.values?.experiences?.length
                                                    const index = length ? length : 0;

                                                    props.setFieldValue(`experiences[${index}]`, EmployeeProfessionalExperiance);
                                                }}
                                            >
                                                + Add Another
                                            </Link>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md={6} className="text-left">
                                            {!isEditMode &&
                                                <CustomLightOutlineButton
                                                    onClick={() => {
                                                        prevStep()
                                                    }}
                                                    label={'Back'}
                                                />

                                            }</Col>
                                        <Col md="6" className="text-right">
                                            <CustomDarkButton
                                                onClick={() => {
                                                    props.handleSubmit();
                                                }}
                                                label={isEditMode ? 'Save' : 'Next'}
                                            />
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            }
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

export default connect(mapStateToProps)(ExperienceInformation);
