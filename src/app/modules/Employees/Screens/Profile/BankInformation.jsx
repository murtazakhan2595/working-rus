import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    ButtonGroup,
    ButtonDropdown,
    DropdownToggle,
    Button,
    Form,
    Label,
    FormGroup, Input, InputGroup, InputGroupText
} from 'reactstrap';
import { Formik } from 'formik';
import { Link } from "react-router-dom";
import moment from "moment";
import { getAllCountries } from 'countries-and-timezones';
import Select from "react-select";
import { countryCodes } from "../../../../../data/CountryCode.js";
import { connect } from "react-redux";
import { getEmployeeBankDetailsData, saveEmployeeBankDetailsData } from '../../../../hooks/employee.jsx';
import { getBankDetails } from '../../../../utils/MappingObjects/mapEmployeeData.jsx'
import EmpDataHeader from "../Sections/Header.jsx";
import { SelectComponent, ImageInput, DateInput, TextInput, PhoneInput, EmailInput } from '../../../../../components/form-control.jsx';
import PageLoader from '../../../../../components/PageLoader.jsx';
import { maritalStatus } from '../../../../../data/Data.js';

const BankInformation = ({ nextstep, baseUrl, token, employeeId , isEditMode}) => {

    const formRef = React.createRef();
    const [bankInfo, setBankInfo] = useState({});
    const [imageError, setImageError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getEmployeeBankDetailsData(baseUrl, employeeId, token).then(response => {
            setBankInfo(response);
            setIsLoading(false)
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, employeeId, token]); // Empty dependency array ensures this effect runs only once after the initial render

    const handleSubmit = (data) => {
        const personalInfrmation = getBankDetails(data);
        const response = saveEmployeeBankDetailsData(baseUrl, employeeId, token, personalInfrmation);
        if (response && isEditMode)
            nextstep();
    };


    // Get country options for Select component
    const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
        value: countryCode,
        label: getAllCountries()[countryCode].name
    }));


    return (
        <>
            <div className="screen">
                <Row>
                    <Col lg={8} className="mx-auto">
                        <CardHeader>
                            <Row>
                                <Col lg={12}>
                                    <h4 className="ml-2 fw-700">Personal Details</h4>
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
                                            initialValues={bankInfo}
                                            ref={formRef}
                                            onSubmit={(values, { resetForm }) => {
                                                handleSubmit(values, resetForm);
                                            }}
                                            validate={(values) => {
                                                const errors = {};
                                                for (let field in values) {
                                                    if (!values[`${field}`]) {
                                                        errors[`${field}`] = 'This field is required';
                                                    }
                                                }
                                                if (imageError) {
                                                    errors.profile_picture = imageError;
                                                }
                                                console.log(values, errors)

                                                return errors;
                                            }}

                                        >
                                            {(props) => (
                                                <Form onSubmit={props.handleSubmit}>
                                                    <Row>

                                                        <Col md="12">
                                                            <ImageInput
                                                                name={'profile_picture'}
                                                                error={props.errors.profile_picture}
                                                                touch={props.touched.profile_picture}
                                                                value={props.values.profile_picture}
                                                                label={'Your Photo'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.setFieldValue(field, value);
                                                                    setImageError(null);
                                                                }}
                                                                setImageError={setImageError}
                                                            />
                                                        </Col>
                                                        <Col lg={12} className="mb-3 ml-1">
                                                            <h6 className="fw-700 mb-0">{props.values.first_name} {props.values.last_name}</h6>
                                                            <span className="opacity-65 fs-12">ID: </span>
                                                        </Col>
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'first_name'}
                                                                error={props.errors.first_name}
                                                                touch={props.touched.first_name}
                                                                value={props.values.first_name}
                                                                label={'First Name'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <PhoneInput
                                                                name={'mobile_no'}
                                                                error={props.errors.mobile_no}
                                                                touch={props.touched.mobile_no}
                                                                value={props.values.mobile_no}
                                                                label={'Contact no.'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'last_name'}
                                                                error={props.errors.last_name}
                                                                touch={props.touched.last_name}
                                                                value={props.values.last_name}
                                                                label={'First Name'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md="6">
                                                            <EmailInput
                                                                name={'other_email'}
                                                                error={props.errors.other_email}
                                                                touch={props.touched.other_email}
                                                                value={props.values.other_email}
                                                                label={'Email'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'nic'}
                                                                error={props.errors.nic}
                                                                touch={props.touched.nic}
                                                                value={props.values.nic}
                                                                label={'ID Card no'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                                regEx={/^[0-9]+$/}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <SelectComponent
                                                                name={'nationality'}
                                                                options={countryOptions}
                                                                error={props.errors.nationality}
                                                                touch={props.touched.nationality}
                                                                value={props.values.nationality}
                                                                label={'Nationality'}
                                                                onChange={(field, value) => {
                                                                    props.setFieldValue(field, value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <DateInput
                                                                name={'date_of_birth'}
                                                                error={props.errors.date_of_birth}
                                                                touch={props.touched.date_of_birth}
                                                                //  value={props.values.date_of_birth}
                                                                value={new Date()}
                                                                label={'DOC'}
                                                                onChange={(field, value) => {
                                                                    props.setFieldValue(field, value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <SelectComponent
                                                                name={'marital_status'}
                                                                options={maritalStatus}
                                                                error={props.errors.marital_status}
                                                                touch={props.touched.marital_status}
                                                                value={props.values.marital_status}
                                                                label={'Martial Status'}
                                                                onChange={(field, value) => {
                                                                    props.setFieldValue(field, value);
                                                                }}
                                                            />
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
                    </Col>
                </Row>
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

export default connect(mapStateToProps)(BankInformation);

