import { useState, useEffect } from 'react';
import Select from "react-select";
import moment from 'moment';
import axios from "axios";
import { connect } from 'react-redux';
import { HeadOfDepartment, employeeStatus, jobRoles, workplaceTypes, UserRoles } from '../../../../../data/Data';
import { getAllCountries } from 'countries-and-timezones';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    FormGroup, Input, InputGroup, InputGroupText
} from 'reactstrap';
import { SelectComponent, SelectMultiInputComponent, DateInput, TextInput } from '../../../../../components/form-control'
import { getDepartmentList, getManagersList, getDesignationList } from '../../../../hooks/general';

const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
}));

function getManagerSelected(managers, managersList) {
    if (managers && managersList && managersList.length > 0) {
        managers = managers.split(', ') || [];
        const matchingObjects = managersList.filter(obj => {
            return managers.find(element => obj.label === element);
        });
        console.log(matchingObjects)
        return matchingObjects;
    }

    return managers;

}

const WorkInformation = ({ errors, touched, values, onChange, baseUrl, token }) => {
    const [managers, setManagers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
        const fetchLists = async () => {
            try {
                const departmentResponse = await getDepartmentList(baseUrl, headers);
                const departmentList = departmentResponse.results.map(department => ({
                    value: department.id,
                    label: department.name,
                }));
                setDepartments(departmentList);

                const managerResponse = await getManagersList(baseUrl, headers);
                const managersList = managerResponse.map(manager => ({
                    value: manager.id,
                    label: manager.username,
                }))
                setManagers(managersList);

                const designationResponse = await getDesignationList(baseUrl, headers);
                const designationList = designationResponse.results.map(department => ({
                    value: department.id,
                    label: department.name,
                }));
                setDesignations(designationList);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLists();
    }, []);


    const HeadOfDepartmentOptions = HeadOfDepartment?.map((manager) => ({
        label: (
            <div>
                <div style={{ fontWeight: 'bold', color: '#000' }}>{manager?.label?.split(' - ')[0]}</div>
                <div style={{ fontSize: '13px', color: '#777', fontWeight: 'normal' }}>{manager?.label?.split(' - ')[1]}</div>
            </div>
        ),
        value: manager.value
    }));
    if (values.direct_report && typeof values.direct_report === 'string') {
        const managerList = getManagerSelected(values.direct_report, managers);
        onChange('direct_report', managerList)
    }
    if (values.indirect_report && typeof values.indirect_report === 'string') {
        const managerList = getManagerSelected(values.indirect_report, managers);
        onChange('indirect_report', managerList)
    }

    return (
        <>
            <Col md="6">
                <SelectComponent
                    name={'department_name'}
                    options={departments}
                    error={errors.department_name}
                    touch={touched.department_name}
                    value={values.department_name}
                    label={'Department'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <SelectComponent
                    name={'employee_location'}
                    options={countryOptions}
                    error={errors.employee_location}
                    touch={touched.employee_location}
                    value={values.employee_location}
                    label={'Employee Location'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <SelectComponent
                    name={'department_position'}
                    options={designations}
                    error={errors.department_position}
                    touch={touched.department_position}
                    value={values.department_position}
                    label={'Designation'}
                    required={true}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <SelectComponent
                    name={'user_role'}
                    options={UserRoles}
                    error={errors.user_role}
                    touch={touched.user_role}
                    value={values.user_role}
                    label={'Role'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md="6">
                <FormGroup>
                    <SelectComponent
                        name={'employee_type'}
                        options={jobRoles}
                        error={errors.employee_type}
                        touch={touched.employee_type}
                        value={values.employee_type}
                        label={'Employee Type'}
                        onChange={(field, value) => {
                            onChange(field, value);
                        }}
                    />

                </FormGroup>
            </Col>
            <Col md="6">
                <FormGroup>
                    <SelectComponent
                        name={'employee_status'}
                        options={employeeStatus}
                        error={errors.employee_status}
                        touch={touched.employee_status}
                        value={values.employee_status}
                        label={'Employee status'}
                        onChange={(field, value) => {
                            onChange(field, value);
                        }}
                    />
                </FormGroup>
            </Col>
            <Col md={6}>
                <SelectComponent
                    name={'employee_work_type'}
                    options={workplaceTypes}
                    error={errors.employee_work_type}
                    touch={touched.employee_work_type}
                    value={values.employee_work_type}
                    label={'Employee Work Type'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>

            <Col md={6}>
                <SelectMultiInputComponent
                    name={'direct_report'}
                    options={managers}
                    error={errors.direct_report}
                    touch={touched.direct_report}
                    value={values.direct_report}
                    label={'Direct Report'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>

            <Col md={6}>
                <SelectMultiInputComponent
                    name={'indirect_report'}
                    options={managers}
                    error={errors.indirect_report}
                    touch={touched.indirect_report}
                    value={values.indirect_report}
                    label={'Indirect Report'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <SelectComponent
                    name={'department_manager'}
                    options={HeadOfDepartmentOptions}
                    error={errors.department_manager}
                    touch={touched.department_manager}
                    value={values.department_manager}
                    label={'Department Head'}
                    onChange={(field, value) => {
                        onChange(field, value);
                    }}
                />
            </Col>
            <Col md={6}>
                <DateInput
                    name={'joining_date'}
                    error={errors.joining_date}
                    touch={touched.joining_date}
                    value={values.joining_date}
                    label={'Joining Date'}
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

export default connect(mapStateToProps)(WorkInformation);