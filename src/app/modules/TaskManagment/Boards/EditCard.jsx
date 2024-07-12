import React, { useEffect, useRef, useState } from "react";
import { RxCross2, RxPlus } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";

import { connect } from "react-redux";
import { Members } from "../Sections";
import {
  FaChevronLeft,
} from "react-icons/fa";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  TextAreaEditorInput,
  TextAreaInput,
  DateInput,
} from "components/form-control.jsx";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import calender from "assets/images/calender.svg";
import members from "assets/images/members.svg";
import priority from "assets/images/priority.svg";
import {
  addTask,
  getTaskById,
} from "app/hooks/taskManagment";
import { CardTypes } from "app/utils/Types/TaskManagment";



const EditCard = ({
  onClose,
  employees,
  isEditMode,
  boardId,
  projectId,
  cardId,
}) => {

  const dropdownOptions = [
    {
      label: "High",
      icon: highpriorityIcon,
      value: "High",
    },
    { label: "Low", icon: lowpriorityIcon, value: "Low" },
    { label: "Medium", icon: mediumpriorityIcon, value: "Medium" },
  ];
  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };
  const reversePriorityMapping = Object.fromEntries(
    Object.entries(priorityMapping).map(([key, value]) => [value, key])
  );


  const [initialValues, setInitialValues] = useState({
    ...CardTypes,
    board_id: boardId,
    project_id: projectId,
  });
  const [membersOpen, setMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log("initialValues", initialValues)

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(cardId);
      if (isMounted) {

        setInitialValues({...cardDetails, priority: reversePriorityMapping[cardDetails.priority]});
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  const formRef = useRef();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await addTask({
        ...formData,
        priority: priorityMapping[formData.priority],
      });
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };
    useEffect(() => {
      let isMounted = true;
      if (cardId && isEditMode) fetchData(isMounted);
      return () => {
        isMounted = false;
      };
    }, [cardId]);

  return (
    <div className="fixed top-0 right-0 max-w-[35%] w-[35%] h-full z-10 overflow-y-auto hideScroll ">
      <div className="bg-white h-full fixed  max-w-[35%] w-[35%] top-0 right-0  shadow px-[50px] py-10 flex flex-col gap-7 overflow-y-auto hideScroll">
        <div className="flex-col justify-start items-start gap-2.5 flex">
          <RxCross2 className="cursor-pointer self-end" onClick={onClose} />
          <div className="flex gap-4 items-center text-xl font-bold text-zinc-800">
            <FaChevronLeft
              onClick={onClose}
              className="text-zinc-800 text-[0.65rem] text-xs cursor-pointer"
            />
            <div>{isEditMode ? "Edit " : "Add"} Card</div>
          </div>
        </div>
        <Row>
          <Col lg={12}>
            <Formik
              initialValues={initialValues}
              innerRef={formRef}
              enableReinitialize={true}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row className="m-0 ">
                    <Col md="12" className="mb-0 p-0">
                      <TextInput
                        name="name"
                        error={props.errors.name}
                        touch={props.touched.name}
                        value={props.values.name}
                        label="Title"
                        required={true}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </Col>
                    <Col md="12" className="mb-0 p-0">
                      <TextAreaEditorInput
                        name="description"
                        error={props.errors.description}
                        touch={props.touched.description}
                        value={props.values.description}
                        required
                        label="Description"
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </Col>
                    <Col md="12" className="mb-0 p-0">
                      <span className="label text-[17px]">
                        {" "}
                        <div className="flex gap-5">
                          <div className="flex items-center gap-2.5  text-lg font-medium leading-4 text-zinc-600">
                            <img loading="lazy" src={calender} alt="" />
                            <div>Due Date</div>
                          </div>
                          <DateInput
                            name="end_date"
                            error={props.errors.end_date}
                            touch={props.touched.end_date}
                            value={props.values.end_date}
                            label="Date"
                            minDate={new Date()}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                      </span>
                    </Col>
                    <Col md="12" className="mb-0 p-0">
                      <Row className="items-center">
                        <Col md="4" className="label text-[17px]">
                          {" "}
                          <div className="flex gap-5">
                            <div className="flex items-center gap-2.5  text-lg font-medium leading-4 text-zinc-600">
                              <img
                                loading="lazy"
                                src={priority}
                                className="shrink-0 aspect-[1.06] w-[17px]"
                                alt=""
                              />
                              <div>Priority</div>
                            </div>
                          </div>
                        </Col>
                        <Col md="6">
                          <SelectComponent
                            name="priority"
                            options={dropdownOptions}
                            error={props.errors.priority}
                            touch={props.touched.priority}
                            value={props.values.priority}
                            label="Priority"
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12" className="mb-0 p-0">
                      <Row className="items-center">
                        <Col md="4" className="label text-[17px] mb-3">
                          {" "}
                          <div className="flex gap-5">
                            <div className="flex items-center gap-2.5  text-lg font-medium leading-4 text-zinc-600">
                              <img
                                loading="lazy"
                                src={members}
                                className="shrink-0 aspect-[1.06] w-[17px]"
                                alt=""
                              />
                              <div>Members</div>
                            </div>
                          </div>
                        </Col>
                        <Col md="6" className="mb-3">
                          <div className="flex justify-start gap-2 items-center h-100">
                            {props.values.card_members &&
                              props.values.card_members.length > 0 &&
                              props.values.card_members.map((member, index) => (
                                <div key={index}>
                                  <Members member={member} />
                                </div>
                              ))}
                            <div
                              onClick={() => {
                                setMembersOpen(!membersOpen);
                              }}
                              className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                            >
                              <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                                <RxPlus />
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {membersOpen && (
                        <Col md="12" className="mb-3 w-full b">
                          <SelectComponent
                            name="card_members"
                            options={employees}
                            error={props.errors.card_members}
                            touch={props.touched.card_members}
                            // value={props.values.card_members}
                            label="Card Members"
                            required
                            onChange={(field, value) => {
                              setMembersOpen(false);
                              const members = props.values.card_members || [];
                              members.push(value);
                              props.setFieldValue(field, members);
                            }}
                          />
                        </Col>
                      )}
                    </Col>
                  </Row>
                  <Row className="my-4">
                    <Col md="3">
                      <div
                        type="button"
                        className="btn btn-outline-dark w-100"
                        to="/jobs"
                        onClick={() => {
                          onClose();
                        }}
                      >
                        Cancel
                      </div>
                    </Col>
                    <Col md="5">
                      <Button type="submit" className="btn btn-dark w-100">
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(EditCard);
