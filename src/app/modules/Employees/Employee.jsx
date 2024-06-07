import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Row,
    Col,
    ButtonGroup,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Placeholder,
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import PageLoader from '../../../components/PageLoader.jsx';
import './style.css';
import EmpDataHeader from "./Screens/Sections/Header.jsx";
import axios from "axios";
import {
    BsArrowLeftShort,
    BsArrowRightShort,
    BsThreeDots,
} from "react-icons/bs";
import { toast } from "react-toastify";
import tie from "../../../assets/images/tie.png";
import profile from "../../../assets/images/profile.png";
import active from "../../../assets/images/active.png";
import { FilterInput, CustomDarkButton } from '../../../components/form-control.jsx';
import { department, UserRoles } from "../../../data/Data.js";
import { useNavigate } from 'react-router-dom';


const Employee = ({ baseUrl, token }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState([]);
    const [openDropdownRow, setOpenDropdownRow] = useState([]);
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        page: 1,
        sizePerPage: 10,
        sortName: '',
        sortOrder: '',
    });

    const onSizePerPageList = (sizePerPage) => {
        if (options.sizePerPage !== sizePerPage) {
            setOptions((prevOptions) => ({ ...prevOptions, sizePerPage }));
        }
    };

    const onPageChange = (page, sizePerPage) => {
        if (options.page !== page) {
            setOptions((prevOptions) => ({ ...prevOptions, page }));
        }
    };

    const sortColumn = (sortName, sortOrder) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            sortName,
            sortOrder,
        }));
    };

    const onRowSelect = (row, isSelected, e) => {
        // Handle row selection logic here
    };

    const onSelectAll = (isSelected, rows) => {
        // Handle select all logic here
    };

    const selectRowProp = {
        bgColor: 'rgba(0,0,0, 0.05)',
        clickToSelect: false,
        onSelect: onRowSelect,
        onSelectAll: onSelectAll,
    };

    const filterData = {
        name: '',
        email: '',
        contactType: '',
    };

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${baseUrl}/emp/?page=${options.page}&page_size=${options.sizePerPage}`,
                    {
                        headers,
                    }
                );
                setEmployeeData(response.data); // Assuming response.data contains the user data directly
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [baseUrl, token, options, setIsLoading]);

    const handleDelete = async (employeeId) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${baseUrl}/emp/${employeeId}`, {
                headers,
            });
            if (response.status === 204) {
                toast.success("User deleted successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            } else {
                toast.error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderName = (cell, row) => {
        return (
            <>

                <div className="bg-[#BE24A5] text-[#FAFBFC] flex font-lato font-semibold text-lg items-center justify-center rounded-full w-10 h-10">
                    {row.first_name.toUpperCase().charAt(0)}
                    {row.last_name.toUpperCase().charAt(0)}
                </div>
                <div className="flex flex-col">
                    <div className="text-base font-bold leading-normal text-[#323333] font-lato">{`${row.first_name} ${row.last_name}`}</div>
                    <div className="text-base font-lato">{`${row.department_position}`}</div>
                </div>
            </>
        )
    }
    const toggleDropdown = (index) => {
        setOpenDropdownRow(index === openDropdownRow ? null : index)
    };

    const renderAction = (row) => {
        return (
            <div>
                <ButtonDropdown
                    isOpen={openDropdownRow === row.id}
                    toggle={() => toggleDropdown(row.id)}
                    className="float-end"
                >
                    <DropdownToggle size="sm" className="btn-brand">
                        <BsThreeDots
                            onClick={() => toggleDropdown(row.id)}
                            className=""
                        />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <div
                                onClick={() => {
                                    navigate(`/profile/${row.id}`)
                                }}
                            >
                                Edit Profile
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                navigate(`/edit-employee/${row.id}`)
                            }}
                        >
                            Edit Employee
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                navigate(`/user/${row.id}`)
                            }}
                        >
                            View Profile
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                handleDelete(row.id)
                            }}
                        >
                            Delete Employee
                        </DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </div>
        );
    }

    return (
        <div className="screen">
            <EmpDataHeader
                title="Profile Management"
                content={
                    <CustomDarkButton
                        label={'+ Add Employee'}
                        onClick={() => {
                            navigate('/add-employee')
                        }}
                    />
                }
            />
            {Blocks([
                {
                    label: 'Total Employees',
                    value: 42,
                    image: profile,
                },
                {
                    label: 'Mangers only',
                    value: 11,
                    image: tie,
                },
                {
                    label: 'Active Employees',
                    value: 48,
                    image: active,
                },
            ])}
            <Row>
                <Col lg={12} className="mx-auto">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col lg={12}>
                                    <div className="py-3">
                                        <FilterInput
                                            filters={[
                                                {
                                                    type: 'search',
                                                    placeholder: 'Search by ID and Name',
                                                    name: ''
                                                },
                                                {
                                                    type: 'select',
                                                    option: department,
                                                    name: '',
                                                    placeholder: "Department"
                                                },
                                                {
                                                    type: 'select',
                                                    option: department,
                                                    name: '',
                                                    placeholder: "Designation"
                                                },
                                                {
                                                    type: 'select',
                                                    option: UserRoles,
                                                    name: '',
                                                    placeholder: "Role"
                                                }
                                            ]}
                                        />

                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            {isLoading ? (
                                <Row>
                                    <Col lg={12}>
                                        <PageLoader />
                                    </Col>
                                </Row>
                            ) : (
                                <Row>
                                    <Col lg={12}>
                                        <div>
                                            <BootstrapTable
                                                selectRow={selectRowProp}
                                                options={{
                                                    ...options,
                                                    onSizePerPageList: onSizePerPageList,
                                                    onPageChange: onPageChange,
                                                    onSortChange: sortColumn,
                                                }}
                                                version="4"
                                                hover
                                                responsive
                                                remote
                                                data={employeeData || []}
                                                pagination={!!employeeData.length}
                                                fetchInfo={{ dataTotalSize: employeeData.length || 0 }}
                                                className={'bootstrap-main-table'}
                                            >
                                                <TableHeaderColumn
                                                    tdStyle={{ whiteSpace: 'normal' }}
                                                    isKey
                                                    dataField="id"
                                                    dataSort
                                                    dataFormat={(cell) => {
                                                        const id = cell.toString().padStart(4, '0')
                                                        return `TXB-${id}`;
                                                    }}
                                                    className="table-header-bg"
                                                >
                                                    ID
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    dataField="name"
                                                    dataSort
                                                    className="table-header-bg"
                                                    dataFormat={renderName}
                                                    width='20%'

                                                >
                                                    Name
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    dataField="user_role"
                                                    dataSort
                                                    className="table-header-bg"
                                                    dataFormat={(cell) => {
                                                        const role = UserRoles.find(obj => obj.value === cell)
                                                        return role?.label ?? '';
                                                    }}

                                                >
                                                    Role
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    dataField="username"
                                                    dataSort
                                                    className="table-header-bg"
                                                >
                                                    Username
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    dataField="phone"
                                                    dataSort
                                                    className="table-header-bg"
                                                    width='20%'
                                                    dataFormat={(cell, row) => {
                                                        return (
                                                            <>
                                                                <div className="text-base font-lato">{row.mobile_no ? `${row.mobile_no}` : ''}</div>
                                                                <div className="text-base font-lato">{row.work_email ? `${row.work_email}` : ''}</div>
                                                            </>
                                                        );
                                                    }}
                                                >
                                                    Phone no/Email
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    className="table-header-bg text-right"
                                                    dataField="employee_status"
                                                    headerAlign="right"
                                                    dataAlign="right"
                                                    width="10%"
                                                >
                                                    Status
                                                </TableHeaderColumn>
                                                <TableHeaderColumn
                                                    columnClassName="text-right"
                                                    width="7%"
                                                    className="table-header-bg text-right"
                                                    headerAlign="right"
                                                    dataFormat={(cell, row) => { return renderAction(row) }}
                                                >
                                                    Action
                                                </TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

function Blocks(blocks) {

    return (
        <Row className="flex items-center">
            {blocks && blocks.map(block => {
                return SubBlock(block.label, block.value, block.image);
            })}
        </Row>
    );

    function SubBlock(label, value, image) {
        return (
            <Col md={4} className="mb-3">
                <div className="bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px] m-1">
                    <img src={image} alt="tie icon" />
                    <div>
                        <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">
                            {label}
                        </h4>
                        <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">
                            {value}
                        </h2>
                    </div>
                </div>
            </Col>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(Employee);
