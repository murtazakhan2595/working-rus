import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { PriorityList, TaskStatus } from "data/Data";
import moment from "moment";
import { connect } from "react-redux";
import EditCard from "./EditCard";
import { getTaskById } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import { deleteTask } from "app/hooks/taskManagment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import {
  Labels,
  MembersList,
  TaskComments,
  CheckList,
  Attachments,
  TaskRelation,
} from "app/modules/TaskManagment/Sections";
import { TextInput, TextAreaInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { Trash } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { PageLoader } from "components";
import { CheckBoxInput } from "components/FormControl";
import { addTask } from "app/hooks/taskManagment";
import TaskShare from "../Sections/TaskShare";
import { SheetCardExtension } from "components/SheetCardExtension";
import { CommentsInputField } from "components/FormControl";
import { useSelector } from "react-redux";
import { addCommentAttachment } from "app/hooks/taskManagment";
import { postComment } from "app/hooks/taskManagment";
import { Formik, Form } from "formik";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { CardTypes } from "app/utils/Types/TaskManagment";
import { DateInput } from "components/FormControl";
import { SelectComponent } from "components/FormControl";
import { Assignee } from "../Sections";
import { getProjectById } from "app/hooks/taskManagment";
import { errorClassName } from "components/FormControl";
import { addAttachments } from "app/hooks/taskManagment";
import { addTaskCheckListItem } from "app/hooks/taskManagment";
import { mapTaskPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { addSubtask } from "app/hooks/taskManagment";

const TaskDetail = ({ taskId, setIsOpen, isOpen, reloadData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [comments, setComments] = useState([]);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(CardTypes);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [ refreshComments,setRefreshComments] = useState(false);
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);

  const fetchTaskData = async (isMounted) => {
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(taskId);
      if (!cardDetails) {
        throw new Error("Card details not found.");
      }

      if (isMounted) {
        setTaskData(cardDetails);
        setInitialValues(cardDetails);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to load task details. Please try again later.");
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchTaskData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [taskId]);
  useEffect(() => {
    let isMounted = true;
    const fetchProject = async (isMounted) => {
      if (taskData?.project_id) {
        try {
          const projectDetails = await getProjectById(taskData.project_id);
          if (isMounted && projectDetails) {
            setProjectDetail(projectDetails);
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    if (taskData?.project_id) {
      fetchProject(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [taskData?.project_id]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const editDetails = () => {
    setIsEditCardOpen(true);
  };

  const confirmDelete = async () => {
    const response = await deleteTask(taskId);
    if (response && response.status === 200) {
      setIsOpen(false);
    }
    setIsDeleteModalOpen(false);
  };

  const archeiveTask = async (name, value, values) => {
    try {
      const newStatus = "ARCHIVED";
      const response = await addTask(
        {
          status: newStatus,
        },
        taskId
      );
      if (response) {
        setIsOpen(false);
        toast.success("Task Archeived updated successfully");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddComment = async (comment, attachments) => {
    const getAttachmentFileIds = async (attachmentfiles) => {
      if (attachmentfiles && attachmentfiles.length > 0) {
        try {
          const attachmentPromises = attachmentfiles.map(async (file) => {
            if (file.attachment instanceof File) {
              const payload = { attachment: file.attachment };
              const response = await addCommentAttachment(payload, file.id);
              return response.id;
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
          throw error;
        }
      } else return [];
    };
    if (comment.trim() || attachments) {
      try {
        const payload = {
          task_id: taskId,
          comment: comment,
          user_id: userId,
          commentattach: await getAttachmentFileIds(attachments),
        };
        const response = await postComment(payload);
        if (response.status === 201 || response.status === 200) {
          setRefreshComments(true);
        }
      } catch (error) {
        console.error("Error Adding Comment:", error);
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    setIsLoading(true);
    try {
      const getAttachmentFileIds = async (files) => {
        return await Promise.all(
          files.map(async (file) => {
            if (file.attachments instanceof File) {
              const response = await addAttachments(
                { attachments: file.attachments },
                file.id
              );
              return response.id;
            }
            return file.id;
          })
        );
      };

      const getCheckListIds = async (checklist) => {
        return await Promise.all(
          checklist.map(async (item) => {
            const response = await addTaskCheckListItem(item, item.id);
            return response.id;
          })
        );
      };

      const finalData = mapTaskPayloadData({
        ...values,
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        attachment: await getAttachmentFileIds(values.attachment || []),
        task_checklist: await getCheckListIds(values.task_checklist || []),
      });

      const response = await addTask(finalData, taskId);
      if (response) {
        await Promise.all(
          (values.subtasks || []).map((subtask) =>
            addSubtask({
              ...subtask,
              tasks: response.id,
            })
          )
        );
        toast.success("Task Updated Successfully!");
        fetchTaskData(true);
        reloadData();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(
        error.response?.data?.detail ||
          "Failed to update task. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  function CardValues({ values, formikProps, editingField, setEditingField }) {
    const items = [
      // Modify the due date part in CardValues
      ...(values?.end_date
        ? [
            {
              label: "Due Date",
              value: (
                <DateInput
                  name="end_date"
                  error={formikProps.errors.end_date}
                  touch={formikProps.touched.end_date}
                  value={formikProps.values.end_date}
                  onChange={(field, value) => {
                    formikProps.setFieldValue(field, value);
                    // Auto-submit when date changes
                    formikProps.submitForm();
                  }}
                />
              ),
            },
          ]
        : []),
      ...(values?.status
        ? [
            {
              label: "Status",
              value: TaskStatus.find(
                (option) => option.value === values?.status
              )?.label,
            },
          ]
        : []),
      ...(values?.priority
        ? [
            {
              label: "Priority",
              value: (
                <SelectComponent
                  name="priority"
                  options={PriorityList}
                  showLabel={false}
                  error={formikProps.errors.priority}
                  touch={formikProps.touched.priority}
                  value={formikProps.values.priority}
                  onChange={(field, value) => {
                    formikProps.setFieldValue(field, value);
                    // Auto-submit when priority changes
                    formikProps.submitForm();
                  }}
                />
              ),
            },
          ]
        : []),
      ...(values?.label?.length || true
        ? [
            {
              label: "Label",
              value: (
                <Labels
                  labelsSelected={formikProps.values.label || []}
                  onSelectedLabelsChange={(value) => {
                    formikProps.setFieldValue("label", value);
                    // Auto-submit when labels change
                    formikProps.submitForm();
                  }}
                  editMode={true} // Always in edit mode
                />
              ),
            },
          ]
        : []),
      ...(values?.assigned_to?.length || true // Changed to always show
        ? [
            {
              label: "Assign",
              value: (
                <>
                  <Assignee
                    assigneeSelected={formikProps.values.assigned_to || []}
                    employees={employees}
                    onChange={(value) => {
                      formikProps.setFieldValue("assigned_to", value);
                      // Auto-submit when assignees change
                      formikProps.submitForm();
                    }}
                    projectMembers={projectDetail?.project_members || []}
                  />
                  {/* Error handling */}
                  {formikProps.errors.assigned_to &&
                    formikProps.touched.assigned_to && (
                      <div className={errorClassName}>
                        {formikProps.errors.assigned_to}
                      </div>
                    )}
                </>
              ),
            },
          ]
        : []),
      ...(values?.relation?.length || true
        ? [
            {
              label: "Relation",
              value: (
                <TaskRelation
                  relationsList={formikProps.values.relation || []}
                  onChange={(value) => {
                    formikProps.setFieldValue("relation", value);
                    formikProps.submitForm();
                  }}
                  projectId={taskData.project_id}
                  taskId={taskId}
                  editMode={true}
                />
              ),
            },
          ]
        : []),
      {
        label: "Share Link",
        value: <TaskShare projectId={taskData.project_id} taskId={taskId} />,
      },
    ];

    return (
      <div className="flex flex-col items-start justify-between flex-wrap w-[100%] gap-4">
        {items.map(({ label, value }, idx) => (
          <DetailBox key={idx} label={label} value={value} className="mt-2" />
        ))}
      </div>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <PageLoader />
          ) : (
            <Formik
              initialValues={initialValues}
              innerRef={formRef}
              enableReinitialize={true}
              onSubmit={handleSubmit}
              validate={validationTaskFormSchema}
            >
              {(formikProps) => (
                <Form>
                  <header className="flex items-center justify-between">
                    {editingField === "name" ? (
                      <div className="min-w-[400px]">
                        <TextInput
                          name="name"
                          error={formikProps.errors.name}
                          touch={formikProps.touched.name}
                          value={formikProps.values.name}
                          required={true}
                          onChange={(field, value) => {
                            formikProps.setFieldValue(field, value);
                          }}
                          onBlur={async (e) => {
                            await formikProps.setFieldTouched("name", true);
                            setEditingField(null);
                            if (formikProps.values.name !== taskData.name) {
                              await formikProps.submitForm();
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <h1
                        className="text-2xl font-bold text-[#323333] cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                        onDoubleClick={() => setEditingField("name")}
                      >
                        {taskData?.name}
                      </h1>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={archeiveTask}>
                        <CiEdit className="mr-2" />
                        Archive
                      </Button>
                      {/* <Button variant="outline" onClick={toggleEditMode}>
                        <CiEdit className="mr-2" />
                        {isEditMode ? "Cancel Edit" : "Edit"}
                      </Button> */}
                      <Button variant="outline" onClick={handleDelete}>
                        <Trash className="mr-2" size={16} />
                        Delete
                      </Button>
                    </div>
                  </header>

                  {/* Render form or view based on isEditMode */}
                  <div className="grid grid-cols-2 w-full gap-4">
                    <LeftColumn
                      taskData={taskData}
                      handleAddComment={handleAddComment}
                      employees={employees}
                      CardValues={CardValues}
                      formikProps={formikProps}
                      editingField={editingField}
                      setEditingField={setEditingField}
                    />
                    <RightColumn
                      taskData={taskData}
                      taskId={taskId}
                      formikProps={formikProps}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      refreshComments={refreshComments}
                    />
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end gap-2 mt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={toggleEditMode}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {isEditCardOpen && (
        <EditCard
          cardId={taskData?.id}
          projectId={taskData?.project_id}
          onClose={() => {
            setIsEditCardOpen(false);
            fetchTaskData(true);
          }}
          setIsOpen={setIsEditCardOpen}
          isOpen={isEditCardOpen}
          reloadData={reloadData}
        />
      )}

      <AlertDialogue
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleContinue={confirmDelete}
        title="Are you sure?"
        description="Are you sure you want to delete this Card? This action is irreversible and will delete all card details"
      />
    </>
  );
};

const LeftColumn = ({
  taskData,
  handleAddComment,
  employees,
  CardValues,
  formikProps,
  editingField,
  setEditingField,
}) => (
  <div>
    <DetailCard detailCardTitle="Card Details" className="">
      <CardValues
        values={taskData}
        formikProps={formikProps}
        editingField={editingField}
        setEditingField={setEditingField}
      />
    </DetailCard>
    {/* Replace the existing DetailBox for description with this */}
    <DetailBox
      label="Description"
      value={
        editingField === "description" ? (
          <TextAreaInput
            name="description"
            error={formikProps.errors.description}
            touch={formikProps.touched.description}
            value={formikProps.values.description}
            required
            maxRows={6}
            onChange={(field, value) => {
              formikProps.setFieldValue(field, value);
            }}
            onBlur={async (e) => {
              await formikProps.setFieldTouched("description", true);
              setEditingField(null);
              if (formikProps.values.description !== taskData.description) {
                await formikProps.submitForm();
              }
            }}
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded block"
            onDoubleClick={() => setEditingField("description")}
            dangerouslySetInnerHTML={{
              __html: taskData?.description,
            }}
          />
        )
      }
      orientation="horizontal"
    />
      <DetailBox
        label="Attachments"
        value={
            <Attachments
              attachmentSelected={formikProps.values.attachment}
              onChange={async(attachment) => {
                console.log("Attachments updated:", attachment);
                await formikProps.setFieldValue("attachment", attachment);
                // Auto-submit when attachments change
                await formikProps.submitForm();
              }}
            />
        }
      />
    <DetailBox
      label="Comments"
      orientation="horizontal"
      value={
        <CommentsInputField
          handleAddComment={handleAddComment}
          users={employees}
        />
      }
    />
  </div>
);

// Right Column Component
const RightColumn = ({
  taskData,
  taskId,
  formikProps,
  editingField,
  setEditingField,
  refreshComments,
}) => (
  <div className="space-y-6">
    <DetailBox
      label="Checklist"
      orientation="horizontal"
      className=""
      value={
        <>
          <DetailCard detailCardTitle="" classNames="min-h-72">
            <CheckList
              items={formikProps.values.task_checklist || []}
              onChange={(items) => {
                console.log("Checklist updated:dsfsdf", items);
                formikProps.setFieldValue("task_checklist", items);
                formikProps.submitForm();
              }}
            />
          </DetailCard>
        </>
      }
    />
    <DetailBox
      label="Activity"
      orientation="horizontal"
      className=""
      value={<TaskComments taskId={taskId} refreshComments={refreshComments} />}
    />
  </div>
);

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(TaskDetail);
