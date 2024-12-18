import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
} from "components/form-control.jsx";
import { PriorityList } from "data/Data";
import SheetComponent from "components/ui/CustomSheet";
import { useSelector } from "react-redux";
import {
  addTask,
  addAttachments,
  addTaskCheckListItem,
  getTaskById,
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
import { toast } from "react-toastify";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import moment from "moment";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { CardTypes } from "app/utils/Types/TaskManagment";
import { PageLoader } from "components";
import DialogBox from "components/DialogBox";

const CreateAndEditCardForm = ({
  taskId,
  employees,
  onClose,
  isEdit,
  setIsOpen,
  isOpen,
  projectId,
  boardId,
}) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [initialValues, setInitialValues] = useState(CardTypes);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      // Fetch card details
      const cardDetails = await getTaskById(taskId);

      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setInitialValues(cardDetails);
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to load task details. Please try again later.");
    } finally {
      if (isMounted) {
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchData(isMounted);
    else
      setInitialValues({
        ...initialValues,
        assigned_by: userProfile.id,
        project_id: projectId,
        board_id: boardId,
      });
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const handleSubmit = async (formData) => {
    const getAttachmentFileIds = async (attachmentfiles) => {
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
        attachment: await getAttachmentFileIds(formData.attachment || []),
        task_checklist: await getCheckListIds(formData.task_checklist || []),
      };
      // Submit the task
      const response = await addTask(finalData);
      if (response) {
        //  setShowSuccessMessage(true);
        toast.success(`Task ${isEdit ? "Updated" : "Added"} Successfully!`, {
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

  const userProfile = useSelector((state) => state.user.userProfile);

  const formSheetEditData = {
    triggerText: null,
    title: isEdit ? "Edit Card" : "Add Card",
    description: null,
    footer: null,
  };

  return (
    <>
      {" "}
      <SheetComponent
        {...formSheetEditData}
        isOpen={isOpen}
        setIsOpen={onClose}
        width="568px"
        contentClassName="custom-sheet-width"
      >
        <>
          {handleCloseWithConfirmation({
            isOpen: closeSheet,
            setCloseSheet,
            setIsOpen,
          })}
          {isLoading ? (
            <PageLoader />
          ) : (
            <Formik
              initialValues={initialValues}
              innerRef={formRef}
              enableReinitialize={true}
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
                  <div
                    className={`flex w-full gap-6 flex-col rounded-lg pt-2.5`}
                  >
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
                          <Attachments
                            attachmentSelected={props.values.attachment}
                            onChange={(attachments) => {
                              props.setFieldValue("attachment", attachments);
                            }}
                          />
                        }
                      />
                      {props.errors.attachment && props.touched.attachment && (
                        <div className="text-red-600">
                          {props.errors.attachment}
                        </div>
                      )}
                    </SheetCardExtension>

                    <SheetCardExtension
                      title={`${isEdit ? "Update To Card" : "Add To Card"}`}
                    >
                      <TaskInputDetails
                        title={"Due Date"}
                        content={
                          <div className="space-y-2">
                            <DateInput
                              name="end_date"
                              error={props.errors.end_date}
                              touch={props.touched.end_date}
                              value={props.values.end_date}
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
                              debugger;
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
                            assigneeSelected={props.values.assigned_to || []}
                            employees={employees}
                            onChange={(value) => {
                              props.setFieldValue("assigned_to", value);
                            }}
                          />
                        }
                      />
                      {props.errors.assigned_to &&
                        props.touched.assigned_to && (
                          <div className="text-red-600">
                            {props.errors.assigned_to}
                          </div>
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
          )}
        </>
      </SheetComponent>
      {showSuccessMessage && (
        <DialogBox
          isOpen={showSuccessMessage}
          setIsOpen={(value) => {
            setShowSuccessMessage(value);
            onClose(); // Close the modal or perform any other action upon success
          }}
          title={`Task ${isEdit ? "Updated" : "Added"} Successfully!`}
          // description=""
        />
      )}
    </>
  );
};

const TaskInputDetails = ({ title, content }) => {
  return (
    <>
      <div className="flex items-center gap-2 space-y-2">
        <div style={{ width: "20%", marginRight: "1rem" }}>{title}</div>
        <div style={{ width: "100%" }}>{content}</div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(CreateAndEditCardForm);
