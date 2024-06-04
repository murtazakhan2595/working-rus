import { useState, useEffect } from 'react';
import Select from "react-select";
import moment from 'moment';
import axios from "axios";
import { connect } from 'react-redux';
import { HeadOfDepartment, department, employeeStatus, jobRoles, workplaceTypes, UserRoles } from '../../../../../data/Data';
import { getAllCountries } from 'countries-and-timezones';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    ButtonGroup,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    Form,
    Label,
    FormGroup, Input, InputGroup, InputGroupText
} from 'reactstrap';
import { FileInput, TextAreaInput, DateInput, TextInput } from '../../../../../components/form-control'


const Experience = ({ errors, touched, values, onChange }) => {
    return (
        <>
            <Col md="6">
                <TextInput
                    name={'exp_organization'}
                    error={errors?.exp_organization}
                    touch={touched?.exp_organization}
                    value={values?.exp_organization}
                    label={'Comapny Name'}
                    required={true}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md="6">
                <TextInput
                    name={'exp_designation'}
                    error={errors?.exp_designation}
                    touch={touched?.exp_designation}
                    value={values?.exp_designation}
                    label={'Position'}
                    required={true}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>

            <Col md={6}>
                <DateInput
                    name={'exp_start_date'}
                    error={errors?.exp_start_date}
                    touch={touched?.exp_start_date}
                    value={values?.exp_start_date}
                    label={'Start Date'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <DateInput
                    name={'exp_end_date'}
                    error={errors?.exp_end_date}
                    touch={touched?.exp_end_date}
                    value={values?.exp_end_date}
                    label={'End Date'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md="12">
                <TextAreaInput
                    name={'exp_responsibilities'}
                    error={errors?.exp_responsibilities}
                    touch={touched?.exp_responsibilities}
                    value={values?.exp_responsibilities}
                    label={'Reponsibilities'}
                    required={true}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md="12">
                <FileInput
                    name={'exp_letter'}
                    error={errors?.exp_letter}
                    touch={touched?.exp_letter}
                    value={values?.exp_letter}
                    required={true}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
           
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(Experience);