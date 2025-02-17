import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { getTaskById, getAllBoards } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  TaskComments,
  CheckList,
  Attachments,
} from "app/modules/TaskManagment/Sections";
import { Button } from "components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { PageLoader } from "components";
import { addTask } from "app/hooks/taskManagment";
import {
  InputTaskTitle,
  InputTaskDescription,
  ProjectCustomFields,
  InputTaskDetailFields,
  AdditionalActionOption,
} from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails/Sections";
import { CommentsInputField } from "components/FormControl";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { Task } from "app/utils/Types/TaskManagment";
import { SelectInputComponent, CoverFileUpload } from "components/FormControl";
import { getProjectById, deleteAttachment } from "app/hooks/taskManagment";
import { addAttachments } from "app/hooks/taskManagment";
import { Progress } from "src/@/components/ui/progress";

import {
  addTaskCheckListItem,
  getAllCustomFields,
} from "app/hooks/taskManagment";
import { mapTaskPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { getDropdownList, convertJSONArrayToStringsArray } from "utils/Lists";
import Subtasks from "../../Sections/SubTask";
import { createActivity } from "app/hooks/taskManagment";
import { trackTaskActivities } from "./Sections/activityHelper";
import SubtaskList from "./Sections/SubtaskList";
import CopyLink from "components/ui/CopyLink";
import TaskCommentsContainer from "../../Sections/TaskComments";
import { FormatID } from "utils/getValuesFromTables";
import { ScrollArea } from "src/@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { TaskRelation } from "../../Sections";
import { Card, CardContent } from "components/ui/card";

const TaskEditAddViewDetails = ({
  taskId,
  setIsOpen,
  isOpen,
  reloadData,
  projectId,
  boardId,
  Projects = [],
  isSubtask = false, // New prop to indicate if this is a subtask
  onTaskCreated, // New callback for when task/subtask is created
}) => {
  const userId = useSelector((state) => state.user.userProfile.id);
  const [isLoading, setIsLoading] = useState(false);
  const [BoardList, setBoardList] = useState([]);
  const [CustomFields, setCustomFields] = useState([]);
  const [openProjectCustomFields, setOpenProjectCustomFields] = useState(false);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(Task);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const [subTasksDetails, setSubTasksDetails] = useState([]);
  const [closeSheet, setCloseSheet] = useState(false);
  const employees = useSelector((state) => state.emp.employees);
  const [showActivities, setShowActivities] = useState(true);
  const [editCommentContent, setEditCommentContent] = useState(null);
  const [replyComment, setReplyComment] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");

  const toggleActivities = () => {
    setShowActivities(!showActivities);
  };

  const handleClose = (e) => {
    if (e && e.event) e.preventDefault();
    setCloseSheet(true);
  };

  const fetchCustomFieldsByProjectId = async (isMounted, projectID) => {
    if (projectID) {
      try {
        // Fetch card details
        const customFields = await getAllCustomFields(projectID);
        if (!customFields) {
          throw new Error("Custom Field not found.");
        }
        if (isMounted) {
          setCustomFields(customFields.results);
        }
      } catch (error) {
        console.error("Error fetching board list:", error);
      }
    }
  };

  const countCompletedTasks = (tasks) => {
    return tasks.filter((task) => task.status === "COMPLETED").length;
  };

  useEffect(() => {
    let isMounted = true;
    if (initialValues.project_id)
      fetchCustomFieldsByProjectId(isMounted, initialValues.project_id);
    return () => {
      isMounted = false;
    };
  }, [initialValues.project_id]);

  const fetchBoardListByProjectId = async (isMounted, projectID) => {
    if (projectID) {
      try {
        // Fetch card details
        const board_list = await getAllBoards({
          filterData: { project_id: [projectID] },
        });

        if (!board_list) {
          throw new Error("Card details not found.");
        }
        if (isMounted) {
          setBoardList(getDropdownList(board_list.results));
        }
      } catch (error) {
        console.error("Error fetching board list:", error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (initialValues.project_id)
      fetchBoardListByProjectId(isMounted, initialValues.project_id);
    return () => {
      isMounted = false;
    };
  }, [initialValues.project_id]);

  const fetchTaskData = async (isMounted) => {
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(taskId);
      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setInitialValues({
          ...cardDetails,
          project_id: projectId || cardDetails.project_id, //
        });
        setIsLoading(false);
      }
      if (cardDetails.sub_task && cardDetails.sub_task.length > 0) {
        const subtaskDetails = await Promise.all(
          cardDetails.sub_task.map((subtaskId) => getTaskById(subtaskId))
        );
        setSubTasksDetails(subtaskDetails);
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
    else
      setInitialValues({
        ...initialValues,
        assigned_by: userId,
        project_id: projectId || null,
        board_id: boardId || null,
      });
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  useEffect(() => {
    let isMounted = true;
    const fetchProject = async (isMounted) => {
      if (initialValues?.project_id) {
        try {
          const projectDetails = await getProjectById(initialValues.project_id);
          if (isMounted && projectDetails) {
            setProjectDetail(projectDetails);
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    if (initialValues?.project_id) {
      fetchProject(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [initialValues?.project_id]);

  const additionalActionReload = async () => {
    setIsOpen(false);
  };
  const uploadAttachmentFile = async (file) => {
    try {
      if (file.attachment instanceof File) {
        const response = await addAttachments(
          { attachment: file.attachment },
          file.id
        );
        return response;
      }
      return file;
    } catch (error) {
      console.error(error);
    }
  };
  const deleteAttachmentFile = async (id) => {
    try {
      if (id) {
        const response = await deleteAttachment(id);
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const getAttachmentFileIds = async (files) => {
        return (
          await Promise.all(
            files.map(async (file, index) => {
              const response = await uploadAttachmentFile(file);
              if (index === 0) {
                values.cover_photo = response.attachment;
              }
              return response.id;
            })
          )
        ).filter(Boolean); // Remove null values;
      };

      const getCheckListIds = async (checklist) => {
        return (
          await Promise.all(
            checklist.map(async (item) => {
              const response = await addTaskCheckListItem(item, item.id);
              return response.id;
            })
          )
        ).filter(Boolean); // Remove null values;
      };
      const finalData = mapTaskPayloadData({
        ...values,
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        attachment: await getAttachmentFileIds(values.attachment || []),
        task_checklist: await getCheckListIds(values.task_checklist || []),
        custom_fields: convertJSONArrayToStringsArray(
          values.custom_fields,
          "field",
          "value"
        ),
      });
      if (!finalData.hasOwnProperty("status") || finalData.status === null) {
        finalData.status = "TODO";
      }
      if (isSubtask) {
        finalData.is_subtask = true;
      }
      finalData.cover_photo =
        values?.attachment?.length > 0 ? values.cover_photo : null;
      const response = await addTask(finalData, taskId);
      if (response) {
        // Notify parent component of the new task
        if (onTaskCreated && isSubtask) {
          onTaskCreated(response.data);
        }
        //  setShowSuccessMessage(true);
        // Track activities
        await trackTaskActivities(
          response?.data,
          taskId ? initialValues : null,
          taskId || response?.data.id,
          userId,
          createActivity
        );
        toast.success(
          isSubtask
            ? "Subtask Created Successfully!"
            : `Task ${taskId ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        taskId && fetchTaskData(true);
        !isSubtask && reloadData();
        setIsOpen(false);
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

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[70vw] w-[70vw] h-[auto] pr-2">
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
              {(props) => (
                <Form className="overflow-x-hidden">
                  <ScrollArea className="[&>div>div[style]]:!block">
                    <div className="h-[85vh] pr-3">
                      <div className="flex justify-between mb-3 px-3 mt-3">
                        <div className="text-md font-semibold dark:text-slate-50 flex items-center gap-2">
                          {isSubtask && (
                            <ArrowLeft
                              className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm cursor-pointer"
                              onClick={() => setIsOpen(false)}
                            />
                          )}
                          {props.values.is_archive ? (
                            <span className="text-amber-400">Archive Card</span>
                          ) : (
                            `${taskId ? "Edit" : "Add"} ${
                              isSubtask ? "Subtask" : "Task"
                            }`
                          )}
                          {taskId && (
                            <CopyLink
                              link={`${taskId}`}
                              text={<FormatID prefix={"T-"} value={taskId} />}
                              directCopy={true}
                            />
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          {!props.values.project_id && (
                            <SelectInputComponent
                              name="project_id"
                              options={Projects}
                              error={props.errors.project_id}
                              touch={props.touched.project_id}
                              value={props.values.project_id}
                              showLabel={false}
                              placeholder="Select Project"
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                                props.setFieldValue("board_id", null);
                                setIsEditMode(true);
                                fetchBoardListByProjectId(true, value);
                              }}
                            />
                          )}
                          <SelectInputComponent
                            name="board_id"
                            options={BoardList}
                            showLabel={false}
                            error={props.errors.board_id}
                            touch={props.touched.board_id}
                            value={props.values.board_id}
                            placeholder="Select Project List"
                            onChange={(field, value) => {
                              setIsEditMode(true);
                              props.setFieldValue(field, value);
                            }}
                          />
                          <AdditionalActionOption
                            projectId={props.values.project_id}
                            taskId={taskId}
                            reloadData={additionalActionReload}
                            isArchive={props.values.is_archive}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-4">
                        <div className="flex flex-col col-span-4 gap-3 p-3">
                          <div className="text-neutral-1200 text-sm font-semibold whitespace-nowrap">
                            {"Title"}
                          </div>
                          <InputTaskTitle
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                            error={props.errors.name}
                            touched={props.touched.name}
                            value={props.values.name}
                            taskId={taskId}
                          />
                          <div className="text-neutral-1200 text-sm font-semibold whitespace-nowrap">
                            {"Description"}
                          </div>
                          <InputTaskDescription
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                            setAttachment={async (attachment) => {
                              await props.setFieldValue(
                                "attachment",
                                attachment
                              );
                              setIsEditMode(true);
                            }}
                            attachments={props.values.attachment || []}
                            error={props.errors.description}
                            touched={props.touched.description}
                            value={props.values.description}
                            uploadAttachmentFile={async (file) => {
                              return await uploadAttachmentFile(file);
                            }}
                            name={"description"}
                          />
                          <InputTaskDetailFields
                            errors={props.errors}
                            touched={props.touched}
                            taskData={props.values}
                            isSubtask={isSubtask}
                            taskId={taskId}
                            projectDetail={projectDetail}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                            employees={employees}
                            CustomFields={CustomFields || []}
                          />
                          <Attachments
                            attachmentSelected={props.values.attachment || []}
                            onChange={async (attachment) => {
                              await props.setFieldValue(
                                "attachment",
                                attachment
                              );
                              setIsEditMode(true);
                            }}
                            acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                            error={props.errors.relation}
                            touch={props.touched.relation}
                            deleteAttachmentFile={deleteAttachmentFile}
                          />
                          {/* <div className="grid grid-cols-2 gap-4">
                            <DetailBox
                              label="Custom Fields"
                              orientation="horizontal"
                              value={
                                <Button
                                  variant="continue"
                                  size="sm"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpenProjectCustomFields(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" /> Add
                                </Button>
                              }
                            />
                            {!isSubtask && (
                              <DetailBox
                                label={"Subtasks"}
                                orientation="horizontal"
                                value={
                                  <Subtasks
                                    items={props.values.subtasks || []}
                                    onChange={(items) => {
                                      props.setFieldValue("subtasks", items);
                                    }}
                                    projectId={projectId}
                                    taskId={taskId}
                                    boardId={boardId}
                                    fetchTaskData={fetchTaskData}
                                  />
                                }
                              />
                            )}
                          </div> */}
                          {/* {!isSubtask && subTasksDetails.length > 0 && (
                            <DetailBox
                              label={"Subtasks"}
                              orientation="horizontal"
                              value={
                                <>
                                  <div className="flex justify-between gap-3 mb-4 flex-4 items-center">
                                    <Progress
                                      value={
                                        (countCompletedTasks(subTasksDetails) /
                                          subTasksDetails?.length) *
                                        100
                                      }
                                      className="mt-1 h-2 bg-gray-400"
                                    />
                                    <span>{`${(
                                      (countCompletedTasks(subTasksDetails) /
                                        subTasksDetails?.length) *
                                      100
                                    )?.toFixed(0)}%`}</span>
                                  </div>

                                  <SubtaskList
                                    items={props?.values?.sub_task || []}
                                    projectId={projectId}
                                    taskId={taskId}
                                    boardId={boardId}
                                    //subTasksDetails={subTasksDetails}
                                  />
                                </>
                              }
                            />
                          )} */}
                        </div>
                        <div className="flex flex-col col-span-3 gap-3 p-3">
                          <div>
                            <Tabs
                              value={activeTab}
                              onValueChange={setActiveTab}
                              defaultValue="checklist"
                            >
                              <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
                                <TabsList className="flex justify-center mb-4">
                                  {[
                                    { value: "checklist", label: "checklist" },
                                    { value: "relation", label: "Relation" },
                                    { value: "subtasks", label: "Subtasks" },
                                    {
                                      value: "customFields",
                                      label: "CustomFields",
                                    },
                                  ].map((tab) => (
                                    <TabsTrigger
                                      key={tab.value}
                                      value={tab.value}
                                      className="data-[state=active]:bg-primary-200 w-fit data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                                    >
                                      {tab.label}
                                    </TabsTrigger>
                                  ))}
                                </TabsList>
                              </div>
                              <TabsContent value="checklist">
                                <CheckList
                                  items={props.values.task_checklist || []}
                                  onChange={(items) => {
                                    props.setFieldValue(
                                      "task_checklist",
                                      items
                                    );
                                    setIsEditMode(true);
                                  }}
                                />
                              </TabsContent>
                              <TabsContent value="relation">
                                {" "}
                                 <DetailCard
                                  detailCardTitle=""
                                  classNames="mt-0"
                                >
                                
                                <TaskRelation
                                  relationsList={props.values.relation || []}
                                  // onChange={(value) => {
                                  //   onChange("relation", value);
                                  // }}
                                  projectId={props.values.project_id}
                                  taskId={taskId}
                                  editMode={true}
                                  error={props.errors.relation}
                                  touch={props.touched.relation}
                                />
                                </DetailCard>
                              </TabsContent>
                              <TabsContent value="subtasks">
                                <DetailCard
                                  detailCardTitle=""
                                  classNames="mt-0"
                                >
                                  <DetailBox
                                    // label={"Subtasks"}
                                    orientation="horizontal"
                                    value={
                                      <Subtasks
                                        items={props.values.subtasks || []}
                                        onChange={(items) => {
                                          props.setFieldValue(
                                            "subtasks",
                                            items
                                          );
                                        }}
                                        projectId={projectId}
                                        taskId={taskId}
                                        boardId={boardId}
                                        fetchTaskData={fetchTaskData}
                                      />
                                    }
                                  />
                                  <DetailBox
                                    // label={"Subtasks"}
                                    orientation="horizontal"
                                    value={
                                      <>
                                        <div className="flex justify-between gap-3 mb-4 flex-4 items-center">
                                          <Progress
                                            value={
                                              (countCompletedTasks(
                                                subTasksDetails
                                              ) /
                                                subTasksDetails?.length) *
                                              100
                                            }
                                            className="mt-1 h-2 bg-gray-400"
                                          />
                                          <span>{`${
                                            (
                                              (countCompletedTasks(
                                                subTasksDetails
                                              ) /
                                                subTasksDetails?.length) *
                                              100
                                            )?.toFixed(0) || 0
                                          }%`}</span>
                                        </div>

                                        <SubtaskList
                                          items={props?.values?.sub_task || []}
                                          projectId={projectId}
                                          taskId={taskId}
                                          boardId={boardId}
                                          //subTasksDetails={subTasksDetails}
                                        />
                                      </>
                                    }
                                  />
                                </DetailCard>
                              </TabsContent>
                              <TabsContent value="customFields">
                                <DetailCard
                                  detailCardTitle=""
                                  classNames="mt-0"
                                >
                                  <DetailBox
                                    label="Custom Fields"
                                    orientation="horizontal"
                                    value={
                                      <Button
                                        variant="continue"
                                        size="sm"
                                        className="w-full"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setOpenProjectCustomFields(true);
                                        }}
                                      >
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                      </Button>
                                    }
                                  />
                                </DetailCard>
                              </TabsContent>
                            </Tabs>
                          </div>
                          <DetailBox
                            label={
                              <div className="flex justify-between items-center w-full">
                                <span>Activity</span>
                                <button
                                  className="text-neutral-1200 text-sm font-semibold whitespace-nowrap mb-3"
                                  type="button"
                                  onClick={toggleActivities}
                                >
                                  {showActivities
                                    ? "Hide Details"
                                    : "Show Details"}
                                </button>
                              </div>
                            }
                            orientation="horizontal"
                            value={
                              !refreshComments && (
                                <CommentsInputField
                                  fetchData={setRefreshComments}
                                  editCommentContent={editCommentContent}
                                  setEditCommentContent={setEditCommentContent}
                                  replyComment={replyComment}
                                  setReplyComment={setReplyComment}
                                  employees={employees}
                                  taskId={taskId}
                                  userId={userId}
                                  projectDetail={projectDetail}
                                  addAttachment={async (attachment) => {
                                    const uploadedAttachment =
                                      await uploadAttachmentFile(attachment);
                                    const attachmentSelected =
                                      props.values.attachment || [];
                                    props.setFieldValue("attachment", [
                                      ...attachmentSelected,
                                      uploadedAttachment,
                                    ]);
                                    return uploadedAttachment.id || null;
                                  }}
                                />
                              )
                            }
                          />
                          <TaskCommentsContainer
                            taskId={taskId}
                            refreshComments={refreshComments}
                            setRefreshComments={setRefreshComments}
                            showActivities={showActivities}
                            setEditCommentContent={setEditCommentContent}
                            setReplyComment={setReplyComment}
                          />
                        </div>
                      </div>

                      {isEditMode && (
                        <div className="flex justify-end gap-2 mt-4 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="continue"
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">{`${
                            taskId ? "Save Changes" : "Add Task"
                          }`}</Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
      {openProjectCustomFields && projectDetail && (
        <ProjectCustomFields
          projectId={projectId}
          projectData={projectDetail}
          isOpen={openProjectCustomFields}
          setIsOpen={() => {
            setOpenProjectCustomFields();
            fetchCustomFieldsByProjectId(true, projectId);
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(TaskEditAddViewDetails);
