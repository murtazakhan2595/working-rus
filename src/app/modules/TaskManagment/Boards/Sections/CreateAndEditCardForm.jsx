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
import {
  addTask,
  addAttachments,
  addTaskCheckListItem,
} from "app/hooks/taskManagment";
import { TextAreaInput } from "components/form-control";
import { Button } from "components/ui/button";
import {
  Labels,
  Assignee,
  CheckList,
  Attachments,
  TaskRelation,
} from "app/modules/TaskManagment/Sections";
import { toast, ToastContainer } from "react-toastify";
import { getDarkerTextColor } from "./getTaskStatus";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import moment from "moment";
import { relationList } from "data/Data";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const CreateAndEditCardForm = ({
  initialValues,
  employees,
  onClose,
  isEdit,
  setIsOpen,
  projectId,
}) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentfiles, setAttachmentFiles] = useState([]);
  const [closeSheet, setCloseSheet] = useState(false);
  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };
  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  const handleSubmit = async (formData) => {
    const getAttachmentFileIds = async () => {
      try {
        const attachmentPromises = attachmentfiles.map(async (file) => {
          if (file.attachments instanceof File) {
            const payload = { attachments: file.attachments };
            const response = await addAttachments(payload, file.id);
            return response.id; // Return the attachment ID
          } else {
            return file.id;
          }
        });
        return await Promise.all(attachmentPromises);
      } catch (error) {
        console.error("Error uploading attachments:", error);
        toast.error(
          "Failed to upload one or more attachments. Please try again.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        throw error; // Propagate the error
      }
    };

    const getCheckListIds = async (task_checklist) => {
      try {
        const checkListPromises = task_checklist.map(async (task_check) => {
          const response = await addTaskCheckListItem(
            task_check,
            task_check.id
          );
          return response.id; // Return the checklist item ID
        });
        return await Promise.all(checkListPromises);
      } catch (error) {
        console.error("Error adding checklist items:", error);
        toast.error(
          "Failed to add one or more checklist items. Please try again.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        throw error; // Propagate the error
      }
    };

    setIsLoading(true);

    try {
      // Prepare final data
      const finalData = {
        ...formData,
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        attachment: await getAttachmentFileIds(),
        task_checklist: await getCheckListIds(formData.task_checklist),
        priority: priorityMapping[formData.priority], // Map priority to the expected value
      };

      // Submit the task
      const response = await addTask(finalData);

      if (response) {
        toast.success("Task added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onClose(); // Close the modal or perform any other action upon success
      }
    } catch (error) {
      console.error("Error submitting task:", error);

      // Display a detailed error message
      const errorMessage =
        error.response?.data?.detail ||
        "An unexpected error occurred while submitting the task.";
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  };

  useEffect(() => {
    setAttachmentFiles(initialValues.attachment);
  }, [initialValues]);

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
    // if (file.id) {
    //   setDeleteFiles([...deleteFiles, file.id]);
    //   const filteredFiles = files.filter((f) => f.id !== file.id);
    //   setFiles(filteredFiles);
    // } else {
    //   const filteredFiles = newfiles.filter((f) => f.name !== file.name);
    //   setNewFiles(filteredFiles);
    // }
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
        onSubmit={(values) => {
          handleSubmit(values);
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
                      labelsSelected={props.values.label || []}
                      onSelectedLabelsChange={(value) => {
                        props.setFieldValue("label", value);
                      }}
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
                      items={props.values.task_checklist || []}
                      onChange={(items) => {
                        props.setFieldValue("task_checklist", items);
                      }}
                    />
                  }
                />
                <TaskInputDetails
                  title={"Relation"}
                  content={
                    <TaskRelation
                      relationsList={props.values.relation || []}
                      onChange={(value) => {
                        props.setFieldValue("relation", value);
                      }}
                      projectId={projectId}
                    />
                  }
                />
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
