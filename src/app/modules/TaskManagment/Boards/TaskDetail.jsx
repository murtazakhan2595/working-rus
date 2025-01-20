import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { PriorityList } from "data/Data";
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
import { Button } from "components/ui/button";
import { Trash } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { PageLoader } from "components";
import { CheckBoxInput } from "components/form-control";
import { addTask } from "app/hooks/taskManagment";
import TaskShare from "../Sections/TaskShare";

const TaskDetail = ({ taskId, setIsOpen, isOpen, reloadData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTaskData = async (isMounted) => {
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(taskId);
      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setTaskData(cardDetails);
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

  const handleStatusChange = async (name, value, values) => {
    try {
      const newStatus = value ? "COMPLETED" : "INPROGRESS";
      const response = await addTask({
        ...taskData,
        status: newStatus,
      });
      setTaskData(response);
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  function CardValues({ values }) {
    const items = [
      ...(values?.end_date
        ? [
            {
              label: "Due Date",
              value: (
                <div className="flex items-center justify-between w-full gap-4">
                  <div>{moment(values?.end_date).format("DD MMM")}</div>
                  <div className="flex items-center space-x-2">
                    <CheckBoxInput
                      label={
                        values.status === "COMPLETED"
                          ? "Completed"
                          : "In Progress"
                      }
                      name="status"
                      value={values.status === "COMPLETED"}
                      onChange={(name, value) =>
                        handleStatusChange(name, value, values)
                      }
                    />
                  </div>
                </div>
              ),
            },
          ]
        : []),
      ...(values?.priority
        ? [
            {
              label: "Priority",
              value: PriorityList.find(
                (option) => option.value === values?.priority
              )?.label,
            },
          ]
        : []),
      ...(values?.label?.length
        ? [
            {
              label: "Label",
              value: (
                <Labels
                  labelsSelected={values.label || []}
                  onSelectedLabelsChange={() => {}}
                  editMode={false}
                />
              ),
            },
          ]
        : []),
      ...(values?.assigned_to?.length
        ? [
            {
              label: "Assign",
              value: (
                <MembersList members={values?.assigned_to} displayAll={true} />
              ),
            },
          ]
        : []),
      ...(values?.relation?.length
        ? [
            {
              label: "Relation",
              value: (
                <TaskRelation
                  relationsList={values.relation || []}
                  onChange={() => {}}
                  projectId={taskData.project_id}
                  editMode={false}
                />
              ),
            },
          ]
        : []),
      ...(values?.task_checklist?.length
        ? [
            {
              label: "Checklist",
              value: (
                <CheckList
                  items={values.task_checklist || []}
                  onChange={() => {}}
                  editMode={false}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="space-y-6">
              <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#323333]">
                  {taskData?.name}
                </h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={editDetails}>
                    <CiEdit className="mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={handleDelete}>
                    <Trash className="mr-2" size={16} />
                    Delete
                  </Button>
                </div>
              </header>

              <div className="space-y-6">
                <div className="text-[14px] text-baseGray">
                  Is in list {taskData.board_name}
                </div>

                <DetailCard detailCardTitle="Card Details">
                  <CardValues values={taskData} />
                </DetailCard>

                <DetailBox
                  label="Description"
                  value={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: taskData?.description,
                      }}
                    />
                  }
                />

                {taskData.attachment && taskData.attachment.length > 0 && (
                  <DetailBox
                    label="Attachments"
                    value={
                      <Attachments
                        attachmentSelected={taskData.attachment || []}
                        onChange={() => {}}
                        editMode={false}
                      />
                    }
                  />
                )}

                <DetailBox label="Comments" value={<></>} />
                <TaskComments taskId={taskId} />
              </div>
            </div>
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

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(TaskDetail);
