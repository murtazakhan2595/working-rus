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
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Formik } from 'formik';
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
import { Link } from "react-router-dom";
import WorkInformation from './Sections/WorkInformation.jsx'
import { EmployeeDepartmentInfo, EmployeeInformation } from '../../../utils/Types/Employee.jsx'
import { getAddEmployeePayload } from '../../../utils/MappingObjects/mapEmployeeData.jsx'
import moment from "moment";

function getManagerSelected(managers) {
    debugger
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


    const [formData, setFormData] = useState({ ...EmployeeInformation, ...EmployeeDepartmentInfo });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [isUserNameInputFocused, setIsUserNameInputFocused] = useState(false);
    const [empId, setempId] = useState(0);
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);



    const handleSubmit = async (data) => {
        debugger
        // Check if an API call is already in progress
        if (isApiCallInProgress) {
            return;
        }
        setIsLoading(true);
        const empInfopayload = getAddEmployeePayload(data);
        try {
            const response = await axios.post(`${baseUrl}/emp/add`, empInfopayload, {
                headers,
            });

            if (response.status === 201) {
                setShowSuccessModal(true);
                setRefreshComponent(!refreshComponent);

            }
        } catch (error) {
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
            setIsApiCallInProgress(false);
            setIsLoading(false);
        }
        setFormData(data);
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
                                    <Link className="btn btn-light">
                                        Go Back
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
                                                // if (!values.direct_report) {
                                                //     errors.direct_report = 'Manager is Required'
                                                // }
                                                // if (!values.employeeId) {
                                                //     errors.employeeId = 'Employee Id is Required'
                                                // }
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
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="employeeId"
                                                                    name="employeeId"
                                                                    autoComplete="Off"
                                                                    disable
                                                                    placeholder={'Enter User Name'}
                                                                    value={empId}
                                                                    className={
                                                                        props.errors.employeeId && props.touched.employeeId ? 'is-invalid' : ''
                                                                    }
                                                                />
                                                                <Label htmlFor="employeeId">
                                                                    <span className="text-danger">* </span>Employee ID
                                                                </Label>
                                                                {props.errors.employeeId && props.touched.employeeId && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.employeeId}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md="6">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="username"
                                                                    name="username"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    onChange={(option) => {
                                                                        props.handleChange('username')(option);
                                                                    }}
                                                                    value={props.values.username}
                                                                    className={
                                                                        props.errors.username && props.touched.username ? 'is-invalid' : ''
                                                                    }
                                                                />
                                                                <Label htmlFor="username">
                                                                    <span className="text-danger">* </span>User Name
                                                                </Label>
                                                                {props.errors.username && props.touched.username && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.username}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="6">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="firstname"
                                                                    name="firstname"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    onChange={(option) => {
                                                                        props.handleChange('firstname')(option);
                                                                    }}
                                                                    value={props.values.firstname}
                                                                    className={
                                                                        props.errors.firstname && props.touched.firstname ? 'is-invalid' : ''
                                                                    }
                                                                />
                                                                <Label htmlFor="firstname">
                                                                    <span className="text-danger">* </span>First Name
                                                                </Label>
                                                                {props.errors.firstname && props.touched.firstname && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.firstname}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="6">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="lastname"
                                                                    name="lastname"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    value={props.values.lastname}
                                                                    className={
                                                                        props.errors.lastname && props.touched.lastname ? 'is-invalid' : ''
                                                                    }
                                                                    onChange={(option) => {
                                                                        props.handleChange('lastname')(option);
                                                                    }}
                                                                />
                                                                <Label htmlFor="lastname">
                                                                    <span className="text-danger">* </span>Last Name:
                                                                </Label>
                                                                {props.errors.lastname && props.touched.lastname && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.lastname}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="6">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="email"
                                                                    maxLength="100"
                                                                    id="email"
                                                                    name="email"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    value={props.values.email}
                                                                    className={
                                                                        props.errors.email && props.touched.email ? 'is-invalid' : ''
                                                                    }
                                                                    onChange={(option) => {
                                                                        props.handleChange('email')(option);
                                                                    }}
                                                                />
                                                                <Label htmlFor="email">
                                                                    <span className="text-danger">* </span>Email
                                                                </Label>
                                                                {props.errors.email && props.touched.email && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.email}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
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
                                                        <Col md="4">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="contact_number"
                                                                    name="contact_number"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    value={props.values.contact_number}
                                                                    className={
                                                                        props.errors.contact_number && props.touched.contact_number ? 'is-invalid' : ''
                                                                    }
                                                                    onChange={(option) => {
                                                                        props.handleChange('contact_number')(option);
                                                                    }}
                                                                />
                                                                <Label htmlFor="contact_number">
                                                                    <span className="text-danger">* </span>Contact no.
                                                                </Label>
                                                                {props.errors.contact_number && props.touched.contact_number && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.contact_number}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="8">
                                                            <FormGroup floating>
                                                                <Input
                                                                    type="text"
                                                                    maxLength="100"
                                                                    id="address"
                                                                    name="address"
                                                                    autoComplete="Off"
                                                                    placeholder={'Enter User Name'}
                                                                    value={props.values.address}
                                                                    className={
                                                                        props.errors.address && props.touched.address ? 'is-invalid' : ''
                                                                    }
                                                                    onChange={(option) => {
                                                                        props.handleChange('address')(option);
                                                                    }}
                                                                />
                                                                <Label htmlFor="address">
                                                                    <span className="text-danger">* </span>Address
                                                                </Label>
                                                                {props.errors.address && props.touched.address && (
                                                                    <div className="invalid-feedback">
                                                                        {props.errors.address}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
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
            </Row>
            {/* 
            <form onSubmit={handleSubmit}>
                <div className="px-2 py-3 md:px-3 md:py-4 lg:px-10 lg:py-6 overflow-y-auto xScroll max-h-[76vh] md:h-[100vh]">
                    <div className="flex flex-col md:flex-row lg:flex-row w-full gap-x-10 lg:gap-x-16 gap-y-2 md:gap-y-3 lg:gap-y-4">
                        <div className="w-full flex flex-col gap-y-2 md:gap-y-3">
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="username"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    EmpolyeeID:
                                </label>
                                <div className="flex flex-col w-full">
                                    {isLoading ? (
                                        <div className="bg-gray-300 h-8 w-full animate-pulse rounded"></div>
                                    ) : (
                                        <input
                                            type="text"
                                            name="username"
                                            readOnly
                                            disabled
                                            value={empId}
                                            className="pl-2 w-full bg-white rounded h-8 text-sm text-gray-600"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="username"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    User Name:
                                </label>
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        required
                                        placeholder="user@123"
                                        className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                                        onChange={(e) =>
                                            handleChange(e.target.name, e.target.value)
                                        }
                                        onFocus={handleUserNameInputFocus}
                                        onBlur={handleUserNameInputBlur}
                                    />
                                    <div className="text-red-500 text-xs">{validationError}</div>
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="username"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    First Name:
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    required
                                    placeholder="First Name Here"
                                    className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="lastname"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    Last Name:
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    required
                                    placeholder="Last Name Here"
                                    className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-2 md:gap-y-3">
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="email"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                            text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    Email:
                                    <span className="text-[#F9F9F9]">Add</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    required
                                    placeholder="Enter email Here"
                                    className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
            placeholder-opacity-50"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="password"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                          text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    Password:
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        required
                                        placeholder="Enter Password Here"
                                        className="pl-2 w-full bg-white rounded h-8 text-sm placeholder-[#555657] 
          placeholder-opacity-50"
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must contain at least one number an uppercase and lowercase letter, and at least 8 or more characters"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <BiShow className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <TbEyeClosed className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center mt-2">
                                <label
                                    htmlFor="userrole"
                                    className="font-sfpro tracking-wide whitespace-nowrap
                          text-input text-sm mb-1 pr-2 md:pr-3 lg:pr-4 font-semibold"
                                >
                                    User Role:
                                </label>
                                <Select
                                    className="w-full"
                                    name="userrole"
                                    value={formData.userrole}
                                    options={userRoles}
                                    required
                                    onChange={(selectedOption) =>
                                        handleChange("userrole", selectedOption)
                                    }
                                />
                            </div>
                            <div className="mt-4 md:mt-3 mb-40 flex justify-end">
                                <Button disabled={isLoading} text={"Create"} />
                            </div>
                        </div>
                    </div>
                </div>
            </form >
            
            {
                showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div
                            className="bg-white shadow-md rounded-3xl lg:px-14 lg:py-16 w-[82%] px-10 py-12 flex
           justify-center items-center absolute md:w-[40%] lg:w-[26%] lg:h-[24%]"
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
            <ToastContainer /> */}
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
