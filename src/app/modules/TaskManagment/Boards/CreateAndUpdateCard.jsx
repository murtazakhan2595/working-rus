import { useEffect, useState, useRef } from "react";
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import { RxCross2, RxPlus } from "react-icons/rx";
import ReactQuill from "react-quill";
import Datepicker from "../../Dashboard/Datepicker";
import moment from "moment";
import { Members } from "../Sections";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import { addProject } from "app/hooks/taskManagment";
import {
  TextInput,
  SelectComponent,
  TextAreaEditorInput,
  TextAreaInput,
} from "components/form-control.jsx";
import { Project } from "app/utils/Types/TaskManagment";

const CreateAndUpdateCard = ({ employees, onClose, isEditMode }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(Project);
  const [membersOpen, setMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await addProject(formData);
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

  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll flex justify-center items-center backdrop-blur-sm py-5 h-[100vh] ">
        <Card
          className="overflow-y-auto h-100 p-4 w-[90%]"
          style={{ maxWidth: "650px" }}
        >
          <div
            className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <RxCross2 />
          </div>
          <Row>
            <Col lg={12}>
              <Formik
                initialValues={initialValues}
                innerRef={formRef}
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
                    <Row className="m-0">
                      <Col md="12">
                        <h5 className="fw-700 mb-3 mt-4">Add New Project</h5>
                      </Col>
                      <Col md="12">
                        <TextInput
                          name="name"
                          error={props.errors.name}
                          touch={props.touched.name}
                          value={props.values.name}
                          label="Title"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="12">
                        <TextAreaEditorInput
                          name="description"
                          error={props.errors.description}
                          touch={props.touched.description}
                          value={props.values.description}
                          label="Description"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="12" className="mb-3">
                        <span className="label text-[17px]">Team Members</span>
                      </Col>
                      <Col md="12" className="mb-3">
                        <div className="flex justify-start gap-2 items-center h-100">
                          {props.values.project_members &&
                            props.values.project_members.length > 0 &&
                            props.values.project_members.map(
                              (member, index) => (
                                <div key={index}>
                                  <Members member={member} />
                                </div>
                              )
                            )}
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
                      {membersOpen && (
                        <Col md="10" className="mb-3">
                          <SelectComponent
                            name="project_members"
                            options={employees}
                            error={props.errors.project_members}
                            touch={props.touched.project_members}
                            // value={props.values.project_members}
                            label="Project Members"
                            required
                            onChange={(field, value) => {
                              setMembersOpen(false);
                              const members =
                                props.values.project_members || [];
                              members.push(value);
                              props.setFieldValue(field, members);
                            }}
                          />
                        </Col>
                      )}
                    </Row>
                    <Row className="my-4">
                      <Col md="3">
                        <div
                          type="button"
                          className="btn btn-outline-dark w-100"
                          to="/jobs"
                          onClick={() => {
                            isEditMode ? onClose() : navigate("/jobs");
                          }}
                        >
                          Cancel
                        </div>
                      </Col>
                      <Col md="5">
                        <Button type="submit" className="btn btn-dark w-100">
                          {isEditMode ? "Update" : "Add"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};
export default connect(mapStateToProps)(CreateAndUpdateCard);
