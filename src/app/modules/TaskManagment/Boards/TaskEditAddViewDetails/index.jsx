import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { getTaskById, getAllBoards } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  Subtasks,
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
import {
  addTaskCheckListItem,
  getAllCustomFields,
} from "app/hooks/taskManagment";
import { mapTaskPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { getDropdownList, convertJSONArrayToStringsArray } from "utils/Lists";
import { useParams, useNavigate } from "react-router-dom";
import { trackTaskActivities } from "./Sections/activityHelper";
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
import { TaskRelation, TaskRelationTab } from "../../Sections";
import { Card, CardContent } from "components/ui/card";
import { addRelationship, deleteRelationship } from "app/hooks/taskManagment";
import { getRelationship } from "app/hooks/taskManagment";

const TaskEditAddViewDetails = ({
  isOpen = true,
  reloadData = () => {},
  Projects = [],
  onTaskCreated, // New callback for when task/subtask is created
}) => {
  const { projectId, taskId, viewStyle, boardId, subtaskId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userProfile.id);
  const isSubtask = !!subtaskId;
  const currentTaskId = isSubtask ? subtaskId : taskId;
  const [isLoading, setIsLoading] = useState(false);
  const [BoardList, setBoardList] = useState([]);
  const [CustomFields, setCustomFields] = useState([]);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(Task);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const employees = useSelector((state) => state.emp.employees);
  const [showActivities, setShowActivities] = useState(true);
  const [editCommentContent, setEditCommentContent] = useState(null);
  const [replyComment, setReplyComment] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");
  const [taskRelationship, setTaskRelationship] = useState([]);
  const [targetRelationship, setTargetRelationship] = useState([]);
  const [removedRelationships, setRemovedRelationships] = useState([]);



  const toggleActivities = () => {
    setShowActivities(!showActivities);
  };
  const handleCloseTaskEditor = () => {
    navigate(
      `/project-board/${projectId}/${viewStyle}${
        isSubtask ? `/${boardId}/${taskId}` : ""
      }`
    );
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

  const fetchTaskRelationship = async (isMounted, taskId) => {
    try {
      const [sourceRelations, targetRelations] = await Promise.all([
        getRelationship({ filterData: { source_task_id: [taskId] } }),
        getRelationship({ filterData: { target_task_id: [taskId] } }),
      ]);
      if (isMounted) {
        setTaskRelationship(sourceRelations.results);
        setTargetRelationship(targetRelations.results);
      }
    } catch (error) {
      console.error("Error fetching task relation:", error);
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (initialValues.project_id)
      fetchBoardListByProjectId(isMounted, initialValues.project_id);
    return () => {
      isMounted = false;
    };
  }, [initialValues.project_id]);

  const fetchTaskData = async (isMounted) => {
    setActiveTab('checklist')
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(currentTaskId);
      fetchTaskRelationship(isMounted, currentTaskId);
      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setInitialValues({
          ...cardDetails,
          project_id: projectId || cardDetails.project_id,
        });
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
    if (currentTaskId) fetchTaskData(isMounted);
    else
      setInitialValues({
        ...Task,
        assigned_by: userId,
        project_id: projectId || null,
        board_id: boardId || null,
      });
    return () => {
      isMounted = false;
    };
  }, [currentTaskId]);

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
              const response = await addTaskCheckListItem(
                item,
                item.id,
                currentTaskId,
                userId,
                initialValues.task_checklist.find((obj) => obj.id === item.id)
              );
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

      const response = await addTask(
        finalData,
        currentTaskId,
        userId,
        initialValues
      );
      if (response) {           
        if (removedRelationships.length > 0) {
          await Promise.all(
            removedRelationships.map(async (id) => {
              try {
                // Delete the relationship by its ID
                await deleteRelationship(id);
              } catch (error) {
                // Ignore errors where the relationship doesn't exist
              }
            })
          );
        }
        if (taskRelationship?.length > 0 || targetRelationship?.length > 0) {
          try {
            // For existing task updates, we need to filter out existing relationships
            if (currentTaskId) {
              // Filter source relationships to only include new ones
              const newSourceRelations = taskRelationship.filter((relation) => {
                // If the relation has no ID, it's new
                return !relation.id;
              });

              // Filter target relationships to only include new ones
              const newTargetRelations = targetRelationship.filter(
                (relation) => {
                  // If the relation has no ID, it's new
                  return !relation.id;
                }
              );

              // Only create new source relationships
              if (newSourceRelations.length > 0) {
                await Promise.all(
                  newSourceRelations.map((relation) =>
                    addRelationship({
                      source_task_id: currentTaskId,
                      target_task_id: relation.target_task_id,
                      relation_choices: relation.relation_choices,
                    })
                  )
                );
              }

              // Only create new target relationships
              if (newTargetRelations.length > 0) {
                await Promise.all(
                  newTargetRelations.map((relation) =>
                    addRelationship({
                      source_task_id: relation.source_task_id,
                      target_task_id: currentTaskId,
                      relation_choices: relation.relation_choices,
                    })
                  )
                );
              }
            } else {
              // For new tasks, create all relationships since none exist yet
              const taskId = response.id;

              await Promise.all([
                // Create all source relationships
                ...taskRelationship.map((relation) =>
                  addRelationship({
                    source_task_id: taskId,
                    target_task_id: relation.target_task_id,
                    relation_choices: relation.relation_choices,
                  })
                ),
                // Create all target relationships
                ...targetRelationship.map((relation) =>
                  addRelationship({
                    source_task_id: relation.source_task_id,
                    target_task_id: taskId,
                    relation_choices: relation.relation_choices,
                  })
                ),
              ]);
            }
          } catch (error) {
            console.error("Error creating relationships:", error);
            toast.error("Failed to create some relationships");
          }
        }

        // Notify parent component of the new task
        if (onTaskCreated && isSubtask) {
          onTaskCreated(response);
        }

        toast.success(
          isSubtask
            ? "Subtask Created Successfully!"
            : `Task ${currentTaskId ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        currentTaskId && fetchTaskData(true);
        !isSubtask && reloadData();
        handleCloseTaskEditor(false);
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
        setIsOpen: handleCloseTaskEditor,
      })}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[1600px] w-[80vw] h-[auto] pr-2">
          <DialogDescription></DialogDescription>
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
                      <div className="flex justify-between mb-6 px-6 mt-3">
                        <div className="text-md font-semibold dark:text-slate-50 flex items-center gap-2">
                          {isSubtask && (
                            <ArrowLeft
                              className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm cursor-pointer"
                              onClick={() => handleCloseTaskEditor()}
                            />
                          )}
                          {props.values.is_archive ? (
                            <span className="text-amber-400">Archive Card</span>
                          ) : (
                            `${currentTaskId ? "Edit" : "Add"} ${
                              isSubtask ? "Subtask" : "Task"
                            }`
                          )}
                          {currentTaskId && (
                            <CopyLink
                              link={`${currentTaskId}`}
                              text={
                                <FormatID prefix={"T-"} value={currentTaskId} />
                              }
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
                          <Button type="submit">
                            {`${
                              currentTaskId
                                ? "Save Changes"
                                : isSubtask
                                ? "Add Subtask"
                                : "Add Task"
                            }`}
                          </Button>
                          <AdditionalActionOption
                            reloadData={fetchTaskData}
                            isArchive={props.values.is_archive}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8 px-6">
                        <div className="flex flex-col gap-6">
                          <div className="space-y-4">
                            <div className="text-neutral-1200 text-sm font-semibold">
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
                              taskId={currentTaskId}
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="text-neutral-1200 text-sm font-semibold">
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
                          </div>

                          <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="mt-4"
                          >
                            <TabsList className="gap-6">
                              {[
                                {
                                  value: "checklist",
                                  label: (
                                    <span>
                                      Checklist(
                                      <span>
                                        {props.values.task_checklist?.length ||
                                          0}
                                      </span>
                                      )
                                    </span>
                                  ),
                                },
                                {
                                  value: "relation",
                                  label: (
                                    <span>
                                      Relation(
                                      <span>
                                        {Math.max(taskRelationship?.length , targetRelationship.length) ||
                                          0}
                                      </span>
                                      )
                                    </span>
                                  ),
                                },
                                ...(!isSubtask
                                  ? [
                                      {
                                        value: "subtasks",
                                        label: (
                                          <span>
                                            Subtasks(
                                            <span>
                                              {props.values.sub_task?.length ||
                                                0}
                                            </span>
                                            )
                                          </span>
                                        ),
                                      },
                                    ]
                                  : []),
                                {
                                  value: "customFields",
                                  label: <span>Custom Fields</span>,
                                },
                              ].map((tab) => (
                                <TabsTrigger
                                  key={tab.value}
                                  value={tab.value}
                                  className="inline-flex px-1 w-fit shadow-none rounded-none text-neutral-1200 data-[state=active]:border-b data-[state=active]:shadow-none data-[state=active]:border-primary-1000 data-[state=active]:text-primary-1100"
                                >
                                  {tab.label}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            <div className="mt-4">
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
                                <DetailCard
                                  detailCardTitle=""
                                  classNames="mt-0"
                                >
                                  <TaskRelationTab
                                    relationsList={taskRelationship || []}
                                    targetRelationsList={
                                      targetRelationship || []
                                    }
                                    setRemovedRelationships={
                                      setRemovedRelationships
                                    }
                                    projectId={props.values.project_id}
                                    taskId={currentTaskId}
                                    editMode={true}
                                    onChange={(
                                      updatedRelations,
                                      updateTargetRelations
                                    ) => {
                                      setTaskRelationship(updatedRelations);
                                      setTargetRelationship(
                                        updateTargetRelations
                                      );
                                    }}
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
                                        items={props.values.sub_task || []}
                                        onChange={(items) => {
                                          props.setFieldValue(
                                            "subtasks",
                                            items
                                          );
                                        }}
                                        projectId={projectId}
                                        taskId={currentTaskId}
                                        boardId={boardId}
                                        fetchTaskData={fetchTaskData}
                                      />
                                    }
                                  />
                                </DetailCard>
                              </TabsContent>

                              <TabsContent value="customFields">
                                <DetailCard
                                  detailCardTitle=""
                                  classNames="mt-0"
                                >
                                  <ProjectCustomFields
                                    projectId={props.values.project_id}
                                    reloadData={() => {
                                      fetchCustomFieldsByProjectId(
                                        true,
                                        props.values.project_id
                                      );
                                    }}
                                  />
                                </DetailCard>
                              </TabsContent>
                            </div>
                          </Tabs>
                        </div>
                        <div className="flex flex-col gap-6">
                          {/* <Card className="p-6"> */}
                          <InputTaskDetailFields
                            errors={props.errors}
                            touched={props.touched}
                            taskData={props.values}
                            isSubtask={isSubtask}
                            taskId={currentTaskId}
                            projectDetail={projectDetail}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                            employees={employees}
                            CustomFields={CustomFields || []}
                            boardList={BoardList}
                          />

                          <div className="mt-6">
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
                          </div>
                          {/* </Card> */}

                          <DetailBox
                            label={
                              <div className="flex justify-between items-center w-full mb-4">
                                <span className="text-neutral-1200 text-sm font-semibold">
                                  Activity
                                </span>
                                <button
                                  className="text-sm text-primary-1100 hover:text-primary-700"
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
                                  taskId={currentTaskId}
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
                            taskId={currentTaskId}
                            refreshComments={refreshComments}
                            setRefreshComments={setRefreshComments}
                            showActivities={showActivities}
                            setEditCommentContent={setEditCommentContent}
                            setReplyComment={setReplyComment}
                          />
                        </div>
                      </div>

                      {/* {isEditMode && (
                        <div className="flex justify-end gap-4 mt-6 pt-4 px-6 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {`${currentTaskId ? "Save Changes" : "Add Task"}`}
                          </Button>
                        </div>
                      )} */}
                    </div>
                  </ScrollArea>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(TaskEditAddViewDetails);
