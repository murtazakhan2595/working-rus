import React, { useEffect, useState } from "react";
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
import PageLoader from '../../../../components/PageLoader.jsx';
import EmpDataHeader from "./Sections/Header.jsx";
import { FaChevronCircleLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
import { Link } from "react-router-dom";
import WorkInformation from './Sections/WorkInformation.jsx'
import { EmployeeInformation } from '../../../utils/Types/Employee.jsx'
import { getAddEmployeePayload } from '../../../utils/MappingObjects/mapEmployeeData.jsx'
import moment from "moment";
import { EmailInput, PhoneInput, TextAreaInput, DateInput, TextInput } from '../../../../components/form-control.jsx'
function getManagerSelected(managers) {
    if (managers) {
        const matchingObjects = managers.map(obj => {
            return obj.value;
        });

        return matchingObjects.join(', ');
    }
    return [];
}

const CreateEmployee = ({ token, baseUrl }) => {
    const formRef = React.createRef();
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const navigate = useNavigate();
    const [formData, setFormData] = useState({...EmployeeInformation });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [empId, setempId] = useState(0);
    const [email, setEmail] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    const handleSubmit = async (data) => {
        debugger
        // Check if an API call is already in progress

        data.indirect_report = data?.indirect_report ? getManagerSelected(data.indirect_report) : '';
        data.direct_report = data?.direct_report ? getManagerSelected(data.direct_report) : '';
        data.department_name = null;
        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/emp/add`, data, {
                headers,
            });

            if (response.status === 201) {
                setShowSuccessModal(true);
                setRefreshComponent(!refreshComponent);

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

    useEffect(() => {
        const fetchLastItemFromLastPage = async () => {
            try {
                // Step 1: Get the total number of pages and items per page
                const initialResponse = await axios.get(`${baseUrl}/emp/`, {
                    headers,
                });
                const totalItems = initialResponse.data.count;
                const itemsPerPage = initialResponse.data.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);

                // Step 2: Determine the last page number
                const lastPage = totalPages;

                // Step 3: Make a request to the last page
                const lastPageResponse = await axios.get(
                    `${baseUrl}/emp/?ordering=id&page=${lastPage}`,
                    {
                        headers,
                    }
                );
                if (lastPageResponse.status === 200) {
                    const lastPageData = lastPageResponse.data;
                    // Step 4: Get the last item from the last page
                    const lastItem = lastPageData[lastPageData.length - 1]?.id + 1;
                    const empId = "TXB" + lastItem.toString().padStart(4, "0")
                    setempId(empId);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error(
                    "Error fetching the last item from the last page:",
                    error
                );
            }
        };
        fetchLastItemFromLastPage();
    }, [refreshComponent, baseUrl, token]);

    const closeModal = () => {
        setShowSuccessModal(false)
    }


    return (

        <div className="screen">
            <EmpDataHeader
                title="Profile Managment"
            />
            <Row>
                <Col lg={12} className="mx-auto">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col lg={10}>
                                    <div className="h4 mb-0 d-flex align-items-center">
                                        <i className="nav-icon fas fa-id-card-alt" />
                                        <span className="ml-2 fw-700">Add Employee</span>
                                    </div>
                                </Col>
                                <Col lg={2}>
                                    <Link
                                        type="button"
                                        className="btn btn-light bg-transparent fw-700"
                                        to="/employees"
                                    >

                                        <span style={{ display: 'inline-block' }}>Go Back </span><FaChevronCircleLeft style={{ display: 'inline-block', marginLeft: '10px', marginBottom: '2px' }} />
                                    </Link>
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
                                    <Col lg={8}>
                                        <Formik
                                            initialValues={formData}
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
                                                return errors;
                                            }}

                                        >
                                            {(props) => (
                                                <Form onSubmit={props.handleSubmit}>
                                                    <Row>
                                                        <Col md="12">
                                                            <h5 className="fw-700 mb-3">Employee Details</h5>
                                                        </Col>
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'employeeId'}
                                                                error={props.errors?.employeeId}
                                                                touch={props.touched?.employeeId}
                                                                value={empId}
                                                                label={'Employee ID'}
                                                                required={true}
                                                                disabled={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'username'}
                                                                error={props.errors.username}
                                                                touch={props.touched.username}
                                                                value={props.values.username}
                                                                label={'User Name'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
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
                                                        <Col md="6">
                                                            <TextInput
                                                                name={'last_name'}
                                                                error={props.errors.last_name}
                                                                touch={props.touched.last_name}
                                                                value={props.values.last_name}
                                                                label={'Last Name'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md="6">
                                                            <EmailInput
                                                                name={'work_email'}
                                                                error={props.errors.work_email}
                                                                touch={props.touched.work_email}
                                                                value={props.values.work_email}
                                                                label={'Email'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field,)(value);
                                                                    setEmail(value);
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
                                                                    placeholder={'Enter User Name'}
                                                                    onChange={(option) => {
                                                                        props.handleChange('password')(option);
                                                                    }}
                                                                    value={props.values.password}
                                                                    className={
                                                                        props.errors.password && props.touched.password ? 'is-invalid' : ''
                                                                    }
                                                                />
                                                                <Label htmlFor="password">
                                                                    <span className="text-danger">* </span>Password
                                                                </Label>
                                                                {props.errors.password && props.touched.password && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.password}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
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
                                                        <Col md="8">
                                                            <TextAreaInput
                                                                name={'residential_address'}
                                                                error={props.errors?.residential_address}
                                                                touch={props.touched?.residential_address}
                                                                value={props.values?.residential_address}
                                                                label={'Reponsibilities'}
                                                                required={true}
                                                                onChange={(field, value) => {
                                                                    props.handleChange(field)(value);
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col md="12">
                                                            <h5 className="fw-700 mb-3 mt-4">Work information</h5>
                                                        </Col>
                                                        {console.log(props)}
                                                        <WorkInformation
                                                            employeeId={''}
                                                            values={props.values}
                                                            errors={props.errors}
                                                            touched={props.touched}
                                                            onChange={(field, value) => {
                                                                props.setFieldValue(field, value);
                                                                //  props.handleChange(field)(value);
                                                            }}

                                                        />

                                                    </Row>
                                                    <Row>
                                                        <Col md="4">
                                                            <Link
                                                                type="button"
                                                                className="btn btn-outline-dark w-100"
                                                            >
                                                                Cancel
                                                            </Link>
                                                        </Col>
                                                        <Col md="6">
                                                            <Button
                                                                type="submit"
                                                                className="btn btn-dark w-100"
                                                            >
                                                                Add
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Col>
                                </Row>
                            }
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={12}>
                    {
                        showSuccessModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                                <div
                                    className="bg-white shadow-md rounded-3xl lg:px-14 lg:py-16 w-[82%] px-10 py-12 flex justify-center items-center absolute md:w-[40%] lg:w-[26%] lg:h-[24%]"
                                >
                                    <p className="text-base text-center text-gray-400">
                                        User has been successfully registered and has been sent to {email}
                                    </p>
                                    <div
                                        className="absolute top-4 right-4 text-white bg-[#ECECEC] rounded-full p-[2px] cursor-pointer"
                                        onClick={closeModal}
                                    >
                                        <RxCross2 className="text-sm" />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <ToastContainer />
                </Col>
            </Row>

        </div>

    );
};

const mapStateToProps = (state) => {
    return {
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(CreateEmployee);
