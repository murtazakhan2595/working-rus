import React, { useState, useEffect } from "react";
import {
    CardHeader,
    CardBody,
    Row,
    Col,
    Button,
    Form,
    Label,
    FormGroup,
} from 'reactstrap';
import { Formik } from 'formik';
import { connect } from "react-redux";
import { getEmployeeBankDetailsData, saveEmployeeBankDetailsData } from '../../../../hooks/employee.jsx';
import { getBankDetails } from '../../../../utils/MappingObjects/mapEmployeeData.jsx'
import {
    TextInput,
    CustomDarkButton,
    CustomLightOutlineButton,
} from '../../../../../components/form-control.jsx';
import PageLoader from '../../../../../components/PageLoader.jsx';

const BankInformation = ({ nextstep, baseUrl, token, employeeId, isEditMode, prevStep }) => {

    const formRef = React.createRef();
    const [bankInfo, setBankInfo] = useState({});
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
        const bandetails = getBankDetails(data);
        const response = saveEmployeeBankDetailsData(baseUrl, employeeId, token, bandetails);
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
                                console.log(values, errors)

                                return errors;
                            }}

                        >
                            {(props) => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <TextInput
                                                name={'account_iban'}
                                                error={props.errors.account_iban}
                                                touch={props.touched.account_iban}
                                                value={props.values.account_iban}
                                                label={'IBAN Number'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <TextInput
                                                name={'bank_name'}
                                                error={props.errors.bank_name}
                                                touch={props.touched.bank_name}
                                                value={props.values.bank_name}
                                                label={'Branch Name'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <TextInput
                                                name={'account_title'}
                                                error={props.errors.account_title}
                                                touch={props.touched.account_title}
                                                value={props.values.account_title}
                                                label={'Account Title'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <TextInput
                                                name={'branch_code'}
                                                error={props.errors.branch_code}
                                                touch={props.touched.branch_code}
                                                value={props.values.branch_code}
                                                label={'Branch Code'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                                regEx={/^[0-9]+$/}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <TextInput
                                                name={'account_number'}
                                                error={props.errors.account_number}
                                                touch={props.touched.account_number}
                                                value={props.values.account_number}
                                                label={'Account Number'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                                regEx={/^[0-9]+$/}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <TextInput
                                                name={'swift_code'}
                                                error={props.errors.swift_code}
                                                touch={props.touched.swift_code}
                                                value={props.values.swift_code}
                                                label={'Swift Code'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                                regEx={/^[0-9]+$/}
                                            />
                                        </Col>
                                        <Col md="12">
                                            <TextInput
                                                name={'branch_address'}
                                                error={props.errors.branch_address}
                                                touch={props.touched.branch_address}
                                                value={props.values.branch_address}
                                                label={'Branch Address'}
                                                required={true}
                                                onChange={(field, value) => {
                                                    props.handleChange(field,)(value);
                                                }}
                                            />
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
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(BankInformation);