import { connect } from "react-redux";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  CustomDarkButton,
  FilterInput,
} from "components/form-control.jsx";
import { LeaveType } from "utils/getValuesFromTables";
import {
  allotLeavesToEmployee,
  getEmployeeLeaveTypes,
} from "app/hooks/leaveManagment";

const AllotLeavesForm = ({ employeeData, leaveTypes, closeModel }) => {
  const formRef = useRef();
  const [filterData, setFilterData] = useState({ leave_type: [] });

  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const getPosts = async () => {
    try {
      const data = await getEmployeeLeaveTypes({
        employee_id: employeeData.id,
      });
      setEmployeeLeaveTypes(data.results);
      if (formRef.current) {
        formRef.current.setFieldValue("employeeLeaveDetails", data.results);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
    }
  };
  useEffect(() => {
    getPosts();
  }, [employeeData]);

  const handleSubmit = (values, resetForm) => {
    const response = allotLeavesToEmployee(
      employeeData.id,
      values.employeeLeaveDetails
    );
    if (response) {
      resetForm();
      closeModel();
    }
  };

  useEffect(() => {
    if (employeeLeaveTypes && employeeLeaveTypes.length > 0) {
      setFilterData({
        leave_type: employeeLeaveTypes.map((item) => item.leave_type),
      });
    } else {
      setFilterData({
        leave_type: [],
      });
    }
  }, [leaveTypes, employeeLeaveTypes]);

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterCheckStatus) {
        updatedFilters[filterName].push(filterValue);
      } else {
        updatedFilters[filterName] = updatedFilters[filterName].filter(
          (item) => item !== filterValue
        );
        removeLeaveType(filterValue);
      }
      return updatedFilters;
    });
  };

  const addNewLeaveType = (leave_type) => {
    if (formRef.current) {
      formRef.current.setFieldValue("employeeLeaveDetails", [
        ...formRef.current.values.employeeLeaveDetails,
        {
          employee_id: employeeData.id,
          leave_type: leave_type,
          used_leaves: 0,
        },
      ]);
    }
  };
  const removeLeaveType = (leave_type) => {
    if (formRef.current) {
      formRef.current.setFieldValue(
        "employeeLeaveDetails",
        formRef.current.values.employeeLeaveDetails.filter(
          (item) => item.leave_type !== leave_type
        )
      );
    }
  };

  return (
    <>
      <div className="flex align-bottom justify-between my-4">
        <div>
          <div className="font-bold leading-normal text-[#323333] text-left text-capitalize text-[25px]">
            {employeeData.first_name} {employeeData.last_name}
          </div>
          <div className="text-baseGray text-left flex justify-between gap-3">
            ID: {employeeData.id} |{"  "}
            <DesignationName value={employeeData.position} /> |{"  "}
            <DepartmentName value={employeeData.department_name} />
          </div>
          <div className="text-baseGray text-left mt-3">
            Jan {new Date().getFullYear()} to Dec {new Date().getFullYear()}
          </div>
        </div>
        <div className="flex items-end">
          <FilterInput
            filters={[
              {
                type: "sorting",
                option: [{ name: "leave_type", options: leaveTypes }],
                name: "sorting",
                placeholder: "Filters",
                values: filterData,
                className: "custom-dropdown-toggle-filter",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="mt-5">
        <Formik
          initialValues={{
            employeeLeaveDetails: employeeLeaveTypes,
          }}
          innerRef={formRef}
          enableReinitialize
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
          validate={(values) => {
            const errors = {};
            return errors;
          }}
        >
          {(props) => (
            <Form
              onSubmit={props.handleSubmit}
              className="flex flex-col justify-between"
              style={{ minHeight: "calc(100vh - 350px)" }}
            >
              <Row className="mx-0">
                {filterData?.leave_type &&
                  filterData?.leave_type.length > 0 &&
                  filterData?.leave_type.map((leave_type) => {
                    const index = props.values?.employeeLeaveDetails.findIndex(
                      (obj) => obj.leave_type === leave_type
                    );
                    if (index === -1) {
                      addNewLeaveType(leave_type);
                    }
                    return (
                      <React.Fragment key={index}>
                        <AllotLeave
                          leaveType={leave_type}
                          values={props.values?.employeeLeaveDetails[index]}
                          errors={
                            props.errors?.employeeLeaveDetails
                              ? props.errors?.employeeLeaveDetails[index]
                              : {}
                          }
                          touched={
                            props.touched?.employeeLeaveDetails
                              ? props.touched?.employeeLeaveDetails[index]
                              : {}
                          }
                          onChange={(field, value) => {
                            props.setFieldValue(
                              `employeeLeaveDetails[${index}].${field}`,
                              value
                            );
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
              </Row>
              <Row>
                <Col md="6" className="text-right">
                  <CustomDarkButton
                    onClick={() => {
                      props.handleSubmit();
                    }}
                    label={`Allot`}
                    className="w-100"
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

const AllotLeave = ({ leaveType, errors, touched, values, onChange }) => {
  return (
    <>
      <Row
        className="mb-4 shadow-sm mx-0"
        style={{
          border: "1px solid #DADADA",
          borderRadius: "9px",
          padding: "4px",
          height: "67px",
        }}
      >
        <Col md="6">
          <div
            className="text-[18px] text-center"
            style={{ marginTop: "12px" }}
          >
            <LeaveType value={leaveType} />
          </div>
        </Col>
        <Col md="6" className="force-white-bg p-0">
          <TextInput
            name={"total_alloted_leaves"}
            error={errors?.total_alloted_leaves}
            touch={touched?.total_alloted_leaves}
            value={values?.total_alloted_leaves}
            label={"No. of leaves"}
            required={true}
            onChange={(field, value) => {
              debugger;
              if (value) {
                value = parseInt(value);
                onChange(field, value);
                console.log(values.left_leave);
                if (!values.left_leave) {
                  onChange("left_leave", value);
                } else {
                  const used_leaves = values.used_leave || 0;
                  const leaves_left = value - used_leaves;
                  onChange("left_leave", leaves_left);
                }
              } else {
                onChange("left_leave", "");
                onChange(field, "");
              }
            }}
            regEx={/^[0-9-]+$/}
          />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    leaveTypes: state.common.leaveTypes,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(AllotLeavesForm);
