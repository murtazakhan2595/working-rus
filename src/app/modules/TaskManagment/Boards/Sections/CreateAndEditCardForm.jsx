import React, { useEffect, useRef, useState } from "react";
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
import { PriorityList } from "data/Data";
import Members from "../../Sections/Member";
import { FileInput } from "components/form-control";
import { AiOutlineDownload } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaRegImage } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import {validationTaskFormSchema} from "app/utils/FormSchema/taskManagementFormSchema";


const CreateAndEditCardForm = ({ initialValues, employees, handleSubmit, onClose, isEdit }) => {
  console.log("initialValues", initialValues)
  const formRef = useRef();
  const fileInputRef = useRef(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [newfiles, setNewFiles] = useState([]);
  const [files, setFiles] = useState([]); 
  const [deleteFiles, setDeleteFiles] = useState([]);


    useEffect(() => {
      setFiles(initialValues.attachment);
    }, [initialValues.attachment]);


  const userProfile = useSelector((state) => state.user.userProfile);
   const formInitialValues = isEdit 
    ? initialValues 
    : { ...initialValues, assigned_by: userProfile.id };

  const handleAttachmentsChange = (event, props) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    Promise.all(
      filesArray.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileData = {
              name: file.name,
              file: event.target.result,
            };
            resolve(fileData);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      })
    )
      .then((fileDataArray) => {
        setNewFiles(fileDataArray); 
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };
  const removeFile = (file)=>{
    console.log("file", file);
    if(file.id){
      setDeleteFiles([...deleteFiles, file.id]);
       const filteredFiles = files.filter(f => f.id !== file.id);
      setFiles(filteredFiles);
    }
    else{
      const filteredFiles = newfiles.filter(f => f.name !== file.name);
      setNewFiles(filteredFiles);
    }
  }

  const removeMember = (member) => {
    console.log("member", member);
    const members = formRef.current.values.assigned_to || [];
    const updatedMembers = members.filter((m) => m !== member);
    formRef.current.setFieldValue("assigned_to", updatedMembers);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      enableReinitialize={true}
      innerRef={formRef}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values, newfiles, files, deleteFiles, resetForm);
      }}
      validate={(values) => {
        const errors = validationTaskFormSchema(values);
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
            <Col md="12" className="mb-0 non-sticky">
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
                    required
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </Col>
                <Col md="6" className="mb-0">
                  <SelectComponent
                    name="assigned_by"
                    options={employees}
                    error={props.errors.assigned_by}
                    touch={props.touched.assigned_by}
                    value={props.values.assigned_by}
                    required
                    label="Assign By"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
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
                    required
                    label="End Date"
                    {...(props.values.start_date && {
                      minDate: new Date(props.values.start_date),
                    })}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </Col>
                <Col md="6" className="mb-0">
                  <SelectComponent
                    name="priority"
                    options={PriorityList}
                    error={props.errors.priority}
                    touch={props.touched.priority}
                    value={props.values.priority}
                    required
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
                      <div>Attachments ({newfiles?.length + files.length})</div>
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
            <Col md="12" className="mb-3">
              {(files.length > 0 || newfiles?.length > 0) && (
                <div className="">
                  {[...files, ...newfiles].map((file, index) => (
                    <div className="flex items-center justify-between w-fit bg-gray-100 p-2 rounded-lg shadow-md mb-2">
                      <div className="flex items-center">
                        <FaRegImage className="h-4 w-4 text-gray-500" />
                        <span className="ml-4 font-lato text-baseGray text-sm">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <a
                          href="/path/to/your/image.jpg"
                          download
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <AiOutlineDownload className="h-5 w-5 " />
                        </a>
                        <MdClose
                          className="h-5 w-5 text-gray-500 cursor-pointer"
                          onClick={() => {
                            removeFile(file);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  {props.errors.assigned_to &&
                    props.values.assigned_to.length === 0 && (
                      <div className="text-red-500 text-xs pt-1">
                        {props.errors.assigned_to}
                      </div>
                    )}
                </Col>
                <Col md="6" className="mb-3">
                  <div className="flex justify-start gap-2 items-center h-100">
                    {props.values.assigned_to &&
                      props.values.assigned_to.length > 0 &&
                      props.values.assigned_to.map((member, index) => (
                        <div key={index}>
                          <Members
                            member={member}
                            isEditMode={true}
                            removeMember={removeMember}
                          />
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
                    name="assigned_to"
                    options={employees}
                    error={props.errors.assigned_to}
                    touch={props.touched.assigned_to}
                    label="Assign to"
                    required
                    onChange={(field, value) => {
                      setMembersOpen(false);
                      const members = props.values.assigned_to || [];
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
