import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
} from "components/form-control.jsx";
import { RiAttachment2 } from "react-icons/ri";
import { RxPlus } from "react-icons/rx";
import members from "assets/images/members.svg";

import plus from "assets/images/plus.svg";
import { PriorityList } from "data/Data";
import Members from "../../Sections/Member";

import { AiOutlineDownload } from "react-icons/ai";

import { FaRegImage } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { getAllLabels } from "app/hooks/taskManagment";

import { TextAreaInput } from "components/form-control";
import { Button } from "components/ui/button";
import {
  Labels,
  Assignee,
  CheckList,
  Attachments,
} from "app/modules/TaskManagment/Sections";
import { getDarkerTextColor } from "./getTaskStatus";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { Input } from "components/ui/input";
import { relationList } from "data/Data";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const CreateAndEditCardForm = ({
  initialValues,
  employees,
  handleSubmit,
  onClose,
  isEdit,
  setIsOpen,
}) => {
  const formRef = useRef();
  const [newfiles, setNewFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [attachmentfiles, setAttachmentFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [labelsAdded, setLabelsAdded] = useState([]);
  const [foreignKeys, setForeignKeys] = useState([]);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);

  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(), // use unique ID
      label: inputValue,
      checked: false,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setInputValue("");
    setIsPopoverOpen(false); // Close the popover after adding the item
  };

  const fetchLabels = async () => {
    const labelList = await getAllLabels();
    setLabelsList(labelList); // Update this to `labelList`
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleSelectedLabelsChange = (selectedLabels) => {
    setLabelsAdded(selectedLabels);
    const selectedLabelObjects = selectedLabels?.map((selectedId) =>
      labelsList?.find((label) => label.id === selectedId)
    );
    setLabels(selectedLabelObjects);
  };

  useEffect(() => {
    console.log(initialValues.attachment)
    setAttachmentFiles(initialValues.attachment);
  }, [initialValues.attachment]);

  const userProfile = useSelector((state) => state.user.userProfile);
  const formInitialValues = isEdit
    ? initialValues
    : { ...initialValues, assigned_by: userProfile.id };

    const handleAttachmentsChange = (event, props) => {
      const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
      const existingFiles = attachmentfiles;
    
      // Map selected files to the desired format
      const formattedFiles = selectedFiles.map((file) => ({
        attachments: file,
        id: null,
        name: file.name,
      }));
    
      // Merge new files with existing ones
      setAttachmentFiles([...formattedFiles, ...existingFiles]);
    };
    
  const removeFile = (file) => {
    if (file.id) {
      setDeleteFiles([...deleteFiles, file.id]);
      const filteredFiles = files.filter((f) => f.id !== file.id);
      setFiles(filteredFiles);
    } else {
      const filteredFiles = newfiles.filter((f) => f.name !== file.name);
      setNewFiles(filteredFiles);
    }
  };

  const removeMember = (member) => {
    const members = formRef.current.values.assigned_to || [];
    const updatedMembers = members.filter((m) => m !== member);
    formRef.current.setFieldValue("assigned_to", updatedMembers);
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={formInitialValues}
        enableReinitialize={true}
        innerRef={formRef}
        onSubmit={(values, { resetForm }) => {
          const formValues = {
            ...values,
            label: labelsAdded,
          };
          handleSubmit(formValues, attachmentfiles, files, deleteFiles, resetForm);
        }}
        validate={(values) => {
          const errors = validationTaskFormSchema(values);
          return errors;
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className="">
            <div className={`flex w-full gap-6 flex-col rounded-lg pt-2.5`}>
              <SheetCardExtension title="Card Details">
                <div className="space-y-2">
                  <TextAreaInput
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
                </div>
                <div className="space-y-2">
                  <TextAreaInput
                    name="description"
                    error={props.errors.description}
                    touch={props.touched.description}
                    value={props.values.description}
                    required
                    maxRows={3}
                    label="Description"
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>

                <TaskInputDetails
                  title={"Attachments"}
                  content={
                    <div className="space-y-2">
                      <Attachments
                        attachmentSelected={attachmentfiles}
                        removeFile={removeFile}
                        onChange={(event) => {
                          handleAttachmentsChange(event);
                        }}
                      />
                    </div>
                  }
                />
              </SheetCardExtension>

              <SheetCardExtension title="Add To Card">
                <TaskInputDetails
                  title={"Due Date"}
                  content={
                    <div className="space-y-2">
                      <DateInput
                        name="end_date"
                        error={props.errors.end_date}
                        touch={props.touched.end_date}
                        value={props.values.end_date}
                        // label="Due Date"
                        // required
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                  }
                />

                <TaskInputDetails
                  title={"Estimated Time (in hours)"}
                  content={
                    <TextInput
                      name="estimated_time"
                      error={props.errors.estimated_time}
                      touch={props.touched.estimated_time}
                      value={props.values.estimated_time}
                      // label=
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  }
                />
                <TaskInputDetails
                  title={"Time Spent (in hours)"}
                  content={
                    <TextInput
                      name="consumed_time"
                      error={props.errors.consumed_time}
                      touch={props.touched.consumed_time}
                      value={props.values.consumed_time}
                      // label="Time Spent (in hours)"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  }
                />
                <TaskInputDetails
                  title={"Priority"}
                  content={
                    <SelectComponent
                      name="priority"
                      options={PriorityList}
                      error={props.errors.priority}
                      touch={props.touched.priority}
                      value={props.values.priority}
                      // required
                      // label="Priority"
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                    />
                  }
                />

                <TaskInputDetails
                  title={"Label"}
                  content={
                    <Labels
                      onSelectedLabelsChange={handleSelectedLabelsChange}
                      labelsList={labelsList}
                      reloadList={() => {
                        fetchLabels();
                      }}
                      labelsSelected={labels}
                    />
                  }
                />
                <TaskInputDetails
                  title={"Assignee"}
                  content={
                    <Assignee
                      assigneeSelected={props.values.assigned_to}
                      removeMember={removeMember}
                      employees={employees}
                      onChange={(value) => {
                        props.setFieldValue("assigned_to", value);
                      }}
                    />
                  }
                />
                {props.errors.assigned_to && props.touched.assigned_to && (
                  <div className="text-red-600">{props.errors.assigned_to}</div>
                )}

                <TaskInputDetails
                  title={"CheckList"}
                  content={
                    <CheckList
                      items={items}
                      setItems={setItems}
                      checkItemValue={inputValue}
                      onChange={(value) => setInputValue(value)}
                      handleAddItem={handleAddItem}
                    />
                  }
                />
                {/* <TaskInputDetails
                  title={"Relation"}
                  content={
                    <SelectComponent
                      name="relation"
                      options={relationList}
                      error={props.errors.relation}
                      touch={props.touched.relation}
                      value={props.values.relation}
                      onChange={(field, value) => {
                        props.setFieldValue(field, [value]);
                      }}
                    />
                  }
                /> */}
              </SheetCardExtension>

              <div className="flex justify-end gap-2 mt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClose}
                  // onClick={onClose()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {initialValues.id ? "Save" : "Add Card"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

const TaskInputDetails = ({ title, content }) => {
  return (
    <>
      <div className="flex items-center gap-2 space-y-2">
        <div style={{ width: "18%" }}>{title}</div>
        {content}
      </div>
    </>
  );
};

export default CreateAndEditCardForm;
