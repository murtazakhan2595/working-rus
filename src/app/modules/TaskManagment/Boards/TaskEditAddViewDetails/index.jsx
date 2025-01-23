import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { PriorityList, TaskStatus } from "data/Data";
import moment from "moment";
import { connect } from "react-redux";
// import EditCard from "./EditCard";

import { getTaskById, getAllBoards } from "app/hooks/taskManagment";
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
import TaskShare from "app/modules/TaskManagment/Sections/TaskShare";
import {
  InputTaskTitle,
  InputTaskDescription,
} from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails/Sections";
import { CommentsInputField } from "components/FormControl";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { CardTypes } from "app/utils/Types/TaskManagment";
import { DateInput } from "components/FormControl";
import { SelectComponent, CoverFileUpload } from "components/FormControl";
import { Assignee } from "app/modules/TaskManagment/Sections";
import { getProjectById } from "app/hooks/taskManagment";
import { errorClassName } from "components/FormControl";
import { addAttachments } from "app/hooks/taskManagment";
import { addTaskCheckListItem } from "app/hooks/taskManagment";
import { mapTaskPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { addSubtask } from "app/hooks/taskManagment";
import { Calendar, Flag } from "lucide-react";
import { getDropdownList, getLabelDropdownList } from "utils/Lists";

const TaskEditAddViewDetails = ({
  taskId,
  setIsOpen,
  isOpen,
  reloadData,
  projectId,
  boardId,
  Projects = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [BoardList, setBoardList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [comments, setComments] = useState([]);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(CardTypes);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);
  const TaskLabelList = getLabelDropdownList(
    useSelector((state) => state.task_managment.task_labels)
  );

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

  const handleSubmit = async (values) => {
    debugger
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-[70%] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
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
              {(props) => (
                <Form>
                  <div className="flex justify-between mb-6">
                    <div className="text-md font-semibold dark:text-slate-50">
                      Add/Edit Details
                    </div>
                    <div className="flex justify-end gap-2">
                      {!projectId && (
                        <SelectComponent
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
                      {!boardId && (
                        <SelectComponent
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
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between gap-5">
                    <div className="flex flex-col w-[55%] gap-3">
                      <InputTaskTitle
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          setIsEditMode(true);
                        }}
                        error={props.errors.name}
                        touched={props.touched.name}
                        value={props.values.name}
                      />
                      <InputTaskDescription
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          setIsEditMode(true);
                        }}
                        error={props.errors.description}
                        touched={props.touched.description}
                        value={props.values.description}
                        name={"description"}
                      />
                      <div className="grid grid-cols-2 gap-4 my-8">
                        <DateInput
                          name="end_date"
                          label="Due Date"
                          error={props.errors.end_date}
                          touch={props.touched.end_date}
                          value={props.values.end_date}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                            setIsEditMode(true);
                          }}
                        />
                        <SelectComponent
                          name="priority"
                          options={PriorityList}
                          label={"Priority"}
                          error={props.errors.priority}
                          touch={props.touched.priority}
                          value={props.values.priority}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                            setIsEditMode(true);
                          }}
                          icon={<Flag size={15} strokeWidth={2} />}
                        />
                        <Labels
                          labelsSelected={props.values.label || []}
                          onSelectedLabelsChange={(value) => {
                            props.setFieldValue("label", value);
                            setIsEditMode(true);
                          }}
                          editMode={true} // Always in edit mode
                        />
                        <Assignee
                          assigneeSelected={props.values.assigned_to || []}
                          employees={employees}
                          onChange={(value) => {
                            props.setFieldValue("assigned_to", value);
                            setIsEditMode(true);
                          }}
                          editMode={true} // Always in edit mode
                          projectMembers={projectDetail?.project_members || []}
                          error={props.errors.assigned_to}
                          touch={props.touched.assigned_to}
                          value={props.values.assigned_to}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <TextInput
                            name="estimated_time"
                            error={props.errors.estimated_time}
                            label={"Estimated Time"}
                            touch={props.touched.estimated_time}
                            value={props.values.estimated_time}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                          />
                          <TextInput
                            label={"Time Spent"}
                            name="consumed_time"
                            error={props.errors.consumed_time}
                            touch={props.touched.consumed_time}
                            value={props.values.consumed_time}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              setIsEditMode(true);
                            }}
                          />
                        </div>
                        <TaskRelation
                          relationsList={props.values.relation || []}
                          onChange={(value) => {
                            props.setFieldValue("relation", value);
                            setIsEditMode(true);
                          }}
                          projectId={taskData.project_id}
                          taskId={taskId}
                          editMode={true}
                          error={props.errors.relation}
                          touch={props.touched.relation}
                        />
                      </div>
                      <Attachments
                        attachmentSelected={props.values.attachment || []}
                        onChange={async (attachment) => {
                          console.log("Attachments updated:", attachment);
                          await props.setFieldValue("attachment", attachment);
                          setIsEditMode(true);
                        }}
                        error={props.errors.relation}
                        touch={props.touched.relation}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <DetailBox
                          label="Custom Fields"
                          orientation="horizontal"
                          value={
                            <Button variant="outline" className="w-full">
                              Add
                            </Button>
                          }
                        />
                        <DetailBox
                          label="Sub Task"
                          orientation="horizontal"
                          value={
                            <Button variant="outline" className="w-full">
                              Add
                            </Button>
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-[45%] gap-3">
                      <div>
                        <div className="text-neutral-1200 text-sm font-semibold whitespace-nowrap mb-3">
                          {"Checklist"}
                        </div>
                        <CheckList
                            items={props.values.task_checklist || []}
                            onChange={(items) => {
                              debugger
                              props.setFieldValue("task_checklist", items);
                              setIsEditMode(true);
                            }}
                          />
                      </div>
                      <DetailBox
                        label="Comments"
                        orientation="horizontal"
                        value={
                          !refreshComments && (
                            <CommentsInputField
                              fetchData={setRefreshComments}
                              users={employees}
                              taskId={taskId}
                              userId={userId}
                            />
                          )
                        }
                      />
                      <div>
                        <div className="text-neutral-1200 text-sm font-semibold whitespace-nowrap mb-3">
                          {"Activity"}
                        </div>
                        <DetailCard detailCardTitle="" classNames="mt-0">
                          <TaskComments
                            taskId={taskId}
                            refreshComments={refreshComments}
                            setRefreshComments={setRefreshComments}
                          />
                        </DetailCard>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <div className="flex justify-start gap-2 mt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={archeiveTask}>
                        <CiEdit className="mr-2" />
                        Archive
                      </Button>
                      <Button onClick={handleDelete}>
                        <Trash className="mr-2" size={16} />
                        Delete
                      </Button>
                    </div>
                    {isEditMode && (
                      <div className="flex justify-end gap-2 mt-4 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                        //  onClick={toggleEditMode}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

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

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(TaskEditAddViewDetails);
