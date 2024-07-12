import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Row, Col, Button } from "reactstrap";
import {
  TextInput,
  SelectComponent,
  TextAreaEditorInput,
  DateInput,
} from "components/form-control.jsx";
import { RiAttachment2 } from "react-icons/ri";
import { RxPlus } from "react-icons/rx";
import members from "assets/images/members.svg";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import plus from "assets/images/plus.svg";
import { CardTypes } from "app/utils/Types/TaskManagment";
import Members from "./Member";

const CreateAndEditCardForm = ({ initialValues, employees, handleSubmit, onClose }) => {
  const formRef = useRef();
  const fileInputRef = useRef(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const dropdownOptions = [
    { label: "High", icon: highpriorityIcon, value: "High" },
    { label: "Low", icon: lowpriorityIcon, value: "Low" },
    { label: "Medium", icon: mediumpriorityIcon, value: "Medium" },
  ];

  const handleAttachmentsChange = (event, props) => {
    const files = event.target.files;
    setFiles(files);
    props.setFieldValue("files", Array.from(files));
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
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
        <Form onSubmit={props.handleSubmit} className="mt-5">
          <Row className="m-0">
            <Col md="12" className="mb-0">
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
            <Col md="12" className="mb-0">
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
            <Col md="12" className="mb-0">
              <Row>
                <Col md="6" className="mb-0">
                  <DateInput
                    name="start_date"
                    error={props.errors.start_date}
                    touch={props.touched.start_date}
                    value={props.values.start_date}
                    label="Start Date"
                    minDate={new Date()}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </Col>
                <Col md="6" className="mb-0">
                  <TextInput
                    name="created_by"
                    error={props.errors.created_by}
                    touch={props.touched.created_by}
                    value={props.values.created_by}
                    label="Created By"
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col md="12" className="mb-0">
              <Row>
                <Col md="6" className="mb-0">
                  <DateInput
                    name="end_date"
                    error={props.errors.end_date}
                    touch={props.touched.end_date}
                    value={props.values.end_date}
                    label="End Date"
                    minDate={new Date()}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </Col>
                <Col md="6" className="mb-0">
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
            <Col md="12" className="mb-3">
              <Row className="items-center">
                <Col md="11" className="label text-[17px]">
                  <div className="flex gap-5">
                    <div className="flex items-center gap-2.5 text-lg font-medium leading-4 text-zinc-600">
                      <RiAttachment2 />
                      <div>Attachments ({files.length})</div>
                    </div>
                  </div>
                </Col>
                <Col md="1">
                  <img
                    src={plus}
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      fileInputRef.current.click();
                    }}
                  />
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(event) => handleAttachmentsChange(event, props)}
                    ref={fileInputRef}
                  />
                </Col>
              </Row>
            </Col>
            <Col md="12" className="mb-0">
              <Row className="items-center">
                <Col md="4" className="label text-[17px] mb-3">
                  <div className="flex gap-5">
                    <div className="flex items-center gap-2.5 text-lg font-medium leading-4 text-zinc-600">
                      <img
                        loading="lazy"
                        src={members}
                        className="shrink-0 aspect-[1.06] w-[17px]"
                        alt=""
                      />
                      <div>Assignee</div>
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
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </div>
            </Col>
            <Col md="5">
              <Button type="submit" className="btn btn-dark w-100">
                {initialValues.id ? "Save" : "Add"}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default CreateAndEditCardForm;
